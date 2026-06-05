variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages, Zone, and DNS permissions."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project and zone."
  type        = string
}

variable "zone_name" {
  description = "Apex domain for the site."
  type        = string
  default     = "stopcallingitgreen.org"
}

variable "pages_project_name" {
  description = "Cloudflare Pages project name."
  type        = string
  default     = "stopcallingitgreen-org"
}

variable "production_branch" {
  description = "Production branch name for the Pages project."
  type        = string
  default     = "main"
}

variable "create_dns_records" {
  description = "Create proxied apex and www CNAME records pointing to Pages."
  type        = bool
  default     = true
}
