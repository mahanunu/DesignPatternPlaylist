import { useState } from "react";

import type { Song } from "../types";

type Props = {
  onAdd: (
    song: Song
  ) => void;
};

function AddSongForm({
  onAdd
}: Props) {

  const [title, setTitle] =
    useState("");

  const [artist, setArtist] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !title ||
      !artist
    ) {
      return;
    }

    onAdd({
      id:
        crypto.randomUUID(),
      title,
      artist,
      duration: 0
    });

    setTitle("");
    setArtist("");
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
    >

      <input
        value={title}
        placeholder="Title"
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      <input
        value={artist}
        placeholder="Artist"
        onChange={(e) =>
          setArtist(
            e.target.value
          )
        }
      />

      <button>
        Add song
      </button>

    </form>
  );
}

export default
  AddSongForm;