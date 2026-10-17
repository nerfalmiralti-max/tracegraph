// The current API has no independent verification metadata. Do not infer it
// from signal strength, the number of matches, or a reputation verdict.
export function connectionConfidence(demo) {
  return demo
    ? { label: "Demo connection", kind: "demo" }
    : { label: "Inferred · unverified", kind: "inferred" };
}

export function relationshipLabel(ids, signals) {
  const categories = new Set(
    signals
      .filter((signal) => ids.includes(signal.id))
      .map((signal) => signal.category),
  );
  if (categories.has("asset") && categories.has("text")) return "Image + text";
  if (categories.has("asset")) return "Shared image";
  if (categories.has("text")) return "Shared text";
  return "Shared signal";
}
