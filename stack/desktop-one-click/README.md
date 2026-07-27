# Sol Room Desktop Stack Installer

This folder is the portable, agent-operable deployment bundle for turning the Windows 11 desktop into the Sol Room control, automation and Home Assistant host.

## Outcome

From an elevated PowerShell terminal, the intended entry point is:

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\stack\desktop-one-click\Install-SolRoomDesktop.ps1 -Mode Install
```

A coding or computer-use agent may run the same command after reading `prompts/SETUP_THIS_DESKTOP.md`.

The installer is designed to be:

- idempotent: safe to re-run after a reboot or partial failure;
- evidence-driven: every phase writes machine-readable state and logs;
- reversible: it does not silently delete existing configuration;
- local-first: secrets stay outside git and services bind locally unless explicitly changed;
- supervised: UAC, driver installation, phone pairing, account login and consequential actions remain human checkpoints.

## What it installs or configures

### Windows host

- Git and Node.js LTS;
- OBS Studio;
- scrcpy and ADB support for Android-over-USB;
- the selected Home Assistant OS VM path;
- project directories, logs and generated MCP configuration;
- optional Playwright MCP configuration;
- placeholders and verified install instructions for Windows UI Automation MCP and OBS MCP;
- startup and health-check scripts.

### Home Assistant VM

The installer detects Windows edition and available hypervisors:

- Hyper-V path where available;
- VirtualBox fallback otherwise.

It downloads the current Home Assistant OS virtual-appliance image from the official Home Assistant release repository, creates `SOL-HOME`, assigns 2 vCPU / 4 GB RAM, and bridges it only to the router-facing network adapter.

The direct laptop-to-desktop media network remains separate.

### Agent harness

This subtree includes:

```text
AGENTS.md
SOUL.md
llms.txt
prompts/SETUP_THIS_DESKTOP.md
skills/desktop-bootstrap/SKILL.md
config/mcp.template.json
stack.manifest.json
```

An agent must treat these files as a deployment contract rather than a suggestion.

## Human checkpoints that cannot be safely removed

The automation pauses or produces an explicit action card for:

1. Windows UAC approval.
2. A reboot after enabling Hyper-V or installing audio drivers.
3. VoiceMeeter Banana download, licence acceptance and driver installation.
4. Pairing Android/iPhone with Microsoft Phone Link.
5. Android USB-debugging authorization on the handset.
6. OBS WebSocket password creation.
7. Home Assistant first-run onboarding.
8. Home Assistant OAuth or long-lived token creation.
9. Logging into ChatGPT, Claude, Gemini, Codex or other agent clients.
10. Permission before placing calls, sending messages, recording or streaming.

The target is therefore **one supervised command**, not silent unattended device takeover.

## Installer modes

```powershell
# Report what would happen without changing the PC
.\Install-SolRoomDesktop.ps1 -Mode Plan

# Install and configure all currently automatable components
.\Install-SolRoomDesktop.ps1 -Mode Install

# Re-run only failed or incomplete phases
.\Install-SolRoomDesktop.ps1 -Mode Repair

# Run the full readiness and safety audit
.\Verify-SolRoomDesktop.ps1
```

## State and logs

Runtime state is written outside the repository:

```text
%ProgramData%\SolRoom\bootstrap\state.json
%ProgramData%\SolRoom\bootstrap\logs\
%USERPROFILE%\.sol-room\generated\
```

No passwords, access tokens, phone numbers or private transcripts may be written into this repository.

## Completion definition

The desktop stack is ready when:

- OBS starts and its local WebSocket endpoint is configured;
- scrcpy can identify the authorized Android device;
- Phone Link is installed and one phone is paired manually;
- VoiceMeeter exposes the intended virtual inputs/outputs;
- `SOL-HOME` boots and is accessible on the router LAN;
- Home Assistant MCP is enabled with only approved entities exposed;
- the selected MCP clients pass read-only smoke tests;
- no agent can place calls, send messages, start recording or stream without explicit confirmation;
- `Verify-SolRoomDesktop.ps1` produces a passing or honestly partial report.
