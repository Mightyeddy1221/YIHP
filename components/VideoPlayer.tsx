function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|watch\?v=))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

/**
 * Standard YouTube embed. Uses YouTube's own player so viewers get the
 * familiar controls and can click through to watch on YouTube if they want.
 */
export default function VideoPlayer({
  url,
  title,
  autoplay = false,
}: {
  url: string;
  title?: string;
  autoplay?: boolean;
}) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  const params = new URLSearchParams({ rel: "0" });
  if (autoplay) params.set("autoplay", "1");

  return (
    <div className="border border-slate-200 bg-navy-950 overflow-hidden">
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${id}?${params.toString()}`}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
