terraform {
  required_version = ">= 1.6.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.52"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_zone" "site" {
  account_id = var.cloudflare_account_id
  zone       = var.zone_name
  type       = "full"
}

resource "cloudflare_pages_project" "site" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = var.production_branch
}

resource "cloudflare_record" "apex_pages" {
  count   = var.create_dns_records ? 1 : 0
  zone_id = cloudflare_zone.site.id
  name    = "@"
  type    = "CNAME"
  value   = "${cloudflare_pages_project.site.name}.pages.dev"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www_pages" {
  count   = var.create_dns_records ? 1 : 0
  zone_id = cloudflare_zone.site.id
  name    = "www"
  type    = "CNAME"
  value   = "${cloudflare_pages_project.site.name}.pages.dev"
  proxied = true
  ttl     = 1
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.site.name
  domain       = var.zone_name
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.site.name
  domain       = "www.${var.zone_name}"
}
