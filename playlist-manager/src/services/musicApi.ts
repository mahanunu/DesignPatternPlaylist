import type { Song } from "../types";

export async function fetchSongs(): Promise<Song[]> {
  const res = await fetch(
    "https://itunes.apple.com/search?term=rock&entity=song&limit=10"
  );

  const data = await res.json();

  return data.results.map((item: any) => ({
    id: item.trackId?.toString() ?? crypto.randomUUID(),
    title: item.trackName ?? "Unknown",
    artist: item.artistName ?? "Unknown",
    duration: item.trackTimeMillis ?? 0
  }));
}