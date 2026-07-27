# Sol Room No-Code / Low-Code Integration Lab

## Objective

Prove the first Sol Room conversation loop using existing software and the hardware already available before writing the production media engine, native OBS plugin or virtual audio driver.

The lab proves or disproves this exact chain:

```text
native phone call in Microsoft Phone Link
+ local human microphone
+ one existing AI voice application
+ two independent mix-minus buses
+ OBS shared stage
+ semantic MCP control of OBS and Windows
```

A successful lab is evidence for architecture decisions. It is not the finished product.

## Existing hardware

- Windows 11 laptop with built-in microphone and speakers;
- Simplecom 15-in-1 dock;
- Windows 11 desktop with GPU and storage;
- Raspberry Pi 5, 8 GB;
- Android phone;
- iPhone;
- two 65-inch Google TVs;
- router, Cat 7 cables and optional direct laptop-to-desktop Ethernet path.

## Software stack

### Required

1. Microsoft Phone Link on the laptop.
2. OBS Studio 28 or later. OBS WebSocket is bundled into OBS 28+.
3. VoiceMeeter Banana for the first two virtual mix-minus buses.
4. ChatGPT desktop or another existing AI voice application.
5. scrcpy from the official Genymobile repository for Android screen/control.
6. One OBS MCP server.
7. One Windows UI Automation MCP server.

### Preferred MCP choices for the lab

Choose one in each category. Do not install several equivalent servers into the same agent context.

#### OBS

Portable stdio option:

```text
obs-mcp version 1.1.0
command: cmd /c npx -y obs-mcp@1.1.0
```

The server connects to OBS WebSocket on `ws://127.0.0.1:4455` by default and uses `OBS_WEBSOCKET_PASSWORD` for authentication.

VS Code / Copilot alternative:

```text
sbroenne.obs-mcp-server
```

#### Windows semantic automation

Preferred:

```text
sbroenne/mcp-windows standalone release
```

It uses Windows UI Automation to find controls by accessible name and exposes a matching `wincli` command surface.

Alternative:

```text
shanselman/FlaUI-MCP
```

Use screenshot/mouse control only when UI Automation cannot expose a custom control.

### Experimental / not first choice

The open-source `VirtualDrivers/Virtual-Audio-Driver` can create virtual speaker and microphone endpoints, but its repository warns that beta builds may require test signing. Do not enable Windows test-signing merely to begin this lab. Use VoiceMeeter's signed virtual devices first.

## Security preparation

- Keep OBS WebSocket bound to localhost for the first lab.
- Enable OBS WebSocket authentication.
- Store the password only in local environment/configuration, never in git.
- Run the Windows MCP non-elevated.
- Keep Phone Link and OBS non-elevated so UI Automation can inspect them from the same integrity level.
- Do not grant an agent unrestricted permission to place calls, send messages, start streaming or publish content.
- Use a trusted test caller and disclose that AI audio is part of the test.
- Disable recording unless everyone has consented.

## Physical setup

```text
Laptop display       = private operator console
TV 1 via HDMI        = SOL STAGE
TV 2 via desktop HDMI= SOL WORK WALL
TV speakers          = muted during first audio tests
```

Connect laptop, desktop and Pi through the router. The direct laptop-to-desktop Ethernet link is optional during the first call proof.

## Install order

1. Update Windows and restart.
2. Pair one phone with Phone Link and verify a normal call manually.
3. Install OBS Studio and restart it.
4. Enable `Tools -> WebSocket Server Settings`, localhost port 4455, authentication on.
5. Install VoiceMeeter Banana and reboot Windows.
6. Install Node.js LTS if the selected OBS MCP uses `npx`.
7. Download scrcpy only from `Genymobile/scrcpy` releases.
8. Install or download exactly one Windows UI Automation MCP server.
9. Configure the chosen coding/desktop agent using `.mcp.example.json` as a template.

## VoiceMeeter topology

The first proof uses one phone/caller, one local human and one AI voice application.

### Device assignment

```text
A1 hardware output  = laptop speakers or wired headset
Hardware Input 1    = laptop microphone
VAIO virtual input  = AI application output
AUX virtual input   = Phone Link output
B1 virtual output   = AI microphone feed
B2 virtual output   = Phone Link microphone feed
```

Windows application output assignments:

```text
ChatGPT / AI app output -> VoiceMeeter Input (VAIO)
Phone Link output       -> VoiceMeeter AUX Input
```

Application input assignments:

```text
ChatGPT microphone      -> VoiceMeeter Output (B1)
Phone Link microphone   -> VoiceMeeter AUX Output (B2)
```

Phone Link may follow the Windows default communications input rather than expose its own selector. Set B2 as the default communications input and verify actual behaviour rather than assuming it.

### Routing buttons

#### Human microphone strip

```text
A1 ON   operator hears own voice only if comfortable; otherwise OFF
B1 ON   AI hears the human
B2 ON   caller hears the human
```

#### Phone Link / caller strip on AUX

```text
A1 ON   operator hears caller
B1 ON   AI hears caller
B2 OFF  caller must not receive itself
```

#### AI application strip on VAIO

```text
A1 ON   operator hears AI
B1 OFF  AI must not receive itself
B2 ON   caller hears AI
```

