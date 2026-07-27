# GitHub Copilot Coding Agent Instructions

Before editing code, read these files in order:

1. `/SYSTEM_PROMPT.md`
2. `/AGENTS.md`
3. `/CODING_AGENT_PROMPT.md`
4. `/CODEX_PROJECT.md`
5. every file in `/specs/`
6. `/prompts/sol-voice-system.md`

Implement only the phase assigned by the user. Do not begin a later phase until the current phase definition of done and applicable acceptance tests pass.

Critical invariants:

- Android Relay sends native SMS and places native calls through supported Android APIs.
- Humans retain ordinary Phone and Messages experiences.
- AI conferences use Twilio Conference plus OpenAI Realtime SIP.
- Native ChatGPT desktop voice is an optional manually started supervised audio bridge only.
- Human participants remain connected when Sol fails or leaves.
- Outward actions use preview and commit, signed expiring idempotent commands, restrictive contact policies, and audit events.
- Unknown recipients require device confirmation.
- Never auto-dial emergency, premium, or international numbers.
- Never commit secrets, phone numbers, private profiles, transcripts, recordings, or device keys.
- Never claim tests, builds, calls, SMS, deployments, or device flows passed unless actually executed and inspected.
- Do not leave production TODOs, fake success responses, dead controls, or mock providers selectable in production.

Use official current primary documentation for provider and platform details. Add tests with the implementation and return the verification report required by `/CODING_AGENT_PROMPT.md`.
