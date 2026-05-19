import type { Playlist, Song } from "../types";
import { PlaylistRepository } from "../repositories/PlaylistRepository";

import { commandManager } from "../commands/CommandManager";
import { AddSongCommand } from "../commands/AddSongCommand";
import { DeleteSongCommand } from "../commands/DeleteSongCommand";
import { AddPlaylistCommand } from "../commands/AddPlaylistCommand";

import { eventBus } from "../observer/EventBus";
import { EVENTS } from "../observer/events";

export class PlaylistFacade {

  constructor(
    private repo: PlaylistRepository,
    private setPlaylists: (p: Playlist[]) => void,
    private getPlaylists: () => Playlist[]
  ) {}

  async loadInitial(): Promise<Playlist[]> {

    const stored = await this.repo.getAll();

    if (stored.length > 0) {
      this.setPlaylists(stored);
      return stored;
    }

    const res = await fetch(
      "/api/lookup.php?i=112024"
    );

    const data = await res.json();

    const songs = (data?.track || []).map((t: any) => ({
      id: t.idTrack,
      title: t.strTrack,
      artist: t.strArtist
    }));

    const apiPlaylist: Playlist = {
      id: "itunes-default",
      name: "Trending (iTunes)",
      songs,
      isCustom: false
    };

    this.setPlaylists([apiPlaylist]);
    this.repo.save([apiPlaylist]);

    return [apiPlaylist];
  }

  addPlaylist(name: string) {

    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name,
      songs: [],
      isCustom: true
    };

    const command =
      new AddPlaylistCommand(
        this.getPlaylists(),
        this.setPlaylists,
        playlist
      );

    commandManager.execute(command);

    this.repo.save(this.getPlaylists());

    eventBus.emit(EVENTS.PLAYLIST_CREATED, playlist);
  }

  deletePlaylist(playlistId: string) {

    const updated = this.getPlaylists().filter(
      p => p.id !== playlistId
    );

    this.setPlaylists(updated);
    this.repo.save(updated);
  }

  addSong(playlistId: string, song: Song) {

    const command =
      new AddSongCommand(
        this.getPlaylists,
        this.setPlaylists,
        playlistId,
        song
      );

    commandManager.execute(command);

    this.repo.save(this.getPlaylists());

    eventBus.emit(EVENTS.SONG_ADDED, {
      playlistId,
      song
    });
  }

  deleteSong(playlistId: string, songId: string) {

    const command =
      new DeleteSongCommand(
        this.getPlaylists,
        this.setPlaylists,
        playlistId,
        songId
      );

    commandManager.execute(command);

    this.repo.save(this.getPlaylists());

    eventBus.emit(EVENTS.SONG_DELETED, {
      playlistId,
      songId
    });
  }
}