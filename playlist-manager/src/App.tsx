import {
  useEffect,
  useState
} from "react";

import "./App.css";

import type {
  Playlist,
  Song
} from "./types";

import { PlaylistRepository } from "./repositories/PlaylistRepository";

import { commandManager } from "./commands/CommandManager";
import { AddSongCommand } from "./commands/AddSongCommand";
import { DeleteSongCommand } from "./commands/DeleteSongCommand";
import { AddPlaylistCommand } from "./commands/AddPlaylistCommand";
import Notifications from "./components/Notifications";

import { eventBus } from "./observer/EventBus";
import { EVENTS } from "./observer/events";

import AddPlaylistForm from "./components/AddPlaylistForm";
import PlaylistList from "./components/PlaylistList";
import PlaylistDetails from "./components/PlaylistDetails";

function App() {

  const [playlists, setPlaylists] =
    useState<Playlist[]>([]);

  const [
    selectedPlaylistId,
    setSelectedPlaylistId
  ] = useState<string | null>(null);

  const repo =
    new PlaylistRepository();

  const getPlaylists = () => playlists;

  useEffect(() => {

    async function load() {

      const data =
        await repo.getAll();

      setPlaylists(data);

      if (data.length > 0) {
        setSelectedPlaylistId(data[0].id);
      }
    }

    load();

  }, []);

  // ➕ ADD PLAYLIST (COMMAND)
  const addPlaylist = (name: string) => {

    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      songs: [],
      isCustom: true
    };

    const command =
      new AddPlaylistCommand(
        playlists,
        setPlaylists,
        newPlaylist
      );

    commandManager.execute(command);

    repo.save(getPlaylists());

    eventBus.emit(EVENTS.PLAYLIST_CREATED, newPlaylist);
  };

  // ❌ DELETE PLAYLIST (SIMPLE)
  const deletePlaylist = (playlistId: string) => {

    const updated = playlists.filter(
      p => p.id !== playlistId
    );

    setPlaylists(updated);
    repo.save(updated);
  };

  // 🎵 ADD SONG (COMMAND)
  const addSong = (
    playlistId: string,
    song: Song
  ) => {

    const command =
      new AddSongCommand(
        getPlaylists,
        setPlaylists,
        playlistId,
        song
      );

    commandManager.execute(command);

    repo.save(getPlaylists());

    eventBus.emit(EVENTS.SONG_ADDED, {
      playlistId,
      song
    });
  };

  // ❌ DELETE SONG (COMMAND)
  const deleteSong = (
    playlistId: string,
    songId: string
  ) => {

    const command =
      new DeleteSongCommand(
        getPlaylists,
        setPlaylists,
        playlistId,
        songId
      );

    commandManager.execute(command);

    repo.save(getPlaylists());

    eventBus.emit(EVENTS.SONG_DELETED, {
      playlistId,
      songId
    });
  };

  const selectedPlaylist =
    playlists.find(
      p => p.id === selectedPlaylistId
    ) || null;

  return (
    <div className="app">
      
      <Notifications />

      <h1>
        Playlist Manager
      </h1>

      

      <AddPlaylistForm
        onAdd={addPlaylist}
      />
      <button onClick={() => commandManager.undo()}>
        Undo
      </button>

      <div className="content">

        <PlaylistList
          playlists={playlists}
          selectedId={selectedPlaylistId}
          onSelect={setSelectedPlaylistId}
        />

        <PlaylistDetails
          playlist={selectedPlaylist}
          onAddSong={addSong}
          onDeleteSong={deleteSong}
        />

        <button onClick={() => deletePlaylist(selectedPlaylistId!)}>
          Delete playlist
        </button>

      </div>

    </div>
  );
}

export default App;