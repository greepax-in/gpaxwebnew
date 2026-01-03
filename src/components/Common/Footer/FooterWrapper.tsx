// CODEX_PATCH_BEGIN
// FILE: src/components/Common/Footer/FooterWrapper.tsx

import styles from "./FooterWrapper.module.css";

export default function FooterWrapper(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <nav className={styles.nav} aria-label="Footer navigation">
        <a className={styles.link} href="/paper-bags">
          Paper Bags
        </a>
        <a className={styles.link} href="/paper-covers">
          Paper Covers
        </a>
        <a className={styles.link} href="/paper-boxes">
          Paper Boxes
        </a>
      </nav>

      <p className={styles.copy}>© {year} GreenPax. All rights reserved.</p>
    </footer>
  );
}

// CODEX_PATCH_END
