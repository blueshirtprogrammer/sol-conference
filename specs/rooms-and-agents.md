# Rooms, Roles and Agents

## Room contents

A persistent room contains participants, roles, media graph, visual stage, workstreams, artifacts, decisions, permissions, audit events and reusable scenes.

## Participant state

```text
presence: offline | available | connecting | connected | degraded
audio: isolated | listening | speaking | muted
visual: none | watching | presenting | private
tools: none | restricted | connected | executing
work: idle | working | blocked | ready
```

## Role examples

Chair, presenter, marketing lead, visual designer, technical supervisor, developer, researcher, translator, note taker, accessibility assistant, client advocate and private critic.

A role supplies instructions and permissions; it does not imply a specific model vendor.

## Scene examples

- Phone + Sol
- Humans only
- Private operator command
- AI roundtable
- Sol + Gemini bounded review
- Client discovery
- Product design sprint
- Executive review
- Multilingual supplier room
- Family support
- Presentation mode
- Emergency silence

## Multi-agent rules

1. Only selected agents receive room audio/visuals.
2. Only the floor owner reaches public program output unless deliberate full-duplex mode is enabled.
3. Human interruption pauses AI output immediately.
4. Maximum autonomous AI turns default to two.
5. Working agents may continue privately while muted.
6. Private critique never enters the public room without release.
7. Structured context is preferred over irrelevant continuous audio.
8. Every generated avatar remains visibly labelled AI.

## Example live product room

- Josh — human cofounder, public audio, full room control.
- Client — human, public audio, limited visual access.
- Sol — chair/marketing lead, public audio and stage presentation.
- Gemini — visual designer, muted while working, may present.
- Claude — private technical supervisor with selected code/context.
- Codex — working agent, no audio by default, publishes a preview artifact.
- Pi moderator — no public voice, manages floor and safety.

## Persistent memory

Rooms may retain approved transcript, summary, decisions, actions, artifacts, branch/preview links, roles and unfinished work. Retention is explicit and configurable; recording is off by default.
