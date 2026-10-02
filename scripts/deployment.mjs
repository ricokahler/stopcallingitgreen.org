import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout } from "node:timers/promises";

function requireCommit(commit) {
  if (!/^[a-f0-9]{40}$/.test(commit || "")) {
    throw new Error("Deployment requires a full Git commit SHA.");
  }
}

export async function stampDeployment(commit, outputDirectory = "dist") {
  requireCommit(commit);
  await writeFile(
    path.join(outputDirectory, "deployment.json"),
    `${JSON.stringify({ commit })}\n`
  );
}

export async function verifyDeployment(commit, {
  siteUrl = "https://stopcallingitgreen.org",
  attempts = 12,
  delayMs = 10_000,
  fetch = globalThis.fetch,
  sleep = setTimeout
} = {}) {
  requireCommit(commit);
  const url = new URL("/deployment.json", siteUrl);
  url.searchParams.set("commit", commit);
  let reason;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10_000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const deployment = await response.json();
      if (deployment.commit === commit) {
        console.log(`Verified ${commit} on ${url.origin}.`);
        return;
      }
      reason = `Expected ${commit}; received ${deployment.commit || "no commit"}.`;
    } catch (error) {
      reason = error.message;
    }
    console.log(`Production verification ${attempt}/${attempts}: ${reason}`);
    if (attempt < attempts) await sleep(delayMs);
  }
  throw new Error(`Production did not serve the expected deployment: ${reason}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const commit = process.env.GITHUB_SHA ||
      execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (process.argv[2] === "stamp") {
      await stampDeployment(commit);
    } else if (process.argv[2] === "verify") {
      await verifyDeployment(commit);
    } else {
      throw new Error("Usage: node scripts/deployment.mjs <stamp|verify>");
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
