# Native Integrations — Sol Link and Sol Fabric

## Connectivity

Control and media transports are separate.

### Control

- authenticated Wi-Fi/LAN WebSocket for nearby active sessions;
- hosted relay for authorised remote control;
- FCM for Android wake-up;
- HTTPS fallback;
- USB/ADB for development and diagnostics.

### Phone media candidates

1. Phone Link compatibility;
2. wired bidirectional headset/USB audio interface;
3. dedicated Bluetooth HFP bridge;
4. controlled Sol Link network audio for calls owned by Sol Link;
5. acoustic fallback.

A plain USB cable is not assumed to provide protected call audio.

## Android Sol Link

Use Kotlin/Compose and Android Keystore.

Responsibilities:

- pairing and revocation;
- contacts and selected SIM;
- SMS preview/confirmed commit;
- native dial/call action according to policy;
- separately authorised notifications;
- navigation and media intents;
- device confirmations;
- signed command and result journal.

Release 1 does not replace the default dialler or default SMS application.

## Windows Sol Desktop

Responsibilities:

- media-node discovery;
- route graph and DSP;
- per-application capture adapters;
- virtual endpoint management;
- operator monitor and talkback;
- phone transport adapters;
- room UI and diagnostics;
- local `solctl` service.

Do not automate AI-application credentials or claim unsupported official voice-control APIs.

## Phone Link adapter

Phone Link may provide practical Bluetooth call audio and operator control. Treat it as a compatibility transport, not the programmable device-control backend. Do not depend on undocumented automation APIs.

## Wired headset bridge

```text
Android phone
  ↕ communication headset audio
bidirectional audio bridge
  ↕ USB audio endpoints
Sol Desktop / Sol Fabric
```

The phone sees a communication headset; Windows sees isolated input/output endpoints.

## Bluetooth HFP bridge

```text
Android phone (audio gateway)
  ↕ Bluetooth HFP
dedicated hands-free bridge
  ↕ USB or network audio
Sol Fabric
```

Do not assume an ordinary Windows user-mode app can advertise as an HFP headset. Validate dedicated hardware, Linux/embedded role support or a signed driver path.

## Raspberry Pi edge

Potential responsibilities:

- room service and discovery;
- physical mute/privacy and scene controls;
- USB/Bluetooth supervision;
- VAD, wake word and speaker activity;
- floor policy;
- local network audio;
- diagnostics and lightweight local models.

Heavy avatar rendering or multiple large models run on connected GPU hardware.

## Existing AI applications

Connect through normal microphone, speaker, camera, screen and UI interfaces. App automation is optional and separate. A virtual audio connection never implies account, tool or computer-use permission.
