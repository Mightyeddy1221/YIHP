"use client";

import { useEffect, useRef } from "react";
import type Plyr from "plyr";
import "plyr/dist/plyr.css";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|watch\?v=))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export default function VideoPlayer({ url, title, autoplay = false }: { url: string; title?: string; autoplay?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const id = extractYouTubeId(url);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    // Plyr touches `document` at import time, so it must load in the browser only —
    // a top-level import breaks static prerendering of pages that use this component.
    (async () => {
      const { default: PlyrLib } = await import("plyr");
      if (cancelled || !containerRef.current) return;
      playerRef.current = new PlyrLib(containerRef.current, {
        autoplay,
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "fullscreen"],
        youtube: { noCookie: true, rel: 0, iv_load_policy: 3, modestbranding: 1 },
      });
    })();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [id, autoplay]);

  if (!id) return null;

  return (
    <div className="border border-slate-200 bg-navy-950 overflow-hidden">
      <div className="aspect-video">
        <div
          ref={containerRef}
          data-plyr-provider="youtube"
          data-plyr-embed-id={id}
          aria-label={title ?? "Video"}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
