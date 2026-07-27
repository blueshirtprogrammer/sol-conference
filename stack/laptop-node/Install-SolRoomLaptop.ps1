[CmdletBinding()]
param(
    [ValidateSet('Plan','Install','Repair')]
    [string]$Mode = 'Plan',

    [string]$DirectMediaAdapterAlias,
    [switch]$ApproveNetworkChanges,
    [switch]$SkipPackages
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$StackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$StateRoot = Join-Path $env:ProgramData 'SolRoom\laptop-node'
$LogRoot = Join-Path $StateRoot 'logs'
$StatePath = Join-Path $StateRoot 'state.json'
$HealthPath = Join-Path $StateRoot 'health.json'
$TranscriptPath = Join-Path $LogRoot ("install-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

function Write-Phase {
    param([string]$Message,[ValidateSet('INFO','OK','WARN','FAIL','ACTION')][string]$Level='INFO')
    $colour = @{ INFO='Gray'; OK='Green'; WARN='Yellow'; FAIL='Red'; ACTION='Cyan' }[$Level]
    Write-Host "[$Level] $Message" -ForegroundColor $colour
}

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Initialize-State {
    New-Item -ItemType Directory -Force -Path $StateRoot,$LogRoot | Out-Null
    if (-not (Test-Path $StatePath)) {
        [ordered]@{
            schemaVersion = 1
            createdAt = (Get-Date).ToString('o')
            updatedAt = (Get-Date).ToString('o')
            phases = [ordered]@{}
            checkpoints = [ordered]@{}
        } | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $StatePath
    }
}

function Get-State {
    if (-not (Test-Path $StatePath)) { Initialize-State }
    return Get-Content -Raw $StatePath | ConvertFrom-Json -AsHashtable
}

function Save-State {
    param([hashtable]$State)
    $State.updatedAt = (Get-Date).ToString('o')
    $State | ConvertTo-Json -Depth 12 | Set-Content -Encoding UTF8 $StatePath
}

function Set-PhaseState {
    param([string]$Name,[ValidateSet('pending','complete','partial','blocked','failed','skipped')][string]$Status,[string]$Detail)
    $state = Get-State
    $state.phases[$Name] = [ordered]@{ status=$Status; detail=$Detail; at=(Get-Date).ToString('o') }
    Save-State $state
}

function Set-Checkpoint {
    param([string]$Name,[string]$Instruction,[bool]$Complete=$false)
    $state = Get-State
    $state.checkpoints[$Name] = [ordered]@{ complete=$Complete; instruction=$Instruction; at=(Get-Date).ToString('o') }
    Save-State $state
}

function Test-CommandAvailable { param([string]$Name) return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue) }

function Invoke-OrPlan {
    param([string]$Description,[scriptblock]$Action)
    if ($Mode -eq 'Plan') { Write-Phase "PLAN: $Description"; return }
    Write-Phase $Description
    & $Action
}

function Ensure-Winget {
    if (-not (Test-CommandAvailable 'winget')) { throw 'WinGet is required. Install or update Microsoft App Installer and re-run.' }
    Write-Phase 'WinGet is available.' 'OK'
}

function Test-WingetPackage {
    param([string]$Id)
    $output = & winget list --id $Id --exact --accept-source-agreements 2>$null | Out-String
    return ($LASTEXITCODE -eq 0 -and $output -match [regex]::Escape($Id))
}

function Install-WingetPackage {
    param([string]$Id,[string]$DisplayName)
    if (Test-WingetPackage $Id) { Write-Phase "$DisplayName is installed." 'OK'; return }
    Invoke-OrPlan "Install $DisplayName ($Id)" {
        & winget install --id $Id --exact --silent --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0) { throw "WinGet failed installing $DisplayName." }
    }
}

function Get-RouterFacingAdapter {
    $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
        Where-Object { $_.NextHop -ne '0.0.0.0' } |
        Sort-Object RouteMetric,InterfaceMetric |
        Select-Object -First 1
    if (-not $route) { return $null }
    return Get-NetAdapter -InterfaceIndex $route.InterfaceIndex -ErrorAction SilentlyContinue
}

