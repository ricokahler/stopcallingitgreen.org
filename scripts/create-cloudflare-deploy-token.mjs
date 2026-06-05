import process from "node:process";

const apiBase = "https://api.cloudflare.com/client/v4";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const bootstrapToken = process.env.CLOUDFLARE_BOOTSTRAP_API_TOKEN;
const tokenName =
  process.env.CLOUDFLARE_DEPLOY_TOKEN_NAME || "stopcallingitgreen-org-deploy";
const expiresOn = process.env.CLOUDFLARE_DEPLOY_TOKEN_EXPIRES_ON;

if (!accountId || !bootstrapToken) {
  console.error(
    "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_BOOTSTRAP_API_TOKEN before running this script."
  );
  process.exit(1);
}

async function cloudflare(pathname, options = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${bootstrapToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const json = await response.json();

  if (!response.ok || !json.success) {
    console.error(
      `Cloudflare API request failed: ${options.method || "GET"} ${pathname}`
    );
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  return json.result;
}

function normalizeName(name) {
  return name.toLowerCase().replace(/^cloudflare\s+/, "");
}

function findPermission(groups, names, scope) {
  const normalizedNames = new Set(names.map(normalizeName));
  const match = groups.find(
    (group) =>
      normalizedNames.has(normalizeName(group.name || "")) &&
      Array.isArray(group.scopes) &&
      group.scopes.includes(scope)
  );

  if (!match) {
    console.error(
      `Could not find Cloudflare permission group for: ${names.join(", ")}`
    );
    console.error(
      "Run the script with a bootstrap token that can list token permission groups."
    );
    process.exit(1);
  }

  return { id: match.id, name: match.name };
}

const permissionGroups = await cloudflare(
  `/accounts/${accountId}/tokens/permission_groups`
);

const pagesWrite = findPermission(
  permissionGroups,
  ["Pages Write", "Cloudflare Pages Write", "Pages Edit", "Cloudflare Pages Edit"],
  "com.cloudflare.api.account"
);
const dnsWrite = findPermission(
  permissionGroups,
  ["DNS Write", "DNS Edit"],
  "com.cloudflare.api.account.zone"
);
const zoneWrite = findPermission(
  permissionGroups,
  ["Zone Write", "Zone Edit"],
  "com.cloudflare.api.account.zone"
);

const payload = {
  name: tokenName,
  policies: [
    {
      effect: "allow",
      resources: {
        [`com.cloudflare.api.account.${accountId}`]: "*"
      },
      permission_groups: [pagesWrite]
    },
    {
      effect: "allow",
      resources: {
        [`com.cloudflare.api.account.${accountId}`]: {
          "com.cloudflare.api.account.zone.*": "*"
        }
      },
      permission_groups: [dnsWrite, zoneWrite]
    }
  ]
};

if (expiresOn) payload.expires_on = expiresOn;

const created = await cloudflare(`/accounts/${accountId}/tokens`, {
  method: "POST",
  body: JSON.stringify(payload)
});

if (!created.value) {
  console.error("Token was created but Cloudflare did not return a secret value.");
  console.error(JSON.stringify(created, null, 2));
  process.exit(1);
}

console.log("Created Cloudflare deploy token. The secret is shown once:");
console.log("");
console.log(`export CLOUDFLARE_ACCOUNT_ID=${accountId}`);
console.log(`export CLOUDFLARE_API_TOKEN=${created.value}`);
console.log(`export TF_VAR_cloudflare_account_id=${accountId}`);
console.log(`export TF_VAR_cloudflare_api_token=${created.value}`);
console.log("");
console.log("Do not commit this token. Revoke the bootstrap token when you are done.");
