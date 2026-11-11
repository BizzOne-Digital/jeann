import type { BookingRequestInput } from "@/lib/shipments/booking-request";

export type BookingSubmitResult = {
  /** "requested": sent, waiting for the provider. "confirmed": provider returned a confirmed booking. */
  status: "requested" | "confirmed";
  providerReference?: string;
  bookingNumber?: string;
  vesselName?: string;
  plannedDeparture?: Date;
  message: string;
};

/**
 * One adapter per logistics provider (Maersk, DSV, Kuehne + Nagel, ...). The Finekarts booking module talks only to
 * this interface, so providers can be added one at a time without changing the portal.
 */
export interface BookingProvider {
  readonly name: string;
  submit(request: BookingRequestInput): Promise<BookingSubmitResult>;
}

/**
 * Works without any provider account: the request is recorded and Finekarts operations send it to the provider by
 * email or the provider's website, then enter the confirmation by hand.
 */
class ManualBookingProvider implements BookingProvider {
  readonly name = "manual";
  async submit(): Promise<BookingSubmitResult> {
    return {
      status: "requested",
      message: "Recorded. Operations will send this request to the provider and enter the confirmation.",
    };
  }
}

/**
 * Dry bulk vessels and tankers have no booking API: they are chartered through brokers (enquiry, offers, negotiation,
 * fixture). The request is recorded as a charter enquiry for Finekarts to send to its chartering brokers.
 */
class CharteringBrokerProvider implements BookingProvider {
  readonly name = "chartering_broker";
  async submit(): Promise<BookingSubmitResult> {
    return {
      status: "requested",
      message: "Recorded as a charter enquiry. Finekarts will send it to chartering brokers and record the fixture.",
    };
  }
}

const PROVIDERS: Record<string, () => BookingProvider> = {
  manual: () => new ManualBookingProvider(),
  chartering_broker: () => new CharteringBrokerProvider(),
  // API adapters are registered here once Finekarts has credentials and a sandbox from the provider, for example:
  // maersk: () => new MaerskBookingProvider(),
};

export function listBookingProviders(): string[] {
  return Object.keys(PROVIDERS);
}

export function getBookingProvider(name: string): BookingProvider | null {
  const factory = PROVIDERS[name.toLowerCase()];
  return factory ? factory() : null;
}
