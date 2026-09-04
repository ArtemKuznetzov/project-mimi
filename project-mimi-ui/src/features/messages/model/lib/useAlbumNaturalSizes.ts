import { useEffect, useState, useRef } from "react";
import type { NaturalSize } from "./useImageNaturalSize";

export function useAlbumNaturalSizes(sources: string[]): (NaturalSize | null)[] {
  const [sizes, setSizes] = useState<(NaturalSize | null)[]>([]);
  const currentVersion = useRef(0);

  useEffect(() => {
    if (sources.length === 0) {
      setSizes([]);
      return;
    }

    // Version of the effect. Race conditions fix
    currentVersion.current += 1;
    const version = currentVersion.current;

    // Sync size with new sources appeared
    setSizes(new Array(sources.length).fill(null));

    sources.forEach((src, index) => {
      const img = new Image();

      img.onload = () => {
        // Ignore the result if photo changed during the async load
        if (version !== currentVersion.current) return;

        setSizes((prev) => {
          const next = [...prev];
          next[index] = { width: img.naturalWidth, height: img.naturalHeight };
          return next;
        });
      };

      img.onerror = () => {
        if (version !== currentVersion.current) return;
      };

      img.src = src;
    });

    return () => {
      currentVersion.current += 1;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sources)]);

  return sizes;
}