This is the first mix-minus graph:

```text
B1 = human microphone + caller; excludes AI output
B2 = human microphone + AI output; excludes caller output
```

Before making a call, test each bus using Windows Sound Recorder or another local recorder.

## OBS setup

Create a scene collection named `SOL ROOM LAB`.

Scenes:

```text
01 LAB OVERVIEW
02 PHONE CALL
03 AI ROOM
04 WORK WALL
05 HUMANS ONLY
06 EMERGENCY SILENCE
```

Sources:

```text
Phone Link window capture
ChatGPT/AI window capture
scrcpy Android window capture
Sol Room browser-source placeholder
participant/status text
system health text
```

Use OBS Fullscreen Projector to show the program stage on TV 1. Use the desktop/TV 2 for code, logs and diagnostics.

## scrcpy setup

Use USB debugging only on a trusted machine.

Initial command:

```powershell
scrcpy --no-audio
```

Use screen mirroring first. Android 11+ scrcpy audio forwarding can be tested separately, but protected voice-communication audio may not be capturable. Never use successful media playback forwarding as evidence that cellular or WhatsApp call audio is available.

## MCP setup validation

### OBS MCP smoke test

Ask the agent to:

1. connect to OBS;
2. list scenes;
3. activate `01 LAB OVERVIEW`;
4. read the current program scene;
5. activate `06 EMERGENCY SILENCE`;
6. verify the current program scene again.

The agent must report observed state, not merely that a command returned success.

### Windows MCP smoke test

Ask the agent to:

1. find the Phone Link window;
2. return a compact UI Automation snapshot;
3. identify the Calls control by accessible name/type;
4. activate the Calls page without coordinates;
5. read the visible connection state;
6. stop before dialling.

If the Phone Link accessibility tree is incomplete, capture the missing-control evidence and use supervised screenshot fallback only for that element.

## Call test sequence

### Test 1 — ordinary Phone Link

- Call a trusted test phone.
- Confirm both sides hear each other using the laptop microphone and speakers.
- End the call manually.
- Save evidence of Phone Link state and Windows audio endpoints.

### Test 2 — B2 virtual microphone

- Set Phone Link/default communications input to VoiceMeeter B2.
- Route only the laptop microphone to B2.
- Confirm the caller hears the human.
- Confirm the caller does not hear delayed self-audio.

### Test 3 — AI hears caller

- Select VoiceMeeter B1 as the AI microphone.
- Route caller AUX to B1.
- Start AI voice manually.
- Confirm the AI reacts to the caller.
- Confirm AI output is excluded from B1.

### Test 4 — caller hears AI

- Route AI VAIO to B2.
- Confirm the caller hears AI output.
- Confirm the caller does not hear a delayed copy of their own speech.

### Test 5 — three-party natural turn

- Human speaks to caller and AI.
- Caller speaks to human and AI.
- AI speaks to human and caller.
- Record only with consent.
- Measure subjective latency, echo and interruption behaviour.

### Test 6 — emergency silence

- Trigger the emergency scene and/or mute AI route to B2.
- Verify caller and human can remain connected while AI is removed from the call mix.

## Pass criteria

The no-code lab passes when:

- Phone Link carries a real call through the laptop;
- B1 and B2 are independently selectable;
- the AI hears caller + human but not itself;
- caller hears human + AI but not itself;
- operator hears caller + AI;
- OBS can be controlled semantically through MCP;
- Phone Link can be inspected and navigated semantically through UI Automation;
- emergency silence removes AI audio without ending the human call;
- the exact endpoint names, latency and limitations are captured in a diagnostic report.

## Failure interpretation

### Caller cannot hear B2

Phone Link may ignore the selected/default virtual microphone. Capture the Windows communications-device state and test:

1. per-app input selection if available;
2. default input;
3. default communications input;
4. restarting Phone Link after device change;
5. physical headset/audio bridge as the next transport candidate.

### AI cannot hear B1

Verify the AI app actually permits microphone selection and has Windows microphone privacy permission.

### Echo or howl

- mute TV speakers;
- use a wired headset;
- reduce A1 monitoring;
- verify caller AUX is not routed to B2;
- verify AI VAIO is not routed to B1.

### Windows MCP cannot see Phone Link controls

Record the UI Automation snapshot and application version. Use screenshot fallback only under supervision. Do not conclude that Phone Link is generally automatable from one failed selector.

## Evidence bundle

Save under a private local directory, not the public repository:

```text
software-versions.txt
windows-audio-endpoints.txt
voicemeeter-routing-screenshot.png
obs-scene-list.json
obs-mcp-trace.json
phone-link-uia-snapshot.json
call-test-results.md
latency-notes.md
known-limitations.md
```

Redact phone numbers, contact names, transcripts, passwords and device identifiers before sharing.

## Decision after the lab

- If Phone Link accepts B2 and the loop is stable, build the Phone Link adapter and Sol Fabric service around the proven graph.
- If control works but audio injection fails, retain Phone Link for call control and test a physical USB/Bluetooth headset bridge.
- If the complete loop works, replace VoiceMeeter and community MCP dependencies incrementally with Sol-owned components only where commercial reliability, licensing or product experience requires it.