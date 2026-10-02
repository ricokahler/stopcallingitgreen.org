# Stop Calling It Green

This is the public home of **Stop Calling It Green: How Cheap Power Got Dragged Into The Culture War**.

The book is free, online-only, self-funded, and meant to be easy to inspect. There is no donation page, merch table, or organization hiding behind it. It exists because the argument felt worth making and the tools were available. The first version shipped in about a day; later editions were rewritten, re-checked, and redesigned.

Read it here:

[stopcallingitgreen.org](https://stopcallingitgreen.org)

## What This Is

This is a short public book about energy framing: why solar, wind, storage, transmission, and electrification keep getting treated like culture-war objects instead of ordinary infrastructure.

It pulls together public sources, clips, and source trails from creators and institutions including Climate Town, Technology Connections, Hank Green, EIA, IEA, FERC and NERC, Lazard, OpenSecrets, and linked primary sources. The goal is not to sell anything. The goal is to make the argument easy to read, easy to check, and easy to share when it comes up naturally.

## How The Site Is Built

Astro static site, no framework on the client. Chapters are MDX in `src/content/chapters`; the loader in `src/lib/chapters.ts` adds reading time, word counts, and section headings for the in-page outline.

- `src/styles/` holds the design system: `tokens.css` (light and dark palettes, type stacks), `chrome.css` (header, footer, nav), `home.css`, `reader.css`, `figures.css`.
- `src/components/VisualFigure.astro` renders bar figures that animate in, with a table view. When every item has the same size it renders as a list of facts instead of pretending to be a chart.
- `src/components/MixExplorer.astro`, `LandCompare.astro`, and `ChainCompare.astro` are the interactive explainers. Their data is inline and sourced in place.
- `src/components/VideoCard.astro` is a click-to-load YouTube facade, so chapter pages don't load player iframes until asked.
- Chapter pages remember which chapters have been read (browser localStorage only; nothing is sent anywhere) and support left/right arrow keys.
- `src/pages/social-card.astro` is the template for `public/og/stop-calling-it-green.png`; regenerate the PNG with a 1200x630 screenshot after changing it.

## Contributing

Small corrections are welcome, especially:

- factual fixes
- broken links
- source improvements
- typos
- clearer wording

Please keep the tone plain, unsmug, and useful. The point is to make the evidence easier to see, not to win a personality contest.

## Publishing

The site deploys automatically to Cloudflare Pages when `main` changes.

Pull requests run the build, deployment-verification tests, and public-output check. After a merge, the same workflow publishes the site and checks that `https://stopcallingitgreen.org/deployment.json` reports the merged commit. Missing credentials, failed uploads, and a stale public domain fail the workflow instead of silently skipping publication. Production deployments run in sequence so an older upload cannot replace a newer one.

Maintainer notes:

```bash
npm install
npm run dev
npm run build
npm run check:public-output
```

The public book source lives in `src/content/chapters`. The output checker makes sure built pages do not leak local paths, transcript filenames, Codex attachment paths, or private workspace breadcrumbs.

## CI Setup

One-time Cloudflare/GitHub setup:

```bash
export CLOUDFLARE_ACCOUNT_ID=ecb7ce0640e8a8a41ace64ad027f9523
export CLOUDFLARE_BOOTSTRAP_API_TOKEN=...
npm run cloudflare:create-deploy-token -- --github
npm run github:configure
```

The bootstrap token should be short-lived and only needs to create another Cloudflare API token. The script creates a least-privilege Cloudflare Pages deploy token, stores it in GitHub Secrets, and does not print the secret.

`npm run github:configure` makes pull requests squash-only, turns on automatic branch cleanup after merges, and disables the old GitHub Pages site so Cloudflare is the only deployment path.
