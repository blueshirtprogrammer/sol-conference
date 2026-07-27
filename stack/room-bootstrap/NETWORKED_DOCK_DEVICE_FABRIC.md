# Networked Dock and Device Fabric

## Goal

Turn the Simplecom dock attached to the Windows laptop into a managed Sol Room edge gateway so devices connected to the dock can be discovered, presented and—where technically safe—used from the Windows desktop over the local network.

The dock itself is not an Ethernet USB server or network display appliance. It remains physically attached to the laptop. The laptop hosts software adapters that expose each device class over an appropriate network protocol.

## Physical ownership

```text
USB/HDMI device
    -> Simplecom dock
    -> laptop USB-C upstream
    -> Windows laptop owns the physical device
    -> Sol gateway adapter exposes an approved network representation
    -> desktop consumes that representation
```

The desktop never assumes that every dock port is transparently remote-accessible.

## Device classes and transports

### 1. USB storage

Use Windows SMB file sharing, not raw USB/IP, for ordinary USB hard drives and flash drives that need simultaneous file access.

```text
USB drive -> laptop filesystem -> SMB share -> desktop
```

Properties:

- laptop remains the block-device owner;
- both computers may access shared files concurrently through SMB locking;
- the drive must use a filesystem supported by Windows;
- ejecting requires that all SMB handles be closed;
- BitLocker/encrypted devices require explicit unlock on the laptop;
- no drive is shared automatically merely because it was inserted.

Required safeguards:

- private-network firewall scope only;
- explicit allowlist of volumes/folders;
- authenticated Windows account or dedicated local service account;
- no Everyone/full-control shares;
- read-only sharing available per device;
- audit insertion, share creation, client connection and removal.

### 2. Generic USB peripherals

Use a reviewed USB-over-IP adapter when an application on the desktop must see the peripheral as if locally attached.

Preferred lab candidate:

- VirtualHere USB Server on the laptop;
- VirtualHere USB Client on the desktop.

VirtualHere automatically discovers shared USB devices and provides a client API/named-pipe control surface. Its trial is limited to one active shared device. Licensing must be reviewed before commercial bundling.

Important properties:

- a raw USB device is generally leased exclusively to one client at a time;
- it is not safe to promise that laptop and desktop can both drive the same USB peripheral concurrently;
- webcams, capture cards, audio interfaces and phones may be sensitive to latency, disconnects and exclusive driver ownership;
- keyboards, authentication keys, storage devices and untrusted USB devices are denied by default;
- no device is auto-exported without vendor/product-ID allowlisting.

Open-source `usbipd-win` is useful for attaching Windows-hosted USB devices to Linux clients such as WSL/Hyper-V guests. It is not the default Windows-to-Windows desktop-sharing path for this lab.

### 3. Android phone

Use dedicated semantic transports instead of generic USB/IP:

```text
USB -> ADB -> Android MCP / scrcpy
Wi-Fi -> ADB TCP/IP or Sol Link WebRTC
Bluetooth -> Microsoft Phone Link cellular-call transport
```

The Android handset may remain physically connected to the dock while:

- laptop runs ADB and scrcpy;
- desktop agents invoke a constrained Android MCP through the laptop gateway;
- Phone Link handles call transport on the laptop;
- Sol policy requires confirmation for calls, messages, installs and destructive actions.

Do not export the entire Android USB connection to the desktop while the laptop is simultaneously using ADB unless the device and workflow have been tested. Raw USB leasing can disconnect ADB from the laptop.

### 4. iPhone

Use:

- Bluetooth + Phone Link for supported call functions;
- Wi-Fi for future Sol Link/WebRTC;
- USB for charging and supervised Apple-device access.

Do not promise generic iPhone steering over ADB. iOS needs a separate adapter and stricter platform permissions.

### 5. Audio devices

Do not raw-share the laptop microphone/speaker through USB/IP for the first room.

Use:

- VoiceMeeter VBAN during the lab;
- Sol Fabric RTP/WebRTC/local network audio later;
- explicit per-source audio channels and mix-minus.

The dock may host future USB audio interfaces, but Sol exposes their audio streams, not uncontrolled raw device access, unless a specific driver workflow requires USB-over-IP.

### 6. Cameras and capture devices

Preferred:

```text
camera/capture device -> laptop/OBS -> NDI/DistroAV or Sol WebRTC -> desktop/OBS
```

This keeps the device driver local to the dock/laptop and sends encoded audio/video over the network.

Raw USB-over-IP remains an optional compatibility test for devices that cannot be integrated through OBS/NDI/WebRTC.

