# Sol Room Desktop Bootstrap Skill

Use this skill only when commissioning, repairing, or verifying the Windows desktop as the `SOL-WORK` and `SOL-HOME` host.

## Inputs

- current Windows edition;
- repository branch;
- router-facing network adapter;
- optional direct-media adapter;
- human approval for elevation and network changes;
- installer state under `%ProgramData%\SolRoom\bootstrap`.

## Control order

1. Read `../prompts/SETUP_THIS_DESKTOP.md` and the desktop installer README.
2. Run `Install-SolRoomDesktop.ps1 -Mode Plan` without changing the machine.
3. Present the plan and unresolved adapter choices.
4. After explicit approval, run Install or Repair with the minimum required switches.
5. Stop at UAC, reboot, driver, pairing, login, OAuth, Home Assistant onboarding, and secret-entry checkpoints.
6. Resume from the persisted state after the human completes a checkpoint.
7. Run `Verify-SolRoomDesktop.ps1` independently.
8. Report verified, partial, blocked, and failed items separately.

## Never do

- never choose a network adapter by guessing from a friendly name when multiple candidates exist;
- never bridge `SOL-HOME` to the direct `10.77.0.0/24` media network;
- never commit or print secrets into the repo;
- never disable security software, Windows test-signing, MFA, or confirmation policies;
- never claim Phone Link audio, VoiceMeeter mix-minus, Android steering, OBS control, or Home Assistant MCP passed without live evidence;
- never place calls, send messages, record, stream, or publish without current human approval.

## Success evidence

A successful desktop commissioning includes:

- installer state and logs;
- Home Assistant VM running on the router LAN;
- generated MCP configuration outside git;
- OBS and Android tooling installed or honestly checkpointed;
- verifier output;
- network separation evidence;
- a clear handoff to the laptop-node installer.
