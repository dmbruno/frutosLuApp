import { useState } from 'react';
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from '../../lib/utils/youtube';

interface VideoEmbedProps {
  url: string;
  title?: string;
  rounded?: boolean;
}

export function VideoEmbed({ url, title, rounded = true }: VideoEmbedProps) {
  const [expanded, setExpanded] = useState(false);
  const embedUrl = getYoutubeEmbedUrl(url);
  const thumbnailUrl = getYoutubeThumbnailUrl(url);
  const roundedClass = rounded ? 'rounded-xl' : '';

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`mt-2 flex cursor-pointer items-center justify-center ${roundedClass} bg-brand-pink py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90`}
      >
        Ver video
      </a>
    );
  }

  if (expanded) {
    return (
      <div className={`mt-2 aspect-video overflow-hidden ${roundedClass}`}>
        <iframe
          src={`${embedUrl}?autoplay=1`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title ?? 'Video explicativo'}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded(true)}
      className={`group relative mt-2 flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden ${roundedClass} bg-brand-pink bg-cover bg-center text-white`}
      style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
    >
      <span className="absolute inset-0 bg-black/30" />
      <span className="relative flex flex-col items-center gap-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-brand-pink transition-transform group-hover:scale-110">
          ▶
        </span>
        <span className="text-sm font-semibold">Ver video explicativo</span>
      </span>
    </button>
  );
}