### 7. HDMI outputs and displays

The dock's HDMI ports are local graphics outputs from the laptop. They cannot be converted into shared remote HDMI ports through ordinary file/device sharing.

Use one of these models:

#### Physical stage

```text
laptop/dock HDMI -> SOL STAGE TV
```

The TV remains a physical laptop display.

#### OBS network program feed

```text
laptop OBS -> DistroAV/NDI -> desktop OBS or network receiver
```

This exposes OBS program, preview, source or scene video/audio over Ethernet.

#### Windows network display

Use spacedesk when the desktop, laptop, phone or another supported viewer should behave as an additional Windows display over TCP/IP.

spacedesk installs a WDDM virtual display adapter on the primary Windows machine and transmits virtual display contents to a network viewer. It does not turn a passive HDMI cable or TV HDMI input into an IP display by itself.

#### Google TVs

Use:

- HDMI for low-latency program output;
- Home Assistant/Google Cast for dashboards and coarse display control;
- a future Sol TV viewer app for participant/status/artifact views.

### 8. Keyboard and mouse

Use a software KVM/input-sharing adapter rather than USB-over-IP where possible.

Options may include a reviewed Barrier/Input Leap/Synergy-style tool or Windows remote-control capability. Input control must remain auditable and separable from phone-call permissions.

## Network topology

```text
Router LAN
├── laptop router-facing NIC through dock
├── desktop built-in NIC
├── SOL-HOME VM
├── phones
└── TVs

Direct media network
└── laptop 10.77.0.1 <-> desktop 10.77.0.2
```

Traffic assignment:

### Router LAN

- Home Assistant discovery and MCP;
- phones and TVs;
- SMB file shares when both nodes need ordinary LAN access;
- service discovery;
- updates and internet.

### Direct media network

- NDI/DistroAV;
- VBAN/Sol Fabric audio;
- high-bandwidth file replication;
- build artifacts and previews;
- optional USB-over-IP after firewall and allowlist configuration.

Neither direct-media NIC receives a default gateway or DNS server.

## Paired bootstrap requirement

The room requires two installers:

```text
stack/desktop-one-click/
stack/laptop-node/
```

The desktop installer cannot configure dock devices until the laptop installer or a supervised desktop agent is running on the laptop.

### Laptop node responsibilities

- inventory dock USB topology;
- label router-facing and direct-media NICs;
- configure 10.77.0.1/24 without gateway;
- install OBS, VoiceMeeter, scrcpy/ADB and Phone Link prerequisites;
- optionally install VirtualHere USB Server;
- install DistroAV/NDI when selected;
- create approved SMB shares for removable storage;
- expose a local health/agent endpoint;
- run Windows/Android MCP servers with least privilege.

### Desktop node responsibilities

- configure 10.77.0.2/24 without gateway;
- host SOL-HOME on router-facing Ethernet only;
- optionally install VirtualHere USB Client;
- receive NDI/OBS feeds;
- consume SMB shares;
- run coding agents and the Sol policy gateway;
- verify laptop services and device leases.

## Device lease model

Every dock device has one of these states:

```text
local-only
network-stream
file-share-readonly
file-share-readwrite
usbip-available
usbip-leased-to-desktop
usbip-leased-to-laptop
blocked
untrusted
unavailable
```

No device may be represented as simultaneously attached to both Windows hosts when the underlying USB transport is exclusive.

## Safety defaults

Blocked by default:

- USB keyboards and mice through raw USB/IP;
- security keys, smart-card readers and biometric devices;
- newly inserted unknown storage;
- phones through raw USB leasing while ADB/Phone Link is active;
- firmware flashers;
- arbitrary USB devices identified only by friendly name;
- public-network SMB and USB-over-IP firewall rules.

## First proof

1. Both machines reach each other on router LAN and direct media LAN.
2. A test USB flash drive inserted into the dock is exposed as an authenticated SMB share.
3. Both machines can read a test file; controlled write behaviour is verified.
4. A harmless allowlisted USB peripheral is leased to the desktop through the selected USB-over-IP tool, then returned to the laptop.
5. Android screen/control works through the laptop gateway without raw USB leasing.
6. OBS sends a test scene from laptop to desktop through NDI/DistroAV or the selected stream adapter.
7. The physical SOL STAGE remains driven by HDMI.
8. Removing the device or disconnecting the direct link produces a clear state transition and does not corrupt files.

No installer may claim the dock is a universal simultaneous multi-host dock. Sol Room provides a policy-controlled network device fabric composed of the correct transport for each device class.
