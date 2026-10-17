import Link from "next/link";
import { ArrowLeft, Database, Fingerprint } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="content-page about-page">
      <Link className="back-link" href="/">
        <ArrowLeft size={15} />
        Back to search
      </Link>
      <div className="eyebrow">Methodology</div>
      <h1>
        Evidence,
        <br />
        <span className="muted">with context.</span>
      </h1>
      <p className="intro">
        TraceGraph is a research prototype for investigating website signals. It
        does not certify a business or guarantee a safe transaction.
      </p>
      <section className="section-block">
        <Fingerprint size={22} />
        <h2>What a check covers</h2>
        <p>
          We normalize the submitted address to a domain. Paths and query
          parameters are excluded. If Google Web Risk is configured, the lookup
          checks the root HTTPS address. TraceGraph does not visit the submitted
          website.
        </p>
        <p>
          No match means the address was not found in the queried threat lists.
          It does not mean the site is safe. A disconnected or unavailable
          source is reported separately.
        </p>
      </section>
      <section className="section-block">
        <Database size={22} />
        <h2>Where connections come from</h2>
        <p>
          The current network uses three fictional domains:
          aurora-deals.example, nova-outlet.example, and polar-shop.example.
          Shared images and text come from a synthetic dataset. Live
          relationship data is not connected.
        </p>
        <p>
          A shared signal may suggest a relationship, but does not verify common
          ownership. Even common ownership would not establish a threat. We do
          not assign an unsupported risk score.
        </p>
      </section>
      <section className="section-block">
        <h2>Timestamps and storage</h2>
        <p>
          The report timestamp records when your browser received the response.
          The API does not provide the source observation date. These are
          different timestamps, and we do not substitute one for the other.
        </p>
        <p>
          The latest report stays in this tab’s memory until you reload. This
          prototype has no persistent investigation history. When configured,
          Google Web Risk receives the normalized HTTPS address.
        </p>
      </section>
      <Link className="text-link" href="/">
        Start an investigation →
      </Link>
    </div>
  );
}
