import { Link } from "react-router-dom";
import {
  ListMusic,
  Pause,
  Play,
  Plus,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useMusicPlayer } from "../context/MusicContext";

function EqBars({ playing }: { playing: boolean }) {
  if (!playing) {
    return (
      <div className="flex items-end gap-[2px] h-4">
        {[3, 6, 4].map((h, i) => (
          <span key={i} className="inline-block w-[3px] rounded-full bg-accent/40" style={{ height: h }} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-[2px] h-4">
      <span className="eq-bar" style={{ height: 14, animationDelay: "0ms" }} />
      <span className="eq-bar" style={{ height: 10, animationDelay: "150ms" }} />
      <span className="eq-bar" style={{ height: 18, animationDelay: "300ms" }} />
    </div>
  );
}

export default function MusicBar({ compact = false }: { compact?: boolean }) {
  const {
    playlist, currentTrack, playing, volume,
    loop, shuffle,
    toggle, next, previous, setVolume, cycleLoop, toggleShuffle,
  } = useMusicPlayer();

  // Empty state — prompt the user to add songs
  if (!currentTrack) {
    return (
      <div className="rounded-xl border bg-panel2 border-border p-3 text-center space-y-2">
        <p className="text-[11px] text-muted">No songs yet</p>
        <Link
          to="/music"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
        >
          <Plus className="h-3 w-3" /> Add music
        </Link>
      </div>
    );
  }

  const loopIcon = loop === "one" ? (
    <Repeat1 className="h-3 w-3" />
  ) : (
    <Repeat className="h-3 w-3" />
  );
  const loopActive = loop !== "none";

  return (
    <div className={`rounded-xl border transition-all ${
      playing ? "bg-accent/10 border-accent/30 shadow-glow-xs" : "bg-panel2 border-border"
    } p-3`}>
      {/* Track info row */}
      <div className="flex items-center gap-2 mb-2">
        <EqBars playing={playing} />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] text-muted uppercase tracking-wider">
            {playing ? "Now playing" : "Paused"} · {playlist.length} track{playlist.length !== 1 ? "s" : ""}
          </div>
          <div className="font-bold text-xs truncate text-fg">{currentTrack.title}</div>
        </div>
        <Link to="/music" title="Open playlist" className="h-6 w-6 rounded-lg flex items-center justify-center text-muted hover:text-accent transition shrink-0">
          <ListMusic className="h-3 w-3" />
        </Link>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-1">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          title="Shuffle"
          className={`h-6 w-6 rounded-lg flex items-center justify-center transition ${
            shuffle ? "text-accent" : "text-muted hover:text-fg"
          }`}
        >
          <Shuffle className="h-3 w-3" />
        </button>

        {/* Prev / Play-Pause / Next */}
        <div className="flex items-center gap-1">
          <button onClick={previous} className="h-6 w-6 rounded-lg flex items-center justify-center text-muted hover:text-fg transition">
            <SkipBack className="h-3 w-3" />
          </button>
          <button
            onClick={toggle}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${
              playing ? "bg-accent text-white shadow-glow-xs" : "bg-panel border border-border text-fg"
            }`}
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
          <button onClick={next} className="h-6 w-6 rounded-lg flex items-center justify-center text-muted hover:text-fg transition">
            <SkipForward className="h-3 w-3" />
          </button>
        </div>

        {/* Loop */}
        <button
          onClick={cycleLoop}
          title={loop === "none" ? "Loop off" : loop === "all" ? "Loop all" : "Loop one"}
          className={`h-6 w-6 rounded-lg flex items-center justify-center transition ${
            loopActive ? "text-accent" : "text-muted hover:text-fg"
          }`}
        >
          {loopIcon}
        </button>
      </div>

      {/* Volume */}
      <label className="flex items-center gap-2 mt-2 opacity-70 hover:opacity-100 transition">
        <Volume2 className="h-3 w-3 text-muted shrink-0" />
        <input
          aria-label="Volume"
          className="w-full"
          max={1} min={0} step={0.05}
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ height: 3 }}
        />
      </label>
    </div>
  );
}
