export type ShipmentStatus =
  | "planned"
  | "booked"
  | "in_transit"
  | "delivered"
  | "exception"
  | "cancelled";

export interface ShipmentMilestone {
  key: string;
  label: string;
  occurredAt?: Date;
  locationLabel?: string;
  notes?: string;
}

export interface ShipmentSnapshot {
  reference: string;
  status: ShipmentStatus;
  carrier?: string;
  mode?: string;
  originPort?: string;
  destinationPort?: string;
  etd?: Date;
  eta?: Date;
  milestones: ShipmentMilestone[];
  /** True when data comes from a configured carrier integration. */
  liveTracking: boolean;
}

export interface TrackingProvider {
  readonly name: string;
  getShipment(reference: string): Promise<ShipmentSnapshot | null>;
}
