import type { Playlist } from "../types";

type Props = {
  playlists: Playlist[];
  selectedId: string | null;

  onSelect: (
    id: string
  ) => void;
};

function PlaylistList({
  playlists,
  selectedId,
  onSelect
}: Props) {

  return (
    <div>

      <h2>
        Playlists
      </h2>

      {playlists.map(
        (
          playlist
        ) => (

          <div
            key={
              playlist.id
            }
            className={
              selectedId ===
              playlist.id
                ? "selected"
                : ""
            }
            onClick={() =>
              onSelect(
                playlist.id
              )
            }
          >

            {playlist.name}

            {" ("}
            {
              playlist.songs
                .length
            }
            {")"}

          </div>
        )
      )}

    </div>
  );
}

export default
  PlaylistList;