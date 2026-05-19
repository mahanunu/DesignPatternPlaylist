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

  // 📦 Repository instance
  const repo =
    new PlaylistRepository();

  // 🎧 LOAD DATA VIA REPOSITORY
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

  // ➕ ADD PLAYLIST
  const addPlaylist = (
    name: string
  ) => {

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

  // ➕ ADD SONG
  const addSong = (
    playlistId: string,
    song: Song
  ) => {

    const updated = playlists.map(
      (playlist) => {

        if (
          playlist.id !== playlistId
        ) {
          return playlist;
        }

        return {
          ...playlist,
          songs: [
            ...playlist.songs,
            song
          ]
        };
      }
    );

    setPlaylists(updated);
    repo.save(updated);
  };

  // ❌ DELETE SONG
  const deleteSong = (
    playlistId: string,
    songId: string
  ) => {

    const updated = playlists.map(
      (playlist) => {

        if (
          playlist.id !== playlistId
        ) {
          return playlist;
        }

        return {
          ...playlist,
          songs: playlist.songs.filter(
            (song) =>
              song.id !== songId
          )
        };
      }
    );

    setPlaylists(updated);
    repo.save(updated);
  };

  // 🎯 SELECTED PLAYLIST
  const selectedPlaylist =
    playlists.find(
      (playlist) =>
        playlist.id ===
        selectedPlaylistId
    ) || null;

  return (
    <div className="app">

      <h1>
        Playlist Manager
      </h1>

      <AddPlaylistForm
        onAdd={addPlaylist}
      />

      <div className="content">

        <PlaylistList
          playlists={playlists}
          selectedId={
            selectedPlaylistId
          }
          onSelect={
            setSelectedPlaylistId
          }
        />

        <PlaylistDetails
          playlist={
            selectedPlaylist
          }
          onAddSong={addSong}
          onDeleteSong={deleteSong}
        />

      </div>

    </div>
  );
}

export default App;