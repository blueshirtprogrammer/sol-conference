[CmdletBinding()]
param(
    [string]$HomeAssistantHost = 'homeassistant.local',
    [int]$HomeAssistantPort = 8123,
    [int]$ObsWebSocketPort = 4455,
    [switch]$WriteJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'

$StateRoot = Join-Path $env:ProgramData 'SolRoom\bootstrap'
$ReportRoot = Join-Path $StateRoot 'reports'
New-Item -ItemType Directory -Force -Path $ReportRoot | Out-Null
$reportPath = Join-Path $ReportRoot ("verification-{0:yyyyMMdd-HHmmss}.json" -f (Get-Date))

$checks = [System.Collections.Generic.List[object]]::new()

function Add-Check {
    param(
        [string]$Name,
        [ValidateSet('pass','partial','fail','manual')][string]$Status,
        [string]$Evidence,
        [string]$NextAction = ''
    )
    $checks.Add([ordered]@{
        name = $Name
        status = $Status
        evidence = $Evidence
        nextAction = $NextAction
    })
}

function Test-CommandAvailable {
    param([string]$Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Test-WingetPackage {
    param([string]$Id)
    if (-not (Test-CommandAvailable 'winget')) { return $false }
    $output = & winget list --id $Id --exact --accept-source-agreements 2>$null | Out-String
    return ($LASTEXITCODE -eq 0 -and $output -match [regex]::Escape($Id))
}

function Test-TcpEndpoint {
    param([string]$HostName, [int]$Port)
    try {
        return Test-NetConnection -ComputerName $HostName -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    } catch {
        return $false
    }
}

foreach ($package in @(
    @{ Id='Git.Git'; Name='Git' },
    @{ Id='OpenJS.NodeJS.LTS'; Name='Node.js LTS' },
    @{ Id='OBSProject.OBSStudio'; Name='OBS Studio' },
    @{ Id='Genymobile.scrcpy'; Name='scrcpy' }
)) {
    if (Test-WingetPackage $package.Id) {
        Add-Check $package.Name 'pass' "WinGet package $($package.Id) detected."
    } else {
        Add-Check $package.Name 'fail' "WinGet package $($package.Id) not detected." 'Run Install-SolRoomDesktop.ps1 -Mode Repair.'
    }
}

$phoneLink = Get-AppxPackage -Name Microsoft.YourPhone -ErrorAction SilentlyContinue
if ($phoneLink) {
    Add-Check 'Microsoft Phone Link' 'manual' "Package detected: $($phoneLink.Version)." 'Open Phone Link and verify that one trusted test phone is paired and a normal call works before audio routing.'
} else {
    Add-Check 'Microsoft Phone Link' 'fail' 'Microsoft.YourPhone package not found.' 'Install Phone Link from Microsoft Store.'
}

$voiceMeeterCandidates = @(
    "$env:ProgramFiles\VB\Voicemeeter\voicemeeterpro.exe",
    "${env:ProgramFiles(x86)}\VB\Voicemeeter\voicemeeterpro.exe",
    "$env:ProgramFiles\VB\Voicemeeter\voicemeeter8.exe",
    "${env:ProgramFiles(x86)}\VB\Voicemeeter\voicemeeter8.exe"
)
$voiceMeeter = $voiceMeeterCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($voiceMeeter) {
    Add-Check 'VoiceMeeter Banana' 'manual' "Executable detected: $voiceMeeter" 'Open it and confirm A1, B1 and B2 devices operate without driver errors.'
} else {
    Add-Check 'VoiceMeeter Banana' 'fail' 'No expected VoiceMeeter executable found.' 'Install the official VoiceMeeter Banana package and restart Windows.'
}

$adb = Get-Command adb -ErrorAction SilentlyContinue
if ($adb) {
    $devices = & adb devices 2>$null | Select-Object -Skip 1 | Where-Object { $_ -match '\S' }
    $authorized = $devices | Where-Object { $_ -match '\sdevice$' }
    $unauthorized = $devices | Where-Object { $_ -match '\sunauthorized$' }
    if ($authorized) {
        Add-Check 'Android ADB authorization' 'pass' ("Authorized devices: " + ($authorized -join '; '))
    } elseif ($unauthorized) {
        Add-Check 'Android ADB authorization' 'partial' ("Unauthorized devices: " + ($unauthorized -join '; ')) 'Approve the RSA prompt on the Android handset.'
    } else {
        Add-Check 'Android ADB authorization' 'manual' 'ADB is installed but no authorized device is connected.' 'Connect Android by USB through the dock and approve USB debugging.'
    }
} else {
    Add-Check 'Android ADB authorization' 'fail' 'adb command not found.' 'Repair the scrcpy installation or add its directory to PATH.'
}

if (Test-TcpEndpoint '127.0.0.1' $ObsWebSocketPort) {
    Add-Check 'OBS WebSocket' 'partial' "TCP port 127.0.0.1:$ObsWebSocketPort is listening." 'Run an authenticated OBS MCP read-only scene-list smoke test.'
} else {
    Add-Check 'OBS WebSocket' 'manual' "Nothing is listening on 127.0.0.1:$ObsWebSocketPort." 'Start OBS and enable Tools > WebSocket Server Settings with authentication.'
}

$hyperVVm = $null
if (Get-Command Get-VM -ErrorAction SilentlyContinue) {
    $hyperVVm = Get-VM -Name 'SOL-HOME' -ErrorAction SilentlyContinue
}
$vbox = @(
    "$env:ProgramFiles\Oracle\VirtualBox\VBoxManage.exe",
    "${env:ProgramFiles(x86)}\Oracle\VirtualBox\VBoxManage.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
$vboxVmExists = $false
if ($vbox) {
    $vboxVmExists = ((& $vbox list vms 2>$null | Out-String) -match '"SOL-HOME"')
}

if ($hyperVVm) {
    Add-Check 'SOL-HOME VM' ($(if ($hyperVVm.State -eq 'Running') {'pass'} else {'partial'})) "Hyper-V VM state: $($hyperVVm.State)." 'Start the VM if stopped.'
} elseif ($vboxVmExists) {
    $running = ((& $vbox list runningvms 2>$null | Out-String) -match '"SOL-HOME"')
    Add-Check 'SOL-HOME VM' ($(if ($running) {'pass'} else {'partial'})) "VirtualBox VM exists; running=$running." 'Start the VM if stopped.'
} else {
    Add-Check 'SOL-HOME VM' 'fail' 'No Hyper-V or VirtualBox VM named SOL-HOME was found.' 'Run the installer with Home Assistant enabled and approve the router-facing bridge.'
}

if (Test-TcpEndpoint $HomeAssistantHost $HomeAssistantPort) {
    Add-Check 'Home Assistant HTTP' 'pass' "$HomeAssistantHost`:$HomeAssistantPort is reachable."
    Add-Check 'Home Assistant MCP' 'manual' 'Home Assistant is reachable, but MCP authentication and exposed-entity policy cannot be inferred safely.' 'Add Model Context Protocol Server in Home Assistant and run a read-only context smoke test.'
} else {
    Add-Check 'Home Assistant HTTP' 'partial' "$HomeAssistantHost`:$HomeAssistantPort is not reachable from this Windows host." 'Check VM networking, router DHCP and Home Assistant onboarding.'
}

$defaultRoute = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
    Where-Object { $_.NextHop -ne '0.0.0.0' } |
    Sort-Object RouteMetric, InterfaceMetric |
    Select-Object -First 1
if ($defaultRoute) {
    $adapter = Get-NetAdapter -InterfaceIndex $defaultRoute.InterfaceIndex -ErrorAction SilentlyContinue
    Add-Check 'Router-facing network' 'pass' "Default route uses '$($adapter.Name)' at index $($adapter.InterfaceIndex)."
} else {
    Add-Check 'Router-facing network' 'fail' 'No IPv4 default route found.' 'Restore the desktop router/LAN connection.'
}

$directAddress = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -in @('10.77.0.1','10.77.0.2') } |
    Select-Object -First 1
if ($directAddress) {
    $gatewayOnDirect = Get-NetIPConfiguration -InterfaceIndex $directAddress.InterfaceIndex -ErrorAction SilentlyContinue
    if ($gatewayOnDirect.IPv4DefaultGateway) {
        Add-Check 'Direct media network' 'fail' "Direct interface $($directAddress.InterfaceAlias) has a default gateway." 'Remove gateway and DNS from the 10.77.0.0/24 direct media interface.'
    } else {
        Add-Check 'Direct media network' 'pass' "$($directAddress.InterfaceAlias) has $($directAddress.IPAddress) and no default gateway."
    }
} else {
    Add-Check 'Direct media network' 'manual' 'No 10.77.0.1 or 10.77.0.2 address was found.' 'Configure the dedicated laptop-desktop media NIC only when ready; this is optional for the first call proof.'
}

$summary = [ordered]@{
    generatedAt = (Get-Date).ToString('o')
    computer = $env:COMPUTERNAME
    homeAssistantTarget = "$HomeAssistantHost`:$HomeAssistantPort"
    totals = [ordered]@{
        pass = @($checks | Where-Object status -eq 'pass').Count
        partial = @($checks | Where-Object status -eq 'partial').Count
        fail = @($checks | Where-Object status -eq 'fail').Count
        manual = @($checks | Where-Object status -eq 'manual').Count
    }
    checks = $checks
    safety = [ordered]@{
        callsRequireConfirmation = $true
        messagesRequireConfirmation = $true
        recordingRequiresConfirmation = $true
        streamingRequiresConfirmation = $true
        secretsMayBeCommitted = $false
        raspberryPiRequired = $false
    }
}

$summary | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $reportPath

Write-Host "Sol Room Desktop verification" -ForegroundColor Cyan
Write-Host "PASS=$($summary.totals.pass) PARTIAL=$($summary.totals.partial) FAIL=$($summary.totals.fail) MANUAL=$($summary.totals.manual)"
foreach ($check in $checks) {
    $colour = switch ($check.status) {
        'pass' { 'Green' }
        'fail' { 'Red' }
        'partial' { 'Yellow' }
        default { 'Cyan' }
    }
    Write-Host ("[{0}] {1}: {2}" -f $check.status.ToUpper(), $check.name, $check.evidence) -ForegroundColor $colour
    if ($check.nextAction) { Write-Host "       Next: $($check.nextAction)" }
}
Write-Host "Report: $reportPath" -ForegroundColor Cyan

if ($WriteJson) {
    $summary | ConvertTo-Json -Depth 10
}

if ($summary.totals.fail -gt 0) { exit 2 }
if ($summary.totals.partial -gt 0 -or $summary.totals.manual -gt 0) { exit 1 }
exit 0
