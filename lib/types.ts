export type Scan = {
  domain: string;
  demo: boolean;
  connections: { domain: string; sharedSignalIds: string[] }[];
  signals: { id: string; name: string; strength: string; category: string }[];
  reputation: { status: string; types: string[] };
  status: string;
  note: string;
};
export type Report = Scan & { receivedAt: string };
