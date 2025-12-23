import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import FooterWrapper from "@/components/Common/Footer/FooterWrapper"; // ?. Import Footer
import ThemeRegistry from "@/theme/ThemeRegistry";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f7a52" />
        <link rel="icon" href="/images/greenpax-logo.svg" />
      </head>
      <body
        className={`${sora.variable} ${manrope.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <ThemeRegistry>
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
        </ThemeRegistry>
      </body>
    </html>
  );
}
