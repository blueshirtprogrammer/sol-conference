# Native Integrations

## 1. Connectivity decision

Normal operation does not require USB.

- **Wi-Fi/mobile data:** primary command, status, and remote-control channel.
- **Firebase Cloud Messaging:** wake-up notification for Android Relay.
- **WebSocket:** preferred active device session.
- **HTTPS polling:** fallback when WebSocket is unavailable.
- **Bluetooth:** Phone Link call audio and operator headset use only.
- **USB/ADB:** development, installation, debugging, logs, recovery, and charging.

The phone must remain capable of native SMS and calls when the desktop is offline.

## 2. Android Relay

### Technology

- Kotlin;
- Jetpack Compose;
- Hilt;
- Room;
- WorkManager;
- Firebase Cloud Messaging;
- Android Keystore;
- supported Android Telecom and telephony APIs.

### Device pairing

1. Administrator creates a short-lived pairing request.
2. Android Relay scans a QR code or enters a code.
3. Relay creates a device key pair in Android Keystore.
4. Gateway records only the public key and device metadata.
5. Pairing displays requested permissions and trust scope.
6. Device can be revoked from the web or desktop UI.

Device record includes:

```text
deviceId
ownerId
displayName
platform
publicKey
permissions
createdAt
lastSeenAt
revokedAt
```

### Command envelope

```ts
type DeviceCommand<T> = {
  commandId: string;
  deviceId: string;
  type: string;
  payload: T;
  issuedAt: string;
  expiresAt: string;
  confirmationId?: string;
  requestedBy: string;
  signature: string;
};
```

Relay must verify signature, device ID, expiry, permission, confirmation binding, recipient policy, and replay state before execution.

### Native SMS

Use supported Android SMS APIs and explicit permission. Support selected subscription/SIM.

SMS preview includes:

```text
recipient contact and masked number
exact message
selected SIM
action expiry
trust level
whether device confirmation is required
```

Commit requirements:

- exact preview payload hash matches;
- valid short-lived confirmation;
- command is not replayed or expired;
- recipient policy permits action;
- Android permission is granted;
- SIM is available.

Return:

```text
queued
sent
failed
delivered (where carrier/platform supports it)
unknown
```

Never report delivery when only send acceptance is known.

Messages should appear in normal sent history where Android platform/default-handler behaviour permits. Public Play Store distribution must comply with current SMS permission policy; private sideloaded or managed deployment is the initial supported path.

### Incoming SMS

Release 1 does not require becoming the default SMS handler.

Modes:

- **Standard:** Relay sends; ordinary Messages app receives and displays replies.
- **Private full gateway:** separately permissioned and distributed; can sync allowlisted incoming messages where platform policy permits.

No automatic reply by default.

### Native calls

Policy modes:

```text
trusted contact direct call
unknown contact open dialler
always open dialler
conference call
```

Use supported Android Telecom APIs. Release 1 must not replace the default dialler.

Trusted direct call may use `TelecomManager.placeCall` after valid confirmation. Unknown recipients should use `ACTION_DIAL` or device-level confirmation.

Report call state only from confirmed platform signals:

```text
dialling
ringing
active
held
disconnected
failed
```

Do not remotely auto-dial:

- emergency numbers;
- premium numbers;
- international numbers without explicit device confirmation;
- blocked or policy-restricted numbers.

### Android UI

Required screens:

- device status;
- pairing;
- permissions;
- selected SIM;
- trusted contacts and policies;
- pending SMS preview;
- pending call preview;
- command history;
- gateway and desktop connectivity;
- battery optimisation guidance;
- diagnostics and log export.

Pending SMS actions: **Send**, **Edit**, **Cancel**.

Pending call actions: **Call now**, **Open dialler**, **Cancel**.

### Android recovery

- WorkManager reconnect after process death;
- boot receiver where permitted;
- bounded retry;
- notification when background restrictions block reliable operation;
- no duplicate execution after reconnect;
- local encrypted command/result journal until gateway acknowledgement.

## 3. Windows Sol Desktop

### Technology

- .NET 9;
- WinUI 3 / Windows App SDK;
- Windows Credential Manager;
- named pipes or authenticated localhost HTTPS;
- Windows Core Audio/WASAPI;
- installer and update mechanism selected during implementation.

### Responsibilities

- pair and display Android devices;
- install/manage `solctl`;
- expose local authenticated command API;
- display pending previews and results;
- Phone Link setup and status guidance;
- optional ChatGPT audio bridge;
- diagnostics bundle;
- start/stop MCP server or secure tunnel when configured.

