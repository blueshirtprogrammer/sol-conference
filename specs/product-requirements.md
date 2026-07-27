# Product Requirements

## 1. Objective

Build a production-ready native communications platform that lets trusted people use ordinary phone calls and SMS while an explicitly disclosed AI voice participant can join supported conferences.

The product must support:

1. sending SMS through an Android phone's real SIM;
2. placing ordinary calls through the native Android Phone experience;
3. creating a Mum + Josh + Sol telephone conference;
4. allowing either human to join or leave without ending the other human's call;
5. adding, muting, and removing Sol independently;
6. calling back a trusted participant once after an unexpected disconnect when policy permits;
7. controlling actions through a web UI, Android Relay, Windows Sol Desktop, `solctl`, and MCP;
8. optionally routing the manually started native ChatGPT desktop voice session into a supervised call;
9. post-call summaries, alerts, audit records, diagnostics, and privacy controls.

## 2. Supported product modes

### Native direct mode

- Android Relay sends SMS through the selected SIM.
- Android Relay opens or places calls through supported Android Telecom APIs.
- The system Phone and Messages applications remain authoritative.
- No Twilio or OpenAI dependency is required for a normal two-person call or SMS.

### Production AI conference mode

- Human participants use normal telephone calls.
- Twilio Conference manages the human participants.
- OpenAI Realtime joins as a SIP participant.
- A persistent gateway manages webhooks, state, sideband tools, reconciliation, and audit.

### Supervised native ChatGPT bridge mode

- The operator manually starts ChatGPT Voice in the native desktop application.
- Windows routes conference audio through approved local audio devices.
- The bridge can be muted or removed without ending the human call.
- This mode is optional and never required for production availability.

## 3. Primary users

### Josh / administrator

Can configure contacts, devices, policies, providers, privacy, limits, and diagnostics; initiate and join calls; preview and confirm outward actions; inspect summaries and audit events.

### Yvonne / trusted caller

Uses an ordinary phone and optionally simplified Mum Mode. Can call Sol, receive calls, ask Josh to join, ask Sol to stop listening or leave, and receive approved SMS summaries.

### Unknown caller

Receives a restricted assistant with no private profile or privileged tools. Unknown callers cannot trigger arbitrary outbound actions.

## 4. Required user journeys

### Josh calls Mum with Sol

1. Josh selects **Call Mum with Sol**.
2. The UI shows the masked destination and exact action.
3. Josh confirms.
4. Gateway creates a random non-personal conference identifier.
5. Twilio calls Mum.
6. After answer, the AI disclosure plays.
7. OpenAI Realtime joins as Sol.
8. Live Call shows confirmed participant and Sol states.
9. Josh may join, mute Sol, remove Sol, send a confirmed SMS, or end the conference.

### Mum calls Sol

1. Mum calls the dedicated number.
2. Gateway verifies whether the number is allowlisted.
3. A conference is created.
4. Disclosure plays.
5. Sol joins.
6. Josh receives a privacy-safe notification and may join.
7. Unknown callers enter restricted mode.

### Josh joins an active call

1. Josh selects **Join call** or Mum authorises Sol to call Josh.
2. The exact action is confirmed when required.
3. Twilio calls Josh or Josh dials the conference.
4. Josh receives a brief joining disclosure.
5. Live state updates from provider callbacks.

### Sol leaves while humans remain

1. A participant says “Sol, leave,” “stop listening,” or “give us privacy,” or Josh removes Sol in the UI.
2. Sol confirms briefly when appropriate.
3. Only the AI SIP participant is removed.
4. Human participants remain connected.
5. An audit event records the reason and actor.

### Mum disconnects unexpectedly

1. Provider callback reports Mum left.
2. Gateway determines whether the departure was unexpected and policy permits callback.
3. UI shows a five-second cancellable countdown.
4. Mum is called back no more than once automatically.
5. Failure notifies Josh without leaking transcript content.

### Send SMS from voice or coding agent

