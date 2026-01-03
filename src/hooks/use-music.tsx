"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

const MUSIC_GENRES = [
  { id: "lofi", name: "Lofi", url: "https://ice1.somafm.com/fluid-128-mp3", desc: "Jazzy hip-hop beats" },
  { id: "groovesalad", name: "Chill", url: "https://ice1.somafm.com/groovesalad-128-mp3", desc: "Downtempo grooves" },
  { id: "dronezone", name: "Ambient", url: "https://ice1.somafm.com/dronezone-128-mp3", desc: "Atmospheric textures" },
  { id: "deepspaceone", name: "Space", url: "https://ice1.somafm.com/deepspaceone-128-mp3", desc: "Deep space ambient" },
  { id: "vaporwave", name: "Vapor", url: "https://ice1.somafm.com/vaporwaves-128-mp3", desc: "Vaporwave & synthwave" },
  { id: "silent", name: "Silence", url: "", desc: "Ambient sounds only" },
] as const;

export type MusicGenre = typeof MUSIC_GENRES[number];

interface MusicContextType {
  genres: typeof MUSIC_GENRES;
  selectedGenre: MusicGenre;
  musicPlaying: boolean;
  musicVolume: number;
  isLoading: boolean;
  hasInteracted: boolean;
  setSelectedGenre: (genre: MusicGenre) => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicVolume: (volume: number) => void;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre>(MUSIC_GENRES[0]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Load preferences on mount
  useEffect(() => {
    setMounted(true);
    const savedVolume = localStorage.getItem("musicVolume");
    const savedGenre = localStorage.getItem("musicGenre");
    if (savedVolume) setMusicVolume(parseFloat(savedVolume));
    if (savedGenre) {
      const found = MUSIC_GENRES.find((g) => g.id === savedGenre);
      if (found) setSelectedGenre(found);
    }
  }, []);

  // Auto-play on first interaction
  useEffect(() => {
    if (!mounted) return;

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setMusicPlaying(true);
      }
    };
    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted, mounted]);

  // Music control
  useEffect(() => {
    if (!mounted) return;

    // Don't play if Silence is selected (empty url)
    if (!selectedGenre.url) {
      if (musicRef.current) {
        musicRef.current.pause();
      }
      return;
    }

    if (!musicRef.current) {
      musicRef.current = new Audio(selectedGenre.url);
      musicRef.current.crossOrigin = "anonymous";
    }
    musicRef.current.volume = musicVolume;

    if (musicPlaying && hasInteracted) {
      setIsLoading(true);
      musicRef.current.play()
        .then(() => setIsLoading(false))
        .catch(() => {
          setIsLoading(false);
          setMusicPlaying(false);
        });
    } else if (musicRef.current) {
      musicRef.current.pause();
    }
  }, [musicPlaying, hasInteracted, musicVolume, selectedGenre.url, mounted]);

  const changeGenre = useCallback((genre: MusicGenre) => {
    if (musicRef.current) {
      musicRef.current.pause();
    }

    // Handle "Silence" option (no music, just ambient)
    if (!genre.url) {
      setMusicPlaying(false);
      setSelectedGenre(genre);
      localStorage.setItem("musicGenre", genre.id);
      return;
    }

    if (musicRef.current) {
      musicRef.current.src = genre.url;
      if (musicPlaying) {
        setIsLoading(true);
        musicRef.current.play()
          .then(() => setIsLoading(false))
          .catch(() => setIsLoading(false));
      }
    }
    setSelectedGenre(genre);
    localStorage.setItem("musicGenre", genre.id);
  }, [musicPlaying]);

  const handleSetMusicVolume = useCallback((volume: number) => {
    setMusicVolume(volume);
    localStorage.setItem("musicVolume", String(volume));
  }, []);

  const toggleMusic = useCallback(() => {
    setHasInteracted(true);
    setMusicPlaying((prev) => !prev);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <MusicContext.Provider
      value={{
        genres: MUSIC_GENRES,
        selectedGenre,
        musicPlaying,
        musicVolume,
        isLoading,
        hasInteracted,
        setSelectedGenre: changeGenre,
        setMusicPlaying,
        setMusicVolume: handleSetMusicVolume,
        toggleMusic,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
