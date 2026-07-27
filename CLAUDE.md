# CLAUDE.md — Sol Room

Claude Code and Claude Work must treat `SYSTEM_PROMPT.md` as the highest repository instruction, `SOUL.md` as the product/decision doctrine and `AGENTS.md` as the engineering contract.

## Required read order

1. `SYSTEM_PROMPT.md`
2. `VISION.md`
3. `SOL_ROOM_MASTER_SPEC.md`
4. `SOUL.md`
5. `START_BUILD_HERE.md`
6. `AGENTS.md`
7. `CODING_AGENT_PROMPT.md`
8. `CODEX_PROJECT.md`
9. `llms.txt`
10. `specs/obs-plugin.md`
11. `lab/CURRENT_HARDWARE_TOPOLOGY.md`
12. `lab/PHONE_LINK_OBS_BUILD_PLAN.md`
13. `lab/NO_CODE_INTEGRATION_LAB.md`
14. `mcp/MCP_STACK.md`
15. `.mcp.example.json`
16. `lab/USB_C_PHONE_LAB.md`
17. `skills/sol-room-integration-lab/SKILL.md`

## Architecture constraints

- The default product is a local virtual audio/video/device fabric.
- Existing ChatGPT, Claude, Gemini and other applications connect as ordinary media nodes.
- Microsoft Phone Link is the first native cellular-call transport adapter.
- VoiceMeeter Banana is the temporary proof mixer, not the permanent product architecture.
- OBS Studio is the visual compositor and operator surface.
- External OBS WebSocket proof precedes a native OBS plugin.
- Sol Fabric owns authoritative room state, routing, policy, MCP and emergency control.
- Audio/video participation and tool access are separate.
- Every audio node receives mix-minus and humans retain emergency silence.
- Windows UI Automation precedes screenshot/pixel control.
- Twilio, SIP, OpenAI Realtime and other metered voice paths are optional later fallbacks only.
- Do not substitute cloud telephony for unproven Windows/phone audio work.

## MCP setup

Use project-local or local/user MCP configuration as appropriate. Keep OBS passwords out of the shared repository.

Use exactly one server per capability:

- OBS: `obs-mcp@1.1.0` or the sbroenne OBS MCP extension;
- Windows semantic automation: `sbroenne/mcp-windows` or FlaUI-MCP.

On native Windows, stdio `npx` commands may require the `cmd /c` wrapper.

## Current task boundary

Begin with either:

- the supervised no-code lab in `lab/NO_CODE_INTEGRATION_LAB.md`; or
- Phase 0B in `START_BUILD_HERE.md`.

Do not begin a custom audio driver, native OBS plugin, Phone Link clone or cloud telephony integration.

## Working method

- Inspect branch, software state, MCP tools and current phase before editing or acting.
- Restate the bounded objective.
- Configure or implement only the assigned proof.
- Add tests and evidence with implementation.
- Verify actual state after every OBS/Windows action.
- Never state that unavailable hardware, caller audio, driver or provider checks passed.
- Keep mocks visibly labelled.
- Require confirmation before calls, messages, recording, streaming, publishing, drivers or elevation.
- Preserve unrelated changes.
- Complete the phase/lab report required by the relevant skill and `CODING_AGENT_PROMPT.md`.

For a fresh session, use the complete message in `prompts/PASTE_INTO_ANY_CODING_AGENT.txt`.