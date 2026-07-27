# Acceptance Tests — Sol Room

## Phase 0 — Vision and lab

- website loads with no external runtime/model dependencies;
- local browser speech synthesis provides the pitch where supported;
- room presets alter channel state;
- routing matrix is keyboard operable;
- every coding-agent entrypoint states the local-first architecture;
- USB-C lab produces a saved diagnostic bundle;
- repository makes no unsupported phone-audio claim;
- no credentials or private data exist in git.

## Phase 1 — Desktop bridge

- selected source output is captured;
- selected destination receives it;
- operator monitor receives intended sources;
- every participant receives mix-minus;
- self-route creation is rejected;
- emergency silence stops AI output immediately;
- humans-only removes all AI input/output;
- system notifications remain private by default;
- test runs without model APIs or cloud conference services;
- latency, clipping and degraded state are recorded.

## Phase 2 — Android control plane

- contact search uses phone data only with permission;
- SMS preview sends nothing;
- confirmed SMS sends once through selected SIM;
- replay returns prior result without resending;
- unknown destination requires phone confirmation;
- native dial/call action uses the system phone experience;
- emergency/premium/international auto-dial is blocked;
- lost desktop connection does not corrupt native phone state.

## Phase 3 — Phone audio transport

- caller audio reaches selected AI input;
- AI output reaches caller;
- Josh hears and speaks with both;
- caller does not hear itself returned;
- AI does not hear itself returned;
- privacy controls remain local;
- cellular and at least one app call are tested where transport permits;
- limitations are documented;
- successful digital test requires no room acoustic coupling.

## Phase 4 — Multi-agent room

- four isolated AI/application slots can be configured;
- each has independent input/output mute;
- conference all and selected work;
- private supervisor channel cannot leak to program output;
- two agents complete a bounded exchange;
- an additional autonomous turn is blocked until human floor;
- human interruption pauses AI output;
- emergency silence stops every AI channel.

## Phase 5 — Visual stage and work

- selected screen/window appears on stage;
- only authorised agents receive it;
- structured artifact metadata accompanies the visual source;
- private sources do not appear publicly;
- stage failure leaves audio active;
- muted working agent can continue;
- completed artifact publishes only when authorised;
- branch/preview/document identity is preserved;
- failed working agent does not disrupt the room.

## Phase 6 — Pi appliance

- boots unattended;
- physical mute works without workstation UI;
- room state survives workstation restart;
- device disconnect is detected;
- watchdog restarts failed local service;
- offline humans-only remains available;
- device keys can be revoked.

## Security and truthfulness

- no self-route can be persisted;
- protected fields are redacted;
- device commands expire and are idempotent;
- external actions create audit events;
- AI avatars remain labelled;
- recording requires disclosure;
- mock/simulated devices are visibly identified;
- verification report lists exact hardware and versions tested.
