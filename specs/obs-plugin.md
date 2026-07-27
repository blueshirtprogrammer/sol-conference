# Sol Room for OBS — Plugin Architecture

## Purpose

Sol Room for OBS is the native visual-production and operator-console layer for Sol Room. It makes OBS Studio the shared-stage compositor while Sol Fabric remains the authoritative real-time audio, phone, policy and room-control service.

The plugin must make Sol Room feel native inside OBS without coupling call survival or low-latency routing to the OBS process.

## Non-negotiable boundary

```text
OBS plugin
= docks, sources, overlays, scenes, meters, visual composition and operator controls

Sol Fabric Windows service
= Phone Link adapter, WASAPI capture, mix-minus, virtual microphones,
  room state, policy, MCP, audit and emergency control
```

OBS crashing or restarting must not terminate a human call or corrupt room state.

## Product components

### 1. Sol Room OBS dock

Required controls and state:

- active room and scene;
- Phone Link connection and call state;
- human, phone, AI and media participants;
- separate audio, visual and tool permissions;
- assign/release floor;
- mute participant;
- humans-only mode;
- private operator channel;
- emergency silence;
- recording consent and recording state;
- Sol Fabric health;
- Pi coordinator health;
- diagnostics shortcut.

All consequential outward actions use preview, confirmation and verified state.

### 2. Custom OBS sources

Planned source types:

```text
Sol Shared Stage
Sol Phone Screen
Sol Phone Camera
Sol Agent Avatar
Sol Agent Workspace
Sol Artifact Preview
Sol Captions
Sol Participant Bar
Sol Audio Meter
Sol System Health
```

Sources receive authenticated data from Sol Fabric or a room client. They do not embed provider credentials.

### 3. Scene pack

The installer creates optional scene templates:

```text
Founder Lab
Client Pitch
Builder Marketplace
Product Studio
AI Roundtable
Translation Room
Family Support
Conference Centre
Humans Only
Emergency Holding
```

Templates must be editable ordinary OBS scenes after creation.

### 4. Sol Fabric client

The plugin connects locally through an authenticated named pipe or localhost WebSocket/HTTP interface.

Required event families:

```text
room.state.changed
room.floor.changed
participant.state.changed
route.state.changed
phone.call.changed
artifact.published
caption.partial
caption.final
system.health.changed
emergency_silence.changed
```

The plugin must reconnect, resubscribe and restore authoritative state after OBS restarts.

## Control hierarchy

Use the most reliable integration available:

1. Sol Fabric typed local API;
2. OBS native frontend/source APIs inside the plugin;
3. OBS WebSocket for external prototype and remote control;
4. Windows UI Automation for Phone Link;
5. supervised computer-use fallback only when semantic automation is unavailable.

Do not operate OBS by screen coordinates when native OBS APIs or WebSocket are available.

## Implementation stages

### Stage A — external proof before native plugin

Deliver:

- Sol Fabric mock/local API;
- OBS WebSocket adapter;
- generated scene collection;
- browser-source Sol Room dock prototype;
- participant and health overlays;
- MCP tools for scene/source/recording control;
- deterministic simulator for room events.

This stage proves the product workflow without requiring a compiled OBS plugin.

### Stage B — native dock plugin

Create `apps/sol-obs-plugin/` from the supported OBS plugin template.

Suggested modules:

```text
plugin-main.cpp
sol-room-dock.cpp
sol-room-client.cpp
sol-room-state.cpp
sol-room-source.cpp
sol-room-captions.cpp
sol-room-participant-bar.cpp
sol-room-audio-meter.cpp
```

The initial native plugin may reuse standard OBS sources and focus on the dock plus state synchronisation.

### Stage C — native custom sources

Add custom sources only when the external/browser-source equivalent is proven and a native source materially improves latency, reliability, installation or operator experience.

### Stage D — packaged product

One installer eventually provisions:

- Sol Fabric Windows service;
- Sol Room OBS plugin;
- virtual audio endpoints;
- MCP server;
- scene templates;
- diagnostics;
- signed binaries and updater.

## MCP contract

Minimum semantic tools:

```text
room.status
room.scene.activate
room.floor.assign
room.participant.mute
room.humans_only
room.emergency_silence

obs.scene.list
obs.scene.activate
obs.source.show
obs.source.hide
obs.recording.start
obs.recording.stop
obs.virtual_camera.start
obs.virtual_camera.stop

phone.status
phone.call.preview
phone.call.start
phone.call.answer
phone.call.mute
phone.call.end
```

MCP tools call shared command handlers. The OBS plugin and MCP server must not implement divergent room logic.

## Safety and failure rules

- Emergency silence overrides every agent and media route.
- Human call continuity is independent of OBS.
- Recording is off by default and requires visible consent state.
- UI state must come from confirmed Sol Fabric/OBS state, not optimistic button clicks.
- Phone Link automation failures must stop safely and request operator action.
- Reconnect must not duplicate calls, recordings or outward actions.
- Secrets, phone numbers and transcript content are redacted from ordinary logs.

## Stage A acceptance test

The first OBS proof passes only when:

1. OBS launches with a generated Sol Room scene collection.
2. A deterministic room simulator updates participant and health overlays.
3. The operator or MCP can activate a scene and verification confirms the program scene changed.
4. A Phone Link window can be represented as a source or placeholder without claiming call audio is proven.
5. Emergency silence updates the room state and visibly disables agent output controls.
6. Restarting OBS restores the authoritative room state from Sol Fabric.
7. No Twilio, SIP or model realtime API is required.

## Native-plugin acceptance test

The native dock is not complete merely because it compiles. It must install into a supported OBS build, load without warnings, reconnect to Sol Fabric, show accurate room state, control scenes, survive OBS restart and pass keyboard/screen-reader checks.