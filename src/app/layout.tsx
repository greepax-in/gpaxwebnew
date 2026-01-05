import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import FooterWrapper from "@/components/Common/Footer/FooterWrapper"; // ?. Import Footer
import * as fs from "fs";
import * as path from "path";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
        {/* CRITICAL HERO CSS — inline to unblock LCP */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .home-hero {
                padding-top: clamp(28px, 6vw, 72px);
                padding-bottom: clamp(32px, 6vw, 72px);
              }
              .hero-content {
                max-width: 560px;
              }
              .heroImage {
                display: block;
                border-radius: 20px;
              }
              .hero-primary-cta {
                margin-top: 16px;
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
        <link
          rel="preload"
          as="image"
          href="/images/home/hero/gpax-hero-final-400x500.avif"
          fetchPriority="high"
          imageSizes="(max-width: 900px) 94vw, 640px"
          type="image/avif"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f7a52" />
        <link rel="icon" href="/images/greenpax-logo.svg" />
      </head>
      <body
        className={`${sora.variable} ${manrope.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (entry.entryType === 'largest-contentful-paint') {
                    document.documentElement.dataset.lcpPainted = 'true';
                  }
                }
              }).observe({ type: 'largest-contentful-paint', buffered: true });
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
