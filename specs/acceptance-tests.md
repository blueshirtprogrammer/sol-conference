# Acceptance Tests

## Repository
- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` pass.
- `docker compose up` starts local dependencies.
- Mock mode works without paid credentials.
- Production refuses mock provider selection.

## Web and gateway
- Confirmation is required before outbound calls and SMS.
- Refresh during an active call restores confirmed state.
- Duplicate webhook or command delivery does not repeat an action.
- Sol can be removed without disconnecting human participants.
- OpenAI failure leaves the human conference connected.
- Mum receives no more than one automatic callback.
- Unknown recipients require device confirmation.
- Recording is off by default and disclosure is played when Sol joins.

## Android real-device SMS
1. Preview sends nothing.
2. Commit sends exactly one SMS through the selected SIM.
3. Sent status is returned.
4. Delivery status is returned where supported.
5. Dual-SIM selection works.
6. Message appears in normal sent history where platform behaviour permits.
7. Unknown recipient requires phone confirmation.
8. Expired, invalid or replayed commands do not send.

## Android real-device calls
1. Trusted contact call starts through Android Telecom.
2. Native Phone UI appears.
3. Unknown contacts open the dialler or require confirmation.
4. Call state is reported only from confirmed platform state.
5. Emergency, premium and international numbers cannot be remotely auto-dialled.
6. Cancelling before connection stops the attempt.

## Twilio/OpenAI staging
1. Create a conference using verified numbers.
2. Connect Mum and Josh through normal phone calls.
3. Add OpenAI Realtime through supported SIP flow.
4. Verify AI disclosure.
5. Verify barge-in.
6. Remove Sol and retain humans.
7. Simulate Sol failure and retain humans.
8. Simulate Mum disconnect and perform one callback only.
9. End cleanly and produce a diagnostic report.

## Windows/Phone Link
1. Bluetooth pairing supports PC call audio.
2. Loss of Bluetooth produces a clear non-destructive error.
3. Android SMS gateway continues without Phone Link.
4. Start and stop the supervised audio bridge.
5. Operator can mute Sol immediately.
6. Removing the bridge does not end the call.
7. Echo prevention avoids self-feedback.
8. The app never automates ChatGPT login or claims it can start Voice.

## CLI and MCP
- Preview returns a short-lived confirmation token.
- Commit requires the valid token and exact action payload.
- JSON results are stable and machine-readable.
- Replaying commit returns prior result without repeating action.
- MCP tools call the same command service as `solctl`.

## Accessibility
- WCAG 2.2 AA automated checks pass.
- Keyboard-only call creation and management works.
- Dialog focus is trapped and restored.
- Live call changes are announced without overwhelming screen readers.
- Controls remain usable at 200% zoom.
- Reduced motion disables nonessential animation.

## Security
- No secrets, real phone numbers, transcripts or private profiles exist in git.
- Provider signatures are verified over raw payloads.
- Logs redact OTPs, credentials, payment cards and protected identifiers.
- Device keys are revocable.
- Spend and duration limits are server-enforced.
- Audit events exist for every external action.