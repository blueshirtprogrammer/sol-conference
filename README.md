# Sol Room

**Turn any room into a live AI company.**

Sol Room is a local-first, vendor-neutral multimodal operating environment where humans, phones, media, subscribed AI voice applications, local models and working agents can hear, see, speak and create real artifacts together through standard virtual-device interfaces.

> Keep this repository private before adding credentials, phone numbers, transcripts, recordings, private profiles or device keys.

## Start here

- **Interactive website:** `website/index.html`
- **Highest instruction:** `SYSTEM_PROMPT.md`
- **Canonical vision:** `VISION.md`
- **Complete architecture:** `SOL_ROOM_MASTER_SPEC.md`
- **Engineering contract:** `AGENTS.md`
- **Universal agent prompt:** `CODING_AGENT_PROMPT.md`
- **Goals and loops:** `CODEX_PROJECT.md`
- **Phone hardware lab:** `lab/USB_C_PHONE_LAB.md`
- **Spoken pitch:** `pitch/COFOUNDER_PITCH.md`

## Product family

- **Sol Link** — phone and device gateway.
- **Sol Fabric** — virtual audio/video routing.
- **Sol Room** — the live human + AI room.
- **Sol Work** — agents producing code, design, research and documents while the meeting continues.
- **Sol Presence** — clearly labelled avatars and embodied room identity.
- **Sol Room Edge** — Raspberry Pi/embedded room chairman.

## Architectural rule

The core is the local virtual-device fabric. Existing ChatGPT, Claude, Gemini and other applications connect through ordinary microphones, speakers, cameras, screens and app windows. Phones retain their native SIM, dialler, messages, contacts and communication applications.

Do not make Twilio, SIP, OpenAI Realtime or another metered voice API the default implementation. Those are optional later fallback adapters.

## First proof

```text
one call or meeting source
+ one existing AI voice application
+ one local human
+ clean bidirectional routing
+ mix-minus
+ immediate emergency mute
```

No model voice API is required for this local demonstration.

## Run the vision site

```bash
npm run dev
```

Or open `website/index.html` directly.

Validate:

```bash
npm run validate
```

## Start Codex or Claude Code

```text
Read SYSTEM_PROMPT.md, VISION.md, SOL_ROOM_MASTER_SPEC.md, AGENTS.md,
CODING_AGENT_PROMPT.md, CODEX_PROJECT.md and lab/USB_C_PHONE_LAB.md.

Implement Phase 0 only. Do not begin with Twilio, SIP, OpenAI Realtime or a
metered voice pipeline. Report only tests and device capabilities actually
verified.
```

## Current branch

The website and expanded product architecture are developed on:

```text
agent/sol-room-vision-site
```
