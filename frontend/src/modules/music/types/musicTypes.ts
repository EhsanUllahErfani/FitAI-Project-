// ─────────────────────────────────────────────────────────────
// Music Types & Default Playlist
//
// Tracks are loaded from the local /public/music/ folder.
// To hear the default tracks, place MP3 files with these exact
// filenames inside  frontend/public/music/
//   warmup-pulse.mp3 · strength-focus.mp3 · cooldown-flow.mp3
//   power-drive.mp3  · endurance-run.mp3
//
// Custom tracks added from the Music page use a temporary
// browser blob URL and are available until the page refreshes.
// ─────────────────────────────────────────────────────────────

// Shape of a single playlist track.
export interface Track {
  id: string;
  title: string;
  bpm?: number;
  src: string;       // local path (/music/file.mp3) or session blob URL
  custom?: boolean;  // true = added by the user at runtime
}

// No built-in tracks — upload your own MP3s from the Music page.
export const DEFAULT_TRACKS: Track[] = [];

// localStorage key used to persist the user's custom track list.
export const STORAGE_KEY = "fitai-playlist";
