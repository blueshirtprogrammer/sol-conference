# Sol Conference — Codex Project Plan

## Mandatory entry

Read `SYSTEM_PROMPT.md`, `AGENTS.md`, `CODING_AGENT_PROMPT.md`, this file, every file under `specs/`, and `prompts/sol-voice-system.md` before implementation.

## Product outcome
Create a native cross-device communications platform where Josh can say or type commands such as “send Mum an SMS”, “call Mum”, or “start Mum, Josh and Sol”, with the action executed through the phone’s real SIM and native dialler or through a supported AI conference.

## Phase 0 — Repository foundation
Deliver:
- pnpm workspace and strict TypeScript configuration
- shared lint/test/build configuration
- Docker Compose with Postgres and Redis
- contracts, structured errors, logging and provider interfaces
- CI for lint, typecheck, unit tests and build

Done when all required root commands pass in mock mode.

## Phase 1 — Consumer web experience
Deliver the complete responsive UI using mock event fixtures before live providers:
- setup wizard
- Home
- Live Call
- Contacts
- History
- Messages
- Settings
- Mum Mode
- Diagnostics
- post-call summary

Implement the exact interaction states in `specs/ui-ux.md`. Add Playwright journeys and accessibility checks.

Done when screenshots and tests cover the required desktop/mobile states.

## Phase 2 — Gateway and conference state machine
Deliver:
- Fastify gateway
- authenticated REST API
- SSE or WebSocket event stream
- Postgres persistence
- Redis idempotency/session locks
- conference and participant state machines
- audit trail
- mock Twilio/OpenAI adapters

Done when browser refresh restores a live mocked call and duplicate commands cannot create duplicate calls.

## Phase 3 — Twilio Conference
Deliver:
- inbound and outbound call flows
- conference creation
- participant callbacks
- allowlisted numbers
- one-attempt dropped-call reconnect
- SMS provider fallback
- request-signature verification
- spend and duration limits

Done when integration tests exercise create, join, remove, reconnect and failure reconciliation.

## Phase 4 — OpenAI Realtime SIP participant
Deliver:
- Twilio adds OpenAI SIP participant
- signed `realtime.call.incoming` webhook handling
- call acceptance and session configuration
- sideband WebSocket for tools and state
- compiled runtime prompt from `prompts/sol-voice-system.md`
- concise telephone persona
- barge-in and interruption handling
- remove Sol without ending human call

Done when staged calls preserve human participants through Sol failure/removal.

## Phase 5 — `solctl` and MCP
Deliver:
- signed JSON CLI
- preview/commit flows
- trusted-contact policy engine
- MCP tools wrapping the same command service
- audit events for every command

Done when CLI tests demonstrate no action on preview, one action on commit and idempotent replay.

## Phase 6 — Android Sol Relay
Deliver a Kotlin/Compose app using Android Keystore, FCM, WorkManager and Room.

Capabilities:
- device pairing
- signed-command verification
- native `SmsManager` sending through selected SIM
- native calls via `TelecomManager` or `ACTION_DIAL` according to policy
- sent/delivery status where available
- pending command confirmation UI
- battery-optimisation guidance
- gateway WebSocket with HTTPS fallback

Release 1 must not replace the default dialler. Incoming-SMS gateway functionality is a separately permissioned private mode.

Done on a real Samsung Android device with the tests in `specs/acceptance-tests.md`.

## Phase 7 — Windows Sol Desktop
Deliver .NET 9/WinUI 3:
- device pairing/status
- local HTTPS or named-pipe API
- Credential Manager storage
- CLI installation and diagnostics
- Phone Link setup/status guidance
- supervised WASAPI bridge controls

Do not automate ChatGPT login or claim to launch ChatGPT Voice programmatically.

Done when bridge start/stop/mute controls work without disconnecting humans.

## Phase 8 — Deployment and operations
Deliver:
- container deployment for persistent gateway
- web deployment
- migrations
- secret setup docs
- provider console setup docs
- observability and diagnostic bundle
- staging-call script
- privacy retention controls

Done only after a real verified-number staging call and a written verification report.

## Final definition of done
- every phase acceptance criterion passes
- no production TODOs or fake adapters selected in production
- secrets and family data are absent from git
- humans keep speaking if Sol fails
- unknown recipients require device confirmation
- mobile UI is one-handed and accessible
- complete setup and recovery documentation exists
- final report distinguishes mocked, configured, deployed and verified-live components

## First Codex instruction

```text
Read SYSTEM_PROMPT.md, AGENTS.md, CODING_AGENT_PROMPT.md, CODEX_PROJECT.md, every file under specs/, and prompts/sol-voice-system.md.

Implement Phase 0 only.

Do not start Phase 1 until pnpm install, lint, typecheck, tests, production build, and docker compose startup all pass. Do not leave TODOs, placeholder success responses, incomplete provider interfaces, or unverified claims. Commit the completed phase with the verification report required by CODING_AGENT_PROMPT.md.
```

## Claude Code and other agents

Claude Code reads `CLAUDE.md`. GitHub Copilot coding agent reads `.github/copilot-instructions.md`. Other agents use `CODING_AGENT_PROMPT.md`. All entrypoints defer to the same `SYSTEM_PROMPT.md`, specifications, phase discipline, and acceptance tests.
