import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
process.env.AURA_TEST_MODE = "1";
process.env.GEMINI_API_KEY = "";
const { app } = await import("../server");
let server: Server;
let url: string;
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test address");
  url = `http://127.0.0.1:${address.port}`;
});
after(async () => { await new Promise<void>((resolve) => server.close(() => resolve())); });
const post = (body: unknown) => fetch(`${url}/api/affirmation`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});

test("offline reflection has explicit provenance and complete content", async () => {
  const health = await (await fetch(`${url}/api/health`)).json();
  assert.equal(health.affirmationMode, "curated");
  const response = await post({category:"productivity",customFocus:"Writing"});
  assert.equal(response.status,200);
  const body = await response.json();
  assert.equal(body.source,"curated");
  assert.equal(body.wellnessPoints.length,3);
  assert.match(body.text,/Writing/);
  assert.equal(typeof body.ritual,"string");
});
test("invalid JSON field types and oversized focus are rejected", async () => {
  for (const input of [null,[],{mood:42},{customFocus:"x".repeat(1001)},{category:{}}]) {
    assert.equal((await post(input)).status,400);
  }
});
