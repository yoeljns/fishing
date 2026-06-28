export type Species = {
  id: number;
  common_name: string;
  scientific_name: string | null;
  family: string | null;
  water_type: string;
  regions: string[];
  aliases: string[];
  is_custom: boolean;
};

export type User = {
  id: number;
  username: string;
  display_name: string | null;
  created_at: string;
};

export type Visibility = "private" | "friends" | "public";

export type FriendState =
  | "self"
  | "none"
  | "friends"
  | "incoming"
  | "outgoing";

export type FriendUser = User & {
  catch_count: number;
};

export type SpeciesWithStats = Species & {
  catch_count: number;
  max_length_cm: number | null;
  max_weight_kg: number | null;
};

export type CatchRow = {
  id: number;
  user_id: number | null;
  species_id: number | null;
  species_name_snapshot: string;
  length_cm: number | null;
  weight_kg: number | null;
  caught_on: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  bait: string | null;
  notes: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
};

export type SeedSpecies = {
  common_name: string;
  scientific_name: string;
  family: string;
  water_type: "Freshwater" | "Saltwater" | "Brackish";
  regions: string[];
  aliases: string[];
};
