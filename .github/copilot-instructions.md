# GitHub Copilot Coding Agent Instructions — Sol Room

Before editing code, read:

1. `/SYSTEM_PROMPT.md`
2. `/VISION.md`
3. `/SOL_ROOM_MASTER_SPEC.md`
4. `/AGENTS.md`
5. `/CODING_AGENT_PROMPT.md`
6. `/CODEX_PROJECT.md`
7. `/lab/USB_C_PHONE_LAB.md`
8. `/website/`

Implement only the phase assigned by the user.

Critical invariants:

- local virtual audio/video devices are the default compatibility layer;
- existing AI applications are media nodes, not hard-coded model APIs;
- phone SIM, contacts, calls and messages remain native to the phone;
- Sol Link controls approved device actions and Sol Fabric controls media routes;
- HEAR, SPEAK, SEE, ACT and SHARE are separate permissions;
- every node receives mix-minus and self-routes are rejected;
- human interruption, humans-only and emergency silence are mandatory;
- AI-to-AI turns are bounded;
- Raspberry Pi/edge hardware is a room controller, not a requirement to run every large model;
- Twilio, SIP and metered realtime model paths are optional later fallback adapters only;
- never claim a USB, Bluetooth, driver, phone-call, SMS or audio path works unless it was actually verified;
- never commit secrets, phone numbers, private profiles, transcripts, recordings or device keys;
- do not leave fake success responses, dead controls or hidden TODOs.

Use current primary platform documentation, add tests with implementation and return the evidence-based phase report required by `/CODING_AGENT_PROMPT.md`.
