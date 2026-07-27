# Architecture

## Supported operating modes

### Native direct communications
- SMS is sent by Android through the selected SIM.
- Calls are placed by Android through the native telecom stack.
- The system Phone and Messages experiences remain authoritative.

### Production AI conference
```text
Yvonne native phone ─┐
Josh native phone ───┼── Twilio Conference ── OpenAI Realtime SIP (Sol)
Browser participant ─┘              │
                                    └── persistent gateway sideband/tools
```

### Supervised native ChatGPT desktop bridge
```text
Phone Link call audio ↔ Windows WASAPI virtual routing ↔ native ChatGPT Voice
```
This is optional, manually started and never the production dependency.

## Components

### Web
Consumer dashboard and Mum Mode. Receives confirmed state through SSE/WebSocket. Never calls provider APIs directly.

### Gateway
Persistent Node.js/Fastify service responsible for:
- authentication and authorisation
- state machines
- Twilio/OpenAI webhooks
- provider reconciliation
- signed device commands
- audit records
- event streaming

### Android Relay
Private Android application responsible for:
- signed command verification
- native SMS and calls
- SIM selection
- device confirmations
- status callbacks

### Windows Desktop
Native Windows companion responsible for:
- pairing and diagnostics
- local `solctl` service
- Credential Manager integration
- optional supervised audio bridge

### CLI and MCP
`solctl` is the dependable automation interface. MCP wraps the same service but is never the sole execution path.

## Connectivity
- Primary command path: HTTPS/WebSocket over mobile data or Wi-Fi.
- Wake-up: FCM.
- Local optimisation: encrypted LAN connection where available.
- Bluetooth: Phone Link audio only.
- USB: development, ADB, recovery and charging only.

## Core entities
User, Contact, Device, DeviceKey, Command, Confirmation, Conference, Participant, CallAttempt, RealtimeSession, TranscriptEvent, ToolExecution, ConsentRecord, AuditEvent, Notification.

## State machines
Conference: `created | dialling | waiting | active | ending | completed | failed`.

Participant: `queued | ringing | connected | muted | held | left | failed`.

Command: `previewed | awaiting_confirmation | queued | acknowledged | executing | completed | failed | expired | cancelled`.

## Security invariants
- Commands are Ed25519-signed or use an equivalently strong asymmetric scheme.
- Every command has an ID, device ID, requested action, recipient, issued time and expiry.
- Replays return the prior result and never repeat the action.
- Contact permissions are explicit and default restrictive.
- Provider signatures are checked over raw bodies.
- Production refuses mock adapters.
- Sensitive fields are encrypted at rest.
- Logs redact credentials, OTPs, payment data and protected identifiers.

## Reliability invariants
- AI failure never ends the human conference.
- Web UI failure never ends an active call.
- Browser refresh reconstructs state from the gateway.
- Reconnect is at most one automatic attempt unless explicitly changed.
- Provider callbacks are idempotent and reconciled against current provider state.
- Maximum conference duration and spend limits are enforced server-side.