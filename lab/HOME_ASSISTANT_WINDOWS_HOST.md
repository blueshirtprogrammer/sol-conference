# Home Assistant on the Windows Desktop

## Decision

The Raspberry Pi 5 is removed from the active Sol Room build because a GPIO/header pin is damaged. Do not power it as a room controller, connect GPIO accessories, or make it part of any critical path until the board is physically inspected.

Home Assistant moves to the Windows 11 desktop as a Home Assistant Operating System virtual machine.

## Why Home Assistant OS in a VM

Use Home Assistant OS rather than a bare Python/Core installation or an initial WSL container.

Home Assistant OS provides:

- the Supervisor and app ecosystem;
- managed updates and backups;
- integrations and dashboards;
- the official Home Assistant MCP Server integration;
- a replaceable appliance boundary that can later move to another host.

A Home Assistant Container installation can work, but it does not include Home Assistant apps and requires more manual lifecycle management. It is not the preferred first-room deployment.

## Hypervisor selection

- Windows 11 Pro/Enterprise: Hyper-V is acceptable.
- Windows 11 Home or a simpler visual setup: VirtualBox is acceptable.
- VMware Workstation is another supported option.

Do not run Home Assistant in WSL merely because WSL is already installed. WSL remains for development tooling; Home Assistant should be an appliance-like VM.

## VM allocation

Start with:

```text
Name: SOL-HOME
CPU: 2 vCPU
RAM: 4 GB
Disk: 32 GB dynamically allocated or larger
Firmware: UEFI
Autostart: enabled after the lab is stable
```

Home Assistant documents a minimum of 2 vCPU and 2 GB RAM for the Windows VM path. Four GB gives the lab more headroom for dashboards, integrations, history and apps.

## Network binding

The desktop has two Ethernet interfaces:

```text
Desktop built-in Ethernet -> router/LAN
Desktop USB Ethernet      -> direct laptop media link
```

Bind the Home Assistant VM only to the router-facing built-in Ethernet adapter using:

- an External Virtual Switch in Hyper-V; or
- Bridged Adapter mode in VirtualBox/VMware.

Do not bind Home Assistant to the direct `10.77.0.0/24` laptop-desktop media network. Phones, televisions and other room devices need to discover Home Assistant through the normal router LAN.

Example:

```text
Router LAN
├── desktop Windows host
├── SOL-HOME virtual machine
├── laptop/dock
├── Android phone
├── iPhone
├── SOL STAGE television
└── SOL WORK WALL television

Direct media network
└── laptop 10.77.0.1 <-> desktop 10.77.0.2
```

Reserve a router address for the VM after its first boot, for example:

```text
sol-home -> 192.168.1.23
```

Use the real router subnet rather than copying this example blindly.

## Home Assistant responsibilities

Home Assistant is the physical-room and coarse scene-control layer:

- television discovery and room display state;
- room-mode entities such as `pitch`, `product_studio`, `phone_support`, `humans_only` and `emergency_silence`;
- health status for laptop, desktop, applications and network nodes;
- future physical buttons and sensors;
- dashboards for SOL WORK WALL;
- automation triggers and notifications;
- official MCP control of deliberately exposed entities.

Home Assistant does not own:

- low-latency audio mixing;
- Phone Link media capture;
- virtual microphones;
- mix-minus;
- call continuity;
- OBS program truth;
- consequential phone actions without Sol policy and confirmation.

Those remain in Sol Fabric, OBS adapters and phone-control adapters.

## MCP setup

After Home Assistant onboarding:

1. Open **Settings -> Devices & services**.
2. Add **Model Context Protocol Server**.
3. Enable control only when ready.
4. Expose only the room entities the agent needs.
5. Keep phone calls, messages and destructive actions outside Home Assistant unless a later reviewed adapter is explicitly added.

Home Assistant exposes the MCP server at:

```text
http://<sol-home-address>:8123/api/mcp
```

Use OAuth where supported or a locally stored token. Never commit the token.

Suggested exposed entities:

```text
input_select.sol_room_mode
input_boolean.sol_emergency_silence
input_boolean.sol_humans_only
input_boolean.sol_ai_enabled
input_text.sol_active_scene
sensor.sol_laptop_status
sensor.sol_obs_status
sensor.sol_phone_link_status
media_player.sol_stage
media_player.sol_work_wall
```

## Television use

Keep HDMI as the primary live visual path:

```text
Laptop/dock HDMI -> SOL STAGE
Desktop GPU HDMI -> SOL WORK WALL
```

Home Assistant may additionally control the TVs, wake them, select room modes, display dashboards or provide a fallback cast path. Do not rely on Wi-Fi casting for latency-critical live presentation output.

## Host coexistence

The desktop continues to run:

- coding agents;
- builds and previews;
- storage and backups;
- optional OBS rendering;
- Sol Work services.

The Home Assistant VM should remain modest and isolated. Do not pass the GPU into it. Do not bind its services to the direct media NIC.

## Pi quarantine

For now:

```text
Raspberry Pi state: isolated / unavailable
```

- disconnect GPIO accessories;
- do not rely on its Ethernet, Wi-Fi or Bluetooth;
- do not power the board until the damaged pin and surrounding header are inspected;
- retain Pi-related interfaces in architecture only as future replaceable edge-node adapters.

No current phase may require the Pi.

## Verification checklist

- [ ] Hypervisor installed and hardware virtualisation enabled.
- [ ] Home Assistant OS VM boots.
- [ ] VM receives a router-LAN IP.
- [ ] `http://homeassistant.local:8123` or the reserved IP loads.
- [ ] Laptop can access Home Assistant.
- [ ] Both phones can access Home Assistant over Wi-Fi.
- [ ] TVs are visible as integrations or reachable room devices.
- [ ] Home Assistant MCP Server integration is enabled.
- [ ] Only approved Sol Room entities are exposed to MCP.
- [ ] Direct laptop-desktop media link remains separate.
- [ ] Pi is absent from all required-room health checks.
