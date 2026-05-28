"use server";

import { requireAuth } from "@/lib/session";
import { forwardGeocode } from "@/lib/geo";

export async function forwardGeocodeAction(
  query: string,
): Promise<{ lat: number; lon: number; display_name: string } | null> {
  await requireAuth();
  const q = query.trim();
  if (q.length < 2) return null;
  return forwardGeocode(q);
}
