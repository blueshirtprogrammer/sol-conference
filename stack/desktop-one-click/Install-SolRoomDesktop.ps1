[CmdletBinding()]
param(
    [ValidateSet('Plan', 'Install', 'Repair')]
    [string]$Mode = 'Plan',

    [switch]$SkipHomeAssistant,
    [switch]$ForceVirtualBox,
    [switch]$ApproveNetworkChanges
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$StackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ManifestPath = Join-Path $StackRoot 'stack.manifest.json'
$StateRoot = Join-Path $env:ProgramData 'SolRoom\bootstrap'
$LogRoot = Join-Path $StateRoot 'logs'
$StatePath = Join-Path $StateRoot 'state.json'
$GeneratedRoot = Join-Path $HOME '.sol-room\generated'
$TranscriptPath = Join-Path $LogRoot ("install-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

function Write-Phase {
    param([string]$Message, [ValidateSet('INFO','OK','WARN','FAIL','ACTION')][string]$Level = 'INFO')
    $prefix = "[{0}]" -f $Level
    switch ($Level) {
        'OK' { Write-Host "$prefix $Message" -ForegroundColor Green }
        'WARN' { Write-Host "$prefix $Message" -ForegroundColor Yellow }
        'FAIL' { Write-Host "$prefix $Message" -ForegroundColor Red }
        'ACTION' { Write-Host "$prefix $Message" -ForegroundColor Cyan }
        default { Write-Host "$prefix $Message" }
    }
}

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Initialize-State {
    New-Item -ItemType Directory -Force -Path $StateRoot, $LogRoot, $GeneratedRoot | Out-Null
    if (-not (Test-Path $StatePath)) {
        $state = [ordered]@{
            schemaVersion = 1
            createdAt = (Get-Date).ToString('o')
            updatedAt = (Get-Date).ToString('o')
            mode = $Mode
            phases = [ordered]@{}
            checkpoints = [ordered]@{}
            rebootRequired = $false
        }
        $state | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $StatePath
    }
}

function Get-State {
    if (-not (Test-Path $StatePath)) { Initialize-State }
    return Get-Content -Raw $StatePath | ConvertFrom-Json -AsHashtable
}

function Save-State {
    param([hashtable]$State)
    $State.updatedAt = (Get-Date).ToString('o')
    $State.mode = $Mode
    $State | ConvertTo-Json -Depth 12 | Set-Content -Encoding UTF8 $StatePath
}

function Set-PhaseState {
    param(
        [string]$Name,
        [ValidateSet('pending','complete','partial','blocked','failed','skipped')][string]$Status,
        [string]$Detail
    )
    $state = Get-State
    $state.phases[$Name] = [ordered]@{
        status = $Status
        detail = $Detail
        at = (Get-Date).ToString('o')
    }
    Save-State $state
}

function Set-Checkpoint {
    param([string]$Name, [string]$Instruction, [bool]$Complete = $false)
    $state = Get-State
    $state.checkpoints[$Name] = [ordered]@{
        complete = $Complete
        instruction = $Instruction
        at = (Get-Date).ToString('o')
    }
    Save-State $state
}

function Invoke-OrPlan {
    param([string]$Description, [scriptblock]$Action)
    if ($Mode -eq 'Plan') {
        Write-Phase "PLAN: $Description" 'INFO'
        return
    }
    Write-Phase $Description 'INFO'
    & $Action
}

function Test-CommandAvailable {
    param([string]$Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Ensure-Winget {
    if (Test-CommandAvailable 'winget') {
        Write-Phase 'WinGet is available.' 'OK'
        Set-PhaseState 'winget' 'complete' 'winget command found'
        return
    }
    Set-PhaseState 'winget' 'blocked' 'WinGet/App Installer is missing'
    throw 'WinGet is required. Install or update App Installer from Microsoft Store, then re-run.'
}

function Test-WingetPackage {
    param([string]$Id)
    $output = & winget list --id $Id --exact --accept-source-agreements 2>$null | Out-String
    return ($LASTEXITCODE -eq 0 -and $output -match [regex]::Escape($Id))
}

function Install-WingetPackage {
    param([string]$Id, [string]$DisplayName)
    if (Test-WingetPackage $Id) {
        Write-Phase "$DisplayName is already installed." 'OK'
        return
    }

    Invoke-OrPlan "Install $DisplayName ($Id) with WinGet" {
        & winget install --id $Id --exact --silent --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0) { throw "WinGet failed installing $DisplayName ($Id)." }
    }
}

function Get-RouterFacingAdapter {
    $defaultRoute = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
        Where-Object { $_.NextHop -ne '0.0.0.0' } |
        Sort-Object RouteMetric, InterfaceMetric |
        Select-Object -First 1

    if (-not $defaultRoute) { return $null }
    return Get-NetAdapter -InterfaceIndex $defaultRoute.InterfaceIndex -ErrorAction SilentlyContinue
}

function Get-WindowsEdition {
    return (Get-ComputerInfo -Property WindowsProductName).WindowsProductName
}

function Test-HyperVAvailable {
    if ($ForceVirtualBox) { return $false }
    $feature = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -ErrorAction SilentlyContinue
    return $null -ne $feature
}

function Enable-HyperVIfNeeded {
    $feature = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -ErrorAction Stop
    if ($feature.State -eq 'Enabled') { return $true }

    Invoke-OrPlan 'Enable Hyper-V Windows feature' {
        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All -NoRestart | Out-Null
        $state = Get-State
        $state.rebootRequired = $true
        Save-State $state
        Set-Checkpoint 'reboot-hyperv' 'Restart Windows, then run Install-SolRoomDesktop.ps1 -Mode Repair.' $false
    }
    return $false
}

function Get-LatestHaosAsset {
    param([ValidateSet('vhdx','vdi')][string]$Format)

    $headers = @{ 'User-Agent' = 'Sol-Room-Desktop-Installer' }
    $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/home-assistant/operating-system/releases/latest' -Headers $headers
    $pattern = if ($Format -eq 'vhdx') { '^haos_ova-.*\.vhdx\.zip$' } else { '^haos_ova-.*\.vdi\.zip$' }
    $asset = $release.assets | Where-Object { $_.name -match $pattern } | Select-Object -First 1
    if (-not $asset) { throw "Could not find the latest Home Assistant OS $Format appliance asset." }
    return $asset
}

function Get-HaosDisk {
    param([ValidateSet('vhdx','vdi')][string]$Format)

    $vmRoot = Join-Path $env:ProgramData 'SolRoom\vm\SOL-HOME'
    New-Item -ItemType Directory -Force -Path $vmRoot | Out-Null
    $existing = Get-ChildItem $vmRoot -Filter "*.$Format" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($existing) { return $existing.FullName }

    if ($Mode -eq 'Plan') {
        Write-Phase "PLAN: download latest Home Assistant OS $Format appliance into $vmRoot" 'INFO'
        return (Join-Path $vmRoot "SOL-HOME.$Format")
    }

    $asset = Get-LatestHaosAsset $Format
    $zipPath = Join-Path $vmRoot $asset.name
    Write-Phase "Downloading $($asset.name)..." 'INFO'
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -UseBasicParsing
    Expand-Archive -Path $zipPath -DestinationPath $vmRoot -Force
    Remove-Item $zipPath -Force

    $disk = Get-ChildItem $vmRoot -Filter "*.$Format" -Recurse | Select-Object -First 1
    if (-not $disk) { throw "Home Assistant OS archive did not contain a $Format disk." }
    return $disk.FullName
}

function Install-HomeAssistantHyperV {
    $routerAdapter = Get-RouterFacingAdapter
    if (-not $routerAdapter) { throw 'Could not identify the router-facing adapter from the default route.' }

    if (-not $ApproveNetworkChanges) {
        Set-Checkpoint 'approve-hyperv-switch' "Re-run with -ApproveNetworkChanges to create an external Hyper-V switch on '$($routerAdapter.Name)'." $false
        Set-PhaseState 'home-assistant-vm' 'blocked' 'External virtual switch creation needs explicit approval.'
        Write-Phase "Home Assistant VM paused: approve binding an external switch to '$($routerAdapter.Name)'." 'ACTION'
        return
    }

    $switchName = 'SOL-LAN'
    Invoke-OrPlan "Create or reuse Hyper-V external switch $switchName on $($routerAdapter.Name)" {
        $switch = Get-VMSwitch -Name $switchName -ErrorAction SilentlyContinue
        if (-not $switch) {
            New-VMSwitch -Name $switchName -NetAdapterName $routerAdapter.Name -AllowManagementOS $true | Out-Null
        }
    }

    $disk = Get-HaosDisk 'vhdx'
    Invoke-OrPlan 'Create or repair Hyper-V VM SOL-HOME' {
        $vm = Get-VM -Name 'SOL-HOME' -ErrorAction SilentlyContinue
        if (-not $vm) {
            New-VM -Name 'SOL-HOME' -Generation 2 -MemoryStartupBytes 4GB -VHDPath $disk -SwitchName $switchName | Out-Null
        }
        Set-VMProcessor -VMName 'SOL-HOME' -Count 2
        Set-VMMemory -VMName 'SOL-HOME' -DynamicMemoryEnabled $true -MinimumBytes 2GB -StartupBytes 4GB -MaximumBytes 6GB
        Set-VMFirmware -VMName 'SOL-HOME' -EnableSecureBoot Off
        Set-VM -Name 'SOL-HOME' -AutomaticStartAction StartIfRunning -AutomaticStopAction ShutDown
        if ((Get-VM -Name 'SOL-HOME').State -ne 'Running') { Start-VM -Name 'SOL-HOME' | Out-Null }
    }

    Set-PhaseState 'home-assistant-vm' 'partial' 'SOL-HOME created in Hyper-V; onboarding and MCP remain human checkpoints.'
}

function Get-VBoxManagePath {
    $candidates = @(
        "$env:ProgramFiles\Oracle\VirtualBox\VBoxManage.exe",
        "${env:ProgramFiles(x86)}\Oracle\VirtualBox\VBoxManage.exe"
    )
    return $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
}

function Install-HomeAssistantVirtualBox {
    Install-WingetPackage 'Oracle.VirtualBox' 'Oracle VirtualBox'
    if ($Mode -eq 'Plan') { return }

    $vbox = Get-VBoxManagePath
    if (-not $vbox) { throw 'VBoxManage.exe was not found after VirtualBox installation.' }

    $routerAdapter = Get-RouterFacingAdapter
    if (-not $routerAdapter) { throw 'Could not identify the router-facing adapter from the default route.' }
    if (-not $ApproveNetworkChanges) {
        Set-Checkpoint 'approve-virtualbox-bridge' "Re-run with -ApproveNetworkChanges to bridge SOL-HOME to '$($routerAdapter.Name)'." $false
        Set-PhaseState 'home-assistant-vm' 'blocked' 'VirtualBox bridged adapter selection needs explicit approval.'
        Write-Phase "Home Assistant VM paused: approve bridging to '$($routerAdapter.Name)'." 'ACTION'
        return
    }

    $disk = Get-HaosDisk 'vdi'
    $exists = (& $vbox list vms | Out-String) -match '"SOL-HOME"'
    if (-not $exists) {
        & $vbox createvm --name 'SOL-HOME' --ostype 'Linux_64' --register | Out-Null
        & $vbox modifyvm 'SOL-HOME' --memory 4096 --cpus 2 --firmware efi --nic1 bridged --bridgeadapter1 $routerAdapter.Name | Out-Null
        & $vbox storagectl 'SOL-HOME' --name 'SATA' --add sata --controller IntelAhci | Out-Null
        & $vbox storageattach 'SOL-HOME' --storagectl 'SATA' --port 0 --device 0 --type hdd --medium $disk | Out-Null
    }
    & $vbox startvm 'SOL-HOME' --type headless | Out-Null
    Set-PhaseState 'home-assistant-vm' 'partial' 'SOL-HOME created in VirtualBox; onboarding and MCP remain human checkpoints.'
}

function Test-PhoneLinkInstalled {
    return $null -ne (Get-AppxPackage -Name Microsoft.YourPhone -ErrorAction SilentlyContinue)
}

function Test-VoiceMeeterInstalled {
    $candidates = @(
        "$env:ProgramFiles\VB\Voicemeeter\voicemeeterpro.exe",
        "${env:ProgramFiles(x86)}\VB\Voicemeeter\voicemeeterpro.exe",
        "$env:ProgramFiles\VB\Voicemeeter\voicemeeter8.exe",
        "${env:ProgramFiles(x86)}\VB\Voicemeeter\voicemeeter8.exe"
    )
    return $null -ne ($candidates | Where-Object { Test-Path $_ } | Select-Object -First 1)
}

function Write-GeneratedMcpTemplate {
    $templatePath = Join-Path $StackRoot 'config\mcp.template.json'
    $destination = Join-Path $GeneratedRoot 'mcp.generated.json'
    if (Test-Path $templatePath) {
        Copy-Item $templatePath $destination -Force
        Write-Phase "Generated MCP template: $destination" 'OK'
    }
}

Initialize-State
Start-Transcript -Path $TranscriptPath -Force | Out-Null

try {
    Write-Phase "Sol Room Desktop Stack — mode: $Mode" 'INFO'
    Write-Phase "Windows edition: $(Get-WindowsEdition)" 'INFO'

    if ($Mode -ne 'Plan' -and -not (Test-IsAdministrator)) {
        throw 'Run PowerShell as Administrator. UAC must be approved by a human.'
    }

    if (-not (Test-Path $ManifestPath)) { throw "Missing stack manifest: $ManifestPath" }
    Ensure-Winget

    foreach ($package in @(
        @{ Id='Git.Git'; Name='Git' },
        @{ Id='OpenJS.NodeJS.LTS'; Name='Node.js LTS' },
        @{ Id='OBSProject.OBSStudio'; Name='OBS Studio' },
        @{ Id='Genymobile.scrcpy'; Name='scrcpy' }
    )) {
        Install-WingetPackage $package.Id $package.Name
    }
    Set-PhaseState 'base-packages' 'complete' 'Git, Node.js LTS, OBS Studio and scrcpy are installed or planned.'

    if (Test-PhoneLinkInstalled) {
        Write-Phase 'Microsoft Phone Link is installed.' 'OK'
        Set-Checkpoint 'phone-link-pairing' 'Open Phone Link and pair one trusted test phone. Do not place a call yet.' $false
    } else {
        Set-PhaseState 'phone-link' 'blocked' 'Microsoft Phone Link package was not detected.'
        Write-Phase 'Phone Link was not detected. Install it from Microsoft Store, then re-run.' 'ACTION'
    }

    if (Test-VoiceMeeterInstalled) {
        Write-Phase 'VoiceMeeter installation detected.' 'OK'
        Set-Checkpoint 'voicemeeter-driver-and-licence' 'Open VoiceMeeter Banana, confirm devices load, and reboot if its installer requests it.' $true
    } else {
        Set-Checkpoint 'voicemeeter-driver-and-licence' 'Install VoiceMeeter Banana from the official VB-Audio site, accept the licence visibly, and reboot before continuing.' $false
        Write-Phase 'VoiceMeeter requires a supervised official installation and possible reboot.' 'ACTION'
        if ($Mode -ne 'Plan') { Start-Process 'https://vb-audio.com/Voicemeeter/banana.htm' }
    }

    if (-not $SkipHomeAssistant) {
        if (Test-HyperVAvailable) {
            if (Enable-HyperVIfNeeded) {
                Install-HomeAssistantHyperV
            } else {
                Write-Phase 'Hyper-V enablement requires a restart before the VM can be created.' 'ACTION'
            }
        } else {
            Install-HomeAssistantVirtualBox
        }
    } else {
        Set-PhaseState 'home-assistant-vm' 'skipped' 'Skipped by command-line switch.'
    }

    Write-GeneratedMcpTemplate
    Set-Checkpoint 'obs-websocket' 'Open OBS > Tools > WebSocket Server Settings. Bind localhost:4455, enable authentication, and store the password outside git.' $false
    Set-Checkpoint 'android-usb-debug' 'Enable Android developer options and USB debugging, connect through the dock, and approve the RSA prompt on the phone.' $false
    Set-Checkpoint 'home-assistant-onboarding' 'Open http://homeassistant.local:8123, complete onboarding, then add the Model Context Protocol Server integration and expose only approved room entities.' $false
    Set-Checkpoint 'agent-logins' 'Sign into the selected coding/desktop agents manually. Do not automate passwords, passkeys, MFA or OAuth approval.' $false

    $state = Get-State
    if ($state.rebootRequired) {
        Write-Phase 'A Windows restart is required. Re-run this script with -Mode Repair afterwards.' 'ACTION'
    }

    Write-Phase "Install pass complete. State: $StatePath" 'OK'
    Write-Phase "Logs: $LogRoot" 'OK'
    Write-Phase 'Next: run Verify-SolRoomDesktop.ps1 and complete its named checkpoints.' 'ACTION'
}
catch {
    Set-PhaseState 'installer' 'failed' $_.Exception.Message
    Write-Phase $_.Exception.Message 'FAIL'
    throw
}
finally {
    Stop-Transcript | Out-Null
}
