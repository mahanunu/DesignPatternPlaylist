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

  // 🔥 getter IMPORTANT pour commands
  const getPlaylists = () => playlists;

  useEffect(() => {

    async function load() {

      const data =
        await repo.getAll();

      setPlaylists(data);

      if (data.length > 0) {
        setSelectedPlaylistId(
          data[0].id
        );
      }
    }

    load();

  }, []);

  // ➕ ADD PLAYLIST (pas command)
  const addPlaylist = (name: string) => {

    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      songs: [],
      isCustom: true
    };

    const updated = [
      ...playlists,
      newPlaylist
    ];

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
  };

  const selectedPlaylist =
    playlists.find(
      p => p.id === selectedPlaylistId
    ) || null;

  return (
    <div className="app">

      <h1>
        Playlist Manager
      </h1>

      <button onClick={() => commandManager.undo()}>
        Undo
      </button>

      <AddPlaylistForm
        onAdd={addPlaylist}
      />

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

      </div>

    </div>
  );
}

export default App;