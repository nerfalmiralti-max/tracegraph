import test from "node:test";
import assert from "node:assert/strict";
import { connectionConfidence, relationshipLabel } from "../lib/graph-view.mjs";

test("demo and inferred connections are never promoted to verified", () => {
  assert.deepEqual(connectionConfidence(true), {
    label: "Demo connection",
    kind: "demo",
  });
  assert.deepEqual(connectionConfidence(false), {
    label: "Inferred · unverified",
    kind: "inferred",
  });
});
test("edge label describes only evidence shared by this relationship", () => {
  const signals = [
    { id: "a", category: "asset" },
    { id: "t", category: "text" },
  ];
  assert.equal(relationshipLabel(["t"], signals), "Shared text");
  assert.equal(relationshipLabel(["a"], signals), "Shared image");
  assert.equal(relationshipLabel(["a", "t"], signals), "Image + text");
  assert.equal(relationshipLabel(["unknown"], signals), "Shared signal");
});
