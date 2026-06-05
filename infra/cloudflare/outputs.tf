output "cloudflare_name_servers" {
  description = "Nameservers to set at Namecheap for the Cloudflare zone."
  value       = cloudflare_zone.site.name_servers
}

output "pages_project" {
  description = "Cloudflare Pages project name."
  value       = cloudflare_pages_project.site.name
}

output "pages_dev_url" {
  description = "Default Cloudflare Pages development URL."
  value       = "https://${cloudflare_pages_project.site.name}.pages.dev"
}

output "custom_domains" {
  description = "Custom domains attached to the Pages project."
  value = [
    cloudflare_pages_domain.apex.domain,
    cloudflare_pages_domain.www.domain
  ]
}
