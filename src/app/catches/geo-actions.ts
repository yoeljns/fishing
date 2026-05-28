"use server";

import { requireAuth } from "@/lib/session";
import { reverseGeocode } from "@/lib/geo";

export async function reverseGeocodeAction(
  lat: number,
  lon: number,
): Promise<{ short_name: string } | null> {
  await requireAuth();
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  const result = await reverseGeocode(lat, lon);
  if (!result) return null;
  return { short_name: result.short_name };
}
