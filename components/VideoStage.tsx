'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type VideoStageProps = {
  title: string;
  subtitle: string;
  eventType: string;
  src: string;
  onCatchMoment: (clickedAt: number) => void;
  locked?: boolean;
};

const MIN_WATCH_SECONDS = 1.5;

export function VideoStage({
  title,
  subtitle,
  eventType,
  src,
  onCatchMoment,
  locked = false
}: VideoStageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hasPlayableVideo, setHasPlayableVideo] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setLoaded(false);
    setHasPlayableVideo(true);
    setHasStarted(false);
    setIsPlaying(false);
  }, [src]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setLoaded(true);
    setHasPlayableVideo(true);
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime || 0);
  };

  const handlePlay = () => {
    setHasStarted(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    const video = videoRef.current;
    setIsPlaying(false);
    if (video) {
      setCurrentTime(video.duration || currentTime);
    }
  };

  const handleError = () => {
    setHasPlayableVideo(false);
    setLoaded(false);
    setHasStarted(false);
    setIsPlaying(false);
  };

  const handleStartEpisode = async () => {
    const video = videoRef.current;
    if (!video || !hasPlayableVideo || locked || hasStarted) return;

    try {
      await video.play();
      setHasStarted(true);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const canCatchMoment = useMemo(() => {
    if (locked) return false;
    if (!hasPlayableVideo || !loaded) return false;
    if (!hasStarted) return false;
    return currentTime >= MIN_WATCH_SECONDS;
  }, [currentTime, hasPlayableVideo, loaded, hasStarted, locked]);

  const statusText = useMemo(() => {
    if (!hasPlayableVideo) {
      return 'Видео не найдено. Добавь mp4 в public/videos, иначе честный раунд не состоится.';
    }

    if (!loaded) {
      return 'Подгружаем эпизод. Кнопка станет активной, когда видео будет готово.';
    }

    if (!hasStarted) {
      return 'Сначала запусти эпизод. До просмотра раунд не считается начатым.';
    }

    if (currentTime < MIN_WATCH_SECONDS) {
      return 'Сначала посмотри хотя бы первые секунды эпизода. Пустой клик не засчитывается.';
    }

    if (isPlaying) {
      return 'Теперь можно ловить кульминацию. Нажми в тот кадр, где эпизод действительно ломается.';
    }

    return 'Эпизод остановлен. Момент уже зафиксирован или видео дошло до конца.';
  }, [currentTime, hasPlayableVideo, loaded, hasStarted, isPlaying]);

  const handleCatch = () => {
    if (!canCatchMoment) return;

    const clickedAt = Number((videoRef.current?.currentTime || currentTime).toFixed(2));
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onCatchMoment(clickedAt);
  };

  return (
    <div className="card-surface rounded-[2rem] p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Эпизод</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/62">{subtitle}</p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72">
          Ключевое событие: {eventType}
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/40">
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            key={src}
            src={src}
            preload="metadata"
            playsInline
            controls={false}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            className={`aspect-video w-full bg-black object-cover ${hasPlayableVideo ? 'block' : 'hidden'}`}
          />

          {!hasPlayableVideo ? (
            <div className="flex aspect-video w-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.14),transparent_36%),linear-gradient(180deg,rgba(10,14,24,0.98),rgba(6,8,14,1))] p-8">
              <div className="max-w-xl text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-white/35">Нужен реальный фрагмент</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">Без видео прототип не доказывает механику</h3>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  Положи mp4-файл в папку <span className="font-semibold text-white">public/videos</span> и
                  сохрани нужное имя. После этого этот экран станет полноценным игровым раундом.
                </p>
              </div>
            </div>
          ) : null}

          {hasPlayableVideo ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />
          ) : null}

          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/65 backdrop-blur">
            {!hasPlayableVideo ? 'Нет видео' : loaded ? (isPlaying ? 'Эпизод идёт' : 'Готово к запуску') : 'Загрузка видео'}
          </div>

          {hasPlayableVideo ? (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
              {!hasStarted ? (
                <button
                  type="button"
                  onClick={handleStartEpisode}
                  disabled={!loaded || locked}
                  className="rounded-full border border-white/15 bg-black/55 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Запустить эпизод
                </button>
              ) : (
                <div className="rounded-full border border-white/15 bg-black/55 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                  Эпизод запущен
                </div>
              )}

              <div className="rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm text-white/80 backdrop-blur">
                {currentTime.toFixed(1)} / {duration > 0 ? duration.toFixed(1) : '0.0'} сек
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-orange-400 to-orange-500 transition-all duration-100"
            style={{ width: `${Math.min((currentTime / Math.max(duration, 1)) * 100, 100)}%` }}
          />
        </div>
        <div className="min-w-[96px] rounded-full border border-white/10 px-3 py-1 text-right text-sm text-white/70">
          {currentTime.toFixed(1)} сек
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
        <p className="text-sm leading-7 text-white/70">{statusText}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-white/55">
          Здесь важен не случайный клик, а точный вход в пик эпизода.
        </p>
        <button
          type="button"
          onClick={handleCatch}
          disabled={!canCatchMoment}
          className="rounded-full border border-orange-400/40 bg-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35"
        >
          Это и есть момент
        </button>
      </div>
    </div>
  );
}