function Resolve-DirectMediaAdapter {
    if ($DirectMediaAdapterAlias) {
        return Get-NetAdapter -Name $DirectMediaAdapterAlias -ErrorAction Stop
    }

    $router = Get-RouterFacingAdapter
    $candidates = Get-NetAdapter -Physical -ErrorAction SilentlyContinue |
        Where-Object { $_.Status -ne 'Disabled' -and (!$router -or $_.ifIndex -ne $router.ifIndex) }

    if ($candidates.Count -eq 1) { return $candidates[0] }
    return $null
}

function Configure-DirectMediaNetwork {
    $adapter = Resolve-DirectMediaAdapter
    if (-not $adapter) {
        Set-PhaseState 'direct-media-network' 'blocked' 'Direct-media adapter could not be selected unambiguously.'
        Set-Checkpoint 'select-direct-media-adapter' 'Run Get-NetAdapter, identify the USB-C 2.5 GbE direct-link adapter, then re-run with -DirectMediaAdapterAlias and -ApproveNetworkChanges.' $false
        Write-Phase 'Direct-media adapter requires explicit selection.' 'ACTION'
        return
    }

    Write-Phase "Selected direct-media adapter: $($adapter.Name) [$($adapter.InterfaceDescription)]" 'INFO'
    if (-not $ApproveNetworkChanges) {
        Set-PhaseState 'direct-media-network' 'blocked' "Approval required to configure $($adapter.Name) as 10.77.0.1/24."
        Set-Checkpoint 'approve-direct-media-network' "Re-run with -DirectMediaAdapterAlias '$($adapter.Name)' -ApproveNetworkChanges." $false
        Write-Phase 'Network change approval required.' 'ACTION'
        return
    }

    Invoke-OrPlan "Configure $($adapter.Name) as 10.77.0.1/24 with no gateway or DNS" {
        Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue |
            Where-Object { $_.IPAddress -ne '10.77.0.1' } |
            Remove-NetIPAddress -Confirm:$false -ErrorAction SilentlyContinue

        if (-not (Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -IPAddress '10.77.0.1' -ErrorAction SilentlyContinue)) {
            New-NetIPAddress -InterfaceIndex $adapter.ifIndex -IPAddress '10.77.0.1' -PrefixLength 24 -AddressFamily IPv4 | Out-Null
        }
        Set-DnsClientServerAddress -InterfaceIndex $adapter.ifIndex -ResetServerAddresses
        Set-NetConnectionProfile -InterfaceIndex $adapter.ifIndex -NetworkCategory Private -ErrorAction SilentlyContinue
        Set-NetIPInterface -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 -InterfaceMetric 50
    }

    Set-PhaseState 'direct-media-network' 'complete' "$($adapter.Name) configured as 10.77.0.1/24 without a default gateway."
}

function Test-PhoneLinkInstalled {
    return $null -ne (Get-AppxPackage -Name Microsoft.YourPhone -ErrorAction SilentlyContinue)
}

function Test-VoiceMeeterInstalled {
    $paths = @(
        "$env:ProgramFiles\VB\Voicemeeter\voicemeeterpro.exe",
        "${env:ProgramFiles(x86)}\VB\Voicemeeter\voicemeeterpro.exe",
        "$env:ProgramFiles\VB\Voicemeeter\voicemeeter8.exe",
        "${env:ProgramFiles(x86)}\VB\Voicemeeter\voicemeeter8.exe"
    )
    return $null -ne ($paths | Where-Object { Test-Path $_ } | Select-Object -First 1)
}

