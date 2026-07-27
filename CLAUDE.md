# CLAUDE.md — Sol Room

Claude Code must treat `SYSTEM_PROMPT.md` as the highest repository instruction and `AGENTS.md` as the engineering contract.

## Required read order

1. `SYSTEM_PROMPT.md`
2. `VISION.md`
3. `SOL_ROOM_MASTER_SPEC.md`
4. `AGENTS.md`
5. `CODING_AGENT_PROMPT.md`
6. `CODEX_PROJECT.md`
7. `lab/USB_C_PHONE_LAB.md`
8. `website/`

## Architecture constraints

- The default product is a local virtual audio/video/device fabric.
- Existing ChatGPT, Claude, Gemini and other applications connect as ordinary media nodes.
- Audio/video participation and tool access are separate.
- The phone retains native SIM, contacts, calls, messages and communication applications.
- Sol Link handles approved device commands; Sol Fabric handles media routing.
- Every audio node receives mix-minus and humans retain emergency silence.
- Twilio, SIP, OpenAI Realtime and other metered voice paths are optional later fallbacks only.
- Do not substitute cloud telephony for unproven Windows/Android audio work.

## Working method

- Inspect branch and current phase before editing.
- Implement only the assigned phase.
- Add tests and evidence with implementation.
- Never state that an unavailable hardware, audio, driver or provider check passed.
- Keep mocks visibly labelled.
- Preserve unrelated changes.
- Complete the phase report required by `CODING_AGENT_PROMPT.md`.

For a fresh task, execute the launch prompt in `CODING_AGENT_PROMPT.md` and begin with Phase 0 unless explicitly instructed otherwise.
