# Sol Room Laptop Node

This node owns the Simplecom dock, Microsoft Phone Link, VoiceMeeter, OBS, scrcpy/ADB and the first live audio bridge.

It is also the physical-device gateway for anything plugged into the dock.

## Entry point

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\stack\laptop-node\Install-SolRoomLaptop.ps1 -Mode Plan
```

After reviewing detected adapters and devices:

```powershell
.\stack\laptop-node\Install-SolRoomLaptop.ps1 `
  -Mode Install `
  -DirectMediaAdapterAlias '<LAPTOP_DIRECT_NIC_ALIAS>' `
  -ApproveNetworkChanges
```

## Responsibilities

- keep the router-facing dock Ethernet adapter on DHCP;
- configure the dedicated direct-media NIC as `10.77.0.1/24` with no gateway or DNS;
- install OBS Studio, scrcpy/ADB, Node.js LTS and optional DistroAV;
- verify Microsoft Phone Link is present;
- create only explicitly approved removable-storage SMB shares;
- optionally install a reviewed USB-over-IP server;
- expose Android steering through ADB/MCP rather than raw USB leasing;
- keep HDMI as a local physical display path while exporting OBS scenes over the network;
- publish a local health report for the desktop orchestrator.

## Device-sharing truth

- SMB allows both computers to access files on a laptop-owned USB drive.
- Raw USB-over-IP normally leases a device to one host at a time.
- Phones should remain on ADB/Phone Link transports unless a specific raw-USB test is approved.
- HDMI outputs are local display outputs. Network video uses OBS + DistroAV/NDI or another approved stream transport.

## Optional commercial dependency

VirtualHere is the preferred low-friction Windows-to-Windows USB-over-IP candidate for the lab. The free trial permits one device at a time. It is optional and requires licence review before commercial redistribution.

The installer does not silently export unknown USB devices.
