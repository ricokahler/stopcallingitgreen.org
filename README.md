# Stop Calling It Green

This is the public home of **Stop Calling It Green: How Cheap Power Got Dragged Into The Culture War**.

The book is free, online-only, self-funded, and meant to be easy to inspect. There is no donation page, merch table, or organization hiding behind it. It exists because the argument felt worth making, the tools were available, and the whole thing was small enough to ship in about a day.

Read it here:

[stopcallingitgreen.org](https://stopcallingitgreen.org)

## What This Is

This is a short public book about energy framing: why solar, wind, storage, transmission, and electrification keep getting treated like culture-war objects instead of ordinary infrastructure.

It pulls together public sources, clips, and source trails from creators and institutions including Climate Town, Technology Connections, Hank Green, EIA, IEA, EPA, Lazard, ABC News, and linked primary sources. The goal is not to sell anything. The goal is to make the argument easy to read, easy to check, and easy to share when it comes up naturally.

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