1. User requests a message.
2. Agent resolves an allowlisted contact and creates a preview.
3. Agent reads the recipient and exact message.
4. User confirms.
5. A signed command is sent to Android Relay.
6. Android sends through the selected SIM.
7. Sent and delivery states return where supported.
8. Replayed commands return the prior result without sending again.

### Place native call from voice or coding agent

1. User requests a call.
2. Agent creates a preview containing contact, number class, SIM, and mode.
3. User confirms.
4. Trusted contacts may use `TelecomManager.placeCall`; unknown contacts open `ACTION_DIAL` or require device confirmation.
5. Native Phone UI appears.
6. Status is reported only from confirmed platform state.

## 5. Application surfaces

### Web

Routes:

```text
/
/setup
/call/:conferenceId
/contacts
/history
/messages
/settings
/diagnostics
/mum
```

### Gateway

Persistent Node.js service. It must not rely on short-lived serverless execution for active Realtime sideband sessions.

### Android Relay

Private Kotlin/Compose application for device pairing, command verification, native SMS, native calls, SIM selection, confirmations, status callbacks, and recovery.

### Windows Sol Desktop

.NET/WinUI application for device state, `solctl`, local API, credential storage, Phone Link guidance, optional audio bridge, and diagnostics.

### CLI

Machine-readable `solctl` command interface.

### MCP

Streamable HTTP server wrapping the same command service as `solctl`.

## 6. Repository target

```text
apps/
  web/
  gateway/
  android-relay/
  windows-desktop/
packages/
  contracts/
  database/
  logger/
  device-commands/
  command-signing/
  provider-adapters/
  solctl/
  mcp-server/
  sol-persona/
prompts/
specs/
docs/
skills/sol-conference/
tests/
```

Use Node.js 22, TypeScript strict mode, pnpm workspaces, Fastify, Next.js or the selected documented web framework, Zod, Postgres, Redis, Vitest, Playwright, Pino, OpenTelemetry-compatible instrumentation, Docker Compose, Kotlin/Compose, and .NET 9/WinUI 3.

## 7. HTTP API

Required authenticated application endpoints:

```text
POST   /api/conferences
GET    /api/conferences/:id
POST   /api/conferences/:id/participants
PATCH  /api/conferences/:id/participants/:participantId
DELETE /api/conferences/:id/participants/:participantId
POST   /api/conferences/:id/reconnect
POST   /api/conferences/:id/end

POST   /api/commands/preview
POST   /api/commands/:id/commit
GET    /api/commands/:id

POST   /api/devices/pair
POST   /api/devices/:id/revoke
GET    /api/devices
GET    /api/contacts
POST   /api/contacts
PATCH  /api/contacts/:id

POST   /webhooks/twilio/voice
POST   /webhooks/twilio/conference
POST   /webhooks/twilio/participant
POST   /webhooks/openai
POST   /webhooks/device

GET    /api/events
GET    /health/live
GET    /health/ready
```

Mutation endpoints require authentication, authorisation, CSRF protection where browser applicable, schema validation, idempotency keys, and typed errors.

Error shape:

```json
{
  "error": {
    "code": "PARTICIPANT_CALL_FAILED",
    "message": "The participant could not be connected.",
    "requestId": "req_..."
  }
}
```

## 8. MCP tools

Required tools:

```text
phone_status
phone_send_sms_preview
phone_send_sms
phone_call_preview
phone_call
conference_create
conference_status
conference_call_mum
conference_call_josh
conference_add_sol
conference_remove_sol
conference_mute_participant
conference_reconnect_mum
conference_end
conference_send_sms
```

Rules:

- JSON Schema inputs and structured outputs;
- preview and execution are separate;
- unknown numbers are refused by default or require device confirmation;
- every action creates an audit event;
- MCP uses the same command handlers as `solctl` and the web UI.

## 9. CLI requirements

```text
solctl device list
solctl device status
solctl sms preview --contact CONTACT --message TEXT
solctl sms send --confirmation TOKEN
solctl call preview --contact CONTACT
solctl call start --confirmation TOKEN --mode native|conference
solctl conference create --contacts CONTACTS --sol
solctl conference status ID
solctl conference add-sol ID
solctl conference remove-sol ID
solctl conference end ID
```

