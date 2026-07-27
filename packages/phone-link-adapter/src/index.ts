import type { PhoneStatus } from "../../contracts/src/index.js";

export interface PhoneAdapter {
  readonly kind: "simulator" | "phone-link";
  getStatus(): Promise<PhoneStatus>;
}

export class DeterministicPhoneAdapter implements PhoneAdapter {
  public readonly kind = "simulator" as const;

  public async getStatus(): Promise<PhoneStatus> {
    return {
      adapter: "simulator",
      connection: "connected",
      callState: "idle",
      simulated: true,
    };
  }
}

export interface PhoneLinkAutomationClient {
  getConnectionState(): Promise<"connected" | "disconnected">;
  getCallState(): Promise<"idle" | "ringing" | "active" | "held">;
}

export class PhoneLinkAdapter implements PhoneAdapter {
  public readonly kind = "phone-link" as const;

  public constructor(private readonly client: PhoneLinkAutomationClient) {}

  public async getStatus(): Promise<PhoneStatus> {
    const [connection, callState] = await Promise.all([
      this.client.getConnectionState(),
      this.client.getCallState(),
    ]);
    return {
      adapter: "phone-link",
      connection,
      callState,
      simulated: false,
    };
  }
}
