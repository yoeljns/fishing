import type { SeedSpecies } from "./types";

export const SPECIES_SEED: SeedSpecies[] = [
  // Freshwater Europe
  { common_name: "Brown Trout", scientific_name: "Salmo trutta", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Rainbow Trout", scientific_name: "Oncorhynchus mykiss", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe", "Freshwater North America"] },
  { common_name: "Atlantic Salmon", scientific_name: "Salmo salar", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe", "North Atlantic"] },
  { common_name: "Brook Trout", scientific_name: "Salvelinus fontinalis", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe", "Freshwater North America"] },
  { common_name: "Arctic Char", scientific_name: "Salvelinus alpinus", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Grayling", scientific_name: "Thymallus thymallus", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Northern Pike", scientific_name: "Esox lucius", family: "Esocidae", water_type: "Freshwater", regions: ["Freshwater Europe", "Freshwater North America"] },
  { common_name: "Zander", scientific_name: "Sander lucioperca", family: "Percidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "European Perch", scientific_name: "Perca fluviatilis", family: "Percidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Common Carp", scientific_name: "Cyprinus carpio", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Mirror Carp", scientific_name: "Cyprinus carpio carpio", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Tench", scientific_name: "Tinca tinca", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Common Bream", scientific_name: "Abramis brama", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Roach", scientific_name: "Rutilus rutilus", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Rudd", scientific_name: "Scardinius erythrophthalmus", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Chub", scientific_name: "Squalius cephalus", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"] },
  { common_name: "Wels Catfish", scientific_name: "Silurus glanis", family: "Siluridae", water_type: "Freshwater", regions: ["Freshwater Europe"] },

  // Freshwater North America
  { common_name: "Largemouth Bass", scientific_name: "Micropterus salmoides", family: "Centrarchidae", water_type: "Freshwater", regions: ["Freshwater North America"] },
  { common_name: "Smallmouth Bass", scientific_name: "Micropterus dolomieu", family: "Centrarchidae", water_type: "Freshwater", regions: ["Freshwater North America"] },
  { common_name: "Bluegill", scientific_name: "Lepomis macrochirus", family: "Centrarchidae", water_type: "Freshwater", regions: ["Freshwater North America"] },
  { common_name: "Walleye", scientific_name: "Sander vitreus", family: "Percidae", water_type: "Freshwater", regions: ["Freshwater North America"] },
  { common_name: "Muskellunge", scientific_name: "Esox masquinongy", family: "Esocidae", water_type: "Freshwater", regions: ["Freshwater North America"] },
  { common_name: "Channel Catfish", scientific_name: "Ictalurus punctatus", family: "Ictaluridae", water_type: "Freshwater", regions: ["Freshwater North America"] },

  // Saltwater Mediterranean
  { common_name: "European Seabass", scientific_name: "Dicentrarchus labrax", family: "Moronidae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"] },
  { common_name: "Gilthead Seabream", scientific_name: "Sparus aurata", family: "Sparidae", water_type: "Saltwater", regions: ["Mediterranean"] },
  { common_name: "Common Dentex", scientific_name: "Dentex dentex", family: "Sparidae", water_type: "Saltwater", regions: ["Mediterranean"] },
  { common_name: "Bluefin Tuna", scientific_name: "Thunnus thynnus", family: "Scombridae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"] },
  { common_name: "Atlantic Bonito", scientific_name: "Sarda sarda", family: "Scombridae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"] },
  { common_name: "Greater Amberjack", scientific_name: "Seriola dumerili", family: "Carangidae", water_type: "Saltwater", regions: ["Mediterranean", "Tropical / Indo-Pacific"] },
  { common_name: "Mahi-mahi", scientific_name: "Coryphaena hippurus", family: "Coryphaenidae", water_type: "Saltwater", regions: ["Mediterranean", "Tropical / Indo-Pacific"] },
  { common_name: "Swordfish", scientific_name: "Xiphias gladius", family: "Xiphiidae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"] },

  // Saltwater North Atlantic
  { common_name: "Atlantic Cod", scientific_name: "Gadus morhua", family: "Gadidae", water_type: "Saltwater", regions: ["North Atlantic"] },
  { common_name: "Pollock", scientific_name: "Pollachius pollachius", family: "Gadidae", water_type: "Saltwater", regions: ["North Atlantic"] },
  { common_name: "Haddock", scientific_name: "Melanogrammus aeglefinus", family: "Gadidae", water_type: "Saltwater", regions: ["North Atlantic"] },
  { common_name: "Atlantic Mackerel", scientific_name: "Scomber scombrus", family: "Scombridae", water_type: "Saltwater", regions: ["North Atlantic"] },
  { common_name: "Atlantic Halibut", scientific_name: "Hippoglossus hippoglossus", family: "Pleuronectidae", water_type: "Saltwater", regions: ["North Atlantic"] },
  { common_name: "European Plaice", scientific_name: "Pleuronectes platessa", family: "Pleuronectidae", water_type: "Saltwater", regions: ["North Atlantic"] },
  { common_name: "Striped Bass", scientific_name: "Morone saxatilis", family: "Moronidae", water_type: "Saltwater", regions: ["North Atlantic"] },

  // Saltwater Tropical / Indo-Pacific
  { common_name: "Sailfish", scientific_name: "Istiophorus platypterus", family: "Istiophoridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"] },
  { common_name: "Blue Marlin", scientific_name: "Makaira nigricans", family: "Istiophoridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"] },
  { common_name: "Wahoo", scientific_name: "Acanthocybium solandri", family: "Scombridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"] },
  { common_name: "Giant Trevally", scientific_name: "Caranx ignobilis", family: "Carangidae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"] },
  { common_name: "Yellowfin Tuna", scientific_name: "Thunnus albacares", family: "Scombridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific", "North Atlantic"] },

  // Brackish
  { common_name: "Common Snook", scientific_name: "Centropomus undecimalis", family: "Centropomidae", water_type: "Brackish", regions: ["Tropical / Indo-Pacific"] },
  { common_name: "European Flounder", scientific_name: "Platichthys flesus", family: "Pleuronectidae", water_type: "Brackish", regions: ["North Atlantic", "Freshwater Europe"] },
];
