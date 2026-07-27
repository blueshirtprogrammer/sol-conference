# USB-C Phone and Windows Capability Lab

## Purpose

Determine what the actual Android phone, USB-C cable, dock, Windows laptop, Bluetooth stack and Phone Link installation expose before selecting the first phone-audio transport.

Do not assume that appearing in Device Manager means call audio is available.

## Safety

- Use a trusted test caller who knows the experiment is occurring.
- Do not record without consent.
- Use low levels and headphones to prevent feedback.
- Never call emergency or premium numbers.
- Redact phone numbers, contacts, serials, account data and device secrets before committing evidence.

## Inventory

Record:

```text
Date:
Windows laptop/model/build:
Android phone/model/version:
USB-C cable:
Dock/audio interface:
Bluetooth adapter:
Phone Link installed/version:
Default phone app:
Default messages app:
Calling apps tested:
```

## Experiment A — Known acoustic baseline

1. Place the phone on speaker.
2. Start an existing AI voice session on the laptop.
3. Let the remote caller, local operator and AI converse naturally.
4. Record intelligibility, echo, interruption behaviour, distance, volume and failure points.

The digital bridge must outperform this baseline.

## Experiment B — Plain USB-C connection

1. Connect phone directly to the PC.
2. Record Android USB modes shown: charging, file transfer, tethering, MIDI, Android Auto/accessory or others.
3. Test each non-destructive mode.
4. Record changes under Windows Sound input/output and Device Manager audio/USB categories.
5. Do not conclude audio exists unless a bidirectional endpoint can actually render and capture test audio.

Expected on many phones: no bidirectional protected call-audio endpoint from a plain data cable.

## Experiment C — Phone Link compatibility

1. Pair Android and Windows through Phone Link and Bluetooth.
2. Place a normal test call.
3. Record active Windows input/output endpoints.
4. Verify PC headset audio in both directions.
5. Test whether Sol Fabric can select/capture the relevant Windows path.
6. Record latency, echo and Bluetooth disconnect behaviour.

## Experiment D — Wired communication headset/audio bridge

1. Connect a compatible bidirectional USB-C headset or audio accessory to the phone.
2. Confirm Android selects it as the communication device.
3. Connect the PC side through an audio interface or bridge.
4. Record Windows endpoints.
5. Test caller audio into PC and low-level PC audio into call.
6. Add headphones and manual mix-minus.
7. Test cellular, WhatsApp and meeting-app compatibility.

## Experiment E — Bluetooth HFP bridge

Only test when hardware can explicitly operate as a hands-free/headset role toward the phone. Do not assume a normal Windows application can advertise the required Bluetooth role.

Record pairing, audio quality, latency, microphone path, call controls, reconnect and application compatibility.

## Windows diagnostics

Run PowerShell and save redacted output:

```powershell
Get-PnpDevice -Class AudioEndpoint | Format-Table -AutoSize
Get-CimInstance Win32_SoundDevice | Select-Object Name, Status, PNPDeviceID
Get-PnpDevice | Where-Object { $_.FriendlyName -match "Phone|Android|USB|Bluetooth|Audio" } |
  Format-Table Status, Class, FriendlyName, InstanceId -AutoSize
Get-Service | Where-Object { $_.Name -match "Bluetooth|Audio" } |
  Format-Table Status, Name, DisplayName
```

## Evidence folder

```text
lab/results/YYYY-MM-DD-device-name/
  inventory.md
  windows-audio-endpoints.txt
  pnp-devices.txt
  screenshots/
  acoustic-baseline.md
  latency-notes.md
  decision.md
```

## Decision record

```text
Selected first transport:
Why:
Hardware required:
Apps tested:
Audio input exposed:
Audio output exposed:
Latency:
Echo/feedback:
Reliability:
Known limitations:
Next experiment:
```

A coding agent may not skip this lab and select Twilio/SIP as a substitute.
