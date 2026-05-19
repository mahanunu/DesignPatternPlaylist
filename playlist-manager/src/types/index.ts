export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: number;
};

export type Playlist = {
  id: string;
  name: string;
  songs: Song[];
  isCustom: boolean;
};