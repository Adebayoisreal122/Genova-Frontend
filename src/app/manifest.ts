import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Genova AI",
    short_name: "Genova",
    description: "Generate images, remove backgrounds and upscale — in one studio.",
    start_url: "/dashboard",
    display: "standalone",
    theme_color: "#050508",
    background_color: "#050508",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
