"use client";

import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|watch\?v=))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

/**
 * Video preview for listing cards (homepage, article index).
 * Shows the YouTube thumbnail with a play button; clicking swaps in the
 * real player and starts playback — without navigating to the article.
 */
export default function InlineVideo({ url, title }: { url: string; title?: string }) {
  const [playing, setPlaying] = useState(false);
  const id = extractYouTubeId(url);
  if (!id) return null;

  if (playing) {
    return <VideoPlayer url={url} title={title} autoplay />;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setPlaying(true);
      }}
      className="relative block w-full aspect-video overflow-hidden bg-navy-950 group/video cursor-pointer"
      aria-label={title ? `Play video: ${title}` : "Play video"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails are external and already CDN-optimized */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <span className="absolute inset-0 bg-navy-950/20 group-hover/video:bg-navy-950/10 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-14 h-14 rounded-full bg-gold-500 group-hover/video:bg-gold-400 transition-colors flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
