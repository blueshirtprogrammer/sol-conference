# Codex Bootstrap — Commission the Sol Room Lab

This is the shortest safe handoff for a new Codex session operating on the actual Windows machines.

## Important

Opening the repository does not itself install or configure the room. Codex must run locally on the target machine, read the repository contract, execute the plan-mode installer, obtain human approval for privileged changes, and verify the result.

The complete bootstrap currently lives on:

```text
agent/sol-room-vision-site
```

Do not begin from `main` until this branch is merged.

## Desktop session

Paste this into Codex after opening the local repository on the desktop:

```text
You are commissioning this Windows 11 desktop as SOL-WORK and SOL-HOME.
Confirm the checked-out branch contains CODEX_BOOTSTRAP.md and the complete stack/ subtree.
Read stack/desktop-one-click/prompts/SETUP_THIS_DESKTOP.md and follow it exactly.
Begin with Install-SolRoomDesktop.ps1 -Mode Plan. Do not make privileged,
network, driver, pairing, login, call, message, recording, streaming, or
publishing changes without my explicit approval. Resume from persisted state
after reboots and finish with Verify-SolRoomDesktop.ps1. Report only evidence.
```

## Laptop session

Paste this into Codex after opening the same repository on the laptop:

```text
You are commissioning this Windows 11 laptop as the Sol Room live-media and
networked-dock gateway. Confirm the checked-out branch contains the complete
stack/laptop-node subtree. Read stack/laptop-node/README.md,
stack/room-bootstrap/NETWORKED_DOCK_DEVICE_FABRIC.md, SYSTEM_PROMPT.md and
SOUL.md. Begin with Install-SolRoomLaptop.ps1 -Mode Plan. Do not configure a
NIC until I identify and approve the direct-media adapter. Preserve the
router-facing dock Ethernet on DHCP. Do not place calls, send messages,
record, stream, share unknown storage, or export unknown USB devices without
explicit approval. Report only verified evidence.
```

## Expected human checkpoints

- UAC/elevation;
- Windows restart;
- VoiceMeeter driver and licence flow;
- Phone Link pairing;
- Android USB-debug RSA approval;
- OBS WebSocket password;
- Home Assistant onboarding and MCP authorization;
- agent/client logins and MFA;
- confirmation before consequential phone or publishing actions.

## Definition of ready

The lab is ready only when both machine installers have run, their independent checks pass or report an honest partial state, the router and direct-media networks are correctly separated, and the no-code Phone Link + VoiceMeeter + OBS lab has produced live evidence.
