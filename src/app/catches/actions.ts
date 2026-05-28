"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type CatchInput,
  deleteCatch as dbDeleteCatch,
  insertCatch,
  updateCatch as dbUpdateCatch,
} from "@/lib/catches";
import { requireAuth } from "@/lib/session";
import { upsertCustomSpecies, findSpeciesByName } from "@/lib/species";
import { inToCm, lbToKg } from "@/lib/units";
import { catchFormSchema } from "@/lib/validation";

async function buildInputFromForm(formData: FormData): Promise<CatchInput> {
  const parsed = catchFormSchema.parse({
    species_name: formData.get("species_name"),
    length_value: formData.get("length_value") ?? undefined,
    length_unit: formData.get("length_unit") ?? "cm",
    weight_value: formData.get("weight_value") ?? undefined,
    weight_unit: formData.get("weight_unit") ?? "kg",
    caught_on: formData.get("caught_on"),
    location: formData.get("location") ?? undefined,
    latitude: formData.get("latitude") ?? undefined,
    longitude: formData.get("longitude") ?? undefined,
    bait: formData.get("bait") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });

  const trimmedName = parsed.species_name.trim();
  let species = await findSpeciesByName(trimmedName);
  if (!species) species = await upsertCustomSpecies(trimmedName);

  const length_cm =
    parsed.length_value == null
      ? null
      : parsed.length_unit === "in"
        ? inToCm(parsed.length_value)
        : parsed.length_value;

  const weight_kg =
    parsed.weight_value == null
      ? null
      : parsed.weight_unit === "lb"
        ? lbToKg(parsed.weight_value)
        : parsed.weight_value;

  return {
    species_id: species.id,
    species_name_snapshot: trimmedName,
    length_cm,
    weight_kg,
    caught_on: parsed.caught_on,
    location: parsed.location,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    bait: parsed.bait,
    notes: parsed.notes,
  };
}

export async function createCatchAction(formData: FormData): Promise<void> {
  await requireAuth();
  const input = await buildInputFromForm(formData);
  await insertCatch(input);
  revalidatePath("/catches");
  revalidatePath("/species");
  revalidatePath("/stats");
  redirect("/catches");
}

export async function updateCatchAction(
  id: number,
  formData: FormData,
): Promise<void> {
  await requireAuth();
  const input = await buildInputFromForm(formData);
  await dbUpdateCatch(id, input);
  revalidatePath("/catches");
  revalidatePath("/species");
  revalidatePath("/stats");
  redirect("/catches");
}

export async function deleteCatchAction(id: number): Promise<void> {
  await requireAuth();
  await dbDeleteCatch(id);
  revalidatePath("/catches");
  revalidatePath("/species");
  revalidatePath("/stats");
}
