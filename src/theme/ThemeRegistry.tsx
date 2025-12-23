// FILE: src/theme/ThemeRegistry.tsx

"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useServerInsertedHTML } from "next/navigation";
import theme from "@/theme/theme";

type ThemeRegistryProps = {
  children: React.ReactNode;
};

export default function ThemeRegistry({
  children,
}: ThemeRegistryProps): JSX.Element {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "mui", prepend: true });
    cache.compat = true;
    const originalInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1] as { name: string };
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return originalInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    names.forEach((name) => {
      styles += cache.inserted[name];
    });

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
