# AGENTS.md — Sol Room Desktop Bootstrap Contract

This subtree exists to let a capable coding/computer-use agent configure the Windows desktop as the Sol Room work, Home Assistant and orchestration node without improvising architecture.

## Mandatory read order

1. `README.md`
2. `SOUL.md`
3. `llms.txt`
4. `stack.manifest.json`
5. `prompts/SETUP_THIS_DESKTOP.md`
6. `skills/desktop-bootstrap/SKILL.md`
7. `Install-SolRoomDesktop.ps1`
8. `Verify-SolRoomDesktop.ps1`
9. repository root `SYSTEM_PROMPT.md`
10. repository root `SOUL.md`
11. `lab/HOME_ASSISTANT_WINDOWS_HOST.md`
12. `lab/NO_CODE_INTEGRATION_LAB.md`
13. `mcp/MCP_STACK.md`

## Execution contract

- Begin with `-Mode Plan`.
- Inspect the plan, Windows edition, active adapters, virtualisation capability and existing software.
- Never assume the USB Ethernet adapter is the router-facing NIC. Use the interface carrying the default route.
- Never bind `SOL-HOME` to the direct `10.77.0.0/24` media network.
- Never use the damaged Raspberry Pi as a required component.
- Run installation from a visibly elevated terminal only after the human approves UAC.
- Re-run with `-Mode Repair` after reboots or interrupted phases.
- Run the independent verifier after every install pass.
- Preserve logs and report exact partial/failing checks.

## Control priority

1. Official installer or API.
2. Deterministic CLI or repository script.
3. MCP with constrained tools.
4. Windows UI Automation by accessible control name.
5. Screenshot/mouse fallback with supervision.

Do not use coordinate clicking when a structured interface exists.

## Consequential-action boundary

The following always require explicit human confirmation immediately before execution:

- placing, answering or ending a real call;
- sending SMS, WhatsApp, email or another message;
- starting recording, streaming or screen broadcast;
- exposing Home Assistant outside the local network;
- installing an unreviewed MCP server or APK;
- changing firewall, router, account or device-security settings;
- deleting user data or overwriting an existing agent configuration.

## Secrets

Never place the following in git, prompts, screenshots, logs or diagnostics bundles:

- OBS WebSocket passwords;
- Home Assistant tokens;
- OAuth tokens or cookies;
- phone numbers beyond deliberately masked test identifiers;
- MFA/passkey/verification codes;
- private recordings or transcripts.

Use local environment variables or protected client credential stores.

## Success standard

A setup is not complete because an installer exited successfully. Completion requires:

- the verifier report;
- a manually paired trusted phone;
- authorized Android ADB;
- OBS WebSocket authenticated read-only smoke test;
- Home Assistant reachable and deliberately exposed through MCP;
- VoiceMeeter device test;
- proof that no consequential action runs without confirmation;
- an honest list of anything still unverified, especially Phone Link audio routing.
