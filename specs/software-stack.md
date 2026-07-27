# Sol Room Software Stack

## Design principle

Build a modular monolith first. The media path stays native to the machine that owns the audio device. The network coordinates nodes; it does not force every sample through a cloud service or through the Raspberry Pi.

## 1. Sol Fabric Windows Node

### Technology

- .NET 9 / C# Windows service for lifecycle, device discovery, policy, routing state, API, diagnostics, and installer integration.
- C++20 native audio module for Windows Core Audio/WASAPI, process-loopback capture, low-latency render/capture, and driver communication.
- WebRTC Audio Processing Module or an equivalent reviewed DSP library for echo cancellation, noise suppression, automatic gain control, and voice activity detection.
- Named pipes for privileged local control; authenticated localhost HTTPS/WebSocket for the dashboard.
- SQLite for local configuration and event journal.

### Modules

```text
SolFabric.Windows.Service
├── DeviceInventory
├── ProcessAudioCapture
├── EndpointCapture
├── MicrophoneCapture
├── AudioGraph
├── MixMinus
├── FloorController
├── VirtualEndpointAdapter
├── PhoneLinkAdapter
├── ObsAdapter
├── WebRtcNodeTransport
├── Diagnostics
└── LocalControlApi
```

### Internal audio format

- 48 kHz float32 processing graph.
- Mono for speech channels by default.
- Stereo only for media channels.
- Per-channel jitter buffer, clock-drift correction, peak/RMS meters, mute, gain, solo, and destination matrix.

## 2. Virtual audio endpoints

### Lab implementation

Use one stable virtual-cable product or a test-signed open-source virtual speaker/microphone driver to prove the routing graph.

### Product implementation

Fork the Microsoft SysVAD architecture or a reviewed SysVAD-derived driver and expose named pairs:

```text
Sol Phone TX      microphone
Sol Phone RX      speaker
Sol Agent 01 TX   microphone
Sol Agent 01 RX   speaker
Sol Agent 02 TX   microphone
Sol Agent 02 RX   speaker
Sol Meeting TX    microphone
Sol Meeting RX    speaker
```

The driver must use signed production packages before public installation. Test-signing is lab-only.

## 3. Sol Room Coordinator

### First location

Raspberry Pi 5.

### Technology

- Go or Rust single binary.
- Embedded SQLite for room configuration and audit metadata.
- HTTPS, WebSocket, and mDNS discovery.
- Short-lived pairing tokens and device certificates.
- Optional NATS only after multiple independent services genuinely require it.

### Responsibilities

- room creation and membership;
- source/destination routing state;
- scene presets;
- floor ownership and bounded AI turns;
- node presence and health;
- permissions and emergency mute propagation;
- no model inference dependency.

The coordinator never claims a route is active until the owning node acknowledges it.

## 4. Sol Room Web UI

### Technology

- Next.js App Router, TypeScript, React, and accessible component primitives.
- PWA mode for laptop, desktop, tablet, and phone control panels.
- WebSocket subscription to room state.
- No direct possession of device secrets beyond short-lived session credentials.

### Primary screens

```text
/room
/routing
/sources
/agents
/scenes
/devices
/diagnostics
/lab
/shop
```

## 5. Android Sol Link client

### Technology

- Kotlin, Jetpack Compose, Android Keystore.
- Native WebRTC library for Sol Link audio/video sessions.
- CameraX and MediaProjection for user-approved camera and screen sharing.
- AudioRecord/AudioTrack for audio owned by the Sol Link session.
- Android contacts, notification listener, Telecom intents, and explicit permission flows.

### Responsibilities

- secure pairing;
- device status;
- camera and screen source;
- microphone/speaker channel for Sol Link sessions;
- contacts and approved device commands;
- call/SMS preview and confirmation;
- no unsupported interception of cellular or third-party call audio.

## 6. iOS Sol Link client

### Technology

- SwiftUI, Keychain, AVAudioEngine, WebRTC, ReplayKit, and user-approved screen broadcast extensions.

### Responsibilities

Mirror the supported Sol Link session functions from Android. Use Phone Link for the initial native cellular-call experiment. Do not claim arbitrary access to iOS call audio.

## 7. OBS integration

- OBS Studio is an optional installed dependency in the lab and room-rendering profiles.
- Control scenes and sources through authenticated obs-websocket.
- Feed Sol Fabric audio endpoints into OBS for metering/recording, but do not make OBS the authoritative mixer.
- Publish the composed stage through OBS Virtual Camera to Zoom, Teams, or another meeting app.

## 8. Screen and virtual-display integration

### Lab

- Android screen: scrcpy.
- Windows app/window capture: OBS or Windows Graphics Capture.
- Remote browser viewer: WebRTC/Deskreen-style viewer.

### Product

- Windows Graphics Capture or DXGI Desktop Duplication for physical displays and windows.
- Windows Indirect Display Driver for optional virtual monitors.
- Each AI workspace can be assigned a dedicated virtual monitor and an isolated audio endpoint.

## 9. Work node

The Windows desktop runs:

- Codex/Claude Code/development tools;
- repositories and build agents;
- artifact generation;
- optional local inference;
- storage and backup services;
- a Sol Work agent that reports task state to the coordinator.

Work tools communicate over structured commands and artifact events, not by speaking all machine instructions over the audio bus.

## 10. Security

- Local-first and deny-by-default.
- Device certificates and revocation.
- Windows DPAPI/Credential Manager, Android Keystore, and iOS Keychain.
- Emergency mute works locally even if coordinator/network fails.
- Recording disabled by default.
- AI identity and recording state always visible.
- No credentials, private contacts, transcripts, or device keys in source control.

## 11. First server vertical slice

Implement in this order:

1. enumerate Windows audio endpoints and processes;
2. capture laptop microphone;
3. capture a selected application's render stream;
4. render both into the human monitor;
5. write a generated tone and then mixed audio into one virtual microphone;
6. create a route matrix API;
7. add hard emergency mute;
8. add Phone Link adapter and real-call test;
9. add one AI application;
10. add OBS scene control.

## 12. First client vertical slice

Implement Android first:

1. QR/device pairing;
2. room status;
3. microphone and speaker WebRTC channel;
4. camera source;
5. user-approved screen source;
6. mute and emergency disconnect;
7. contact lookup and call preview;
8. signed command acknowledgement.

The iOS client follows once the shared protocol and WebRTC session are stable.
