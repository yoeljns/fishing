import type { SeedSpecies } from "./types";

export const SPECIES_SEED: SeedSpecies[] = [
  // Freshwater Europe
  { common_name: "Brown Trout", scientific_name: "Salmo trutta", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Bachforelle", "Truite fario", "Sea Trout"] },
  { common_name: "Rainbow Trout", scientific_name: "Oncorhynchus mykiss", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe", "Freshwater North America"], aliases: ["Steelhead", "Regenbogenforelle"] },
  { common_name: "Atlantic Salmon", scientific_name: "Salmo salar", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe", "North Atlantic"], aliases: ["Salmon", "Saumon", "Lachs"] },
  { common_name: "Brook Trout", scientific_name: "Salvelinus fontinalis", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe", "Freshwater North America"], aliases: ["Brookie", "Speckled Trout", "Bachsaibling"] },
  { common_name: "Arctic Char", scientific_name: "Salvelinus alpinus", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Char", "Saibling"] },
  { common_name: "Grayling", scientific_name: "Thymallus thymallus", family: "Salmonidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Äsche", "Lady of the Stream"] },
  { common_name: "Northern Pike", scientific_name: "Esox lucius", family: "Esocidae", water_type: "Freshwater", regions: ["Freshwater Europe", "Freshwater North America"], aliases: ["Pike", "Jackfish", "Snake", "Hecht", "Brochet"] },
  { common_name: "Zander", scientific_name: "Sander lucioperca", family: "Percidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Pike-perch", "Sandre"] },
  { common_name: "European Perch", scientific_name: "Perca fluviatilis", family: "Percidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Perch", "Redfin", "Flussbarsch", "Perche"] },
  { common_name: "Common Carp", scientific_name: "Cyprinus carpio", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["King Carp", "Karpfen"] },
  { common_name: "Mirror Carp", scientific_name: "Cyprinus carpio carpio", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Mirror", "Spiegelkarpfen"] },
  { common_name: "Tench", scientific_name: "Tinca tinca", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Doctor Fish", "Schleie", "Tanche"] },
  { common_name: "Common Bream", scientific_name: "Abramis brama", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Bronze Bream", "Brachsen", "Brème"] },
  { common_name: "Roach", scientific_name: "Rutilus rutilus", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Plötze", "Rotauge", "Gardon"] },
  { common_name: "Rudd", scientific_name: "Scardinius erythrophthalmus", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Rotfeder"] },
  { common_name: "Chub", scientific_name: "Squalius cephalus", family: "Cyprinidae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Aitel", "Döbel", "Chevesne"] },
  { common_name: "Wels Catfish", scientific_name: "Silurus glanis", family: "Siluridae", water_type: "Freshwater", regions: ["Freshwater Europe"], aliases: ["Wels", "Sheatfish", "Waller", "Silure"] },

  // Freshwater North America
  { common_name: "Largemouth Bass", scientific_name: "Micropterus salmoides", family: "Centrarchidae", water_type: "Freshwater", regions: ["Freshwater North America"], aliases: ["Bucketmouth", "Hawg", "Bigmouth", "Black Bass", "LMB"] },
  { common_name: "Smallmouth Bass", scientific_name: "Micropterus dolomieu", family: "Centrarchidae", water_type: "Freshwater", regions: ["Freshwater North America"], aliases: ["Smallie", "Bronzeback", "SMB"] },
  { common_name: "Bluegill", scientific_name: "Lepomis macrochirus", family: "Centrarchidae", water_type: "Freshwater", regions: ["Freshwater North America"], aliases: ["Bream", "Sunny", "Sun Perch", "Brim"] },
  { common_name: "Walleye", scientific_name: "Sander vitreus", family: "Percidae", water_type: "Freshwater", regions: ["Freshwater North America"], aliases: ["Pickerel", "Yellow Pike"] },
  { common_name: "Muskellunge", scientific_name: "Esox masquinongy", family: "Esocidae", water_type: "Freshwater", regions: ["Freshwater North America"], aliases: ["Musky", "Muskie", "Lunge"] },
  { common_name: "Channel Catfish", scientific_name: "Ictalurus punctatus", family: "Ictaluridae", water_type: "Freshwater", regions: ["Freshwater North America"], aliases: ["Channel Cat", "Spotted Cat"] },

  // Saltwater Mediterranean
  { common_name: "European Seabass", scientific_name: "Dicentrarchus labrax", family: "Moronidae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"], aliases: ["Branzino", "Loup de mer", "Spigola", "Sea Bass", "Lubina"] },
  { common_name: "Gilthead Seabream", scientific_name: "Sparus aurata", family: "Sparidae", water_type: "Saltwater", regions: ["Mediterranean"], aliases: ["Dorade", "Orata", "Dorada", "Dorade royale"] },
  { common_name: "Common Dentex", scientific_name: "Dentex dentex", family: "Sparidae", water_type: "Saltwater", regions: ["Mediterranean"], aliases: ["Dentex", "Dentice", "Denté"] },
  { common_name: "Bluefin Tuna", scientific_name: "Thunnus thynnus", family: "Scombridae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"], aliases: ["Tuna", "Atún", "Toro", "Thon rouge"] },
  { common_name: "Atlantic Bonito", scientific_name: "Sarda sarda", family: "Scombridae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"], aliases: ["Bonito", "Palamida", "Pelamide"] },
  { common_name: "Greater Amberjack", scientific_name: "Seriola dumerili", family: "Carangidae", water_type: "Saltwater", regions: ["Mediterranean", "Tropical / Indo-Pacific"], aliases: ["Amberjack", "AJ", "Reef Donkey", "Ricciola"] },
  { common_name: "Mahi-mahi", scientific_name: "Coryphaena hippurus", family: "Coryphaenidae", water_type: "Saltwater", regions: ["Mediterranean", "Tropical / Indo-Pacific"], aliases: ["Dorado", "Dolphinfish", "Coryphène", "Lampuga"] },
  { common_name: "Swordfish", scientific_name: "Xiphias gladius", family: "Xiphiidae", water_type: "Saltwater", regions: ["Mediterranean", "North Atlantic"], aliases: ["Broadbill", "Pez Espada", "Espadon", "Pesce spada"] },

  // Saltwater North Atlantic
  { common_name: "Atlantic Cod", scientific_name: "Gadus morhua", family: "Gadidae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Cod", "Codfish", "Kabeljau", "Cabillaud"] },
  { common_name: "Pollock", scientific_name: "Pollachius pollachius", family: "Gadidae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Saithe", "Coley", "Lieu jaune"] },
  { common_name: "Haddock", scientific_name: "Melanogrammus aeglefinus", family: "Gadidae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Schellfisch", "Églefin"] },
  { common_name: "Atlantic Mackerel", scientific_name: "Scomber scombrus", family: "Scombridae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Mackerel", "Maquereau", "Makrele", "Sgombro"] },
  { common_name: "Atlantic Halibut", scientific_name: "Hippoglossus hippoglossus", family: "Pleuronectidae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Halibut", "Heilbutt", "Flétan"] },
  { common_name: "European Plaice", scientific_name: "Pleuronectes platessa", family: "Pleuronectidae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Plaice", "Scholle", "Plie"] },
  { common_name: "Striped Bass", scientific_name: "Morone saxatilis", family: "Moronidae", water_type: "Saltwater", regions: ["North Atlantic"], aliases: ["Striper", "Rockfish", "Linesider", "Stripey"] },

  // Saltwater Tropical / Indo-Pacific
  { common_name: "Sailfish", scientific_name: "Istiophorus platypterus", family: "Istiophoridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"], aliases: ["Sail", "Spindlebeak"] },
  { common_name: "Blue Marlin", scientific_name: "Makaira nigricans", family: "Istiophoridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"], aliases: ["Marlin"] },
  { common_name: "Wahoo", scientific_name: "Acanthocybium solandri", family: "Scombridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"], aliases: ["Ono", "Hoo"] },
  { common_name: "Giant Trevally", scientific_name: "Caranx ignobilis", family: "Carangidae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific"], aliases: ["GT", "Ulua", "Trevally"] },
  { common_name: "Yellowfin Tuna", scientific_name: "Thunnus albacares", family: "Scombridae", water_type: "Saltwater", regions: ["Tropical / Indo-Pacific", "North Atlantic"], aliases: ["Ahi", "Yellowfin", "Thon jaune"] },

  // Brackish
  { common_name: "Common Snook", scientific_name: "Centropomus undecimalis", family: "Centropomidae", water_type: "Brackish", regions: ["Tropical / Indo-Pacific"], aliases: ["Snook", "Robalo", "Linesider"] },
  { common_name: "European Flounder", scientific_name: "Platichthys flesus", family: "Pleuronectidae", water_type: "Brackish", regions: ["North Atlantic", "Freshwater Europe"], aliases: ["Flounder", "Flunder", "Flet"] },
];
