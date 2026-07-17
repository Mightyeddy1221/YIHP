"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|watch\?v=))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export default function VideoPlayer({ url, title }: { url: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const id = extractYouTubeId(url);

  useEffect(() => {
    if (!id || !containerRef.current) return;

    playerRef.current = new Plyr(containerRef.current, {
      controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "fullscreen"],
      youtube: { noCookie: true, rel: 0, iv_load_policy: 3, modestbranding: 1 },
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [id]);

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
