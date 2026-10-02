import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { stampDeployment, verifyDeployment } from "./deployment.mjs";

const commit = "a".repeat(40);
const options = { attempts: 1, delayMs: 0 };

test("stamp records the full source commit in the published output", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "site-deployment-"));
  try {
    await stampDeployment(commit, directory);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, "deployment.json"), "utf8")), { commit });
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("a matching production commit succeeds", async () => {
  await verifyDeployment(commit, {
    ...options,
    fetch: async (url, request) => {
      assert.equal(url.origin, "https://stopcallingitgreen.org");
      assert.equal(url.searchParams.get("commit"), commit);
      assert.equal(request.cache, "no-store");
      assert.equal(request.redirect, "error");
      return Response.json({ commit });
    }
  });
});

test("HTTP 200 with an older deployment fails", async () => {
  await assert.rejects(verifyDeployment(commit, {
    ...options,
    fetch: async () => Response.json({ commit: "b".repeat(40) })
  }), /Production did not serve the expected deployment/);
});

test("a transient stale deployment is retried", async () => {
  let requests = 0;
  await verifyDeployment(commit, {
    attempts: 2,
    delayMs: 0,
    fetch: async () => Response.json({ commit: ++requests === 2 ? commit : "b".repeat(40) })
  });
  assert.equal(requests, 2);
});

test("missing output and network errors cannot pass verification", async () => {
  for (const fetch of [
    async () => new Response("Not found", { status: 404 }),
    async () => { throw new Error("Network unavailable"); },
    async () => new Response("<html>Old site</html>")
  ]) {
    await assert.rejects(verifyDeployment(commit, { ...options, fetch }), /Production did not serve the expected deployment/);
  }
});

test("an invalid commit cannot be stamped or verified", async () => {
  await assert.rejects(stampDeployment("main"), /full Git commit SHA/);
  await assert.rejects(verifyDeployment("main", options), /full Git commit SHA/);
});
