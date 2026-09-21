/** Stored on Terminal49 shipment `ref_numbers` to map webhooks back to a lot. */
export const TERMINAL49_LOT_REF_PREFIX = "jea-lot:";

export function terminal49LotRef(shipmentLotId: string): string {
  return `${TERMINAL49_LOT_REF_PREFIX}${shipmentLotId}`;
}

export function parseShipmentLotIdFromRefNumbers(refNumbers: string[] | undefined): string | null {
  if (!refNumbers?.length) return null;
  for (const ref of refNumbers) {
    if (ref.startsWith(TERMINAL49_LOT_REF_PREFIX)) {
      return ref.slice(TERMINAL49_LOT_REF_PREFIX.length);
    }
  }
  return null;
}
