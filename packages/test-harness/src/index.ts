import { MockObsAdapter } from "../../obs-adapter/src/index.js";
import { DeterministicPhoneAdapter } from "../../phone-link-adapter/src/index.js";
import { createDeterministicRoomStore } from "../../room-state/src/index.js";

export function createDeterministicHarness() {
  return {
    room: createDeterministicRoomStore(),
    obs: new MockObsAdapter(),
    phone: new DeterministicPhoneAdapter(),
  };
}
