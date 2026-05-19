import type { Playlist, Song } from "../types";
import type { Command } from "./Command";

export class AddSongCommand implements Command {

  constructor(
    private getPlaylists: () => Playlist[],
    private setPlaylists: (p: Playlist[]) => void,
    private playlistId: string,
    private song: Song
  ) {}

  execute() {

    const playlists = this.getPlaylists();

    const updated = playlists.map((p) => {

      if (p.id !== this.playlistId) return p;

      return {
        ...p,
        songs: [...p.songs, this.song]
      };
    });

    this.setPlaylists(updated);
  }

  undo() {

    const playlists = this.getPlaylists();

    const updated = playlists.map((p) => {

      if (p.id !== this.playlistId) return p;

      return {
        ...p,
        songs: p.songs.filter(
          (s) => s.id !== this.song.id
        )
      };
    });

    this.setPlaylists(updated);
  }
}