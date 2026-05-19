import type { Playlist, Song } from "../types";
import type { Command } from "./Command";

export class DeleteSongCommand implements Command {

  private removedSong: Song | null = null;

  constructor(
    private getPlaylists: () => Playlist[],
    private setPlaylists: (p: Playlist[]) => void,
    private playlistId: string,
    private songId: string
  ) {}

  execute() {

    const playlists = this.getPlaylists();

    const updated = playlists.map((p) => {

      if (p.id !== this.playlistId) return p;

      const song = p.songs.find(
        (s) => s.id === this.songId
      );

      this.removedSong = song ?? null;

      return {
        ...p,
        songs: p.songs.filter(
          (s) => s.id !== this.songId
        )
      };
    });

    this.setPlaylists(updated);
  }

  undo() {

    if (!this.removedSong) return;

    const playlists = this.getPlaylists();

    const updated = playlists.map((p) => {

      if (p.id !== this.playlistId) return p;

      return {
        ...p,
        songs: [...p.songs, this.removedSong]
      };
    });

    this.setPlaylists(updated);
  }
}