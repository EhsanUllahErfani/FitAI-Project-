import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { addTrack as apiAdd, getPlaylist, removeTrack as apiRemove } from "../apis/musicApi";
import type { Track } from "../types/musicTypes";

export type LoopMode = "none" | "all" | "one";

interface MusicCtx {
  playlist:     Track[];
  currentIndex: number;
  currentTrack: Track | undefined;
  playing:      boolean;
  volume:       number;
  loop:         LoopMode;
  shuffle:      boolean;
  toggle:       () => void;
  play:         (index: number) => void;
  next:         () => void;
  previous:     () => void;
  setVolume:    (v: number) => void;
  cycleLoop:    () => void;
  toggleShuffle:() => void;
  addTrack:     (title: string, src: string, bpm?: number) => void;
  removeTrack:  (id: string) => void;
}

const Ctx = createContext<MusicCtx | null>(null);

export function useMusicPlayer(): MusicCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusicPlayer must be inside MusicProvider");
  return c;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const [playlist,     setPlaylist]     = useState<Track[]>(getPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing,      setPlaying]      = useState(false);
  const [volume,       setVolumeState]  = useState(0.35);
  const [loop,         setLoop]         = useState<LoopMode>("none");
  const [shuffle,      setShuffle]      = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync ref so event handlers always see the latest state without stale closures.
  const stateRef = useRef({ currentIndex, playlist, loop, shuffle, playing });
  stateRef.current = { currentIndex, playlist, loop, shuffle, playing };

  const currentTrack = playlist[currentIndex];

  // ── Volume ────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── Track change: load new source then maybe play ─────────────
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (currentTrack) {
      a.src = currentTrack.src;
      a.load();
      if (stateRef.current.playing) a.play().catch(() => setPlaying(false));
    } else {
      a.src = "";
    }
  // stateRef is intentionally omitted — it's a ref, not reactive
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ── Play / pause toggle ───────────────────────────────────────
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // ── onEnded handler ───────────────────────────────────────────
  const handleEnded = useCallback(() => {
    const { currentIndex: idx, playlist: pl, loop: lp, shuffle: sh } = stateRef.current;
    const len = pl.length;
    if (!len) return;

    if (lp === "one") {
      const a = audioRef.current;
      if (a) { a.currentTime = 0; a.play().catch(() => setPlaying(false)); }
      return;
    }

    const isLast = idx === len - 1;
    if (!isLast || lp === "all" || sh) {
      if (sh && len > 1) {
        let r: number;
        do { r = Math.floor(Math.random() * len); } while (r === idx);
        setCurrentIndex(r);
      } else {
        setCurrentIndex((idx + 1) % len);
      }
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, []);

  // ── Public API ────────────────────────────────────────────────
  const toggle = useCallback(() => {
    if (!stateRef.current.playlist.length) return;
    setPlaying((p) => !p);
  }, []);

  const play = useCallback((index: number) => {
    setCurrentIndex(index);
    setPlaying(true);
  }, []);

  const next = useCallback(() => {
    const { currentIndex: idx, playlist: pl, shuffle: sh } = stateRef.current;
    if (!pl.length) return;
    if (sh && pl.length > 1) {
      let r: number;
      do { r = Math.floor(Math.random() * pl.length); } while (r === idx);
      setCurrentIndex(r);
    } else {
      setCurrentIndex((idx + 1) % pl.length);
    }
    setPlaying(true);
  }, []);

  const previous = useCallback(() => {
    const { currentIndex: idx, playlist: pl } = stateRef.current;
    if (!pl.length) return;
    setCurrentIndex((idx - 1 + pl.length) % pl.length);
    setPlaying(true);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const cycleLoop = useCallback(() => {
    setLoop((l) => (l === "none" ? "all" : l === "all" ? "one" : "none"));
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const addTrack = useCallback((title: string, src: string, bpm?: number) => {
    setPlaylist(apiAdd(title, src, bpm));
  }, []);

  const removeTrack = useCallback((id: string) => {
    const updated = apiRemove(id);
    setPlaylist(updated);
    setCurrentIndex((i) => Math.min(i, Math.max(0, updated.length - 1)));
  }, []);

  return (
    <Ctx.Provider
      value={{
        playlist, currentIndex, currentTrack, playing, volume, loop, shuffle,
        toggle, play, next, previous, setVolume, cycleLoop, toggleShuffle,
        addTrack, removeTrack,
      }}
    >
      {/* Single persistent audio element — lives for the app lifetime */}
      <audio
        ref={audioRef}
        preload="none"
        onEnded={handleEnded}
        onError={() => setPlaying(false)}
        style={{ display: "none" }}
      />
      {children}
    </Ctx.Provider>
  );
}
