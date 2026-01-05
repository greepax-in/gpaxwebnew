import "./globals.css";
import FooterWrapper from "@/components/Common/Footer/FooterWrapper"; // ?. Import Footer
import * as fs from "fs";
import * as path from "path";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heroCriticalCSS = fs.readFileSync(
    path.join(process.cwd(), "src/styles/hero-critical.css"),
    "utf8"
  );
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: heroCriticalCSS }}
        />
        {/* CRITICAL HERO CSS - inline to unblock LCP */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* LCP CRITICAL — TEXT ONLY */
              .home-hero {
                padding-top: 20px;
              }
              .hero-content {
                max-width: 560px;
              }
              .heroTitle {
                font-size: clamp(2.6rem, 6.8vw, 3.1rem);
                line-height: 1.04;
                margin: 0 0 8px;
              }
              .heroLead {
                font-size: 1.05rem;
                line-height: 1.6;
                margin: 0;
              }

              @media (max-width: 768px) {
                .hero {
                  min-height: 100vh;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                }

                .hero-primary-cta--abovefold {
                  margin-top: 12px;
                }
                /* Reduce the hero top padding on narrow mobile to keep primary CTA above the fold
                   This is a minimal, server-safe change that preserves desktop layout and LCP optimizations. */
                @media (max-width: 480px) {
                  .home-hero {
                    padding-top: clamp(12px, 4vw, 28px);
                  }
                }
              }
            `,
          }}
        />
        {/* LCP HERO PRELOAD — authoritative mobile hint */}
        {/* Desktop-only hero image preload */}
        <link
          rel="preload"
          as="image"
          href="/images/home/hero/gpax-hero-final-400x500.avif"
          media="(min-width: 900px)"
          fetchPriority="high"
          type="image/avif"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f7a52" />
        <link rel="icon" href="/images/greenpax-logo.svg" />
      </head>
      <body>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* === MOBILE LCP HARD LOCK (TEXT ONLY) === */
              @media (max-width: 768px) {
                .home-hero {
                  padding-top: 16px;
                }

                .hero-content {
                  max-width: 560px;
                }

                .heroTitle {
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                  font-size: clamp(2.4rem, 7vw, 3rem);
                  line-height: 1.04;
                  letter-spacing: -0.02em;
                  margin: 0 0 8px;
                }

                .heroLead {
                  font-size: 1.05rem;
                  line-height: 1.6;
                  margin: 0;
                }
              }
            `,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <main style={{ flexGrow: 1 }}>{children}</main>
          <FooterWrapper />
        </div>
      </body>
    </html>
  );
}
