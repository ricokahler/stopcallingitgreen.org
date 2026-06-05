# Stop Calling It Green

Public site for **Stop Calling It Green: How Cheap Power Got Dragged Into The Culture War**.

This is an Astro static book site for `stopcallingitgreen.org`. It is online-only, free, self-funded, and intentionally not a donation, merch, or foundation project.

## Local Development

```bash
npm install
npm run dev
```

The committed MDX files in `src/content/chapters` are the public book source.
If you keep a private manuscript elsewhere, regenerate the chapters explicitly:

```bash
export MANUSCRIPT_DIR=/path/to/private/manuscript
npm run migrate:manuscript
npm run build
npm run check:public-output
```

`npm run check:public-output` verifies that built public pages do not contain local paths, transcript filenames, Codex attachment paths, or private workspace breadcrumbs.

## Cloudflare Pages Direct Upload

The deploy path avoids dashboard-dependent publishing:

```bash
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_API_TOKEN=...
npm run deploy:cloudflare
```

That runs the Astro build, scans public output, and uploads `dist/` with Wrangler:

```bash
wrangler pages deploy dist --project-name stopcallingitgreen-org --branch main
```

## Optional Token Bootstrap

Cloudflare can create API tokens by API, but only after one bootstrap token exists. Create that first token in the dashboard with the **Create additional tokens** template. It should only need token-creation permission.

```bash
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_BOOTSTRAP_API_TOKEN=...
npm run cloudflare:create-deploy-token
```

The script creates an account-owned deploy token with Pages, Zone, and DNS write permissions. The secret is printed once. Put it into `CLOUDFLARE_API_TOKEN` or `TF_VAR_cloudflare_api_token`; do not commit it.

## Cloudflare Infrastructure

Cloudflare zone, DNS, Pages project, and custom domains live in `infra/cloudflare`.

```bash
cd infra/cloudflare
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

After `terraform apply`, copy the emitted Cloudflare nameservers into Namecheap unless registrar automation is configured.

Optional Namecheap automation:

```bash
export NAMECHEAP_API_USER=...
export NAMECHEAP_API_KEY=...
export NAMECHEAP_CLIENT_IP=...
export NAMECHEAP_DOMAIN=stopcallingitgreen.org
npm run registrar:nameservers -- ns1.cloudflare.com ns2.cloudflare.com
```

Namecheap API access often requires account enablement and IP allowlisting. If that is not available, changing the registrar nameservers is the one manual step.
