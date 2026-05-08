import type { MetadataRoute } from "next";

// PWA manifest. Makes the platform installable on phones and desktops —
// when added to the home screen / installed via the browser, it opens
// in standalone mode without browser chrome, so the app shell is the
// whole experience.
//
// The icon at /icon comes from app/icon.svg via Next's metadata file
// conventions. The brand-true forest background matches the app shell
// so launch is seamless.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Black Dog · The Founder Platform",
    short_name: "Black Dog",
    description:
      "Pitch. Score. Fund. Scott Kelly's operator-investor judgment as a founder platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1410",
    theme_color: "#0a1410",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["business", "education", "productivity"],
  };
}
