import type { Playlist } from "../types";
import { fetchSongs } from "../services/musicApi";

const STORAGE_KEY = "playlists";

export class PlaylistRepository {

 
  async getAll(): Promise<Playlist[]> {

    const localData =
      localStorage.getItem(STORAGE_KEY);

    if (localData) {
      return JSON.parse(localData);
    }


    const songs = await fetchSongs();

    const apiPlaylist: Playlist = {
      id: "api-playlist",
      name: "Trending (iTunes)",
      songs,
      isCustom: false
    };

    return [apiPlaylist];
  }


  save(playlists: Playlist[]) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(playlists)
    );
  }
}