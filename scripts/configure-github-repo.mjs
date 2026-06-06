import { spawnSync } from "node:child_process";
import process from "node:process";

const repository = process.env.GITHUB_REPOSITORY || "ricokahler/stopcallingitgreen.org";

function runGh(args, options = {}) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
    if (options.allowFailure) return result;
    console.error(`gh ${args.join(" ")} failed`);
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }

  return result.stdout;
}

runGh(["auth", "status", "-h", "github.com"]);

runGh([
  "api",
  "-X",
  "PATCH",
  `repos/${repository}`,
  "-F",
  "allow_squash_merge=true",
  "-F",
  "allow_merge_commit=false",
  "-F",
  "allow_rebase_merge=false",
  "-F",
  "delete_branch_on_merge=true",
  "-f",
  "squash_merge_commit_title=PR_TITLE",
  "-f",
  "squash_merge_commit_message=PR_BODY"
]);

const disablePages = runGh(
  ["api", "-X", "DELETE", `repos/${repository}/pages`],
  { allowFailure: true }
);

if (disablePages.status === 0) {
  console.log(`Disabled GitHub Pages for ${repository}.`);
} else if (!/not found/i.test(disablePages.stderr || disablePages.stdout)) {
  console.warn("Could not disable GitHub Pages automatically:");
  console.warn(disablePages.stderr || disablePages.stdout);
}

console.log(`Configured ${repository} for squash-only pull request merges.`);
