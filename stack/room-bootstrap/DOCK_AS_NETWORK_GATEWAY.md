# The Dock as a Software-Defined Network Gateway

## The correct interpretation

At the hardware-protocol level, the Simplecom dock is attached to one USB-C host: the laptop. Its Ethernet controller, USB hub, card readers, audio interface and HDMI/DisplayPort outputs appear to that laptop as separate local functions.

At the Sol Room system level, the laptop can make those local functions available to other devices through software. This makes the combined laptop + dock behave like a networked room appliance.

```text
Physical dock + laptop host + Sol gateway software
= software-defined network dock
```

The Ethernet cable does not automatically packetize every USB or HDMI port. Sol adapters perform that translation.

## Bidirectional model

### Network into dock outputs

```text
phone / desktop / agent / network file
        -> Wi-Fi or Ethernet
        -> laptop Sol gateway
        -> application / OBS / display compositor
        -> dock HDMI
        -> television
```

Examples:

- a phone sends a screen or camera feed over Wi-Fi;
- the laptop receives it through scrcpy, Cast, WebRTC or another adapter;
- OBS composites the feed;
- the dock outputs the finished stage over HDMI.

The HDMI port is therefore usable by network sources through the laptop compositor even though the physical HDMI connector itself is not an IP endpoint.

### Dock inputs/devices out to the network

```text
USB storage / phone / camera / audio interface
        -> dock
        -> laptop owns physical device
        -> Sol gateway publishes files, control or streams
        -> desktop / phones / TVs / agents consume approved representation
```

Examples:

- USB storage becomes an authenticated SMB/Web share;
- Android control becomes ADB + Android MCP;
- camera video becomes OBS/NDI/WebRTC;
- audio becomes VBAN or Sol Fabric channels;
- an exceptional generic peripheral becomes an allowlisted USB-over-IP lease.

## What becomes room-accessible

With the correct adapters, the room can support:

- phone-to-TV casting through the laptop stage;
- desktop-to-dock-HDMI presentation over NDI, remote display or Sol streams;
- files inserted at the dock shared to the desktop and authorized mobile clients;
- Bluetooth transfers received by the laptop and re-published through room storage;
- Android phone steering from an agent running on either computer;
- dock-connected cameras and microphones exposed as network media sources;
- shared dashboards and artifacts sent to either television;
- OBS scenes controlled through MCP while the physical output remains HDMI.

## What does not happen automatically

- The dock does not receive its own IP address independently from the laptop.
- Each HDMI connector is not assigned an IP address.
- HDMI outputs do not accept incoming HDMI signals.
- A passive TV HDMI input is not transformed into a network receiver by the dock.
- USB devices are not automatically and safely controlled by two Windows hosts at once.
- Plugging an unknown USB device into the dock does not automatically authorize network export.

An external HDMI source requires a capture device connected to the dock or another network-video adapter before the laptop can ingest it.

## Sol abstraction

The user-facing Sol Room model does not expose protocol trivia. It presents resources:

```text
SOL STAGE
SOL WORK WALL
Android Phone
Phone Camera
Dock Storage
Dock Camera
Dock Audio
Desktop Preview
Laptop Screen
Room Files
```

Underneath, each resource has a transport:

```text
HDMI
SMB/HTTPS
ADB
Bluetooth/Phone Link
OBS WebSocket
NDI/WebRTC
VBAN/Sol Fabric
USB-over-IP
Google Cast/Home Assistant
```

This is the intended product experience: anything connected to the room may be routed, shown, shared or controlled when an appropriate adapter exists and policy permits it.
