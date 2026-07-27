# UI and User Flows

## Product character
A calm, premium consumer communication tool. It must not look like a call-centre console or AI demo. Use high contrast, large controls, plain language and visible recovery states.

## Visual system
- Dark neutral background, raised charcoal surfaces, white primary text.
- Accent: accessible blue. Participant accents: Mum purple, Josh blue, Sol teal.
- Geist Sans; Geist Mono for timers.
- Minimum control target 48x48 px; primary mobile call buttons at least 72 px high.
- Rounded cards, restrained shadows, reduced-motion support.
- WCAG 2.2 AA and text scaling to 200%.

## Navigation
Desktop: Home, Live Call, Contacts, History, Messages, Settings, Diagnostics.
Mobile: Home, Call, History, Settings.
An active call creates a persistent live indicator.

## Home
Header: “Good morning, Josh” and “Who would you like to speak with?”

Primary cards, in order:
1. **Call Mum with Sol** — calls Mum and adds Sol after answer.
2. **Start family call** — Mum, Josh and Sol.
3. **Join from my phone**.
4. **Add Sol to a live call**.

Display recent activity underneath. On mobile, cards become a vertical stack and **Call Mum with Sol** remains first.

Before calling, show:

```text
Call Mum now?
Mum will receive a normal phone call.
Sol will join after she answers.
Mum: 04•• ••• ••71
[ Call Mum ] [ Cancel ]
```

## Live Call
Top bar: call status, timer and connection state.

Participant cards:
- Mum: calling, ringing, connected, speaking, muted, disconnected, reconnecting, failed.
- Sol: waiting, joining, listening, preparing a response, speaking, using a tool, muted, removed, failed.
- Josh: not in call, calling, ringing, connected, speaking, declined, failed.

Each card includes name, role, connection state, speaking state and relevant controls. Active speaker uses text, waveform and an outline—not colour alone.

Desktop uses participants left and live transcript right. Mobile stacks participants and opens transcript in a bottom sheet.

Primary controls:
- Mute Sol
- Remove Sol
- Call Josh
- Send Mum SMS
- More actions
- End conference

Removing Sol must clearly state: “Mum and Josh will remain connected.”

If Sol fails:

```text
Sol could not join.
Mum and Josh can continue speaking without Sol.
[ Try adding Sol again ] [ Continue without Sol ]
```

## Dropped call flow
When Mum disconnects unexpectedly:

```text
Mum’s call disconnected
Calling her back in 5 seconds…
[ Cancel callback ]
```

Then:

```text
Calling Mum back…
Attempt 1 of 1
```

Failure:

```text
Mum did not answer
No more automatic attempts will be made.
[ Try again ] [ Send SMS ] [ End conference ]
```

## Transcript
Speaker, timestamp and final utterance. Support live, paused, disabled and unavailable states.

Provide **Pause transcript**. Redact payment cards, OTPs, passwords and protected identifiers as `[ Sensitive information hidden ]`.

## Post-call summary
Show participants, date/time, duration, objective summary, decisions, action items, unresolved questions, dropped-call events and tool failures. Avoid unsupported emotional or medical inference.

Actions: Send summary to Mum, Add reminder, View transcript, Back home.

## Setup wizard
1. Welcome.
2. Verify Josh’s phone.
3. Add Mum/Yvonne as a trusted contact.
4. AI disclosure and privacy settings.
5. Dropped-call behaviour.
6. Test call.
7. Completion.

Recording defaults off. “Announce when Sol joins” and “Allow Mum to ask Sol to leave” default on.

## Contacts
Cards show masked number, verification and permissions. New contacts default restricted.

Fields: name, relationship, phone, preferred language, may Sol call, may Sol access private context, emergency contact, confirmation policy.

## Settings
Sections: Profile, Phone numbers, Sol voice, Call behaviour, Privacy, Notifications, Accessibility, Integrations, Security, Billing and limits.

Accessibility includes Standard/Large/Extra large, high contrast, reduce motion and simplified Mum Mode.

## Mum Mode
Only four large actions:
- Talk to Sol
- Call Josh
- Ask Sol to call Josh
- Help

During call:
- Make louder
- Repeat that
- Call Josh
- Give me privacy
- End call

Do not use provider or engineering terminology.

## Android Relay UI
Home status:
- device online
- calls ready
- SMS ready
- selected SIM
- desktop connected
- gateway connected
- recent activity

Pending SMS:

```text
Sol wants to send a message
To: Mum
Message: ...
[ Send ] [ Edit ] [ Cancel ]
```

Pending call:

```text
Call Mum?
This will place a normal mobile call using your selected SIM.
[ Call now ] [ Open dialler ] [ Cancel ]
```

## Windows Desktop UI
- Device status
- Phone Link setup/status
- CLI status
- Connect Phone Link
- Select ChatGPT Audio
- Start Bridge
- Mute Sol
- Give Humans Privacy
- Stop Bridge
- diagnostics bundle

Never show or capture ChatGPT credentials.

## Required Playwright journeys
A. Josh calls Mum with Sol.
B. Mum calls Sol and Josh joins.
C. Mum disconnects and receives one callback.
D. Sol is removed while Mum and Josh remain connected.
E. OpenAI fails but humans continue.
F. Browser refresh restores the call.
G. Full keyboard-only workflow.
H. 200% zoom and reduced motion.