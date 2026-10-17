/** Filter both relationships and their visible evidence without changing the report. */
export function filterConnections(scan, query, category) {
  const search = query.trim().toLowerCase();
  const allowed = new Set(
    scan.signals
      .filter((signal) => category === "all" || signal.category === category)
      .map((signal) => signal.id),
  );
  return scan.connections
    .filter((connection) => connection.domain.toLowerCase().includes(search))
    .map((connection) => ({
      ...connection,
      sharedSignalIds: connection.sharedSignalIds.filter((id) =>
        allowed.has(id),
      ),
    }))
    .filter((connection) => connection.sharedSignalIds.length > 0);
}
