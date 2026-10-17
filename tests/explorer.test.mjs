import test from "node:test";
import assert from "node:assert/strict";
import { filterConnections } from "../lib/explorer.mjs";
import { findDemoConnections } from "../lib/graph.mjs";

const scan = findDemoConnections("aurora-deals.example");
test("category filter counts only matching evidence for each relationship", () => {
  const result = filterConnections(scan, "", "asset");
  assert.deepEqual(result, [
    { domain: "nova-outlet.example", sharedSignalIds: ["hero-image-demo"] },
  ]);
  assert.equal(
    scan.connections[0].sharedSignalIds.length,
    2,
    "filter must not mutate the report",
  );
});
test("domain query and category combine, with whitespace and case ignored", () => {
  assert.deepEqual(filterConnections(scan, " POLAR ", "text"), [
    { domain: "polar-shop.example", sharedSignalIds: ["returns-text-demo"] },
  ]);
  assert.deepEqual(filterConnections(scan, "polar", "asset"), []);
});
test("empty reports and searches without matches stay empty", () => {
  assert.deepEqual(
    filterConnections({ connections: [], signals: [] }, "", "all"),
    [],
  );
  assert.deepEqual(filterConnections(scan, "missing", "all"), []);
});
