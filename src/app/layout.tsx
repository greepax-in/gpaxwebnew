import "./globals.css";
import "../styles/sections.css";
import FooterWrapper from "@/components/Common/Footer/FooterWrapper"; // ?. Import Footer

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* LCP HERO PRELOAD — authoritative mobile hint */}
        {/* Desktop-only hero image preload */}
        <link
          rel="preload"
          as="image"
          href="/images/home/hero/printed-kraft-square-bottom-paper-bags.avif"
          media="(min-width: 900px)"
          fetchPriority="high"
          type="image/avif"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f7a52" />
        <link rel="icon" href="/images/greenpax-logo.svg" />
      </head>
      <body>
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
