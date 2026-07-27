# AGENTS.md — Sol Conference

## Instruction hierarchy

Before implementation, read in order:

1. `SYSTEM_PROMPT.md`
2. `AGENTS.md`
3. `CODING_AGENT_PROMPT.md`
4. `CODEX_PROJECT.md`
5. every file under `specs/`
6. `prompts/sol-voice-system.md`
7. any nested `AGENTS.md` or platform-specific instruction applying to edited files

`SYSTEM_PROMPT.md` is the repository-level system instruction. `prompts/sol-voice-system.md` controls the runtime voice participant and must not be confused with coding-agent instructions.

## Mission
Build a production-grade native communications system that lets trusted people use ordinary phone calls and SMS while an AI voice participant can join conferences through supported APIs.

## Non-negotiable architecture
- Humans use their phone's native dialler, cellular service and ordinary SMS.
- Android is the programmable SIM gateway through a private `Sol Relay` app.
- Windows runs `Sol Desktop`, `solctl`, optional MCP tools and a supervised audio bridge.
- Multi-party AI calls use Twilio Conference plus OpenAI Realtime SIP.
- The native ChatGPT desktop app may be routed into a supervised conference as an optional bridge, but must never be reverse engineered or treated as the production voice backend.
- Wi-Fi/mobile data carries commands; Bluetooth is only for Phone Link call audio; USB is for development, charging and recovery.

## Repository expectations
Use a strict TypeScript pnpm monorepo for web, gateway, contracts, CLI and MCP components. Use Kotlin/Jetpack Compose for Android. Use .NET 9/WinUI 3 for Windows.

Target structure:

```text
apps/web
apps/gateway
apps/android-relay
apps/windows-desktop
packages/contracts
packages/device-commands
packages/command-signing
packages/solctl
packages/mcp-server
packages/provider-adapters
prompts
specs
docs
skills/sol-conference
```

## Engineering rules
1. Read every mandatory instruction and specification file before implementation.
2. Use official current OpenAI, Twilio, Android and Microsoft documentation for provider details.
3. TypeScript strict mode is mandatory.
4. Validate all external input with Zod or the platform equivalent.
5. Verify Twilio and OpenAI webhook signatures against raw request bodies.
6. Every outward action uses preview then commit, unless a trusted-contact policy explicitly allows direct execution after conversational confirmation.
7. Commands are signed, timestamped, idempotent, short-lived and device-bound.
8. Never commit secrets, phone numbers, private profiles, recordings or transcripts.
9. Unknown recipients require device-level confirmation.
10. Emergency, premium and international numbers may never be dialled automatically.
11. Recording is off by default. AI participation is disclosed.
12. Human calls must survive AI failure or removal.
13. Do not leave production TODOs, fake success responses or unimplemented routes.
14. Mock providers are allowed only behind complete provider interfaces.
15. Production must refuse mock provider selection.
16. Run lint, typecheck, tests and builds before declaring a phase complete.
17. Distinguish truthfully between implemented, mocked, configured, deployed and verified-live states.

## UX rules
- Build a calm consumer communications product, not a developer dashboard.
- Primary actions must be usable one-handed on mobile.
- Minimum control target: 48x48 px.
- WCAG 2.2 AA.
- Never expose SIP, TwiML, SIDs, webhooks or Realtime IDs outside Diagnostics.
- Every visual state must be backed by confirmed local pending state or backend/provider events.

## Required commands
The final repository must support:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
docker compose up
```

The CLI must support JSON output:

```bash
solctl device list
solctl device status
solctl sms preview --contact mum --message "..."
solctl sms send --confirmation TOKEN
solctl call preview --contact mum
solctl call start --confirmation TOKEN --mode native
solctl call start --confirmation TOKEN --mode conference
solctl conference create --mum --sol
solctl conference add-sol ID
solctl conference remove-sol ID
```

## Phase discipline
Implement one phase at a time from `CODEX_PROJECT.md`. A phase is complete only when its definition of done and tests pass. Commit each phase separately with a clear summary and the verification report required by `CODING_AGENT_PROMPT.md`.
