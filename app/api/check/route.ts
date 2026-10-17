import { normalizeDomain } from '../../../lib/domain.mjs';
import { findDemoConnections } from '../../../lib/graph.mjs';
import { lookupWebRisk } from '../../../lib/webrisk.mjs';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); }
  catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  let domain: string;
  try { domain = normalizeDomain((payload as { url?: unknown })?.url); }
  catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Enter a valid website address." }, { status: 400 });
  }
  const demo = findDemoConnections(domain);
  // .example is reserved for documentation; do not send synthetic domains to provider.
  const reputation = demo.demo || domain.endsWith('.example')
    ? { status: 'not_configured', types: [] }
    : await lookupWebRisk(domain);
  return Response.json({
    domain,
    demo: demo.demo,
    connections: demo.connections,
    signals: demo.signals,
    reputation,
    status: reputation.status === 'listed' ? 'known_threat' : demo.demo ? 'demo_links' : 'insufficient_data',
    note: "No match does not establish safety. Network connections in this research preview are demonstration data."
  }, { headers: { 'Cache-Control': 'no-store' } });
}
