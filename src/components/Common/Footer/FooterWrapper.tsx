'use client';

import { useEffect, useState } from 'react';
import Footer from '../../Home/Footer/page';

export default function FooterWrapper() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait a short delay to let main content hydrate
    const timeout = setTimeout(() => setReady(true), 30);
    return () => clearTimeout(timeout);
  }, []);

  if (!ready) return null;
  return <Footer />;
}