function Write-HealthReport {
    $router = Get-RouterFacingAdapter
    $direct = Resolve-DirectMediaAdapter
    $adbDevices = if (Test-CommandAvailable 'adb') { (& adb devices 2>$null | Out-String) } else { '' }
    $obs = Get-Process obs64 -ErrorAction SilentlyContinue

    [ordered]@{
        generatedAt = (Get-Date).ToString('o')
        computerName = $env:COMPUTERNAME
        routerAdapter = if ($router) { $router.Name } else { $null }
        routerAddress = if ($router) { (Get-NetIPAddress -InterfaceIndex $router.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty IPAddress) } else { @() }
        directAdapter = if ($direct) { $direct.Name } else { $null }
        directAddress = if ($direct) { (Get-NetIPAddress -InterfaceIndex $direct.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty IPAddress) } else { @() }
        phoneLinkInstalled = Test-PhoneLinkInstalled
        voiceMeeterInstalled = Test-VoiceMeeterInstalled
        obsRunning = $null -ne $obs
        adbDevices = $adbDevices.Trim()
    } | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $HealthPath
    Write-Phase "Health report written to $HealthPath" 'OK'
}

Initialize-State
Start-Transcript -Path $TranscriptPath -Force | Out-Null

try {
    Write-Phase "Sol Room Laptop Node — mode: $Mode"
    if ($Mode -ne 'Plan' -and -not (Test-IsAdministrator)) { throw 'Run PowerShell as Administrator. UAC approval must remain human-controlled.' }

    if (-not $SkipPackages) {
        Ensure-Winget
        foreach ($package in @(
            @{ Id='Git.Git'; Name='Git' },
            @{ Id='OpenJS.NodeJS.LTS'; Name='Node.js LTS' },
            @{ Id='OBSProject.OBSStudio'; Name='OBS Studio' },
            @{ Id='Genymobile.scrcpy'; Name='scrcpy/ADB' }
        )) { Install-WingetPackage $package.Id $package.Name }
        Set-PhaseState 'base-packages' 'complete' 'Git, Node.js LTS, OBS Studio and scrcpy are installed or planned.'
    }

    Configure-DirectMediaNetwork

    if (Test-PhoneLinkInstalled) {
        Set-PhaseState 'phone-link' 'partial' 'Phone Link installed; pairing and live-call proof remain manual.'
        Set-Checkpoint 'phone-link-pairing' 'Pair one trusted test phone over Bluetooth and confirm a normal manual call before introducing VoiceMeeter.' $false
    } else {
        Set-PhaseState 'phone-link' 'blocked' 'Microsoft Phone Link was not detected.'
        Set-Checkpoint 'phone-link-install' 'Install Microsoft Phone Link from Microsoft Store, then re-run Repair.' $false
    }

    if (Test-VoiceMeeterInstalled) {
        Set-PhaseState 'voicemeeter' 'partial' 'VoiceMeeter detected; B1/B2 topology and real call routing remain unverified.'
    } else {
        Set-PhaseState 'voicemeeter' 'blocked' 'VoiceMeeter requires supervised official installation and reboot.'
        Set-Checkpoint 'voicemeeter-install' 'Install VoiceMeeter Banana from the official VB-Audio site, approve its driver install, reboot, then re-run Repair.' $false
        if ($Mode -ne 'Plan') { Start-Process 'https://vb-audio.com/Voicemeeter/banana.htm' }
    }

    Set-Checkpoint 'android-usb-debug' 'Enable Android developer options and USB debugging, connect through the dock, and approve the RSA fingerprint on the handset.' $false
    Set-Checkpoint 'obs-websocket' 'Open OBS > Tools > WebSocket Server Settings, bind localhost:4455, enable authentication, and store the password outside git.' $false
    Set-Checkpoint 'dock-storage-sharing' 'Choose an explicit removable folder or volume to publish. Do not auto-share newly inserted USB storage or use Everyone/full-control.' $false
    Set-Checkpoint 'phone-action-policy' 'Calls, messages, installs, recording and streaming require preview plus explicit human confirmation.' $false

    Write-HealthReport
    Write-Phase "Install pass complete. State: $StatePath" 'OK'
    Write-Phase 'Next: complete the named checkpoints and run the desktop verifier from SOL-WORK.' 'ACTION'
}
catch {
    Set-PhaseState 'installer' 'failed' $_.Exception.Message
    Write-Phase $_.Exception.Message 'FAIL'
    throw
}
finally {
    Stop-Transcript | Out-Null
}
