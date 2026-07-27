# Set Up This Desktop as SOL-WORK

You are operating on the Windows 11 desktop that will host the Sol Room control plane, coding agents, build services, storage, and the `SOL-HOME` Home Assistant OS virtual machine.

## Mandatory read order

1. `SYSTEM_PROMPT.md`
2. `SOUL.md`
3. `START_BUILD_HERE.md`
4. `stack/desktop-one-click/README.md`
5. `stack/desktop-one-click/AGENTS.md`
6. `stack/desktop-one-click/SOUL.md`
7. `stack/desktop-one-click/stack.manifest.json`
8. `stack/room-bootstrap/NETWORKED_DOCK_DEVICE_FABRIC.md`
9. `stack/laptop-node/README.md`
10. `lab/HOME_ASSISTANT_WINDOWS_HOST.md`

## Objective

Commission this desktop as `SOL-WORK` using the repository installer. Do not redesign the stack. Do not silently bypass UAC, Windows security, driver prompts, device pairing, account sign-in, MFA, Home Assistant onboarding, or approval gates.

## Procedure

1. Inspect the repository branch and confirm it is `agent/sol-room-vision-site` or a descendant containing the complete bootstrap subtree.
2. Run the desktop installer in plan mode:

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\stack\desktop-one-click\Install-SolRoomDesktop.ps1 -Mode Plan
```

3. Summarise detected Windows edition, hypervisor path, router-facing NIC, packages, VM plan, network changes, checkpoints, and anything ambiguous.
4. Request human approval before elevated installation or network changes.
5. After approval, run:

```powershell
.\stack\desktop-one-click\Install-SolRoomDesktop.ps1 -Mode Install -ApproveNetworkChanges
```

6. If a reboot is required, preserve state and instruct the human to restart. Resume with:

```powershell
.\stack\desktop-one-click\Install-SolRoomDesktop.ps1 -Mode Repair -ApproveNetworkChanges
```

7. Run the independent verifier:

```powershell
.\stack\desktop-one-click\Verify-SolRoomDesktop.ps1
```

8. Do not report completion unless the verifier and named human checkpoints support it. Use `partial`, `blocked`, or `unverified` honestly.

## Safety constraints

- Keep the Home Assistant VM on the router-facing NIC only.
- Preserve the direct laptop-desktop media network as a separate no-gateway subnet.
- Never commit passwords, tokens, phone numbers, pairing codes, recordings, transcripts, or private device identifiers.
- Do not place calls, send messages, start recording, start streaming, or alter external accounts without explicit human confirmation at the time of action.
- Do not enable Windows test-signing or install unreviewed kernel drivers.
- Do not expose broad SMB, USB-over-IP, MCP, OBS WebSocket, or Home Assistant services to public networks.

## Completion report

Return:

- exact commands run;
- package and VM status;
- network adapter mapping;
- generated configuration paths;
- verifier output;
- human checkpoints completed and remaining;
- failures or uncertainties;
- next action for commissioning the laptop/dock node.
