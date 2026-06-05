import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://stopcallingitgreen.org",
  integrations: [mdx()]
});
