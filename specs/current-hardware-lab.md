# Current Hardware Lab Architecture

## Inventory

- Windows 11 laptop with built-in microphone and speakers, WSL, and a Simplecom 15-in-1 USB-C dock.
- Windows 11 desktop with 4 GB GPU, two 1 TB HDDs, and wired Ethernet.
- Raspberry Pi 5 with 8 GB RAM.
- One Android smartphone.
- One iPhone.
- ChatGPT, Claude, Gemini, WhatsApp, Zoom, and Teams available across the devices.
- Router and spare Cat 7 Ethernet cables.

## Physical topology

Use the router as the primary switch. Do not start with a direct laptop-to-desktop cable.

```text
Internet / LAN router
├── Cat 7 -> Windows desktop
├── Cat 7 -> Simplecom dock -> Windows laptop
├── Cat 7 -> Raspberry Pi 5
├── Wi-Fi -> Android phone
└── Wi-Fi -> iPhone
```

A direct laptop-to-desktop media link is optional later and requires a second network adapter on at least one computer. The routed LAN is already sufficient for the first audio and video proof.

## Machine roles

### Windows laptop: live audio node

The laptop owns the first real-time bridge because it already has:

- human microphone and speakers;
- Bluetooth for Phone Link;
- ChatGPT/Claude/Gemini browser or desktop applications;
- access to Windows Core Audio and default communications devices;
- the Simplecom dock for wired networking and USB expansion.

Run on the laptop:

- Microsoft Phone Link;
- Sol Fabric Windows Node;
- AI voice applications, each isolated in its own process tree or virtual endpoint;
- OBS Studio for the visual stage;
- Android screen mirroring for visual capture;
- the room operator dashboard.

### Windows desktop: work and artifact node

Run on the desktop:

- coding agents and build tools;
- website and application development;
- recordings, transcripts, artifacts, model files, and backups;
- optional OBS rendering/encoding when the laptop is overloaded;
- local services that do not require direct access to Phone Link audio.

The 4 GB GPU is suitable for desktop composition, encoding, and light local inference, but it is not the assumed host for several large multimodal models.

### Raspberry Pi 5: room coordinator

The Pi is not the primary audio mixer in the first proof. It runs:

- secure pairing and room discovery;
- local HTTPS/WebSocket signalling;
- room state and scene presets;
- health monitoring and watchdogs;
- physical controls and LEDs later;
- optional lightweight VAD, wake word, moderation, and transcription;
- optional USB gadget experiments after the network proof works.

### Android and iPhone

The phones retain their native SIM, dialler, contacts, calling apps, and notification systems.

For the first native cellular-call proof, use Phone Link over Bluetooth. A plain USB cable does not make a stock Android phone or iPhone appear as a generic Windows sound card.

The future Sol Link mobile clients provide network audio/video, screen sharing, camera input, control commands, contacts, notifications, and device status. They must not claim they can capture protected cellular or third-party voice-call audio from ordinary mobile applications.

## First native call bridge

```text
Remote caller
  <-> phone cellular radio
  <-> Bluetooth HFP
  <-> Microsoft Phone Link on laptop
  <-> Sol Fabric Windows Node

Sol Fabric routes:

PHONE_RX -> human monitor
PHONE_RX -> selected AI virtual microphones
HUMAN_MIC -> PHONE_TX
selected AI outputs -> PHONE_TX

Never route PHONE_RX back to PHONE_TX.
Never route an AI output back into that same AI's microphone.
```

## Required lab evidence

1. Phone Link can place or receive a real call on the laptop.
2. Identify the Windows render and capture endpoints used during the call.
3. Determine whether process-loopback capture sees the Phone Link call stream.
4. If process capture fails, determine whether communications-endpoint loopback sees it.
5. Feed a generated test tone through a virtual microphone selected as the default communications input.
6. Confirm the remote caller hears the test tone.
7. Replace the tone with the operator microphone.
8. Add one AI output.
9. Prove mix-minus and immediate emergency mute.
10. Record latency, echo, clipping, drift, and reconnect behaviour.

No phase may claim a working phone bridge until all ten items have real-device evidence.

## Phone and screen sources

### Android

Use USB debugging and scrcpy for the visual source. Audio forwarding is useful for capture-eligible media, but it is not the cellular-call bridge.

### iPhone

Use Phone Link for the native call experiment. Add a Sol Link iOS client with ReplayKit/WebRTC later for screen and app-controlled media. Do not claim access to arbitrary iOS call audio.

## OBS boundary

OBS is the visual compositor and presentation stage:

- application/window capture;
- phone-screen capture;
- camera inputs;
- shared presentation scene;
- recording and virtual-camera output;
- scene control through authenticated obs-websocket.

OBS is not the authoritative audio router. Sol Fabric owns audio channels, mix-minus, floor control, privacy, and virtual microphones.

## Safe fallback order

1. Acoustic speakerphone baseline.
2. Phone Link Bluetooth call bridge.
3. Phone Link plus virtual microphone and process/endpoint loopback.
4. Sol Link WebRTC mobile audio for calls made inside Sol Link.
5. Dedicated USB/Bluetooth headset bridge hardware.
6. Optional metered cloud conference adapter only when specifically selected.