All commands support stable JSON output, request IDs, non-zero exit codes on failure, and no secret output.

## 10. Data model

Required entities:

```text
User
Contact
ContactPermission
Device
DeviceKey
Command
CommandConfirmation
Conference
Participant
CallAttempt
RealtimeSession
TranscriptEvent
ToolExecution
ConsentRecord
AuditEvent
Notification
ProviderEvent
```

States:

```text
Conference: created | dialling | waiting | active | ending | completed | failed
Participant: queued | ringing | connected | muted | held | left | failed
Command: previewed | awaiting_confirmation | queued | acknowledged | executing | completed | failed | expired | cancelled
```

## 11. Twilio requirements

- Use random conference names without personal information.
- Verify request signatures over raw request bodies.
- Support inbound and outbound participants.
- Reconcile callbacks idempotently.
- Enforce call duration and spend limits server-side.
- Support one authorised automatic callback after unexpected disconnect.
- Removing the SIP participant never ends the human conference.
- Do not expose provider identifiers in normal UI.

## 12. OpenAI Realtime requirements

- Use the current official supported SIP flow at implementation time.
- Verify `realtime.call.incoming` webhook signatures.
- Accept/configure the call with model, voice, instructions, and tools from validated configuration.
- Maintain a persistent sideband connection for tool and state control.
- Support interruption/barge-in.
- Load `prompts/sol-voice-system.md` through a prompt compiler that appends only authorised runtime context.
- Never inject credentials, raw logs, unrestricted repository content, or another participant's private profile.

## 13. Privacy and security

- Recording off by default.
- AI disclosure always enabled.
- Additional disclosure before recording.
- Encrypt sensitive fields at rest.
- Revocable device keys stored in Android Keystore and Windows Credential Manager.
- Redact credentials, OTPs, payment cards, account numbers, and protected identifiers.
- Rate-limit call and message creation.
- Restrictive contact permissions by default.
- Never let the agent complete identity verification as the user.
- Do not automatically represent a user to a bank, government service, insurer, creditor, medical provider, or legal service.
- Maximum conference duration defaults to 60 minutes.
- Production fails closed if provider, key, policy, or disclosure configuration is invalid.

## 14. Reliability

- Web UI failure does not end an active call.
- AI failure does not end human calls.
- Event-stream reconnect restores state from the gateway.
- Provider callbacks and device commands are idempotent.
- Use bounded retries with exponential backoff.
- Prevent duplicate participants and duplicate outward actions.
- Reconcile stale sessions and provider state.
- Graceful shutdown preserves or hands off durable state.
- Health endpoints distinguish liveness from readiness.

## 15. Notifications and summaries

Notifications must avoid private transcript content by default.

Post-call summary includes:

- participants;
- date/time and duration;
- factual main topics;
- decisions;
- actions and verified status;
- follow-ups;
- unresolved questions;
- disconnects, callbacks, and tool failures.

Do not infer medical, psychological, or cognitive status.

## 16. Deployment

- Web may deploy separately to a supported web platform.
- Gateway must run on persistent container compute.
- Postgres and Redis are production services, not in-process replacements.
- Secrets are deployment-managed.
- Provide migrations, backups, retention settings, observability, diagnostics, and staging scripts.
- Local development uses Docker Compose and mock providers.

## 17. Definition of done

The product is not complete until:

- every phase in `CODEX_PROJECT.md` passes;
- all root commands pass;
- production build and Docker startup pass;
- required UI states and journeys have automated coverage;
- Android real-device SMS and call tests pass;
- Windows bridge tests pass;
- Twilio/OpenAI staging conference passes;
- Sol can be removed while humans remain connected;
- replay cannot repeat calls or messages;
- no secrets or private family data exist in git;
- setup, deployment, recovery, privacy, and provider documentation exists;
- a factual final verification report identifies every mocked and live-tested component.
