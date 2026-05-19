import {
  useEffect,
  useState
} from "react";

import {
  fetchSongs
} from "./services/musicApi";

import "./App.css";

import type {
  Playlist,
  Song
} from "./types";

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

  // 🎧 LOAD ITUNES PLAYLIST
  useEffect(() => {

    async function load() {

      try {

        const songs =
          await fetchSongs();

        const apiPlaylist: Playlist = {
          id: "itunes-playlist",

          name:
            "Trending (iTunes)",

          songs,

          isCustom: false
        };

        setPlaylists([
          apiPlaylist
        ]);

        setSelectedPlaylistId(
          "itunes-playlist"
        );

      } catch (err) {

        console.error(
          "API error:",
          err
        );

        setPlaylists([
          {
            id: "fallback",

            name:
              "My Playlist",

            songs: [],

            isCustom: true
          }
        ]);
      }
    }

    load();

  }, []);

  // ➕ ADD PLAYLIST
  const addPlaylist = (
    name: string
  ) => {

    const newPlaylist: Playlist = {
      id:
        crypto.randomUUID(),

      name,

      songs: [],

      isCustom: true
    };

    setPlaylists(prev => [
      ...prev,
      newPlaylist
    ]);
  };

  // ➕ ADD SONG
  const addSong = (
    playlistId: string,
    song: Song
  ) => {

    setPlaylists(prev =>
      prev.map(
        (playlist) => {

          if (
            playlist.id !==
            playlistId
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
      )
    );
  };

  // ❌ DELETE SONG
  const deleteSong = (
    playlistId: string,
    songId: string
  ) => {

    setPlaylists(prev =>
      prev.map(
        (playlist) => {

          if (
            playlist.id !==
            playlistId
          ) {
            return playlist;
          }

          return {
            ...playlist,

            songs:
              playlist.songs.filter(
                (song) =>
                  song.id !==
                  songId
              )
          };
        }
      )
    );
  };

  // 🎯 CURRENT PLAYLIST
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

          onAddSong={
            addSong
          }

          onDeleteSong={
            deleteSong
          }
        />

      </div>

    </div>
  );
}

export default App;