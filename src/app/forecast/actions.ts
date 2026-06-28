"use server";

import { requireUser } from "@/lib/session";
import {
  forwardGeocode,
  forwardGeocodeMulti,
  type GeocodeCandidate,
} from "@/lib/geo";

export async function forwardGeocodeAction(
  query: string,
): Promise<{ lat: number; lon: number; display_name: string } | null> {
  await requireUser();
  const q = query.trim();
  if (q.length < 2) return null;
  return forwardGeocode(q);
}

export async function forwardGeocodeMultiAction(
  query: string,
): Promise<GeocodeCandidate[]> {
  await requireUser();
  const q = query.trim();
  if (q.length < 2) return [];
  return forwardGeocodeMulti(q, 6);
}
