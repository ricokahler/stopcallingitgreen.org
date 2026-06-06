import { spawnSync } from "node:child_process";
import process from "node:process";

const repository = process.env.GITHUB_REPOSITORY || "ricokahler/stopcallingitgreen.org";

function runGh(args) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
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
  "-f",
  "allow_squash_merge=true",
  "-f",
  "allow_merge_commit=false",
  "-f",
  "allow_rebase_merge=false",
  "-f",
  "delete_branch_on_merge=true",
  "-f",
  "squash_merge_commit_title=PR_TITLE",
  "-f",
  "squash_merge_commit_message=PR_BODY"
]);

console.log(`Configured ${repository} for squash-only pull request merges.`);
