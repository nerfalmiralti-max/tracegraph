/**
 * The following nodes and reports are INVENTED EXCLUSIVELY for UI/demo testing.
 * Reserved .example domains cannot be mistaken for real-world accusations.
 */
const fakeSignals = [
  { id: 'hero-image-demo', name: "Shared banner image", strength: 'weak', category: 'asset' },
  { id: 'returns-text-demo', name: "Matching returns policy", strength: 'weak', category: 'text' },
];
const fixtureDomains = [
  { domain: 'aurora-deals.example', signalIds: ['hero-image-demo', 'returns-text-demo'] },
  { domain: 'nova-outlet.example', signalIds: ['hero-image-demo', 'returns-text-demo'] },
  { domain: 'polar-shop.example', signalIds: ['returns-text-demo'] },
];

export function findDemoConnections(domain) {
  const current = fixtureDomains.find((item) => item.domain === domain);
  if (!current) return { demo: false, connections: [], signals: [] };
  const related = fixtureDomains
    .filter((item) => item.domain !== domain)
    .map((item) => {
      const common = item.signalIds.filter((id) => current.signalIds.includes(id));
      return { domain: item.domain, sharedSignalIds: common };
    })
    .filter((item) => item.sharedSignalIds.length > 0);
  return {
    demo: true,
    connections: related,
    signals: fakeSignals.filter((signal) => current.signalIds.includes(signal.id)),
  };
}
