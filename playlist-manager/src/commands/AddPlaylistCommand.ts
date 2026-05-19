import type { Playlist } from "../types";
import type { Command } from "./Command";

export class AddPlaylistCommand implements Command {

  constructor(
    private playlists: Playlist[],
    private setPlaylists: (p: Playlist[]) => void,
    private playlist: Playlist
  ) {}

  execute() {

    const updated = [
      ...this.playlists,
      this.playlist
    ];

    this.setPlaylists(updated);
  }

  undo() {

    const updated = this.playlists.filter(
      p => p.id !== this.playlist.id
    );

    this.setPlaylists(updated);
  }
}