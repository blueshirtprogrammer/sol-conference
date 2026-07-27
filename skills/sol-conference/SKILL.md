---
name: sol-conference
description: Build, test, review, or operate the Sol Conference native communications platform, including Twilio/OpenAI voice conferencing, Android native SMS and calls, Windows desktop bridging, solctl, MCP, accessibility, and device-command security.
---

# Sol Conference Skill

## Trigger

Use this skill whenever a task involves this repository or any of these areas:

- Sol Conference product implementation;
- native Android SMS or calling;
- Twilio Conference call control;
- OpenAI Realtime SIP;
- Sol voice behaviour;
- Windows Phone Link or supervised ChatGPT audio bridging;
- `solctl` or Sol MCP tools;
- call-state UI, Mum Mode, transcripts, summaries, accessibility, or diagnostics;
- device command signing, confirmations, audit events, or contact permissions.

## Mandatory context

Read, in order:

1. `/SYSTEM_PROMPT.md`
2. `/AGENTS.md`
3. `/CODING_AGENT_PROMPT.md`
4. `/CODEX_PROJECT.md`
5. `/specs/product-requirements.md`
6. `/specs/architecture.md`
7. `/specs/native-integrations.md`
8. `/specs/ui-ux.md`
9. `/specs/acceptance-tests.md`
10. `/prompts/sol-voice-system.md`

If a referenced file does not exist, do not silently proceed. Report the missing contract or create it when the task authorises repository changes.

## Decision rules

### Direct communication

Use Android Relay and the phone's selected SIM for native SMS and ordinary calls. Keep the operating-system Phone and Messages experiences authoritative.

### AI conference

Use Twilio Conference plus OpenAI Realtime SIP. Design removal and failure so human participants remain connected.

### Native ChatGPT desktop voice

Treat this as a manually started, supervised Windows audio bridge. Do not automate ChatGPT authentication, reverse engineer the app, or claim a supported API to start native Voice.

### Automation interface

Use the shared command service. `solctl` is required; MCP is a wrapper, not a separate implementation.

### Outward actions

Require preview and commit unless an explicit trusted-contact policy authorises execution after confirmed consent. Unknown recipients require device confirmation. Never remotely auto-dial emergency, premium, or international numbers.

## Implementation workflow

1. Identify the active phase.
2. Inspect existing code and tests.
3. Implement one complete vertical slice within that phase.
4. Add typed contracts and validation first at external boundaries.
5. Add provider mocks and real adapters behind the same interface.
6. Add tests for success, failure, retries, duplicate delivery, expiry, cancellation, and privacy controls.
7. Run all applicable checks.
8. Produce the completion report required by `CODING_AGENT_PROMPT.md`.

## Review checklist

- No fake success paths or production TODOs.
- No secrets or personal data in git.
- Signatures verified using raw request bodies.
- Commands authenticated, signed, expiring, idempotent, and audited.
- Human calls survive AI failure/removal.
- Recording off by default and AI participation disclosed.
- UI state comes from confirmed backend/provider state.
- WCAG 2.2 AA, keyboard operation, 200% zoom, reduced motion, and screen-reader announcements are covered.
- Live tests are described truthfully and separately from mocked tests.
