import { useEffect, useState } from "react";

export type NaturalSize = { width: number; height: number };

export function useImageNaturalSize(src: string | undefined): NaturalSize | null {
  const [size, setSize] = useState<NaturalSize | null>(null);

  useEffect(() => {
    if (!src) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSize(null);
      return;
    }

    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      if (!cancelled) setSize(null);
    };

    img.src = src;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return size;
}
