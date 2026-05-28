import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fishing Journal",
    short_name: "Fishing",
    description: "Personal fishing catch journal",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon0",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
