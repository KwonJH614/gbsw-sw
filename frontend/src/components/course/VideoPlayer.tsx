import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  startPosition?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  return match ? match[1] : null;
}

export default function VideoPlayer({
  videoUrl,
  startPosition = 0,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
}: VideoPlayerProps) {
  const youtubeId = extractYouTubeId(videoUrl);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!youtubeId) return;

    const loadPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          start: Math.floor(startPosition),
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              onPlay?.();
              intervalRef.current = setInterval(() => {
                if (playerRef.current?.getCurrentTime) {
                  onTimeUpdate?.(playerRef.current.getCurrentTime());
                }
              }, 5000);
            } else {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              if (event.data === window.YT.PlayerState.PAUSED) {
                if (playerRef.current?.getCurrentTime) {
                  onTimeUpdate?.(playerRef.current.getCurrentTime());
                }
                onPause?.();
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                if (playerRef.current?.getDuration) {
                  onTimeUpdate?.(playerRef.current.getDuration());
                }
                onEnded?.();
              }
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      (window as unknown as Record<string, () => void>).onYouTubeIframeAPIReady = loadPlayer;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
    };
  }, [youtubeId]);

  if (!youtubeId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-900 text-white">
        지원하지 않는 영상 형식입니다.
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-black">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
