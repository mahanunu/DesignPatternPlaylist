import { useEffect, useState } from "react";
import { eventBus } from "../observer/EventBus";
import { EVENTS } from "../observer/events";

type Notification = {
  id: string;
  message: string;
};

export default function Notifications() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  useEffect(() => {

    const onSongAdded = () => {
      add("🎵 Song added !");
    };

    const onSongDeleted = () => {
      add("🗑️ Song deleted !");
    };

    const onPlaylistCreated = () => {
      add("📁 Playlist created !");
    };

    eventBus.on(EVENTS.SONG_ADDED, onSongAdded);
    eventBus.on(EVENTS.SONG_DELETED, onSongDeleted);
    eventBus.on(EVENTS.PLAYLIST_CREATED, onPlaylistCreated);

    return () => {
      eventBus.off(EVENTS.SONG_ADDED, onSongAdded);
      eventBus.off(EVENTS.SONG_DELETED, onSongDeleted);
      eventBus.off(EVENTS.PLAYLIST_CREATED, onPlaylistCreated);
    };

  }, []);

  const add = (message: string) => {

    const notif: Notification = {
      id: crypto.randomUUID(),
      message
    };

    setNotifications((prev) => [...prev, notif]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.slice(1)
      );
    }, 3000);
  };

  return (
    <div className="notifications">

      {notifications.map((n) => (
        <div key={n.id}>
          {n.message}
        </div>
      ))}

    </div>
  );
}