/**
 * Convert user input to a hostname without fetching the target website.
 * Security boundary: accept public DNS names only; refuse credentials, IPs,
 * explicit ports and local hostnames. Full URL paths are intentionally dropped.
 */
export function normalizeDomain(input) {
  if (typeof input !== 'string') throw new Error("Enter a website address.");
  const raw = input.trim();
  if (!raw || raw.length > 2048) throw new Error("Enter a website address of 2,048 characters or fewer.");
  if (!/^https?:\/\//i.test(raw) && /^[a-z][a-z\d+.-]*:\/\//i.test(raw)) {
    throw new Error("Use an HTTP or HTTPS address.");
  }
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new Error("We couldn’t recognize that address.");
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) {
    throw new Error("Enter a website address without credentials or a custom port.");
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
    throw new Error("Local addresses aren’t supported.");
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':') || host.startsWith('[')) {
    throw new Error("Enter a domain name rather than an IP address.");
  }
  if (host.length > 253 || !host.includes('.') || !host.split('.').every(label =>
    label.length >= 1 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  )) {
    throw new Error("Enter a valid domain name.");
  }
  if (/^\d+$/.test(host.split('.').at(-1) ?? '')) {
    throw new Error("Enter a domain with a valid extension.");
  }
  return host;
}
