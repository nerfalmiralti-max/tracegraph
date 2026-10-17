import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Workspace } from "../components/workspace";
import "./globals.css";

export const viewport: Viewport = { themeColor: "#16191f" };

export const metadata: Metadata = {
  title: "TraceGraph — Domain intelligence",
  description:
    "Investigate domains, review risk signals, and explore the evidence behind website connections.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={GeistSans.variable}>
      <body>
        <Workspace>{children}</Workspace>
      </body>
    </html>
  );
}
