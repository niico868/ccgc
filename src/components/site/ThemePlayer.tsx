import { useEffect, useRef, useState } from "react";
import { Pause, Volume2, VolumeX } from "lucide-react";
import themeAsset from "@/assets/fine-time-theme.mp3.asset.json";
import musicPlayAsset from "@/assets/music-play.png.asset.json";

const SRC = themeAsset.url;
const PREF_KEY = "cgcc.theme.prefs.v1";

type Prefs = { playing: boolean; time: number; volume: number; muted: boolean };

function loadPrefs(): Prefs {
  try {
    if (typeof window === "undefined") throw new Error();
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) return { playing: false, time: 0, volume: 0.7, muted: false, ...JSON.parse(raw) };
  } catch {}
  return { playing: false, time: 0, volume: 0.7, muted: false };
}

function savePrefs(p: Partial<Prefs>) {
  try {
    const cur = loadPrefs();
    localStorage.setItem(PREF_KEY, JSON.stringify({ ...cur, ...p }));
  } catch {}
}

export function ThemePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const p = loadPrefs();
    setVolume(p.volume);
    setMuted(p.muted);
    const a = audioRef.current;
    if (a) {
      a.volume = p.volume;
      a.muted = p.muted;
      if (p.time && isFinite(p.time)) a.currentTime = p.time;
      if (p.playing) {
        a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }
  }, [mounted]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const a = audioRef.current;
      if (a && !a.paused) savePrefs({ time: a.currentTime, playing: true });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
        savePrefs({ playing: true });
        setExpanded(true);
      } catch {}
    } else {
      a.pause();
      setPlaying(false);
      savePrefs({ playing: false, time: a.currentTime });
    }
  };

  const onTime = () => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(a.currentTime);
    if (a.duration && !duration) setDuration(a.duration);
  };

  const onLoaded = () => {
    const a = audioRef.current;
    if (a?.duration) setDuration(a.duration);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const t = Number(e.target.value);
    a.currentTime = t;
    setProgress(t);
    savePrefs({ time: t });
  };

  const changeVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0 && muted) {
      setMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
    savePrefs({ volume: v, muted: v === 0 ? muted : false });
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    if (audioRef.current) audioRef.current.muted = m;
    savePrefs({ muted: m });
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      <audio
        ref={audioRef}
        src={SRC}
        preload="metadata"
        onTimeUpdate={onTime}
        onLoadedMetadata={onLoaded}
        onEnded={() => { setPlaying(false); savePrefs({ playing: false, time: 0 }); }}
      />
      {!expanded ? (
        <button
          onClick={toggle}
          aria-label={playing ? "Pause theme song" : "Play theme song"}
          onDoubleClick={() => setExpanded(true)}
          className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-110 active:scale-95"
        >
          <img
            src={musicPlayAsset.url}
            alt=""
            className="h-11 w-11 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
          />
          {playing && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Pause className="h-4 w-4 text-leaf-deep drop-shadow" />
            </span>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-full border border-leaf-deep/20 bg-cream/95 px-3 py-2 shadow-soft backdrop-blur w-[280px] sm:w-[320px]">
          <button
            onClick={toggle}
            aria-label={playing ? "Pause theme song" : "Play theme song"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:scale-105"
          >
            {playing ? (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-leaf-deep text-cream">
                <Pause className="h-4 w-4" />
              </span>
            ) : (
              <img src={musicPlayAsset.url} alt="" className="h-9 w-9 object-contain" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <div className="truncate text-[11px] font-bold uppercase tracking-wider text-leaf-deep">
                Fine Time Theme
              </div>
              <div className="text-[10px] tabular-nums text-brown">
                {fmt(progress)} / {fmt(duration)}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={progress}
              onChange={seek}
              aria-label="Seek"
              className="mt-1 h-1 w-full cursor-pointer accent-leaf-deep"
            />
          </div>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-leaf-deep hover:bg-secondary"
          >
            {muted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={changeVol}
            aria-label="Volume"
            className="hidden h-1 w-16 cursor-pointer accent-leaf-deep sm:block"
          />
          <button
            onClick={() => setExpanded(false)}
            aria-label="Collapse player"
            className="text-[10px] font-semibold text-brown hover:text-leaf-deep"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
