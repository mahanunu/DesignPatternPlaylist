import {
  useEffect,
  useState
} from "react";

import "./App.css";

import type { Playlist } from "./types";

import { PlaylistRepository } from "./repositories/PlaylistRepository";
import { PlaylistFacade } from "./facade/PlaylistFacade";

import { commandManager } from "./commands/CommandManager";

import Notifications from "./components/Notifications";
import AddPlaylistForm from "./components/AddPlaylistForm";
import PlaylistList from "./components/PlaylistList";
import PlaylistDetails from "./components/PlaylistDetails";

function App() {

  const [playlists, setPlaylists] =
    useState<Playlist[]>([]);

  const [selectedPlaylistId, setSelectedPlaylistId] =
    useState<string | null>(null);

  const repo = new PlaylistRepository();

  const facade = new PlaylistFacade(
    repo,
    setPlaylists,
    () => playlists
  );

  useEffect(() => {

    async function load() {

      const data = await facade.loadInitial();

      if (data.length > 0) {
        setSelectedPlaylistId(data[0].id);
      }
    }

    load();

  }, []);

  const selectedPlaylist =
    playlists.find(
      p => p.id === selectedPlaylistId
    ) || null;

  return (
    <div className="app">

      <Notifications />

      <h1>Playlist Manager</h1>

      <AddPlaylistForm
        onAdd={facade.addPlaylist.bind(facade)}
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
          onAddSong={facade.addSong.bind(facade)}
          onDeleteSong={facade.deleteSong.bind(facade)}
        />

        <button onClick={() => facade.deletePlaylist(selectedPlaylistId!)}>
          Delete playlist
        </button>

      </div>

    </div>
  );
}

export default App;