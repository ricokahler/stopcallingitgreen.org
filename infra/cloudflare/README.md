# Cloudflare IaC

This directory manages Cloudflare infrastructure for `stopcallingitgreen.org`.

It creates:

- Cloudflare zone: `stopcallingitgreen.org`
- Cloudflare Pages project: `stopcallingitgreen-org`
- Apex and `www` Pages custom domains
- Proxied DNS records pointing to the Pages project

## Required Environment

The Cloudflare token should have account and zone permissions for Pages, Zone, and DNS read/edit.

```bash
export TF_VAR_cloudflare_account_id=...
export TF_VAR_cloudflare_api_token=...
```

or copy `terraform.tfvars.example` to `terraform.tfvars`.

## Apply

```bash
terraform init
terraform plan
terraform apply
```

The `cloudflare_name_servers` output is the registrar handoff. Set those nameservers in Namecheap, then deploy the site:

```bash
npm run deploy:cloudflare
```

## Optional Registrar Automation

If the Namecheap API is enabled and your client IP is allowlisted:

```bash
export NAMECHEAP_API_USER=...
export NAMECHEAP_API_KEY=...
export NAMECHEAP_CLIENT_IP=...
export NAMECHEAP_DOMAIN=stopcallingitgreen.org
npm run registrar:nameservers -- $(terraform output -json cloudflare_name_servers | jq -r '.[]')
```

If Namecheap API access is not enabled, update nameservers manually once in the Namecheap UI.
