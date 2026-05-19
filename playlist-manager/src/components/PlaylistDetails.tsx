import type {
  Playlist,
  Song
} from "../types";

import AddSongForm from "./AddSongForm";

type Props = {
  playlist:
    | Playlist
    | null;

  onAddSong: (
    playlistId: string,
    song: Song
  ) => void;

  onDeleteSong: (
    playlistId: string,
    songId: string
  ) => void;
};

function PlaylistDetails({
  playlist,
  onAddSong,
  onDeleteSong
}: Props) {

  if (!playlist) {
    return (
      <div>
        Select a playlist
      </div>
    );
  }

  return (
    <div>

      <h2>
        {playlist.name}
      </h2>

      <p className="muted">
        {playlist.songs.length}
        {" songs"}
      </p>


      {playlist.isCustom && (

        <AddSongForm
          onAdd={(song) =>
            onAddSong(
              playlist.id,
              song
            )
          }
        />

      )}

      {playlist.songs.map(
        (song) => (

          <div
            className="song"
            key={song.id}
          >

            <div>

              <strong>
                {song.title}
              </strong>

              <div className="muted">
                {song.artist}
              </div>

            </div>

            {playlist.isCustom && (

              <button
                onClick={() =>
                  onDeleteSong(
                    playlist.id,
                    song.id
                  )
                }
              >
                Delete
              </button>

            )}

          </div>
        )
      )}

    </div>
  );
}

export default PlaylistDetails;