import process from "node:process";
import { spawnSync } from "node:child_process";

const apiBase = "https://api.cloudflare.com/client/v4";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const bootstrapToken = process.env.CLOUDFLARE_BOOTSTRAP_API_TOKEN;
const tokenName =
  process.env.CLOUDFLARE_DEPLOY_TOKEN_NAME || "stopcallingitgreen-org-pages-ci";
const expiresOn = process.env.CLOUDFLARE_DEPLOY_TOKEN_EXPIRES_ON;
const args = new Set(process.argv.slice(2));
const storeInGitHub = args.has("--github") || process.env.GITHUB_STORE_SECRETS === "1";
const printToken = args.has("--print-token") || process.env.PRINT_TOKEN === "1";
const githubRepository =
  process.env.GITHUB_REPOSITORY || "ricokahler/stopcallingitgreen.org";

if (!accountId || !bootstrapToken) {
  console.error(
    "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_BOOTSTRAP_API_TOKEN before running this script."
  );
  process.exit(1);
}

if (!storeInGitHub && !printToken) {
  console.error(
    "Choose an output mode: pass --github to store secrets with gh, or --print-token for a manual one-time token print."
  );
  process.exit(1);
}

if (storeInGitHub) {
  const ghStatus = spawnSync("gh", ["auth", "status", "-h", "github.com"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (ghStatus.status !== 0) {
    console.error(
      "GitHub CLI is not authenticated. Run `gh auth login -h github.com`, then rerun this script with --github."
    );
    process.exit(1);
  }
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

const permissionGroups = await cloudflare("/user/tokens/permission_groups");

const pagesWrite = findPermission(
  permissionGroups,
  ["Pages Write", "Cloudflare Pages Write", "Pages Edit", "Cloudflare Pages Edit"],
  "com.cloudflare.api.account"
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
    }
  ]
};

if (expiresOn) payload.expires_on = expiresOn;

const created = await cloudflare("/user/tokens", {
  method: "POST",
  body: JSON.stringify(payload)
});

if (!created.value) {
  console.error("Token was created but Cloudflare did not return a secret value.");
  console.error(JSON.stringify(created, null, 2));
  process.exit(1);
}

function ghSecretSet(name, value) {
  const result = spawnSync(
    "gh",
    ["secret", "set", name, "--repo", githubRepository, "--body", value],
    {
      encoding: "utf8",
      stdio: "pipe"
    }
  );

  if (result.status !== 0) {
    console.error(`Failed to set GitHub secret ${name}.`);
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
}

if (storeInGitHub) {
  ghSecretSet("CLOUDFLARE_ACCOUNT_ID", accountId);
  ghSecretSet("CLOUDFLARE_API_TOKEN", created.value);
  console.log(
    `Created Cloudflare Pages deploy token and stored it in GitHub Secrets for ${githubRepository}.`
  );
  console.log(`Token name: ${tokenName}`);
  console.log("Revoke the short-lived bootstrap token when you are done.");
} else if (printToken) {
  console.log("Created Cloudflare deploy token. The secret is shown once:");
  console.log("");
  console.log(`export CLOUDFLARE_ACCOUNT_ID=${accountId}`);
  console.log(`export CLOUDFLARE_API_TOKEN=${created.value}`);
  console.log("");
  console.log("Do not commit this token. Revoke the bootstrap token when you are done.");
}
