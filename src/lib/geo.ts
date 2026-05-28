export type ReverseGeocodeResult = {
  display_name: string;
  short_name: string;
  country: string | null;
};

type NominatimResponse = {
  display_name?: string;
  address?: {
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    body_of_water?: string;
    water?: string;
    lake?: string;
    river?: string;
    sea?: string;
    bay?: string;
    beach?: string;
  };
};

const UA = "FishingJournal/1.0";

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<ReverseGeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&accept-language=en`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResponse;
    if (!data.display_name) return null;
    const a = data.address ?? {};
    const water =
      a.body_of_water ?? a.water ?? a.lake ?? a.river ?? a.sea ?? a.bay;
    const place =
      water ??
      a.beach ??
      a.village ??
      a.town ??
      a.city ??
      a.municipality ??
      a.county ??
      a.state;
    const short = [place, a.country].filter(Boolean).join(", ");
    return {
      display_name: data.display_name,
      short_name: short || data.display_name,
      country: a.country ?? null,
    };
  } catch {
    return null;
  }
}

export async function forwardGeocode(
  query: string,
): Promise<{ lat: number; lon: number; display_name: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1&accept-language=en`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (data.length === 0) return null;
    return {
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
      display_name: data[0].display_name,
    };
  } catch {
    return null;
  }
}

const REGION_BOXES: Array<{
  name: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}> = [
  // Levant / Eastern Mediterranean
  { name: "Levant", minLat: 29, maxLat: 38, minLon: 32, maxLon: 40 },
  // Western Europe
  { name: "Western Europe", minLat: 36, maxLat: 71, minLon: -10, maxLon: 31 },
  // North America east
  {
    name: "North America East",
    minLat: 24,
    maxLat: 50,
    minLon: -85,
    maxLon: -60,
  },
  // North America west
  {
    name: "North America West",
    minLat: 24,
    maxLat: 60,
    minLon: -130,
    maxLon: -85,
  },
  // South America
  { name: "South America", minLat: -55, maxLat: 13, minLon: -82, maxLon: -34 },
  // Africa
  { name: "Africa", minLat: -35, maxLat: 38, minLon: -18, maxLon: 52 },
  // Asia / Indo-Pacific
  {
    name: "Asia / Indo-Pacific",
    minLat: -45,
    maxLat: 55,
    minLon: 65,
    maxLon: 180,
  },
];

export function regionFromCoords(lat: number, lon: number): string | null {
  for (const box of REGION_BOXES) {
    if (
      lat >= box.minLat &&
      lat <= box.maxLat &&
      lon >= box.minLon &&
      lon <= box.maxLon
    ) {
      return box.name;
    }
  }
  return null;
}
