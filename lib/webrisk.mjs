/**
 * Optional REAL provider: Google Web Risk Lookup API.
 * Checks only https://hostname/ (not every page of the website).
 * Empty response means NOT LISTED, NEVER "safe".
 */
export async function lookupWebRisk(domain) {
  const key = process.env.GOOGLE_WEB_RISK_API_KEY;
  if (!key) return { status: 'not_configured', types: [] };
  const params = new URLSearchParams({ uri: `https://${domain}/`, key });
  params.append('threatTypes', 'SOCIAL_ENGINEERING');
  params.append('threatTypes', 'MALWARE');
  const endpoint = `https://webrisk.googleapis.com/v1/uris:search?${params}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    let response;
    try { response = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' }); }
    finally { clearTimeout(timeout); }
    if (!response.ok) return { status: 'unavailable', types: [] };
    const data = await response.json();
    const types = Array.isArray(data?.threat?.threatTypes) ? data.threat.threatTypes : [];
    return { status: types.length ? 'listed' : 'not_listed', types };
  } catch {
    return { status: 'unavailable', types: [] };
  }
}