Do not store or automate ChatGPT credentials.

### Phone Link

Phone Link is an operator-facing integration, not the programmable backend.

Use it for:

- making or answering calls through the PC;
- PC headset audio;
- manual message access;
- supported phone screen/app mirroring;
- supplying call audio to supervised bridge mode.

Do not depend on undocumented Phone Link automation APIs.

If Bluetooth disconnects, show a clear error and leave Android Relay data/SMS functionality running.

## 4. Native ChatGPT desktop bridge

### Boundaries

- The operator signs into ChatGPT normally.
- The operator manually starts native Voice.
- Sol Desktop detects/configures audio devices but does not automate ChatGPT authentication or claim to start Voice through an API.
- The bridge is supervised and has an immediate mute/stop control.

### Logical audio devices

```text
SOL_CALL_RX
SOL_CALL_TX
SOL_GPT_RX
SOL_GPT_TX
SOL_OPERATOR_MIC
SOL_OPERATOR_HEADSET
```

Target routing:

```text
Phone Link/conference output -> SOL_CALL_RX -> ChatGPT microphone
ChatGPT output -> SOL_GPT_RX -> Phone Link/conference microphone
Operator microphone -> conference microphone
Conference output -> operator headset
```

Prevent ChatGPT output from looping into its own microphone. Use echo cancellation, level monitoring, and clear feedback warnings.

### Bridge UI

```text
Connect Phone Link
Select call input/output
Select ChatGPT input/output
Test audio
Start Bridge
Mute Sol
Mute operator
Give Humans Privacy
Stop Bridge
```

Statuses:

```text
Phone connected
Bluetooth audio connected
ChatGPT audio device selected
Call audio active
Bridge active
Muted
Echo risk detected
Disconnected
```

Stopping/removing bridge must not terminate human call legs.

## 5. `solctl` local and remote control

`solctl` can run:

- locally on Windows;
- in Codex terminal sessions;
- in CI for mock/integration tests;
- through a secure hosted gateway from authorised remote clients.

The CLI never directly manipulates Phone Link or ChatGPT UI. It invokes the shared command service.

Two-phase flow:

```text
solctl sms preview ...
solctl sms send --confirmation TOKEN
```

```text
solctl call preview ...
solctl call start --confirmation TOKEN --mode native
```

All output is stable JSON when `--json` is used.

## 6. Codex, Claude Code, and coding-agent use

Coding agents can use `solctl` only after the implementation exists and credentials/device pairing are configured.

Outward-action rules still apply:

- preview first;
- present exact recipient and action;
- require explicit confirmation;
- commit exact payload;
- inspect verified result;
- do not retry blindly.

Remote Codex can invoke `solctl` on an authorised desktop session. The product must also support direct hosted control so it is not exclusively dependent on a desktop Codex session.

## 7. Conference integration

Android phones and Yvonne's phone use ordinary Phone interfaces to connect to the conference number or receive provider calls.

Do not attempt unsupported capture/injection of both sides of a normal cellular call from an ordinary Android application. AI audio enters through the supported Twilio/OpenAI conference path, or through supervised Phone Link audio bridge mode.

Conference joining options:

- Twilio outbound call;
- participant dials the conference number;
- short-lived PIN or signed participant token;
- browser voice participant as a later/secondary path.

## 8. Permissions and privacy

Android permission onboarding must explain why each permission is needed and support degraded operation when optional permissions are declined.

Required or conditional areas include:

- notifications;
- SMS sending;
- phone calling;
- phone state;
- selected SIM/subscription access;
- battery optimisation exemption;
- incoming SMS only in separately enabled private mode.

Never request broad permissions before the corresponding feature is enabled.

## 9. Native acceptance gates

### Android SMS

- preview sends nothing;
- confirmed commit sends exactly once;
- selected SIM is used;
- invalid, expired, altered, or replayed command does not send;
- status is truthful;
- unknown recipient requires device confirmation.

### Android calls

- native Phone UI appears;
- trusted and unknown policies differ correctly;
- emergency/premium/international restrictions work;
- cancellation works;
- state is not invented.

### Windows

- pairing and credentials survive restart securely;
- `solctl` works through local service;
- Bluetooth loss is non-destructive;
- bridge starts, mutes, and stops;
- echo protection works;
- human call continues after bridge removal.

### Remote control

- authorised command works over mobile data outside LAN;
- revoked device rejects commands;
- duplicate delivery executes once;
- unavailable desktop does not prevent hosted device commands;
- audit trail records actor, preview, confirmation, execution, and result.
