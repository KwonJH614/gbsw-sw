import { useEffect, useRef, useCallback } from 'react';

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

// YouTube iframe postMessage 기반 통신 (YT IFrame API 불필요)
export default function VideoPlayer({
  videoUrl,
  startPosition = 0,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
}: VideoPlayerProps) {
  const youtubeId = extractYouTubeId(videoUrl);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const callbackRefs = useRef({ onTimeUpdate, onPlay, onPause, onEnded });
  callbackRefs.current = { onTimeUpdate, onPlay, onPause, onEnded };

  const sendCommand = useCallback((func: string, args?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: args ? [args] : [] }),
      '*'
    );
  }, []);

  // postMessage 리스너로 YouTube 이벤트 수신
  useEffect(() => {
    if (!youtubeId) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://www.youtube.com') return;

      let data;
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }

      if (!data.event && !data.info) return;

      const info = data.info;
      if (!info) return;

      // 현재 시간 업데이트
      if (typeof info.currentTime === 'number') {
        currentTimeRef.current = info.currentTime;
      }
      if (typeof info.duration === 'number') {
        durationRef.current = info.duration;
      }

      // 상태 변경 감지
      if (typeof info.playerState === 'number') {
        const cbs = callbackRefs.current;
        switch (info.playerState) {
          case 1: // PLAYING
            cbs.onPlay?.();
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
              cbs.onTimeUpdate?.(currentTimeRef.current);
            }, 5000);
            break;
          case 2: // PAUSED
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            cbs.onTimeUpdate?.(currentTimeRef.current);
            cbs.onPause?.();
            break;
          case 0: // ENDED
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            cbs.onTimeUpdate?.(durationRef.current || currentTimeRef.current);
            cbs.onEnded?.();
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // iframe 로드 후 이벤트 리스닝 시작
    const iframe = iframeRef.current;
    const onLoad = () => {
      sendCommand('addEventListener', 'onStateChange');
      // 현재 시간을 주기적으로 받기 위해 listening 활성화
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    };

    iframe?.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('message', handleMessage);
      iframe?.removeEventListener('load', onLoad);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [youtubeId, sendCommand]);

  if (!youtubeId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-900 text-white">
        지원하지 않는 영상 형식입니다.
      </div>
    );
  }

  const origin = window.location.origin;
  const startParam = startPosition > 0 ? `&start=${Math.floor(startPosition)}` : '';
  const src = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&origin=${origin}&rel=0&modestbranding=1&widget_referrer=${origin}${startParam}`;

  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-black">
      <iframe
        ref={iframeRef}
        src={src}
        title="Video Player"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
