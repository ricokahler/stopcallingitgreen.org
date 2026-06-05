import process from "node:process";

const env = process.env;
const domain = env.NAMECHEAP_DOMAIN || "stopcallingitgreen.org";
const nameservers =
  process.argv.slice(2).join(",") || env.NAMECHEAP_NAMESERVERS || "";

const required = [
  "NAMECHEAP_API_USER",
  "NAMECHEAP_API_KEY",
  "NAMECHEAP_CLIENT_IP"
];

const missing = required.filter((name) => !env[name]);
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

if (!nameservers.trim()) {
  console.error(
    "Provide nameservers as arguments or NAMECHEAP_NAMESERVERS=ns1,ns2."
  );
  process.exit(1);
}

const parts = domain.split(".");
if (parts.length < 2) {
  console.error(`Invalid NAMECHEAP_DOMAIN: ${domain}`);
  process.exit(1);
}

const tld = parts.pop();
const sld = parts.join(".");
const endpoint =
  env.NAMECHEAP_SANDBOX === "true"
    ? "https://api.sandbox.namecheap.com/xml.response"
    : "https://api.namecheap.com/xml.response";

const params = new URLSearchParams({
  ApiUser: env.NAMECHEAP_API_USER,
  ApiKey: env.NAMECHEAP_API_KEY,
  UserName: env.NAMECHEAP_USERNAME || env.NAMECHEAP_API_USER,
  ClientIp: env.NAMECHEAP_CLIENT_IP,
  Command: "namecheap.domains.dns.setCustom",
  SLD: sld,
  TLD: tld,
  NameServers: nameservers
});

const response = await fetch(`${endpoint}?${params}`);
const text = await response.text();

if (!response.ok || /Status="ERROR"/.test(text) || /<Errors>[\s\S]*?<Error/.test(text)) {
  console.error("Namecheap nameserver update failed:");
  console.error(text);
  process.exit(1);
}

console.log(`Requested Namecheap nameserver update for ${domain}:`);
console.log(nameservers);
