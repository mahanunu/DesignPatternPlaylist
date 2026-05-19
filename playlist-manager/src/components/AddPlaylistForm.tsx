import { useState } from "react";

type Props = {
  onAdd: (
    name: string
  ) => void;
};

function AddPlaylistForm({
  onAdd
}: Props) {

  const [name, setName] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    onAdd(name);

    setName("");
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
    >

      <input
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
        placeholder="Playlist name"
      />

      <button>
        Add
      </button>

    </form>
  );
}

export default
  AddPlaylistForm;