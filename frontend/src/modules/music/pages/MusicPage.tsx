import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";
import {
  FolderOpen,
  ListMusic,
  Music2,
  Pause,
  Play,
  Plus,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  Volume2,
} from "lucide-react";
import BackButton from "../../../components/BackButton";
import { useMusicPlayer } from "../context/MusicContext";

function EqBars({ playing }: { playing: boolean }) {
  if (!playing) return null;
  return (
    <div className="flex items-end gap-[2px] h-5">
      <span className="eq-bar" style={{ height: 14, animationDelay: "0ms" }} />
      <span className="eq-bar" style={{ height: 10, animationDelay: "150ms" }} />
      <span className="eq-bar" style={{ height: 18, animationDelay: "300ms" }} />
      <span className="eq-bar" style={{ height: 8,  animationDelay: "450ms" }} />
    </div>
  );
}

export default function MusicPage() {
  const {
    playlist, currentIndex, currentTrack, playing, volume, loop, shuffle,
    toggle, play, next, previous, setVolume, cycleLoop, toggleShuffle,
    addTrack, removeTrack,
  } = useMusicPlayer();

  // Add-song form state (local to this page only)
  const [title,        setTitle]        = useState("");
  const [bpm,          setBpm]          = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError,    setFormError]    = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file && !title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!selectedFile) { setFormError("Please choose an MP3 file first."); return; }
    const src = URL.createObjectURL(selectedFile);
    const trackTitle = title.trim() || selectedFile.name.replace(/\.[^.]+$/, "");
    addTrack(trackTitle, src, bpm ? Number(bpm) : undefined);
    setTitle(""); setBpm(""); setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Loop button visuals
  const loopIcon = loop === "one" ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />;
  const loopLabel = loop === "none" ? "Loop off" : loop === "all" ? "Loop all" : "Loop one";

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <BackButton />

      <header>
        <p className="section-label mb-1">Focus Mode</p>
        <h1 className="text-3xl font-extrabold text-fg">Workout Playlist</h1>
        <p className="text-muted text-sm mt-1">Upload your own MP3s and keep your training locked in.</p>
      </header>

      {/* ── Player card ── */}
      {currentTrack ? (
        <div className="relative rounded-2xl bg-grad-primary overflow-hidden shadow-glow p-6 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10">
            {/* Track info + EQ bars */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-75 mb-1">
                  {playing ? "Now playing" : "Paused"}
                </div>
                <div className="text-xl font-extrabold truncate">{currentTrack.title}</div>
                {currentTrack.bpm && (
                  <div className="text-sm opacity-75 mt-0.5">{currentTrack.bpm} BPM</div>
                )}
              </div>
              <div className="flex items-end gap-[3px] h-8 shrink-0">
                {playing ? (
                  <>
                    <span className="eq-bar !bg-white/80" style={{ height: 16, animationDelay: "0ms" }} />
                    <span className="eq-bar !bg-white/80" style={{ height: 12, animationDelay: "150ms" }} />
                    <span className="eq-bar !bg-white/80" style={{ height: 20, animationDelay: "300ms" }} />
                    <span className="eq-bar !bg-white/80" style={{ height: 10, animationDelay: "450ms" }} />
                  </>
                ) : (
                  [14, 8, 18, 10].map((h, i) => (
                    <span key={i} className="inline-block w-[3px] rounded-full bg-white/30" style={{ height: h }} />
                  ))
                )}
              </div>
            </div>

            {/* Shuffle · Prev · Play-Pause · Next · Loop */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                onClick={toggleShuffle}
                title="Shuffle"
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition active:scale-95 ${
                  shuffle ? "bg-white/30 text-white" : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Shuffle className="h-5 w-5" />
              </button>

              <button onClick={previous} className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition active:scale-95">
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={toggle}
                className="h-14 w-14 rounded-2xl bg-white/25 flex items-center justify-center hover:bg-white/35 transition active:scale-95 shadow-inner"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </button>

              <button onClick={next} className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition active:scale-95">
                <SkipForward className="h-5 w-5" />
              </button>

              <button
                onClick={cycleLoop}
                title={loopLabel}
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition active:scale-95 ${
                  loop !== "none" ? "bg-white/30 text-white" : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
                }`}
              >
                {loopIcon}
              </button>
            </div>

            {/* Volume */}
            <label className="flex items-center gap-3 opacity-80">
              <Volume2 className="h-4 w-4 shrink-0" />
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full" aria-label="Volume"
              />
            </label>
          </div>
        </div>
      ) : (
        /* Empty player placeholder */
        <div className="rounded-2xl border border-dashed border-border bg-panel2 p-8 text-center text-muted space-y-2">
          <ListMusic className="h-10 w-10 mx-auto opacity-30" />
          <p className="text-sm">Upload an MP3 below to start playing</p>
        </div>
      )}

      {/* ── Playlist ── */}
      <div className="card">
        <h2 className="font-bold text-fg mb-4 flex items-center gap-2">
          <Music2 className="h-5 w-5 text-accent" />
          Playlist
          <span className="chip-accent ml-1">{playlist.length} track{playlist.length !== 1 ? "s" : ""}</span>
          {shuffle && <span className="chip text-[10px]">shuffle on</span>}
          {loop !== "none" && <span className="chip text-[10px]">{loop === "one" ? "loop 1" : "loop all"}</span>}
        </h2>

        {playlist.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">No tracks yet — add one below.</p>
        ) : (
          <ul className="space-y-2">
            {playlist.map((t, i) => {
              const active = i === currentIndex;
              return (
                <li
                  key={t.id}
                  onClick={() => play(i)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                    active ? "bg-accent/10 border-accent/40" : "bg-panel2 border-border hover:border-accent/30 hover:bg-panel"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    active ? "bg-grad-primary text-white shadow-glow-xs" : "bg-panel border border-border text-muted"
                  }`}>
                    {active && playing
                      ? <Pause className="h-4 w-4" />
                      : <Play className={`h-4 w-4 ${active ? "" : "ml-0.5"}`} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm truncate ${active ? "text-accent" : "text-fg"}`}>{t.title}</div>
                    {t.bpm && <div className="text-xs text-muted">{t.bpm} BPM</div>}
                  </div>

                  {active && playing && <EqBars playing={playing} />}
                  {t.custom && <span className="chip text-[10px] shrink-0">custom</span>}
                  {t.custom && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeTrack(t.id); }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-400/10 transition shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Add MP3 form ── */}
      <div className="card">
        <h2 className="font-bold text-fg mb-3 flex items-center gap-2">
          <Plus className="h-5 w-5 text-accent" /> Add Local MP3
        </h2>
        <div className="mb-4 rounded-xl bg-panel2 border border-border px-4 py-3 text-xs text-muted">
          Uploaded files play for this session. After a refresh, re-upload them or add new ones.
        </div>

        <form onSubmit={handleAdd} className="grid sm:grid-cols-[1fr_90px] gap-3">
          <div>
            <label className="label">Song title (optional)</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Auto-detected from filename" />
          </div>
          <div>
            <label className="label">BPM</label>
            <input className="input" type="number" min={60} max={220} value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="128" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">MP3 File</label>
            <label className="flex items-center gap-3 input cursor-pointer hover:border-accent/60 transition">
              <FolderOpen className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted text-sm truncate flex-1">
                {selectedFile ? selectedFile.name : "Click to choose an MP3 file…"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mpeg,audio/mp3,.mp3"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
          {formError && <p className="sm:col-span-2 text-red-400 text-sm">{formError}</p>}
          <button type="submit" className="btn-primary sm:col-span-2" disabled={!selectedFile}>
            <Plus className="h-4 w-4" /> Add to playlist
          </button>
        </form>
      </div>
    </div>
  );
}
