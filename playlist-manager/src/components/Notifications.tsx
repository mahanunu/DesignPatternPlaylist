import { useEffect, useState } from "react";
import { eventBus } from "../observer/EventBus";
import { EVENTS } from "../observer/events";
import { NotificationFactory } from "../factories/NotificationFactory";

import type { Notification } from "../factories/NotificationFactory";

export default function Notifications() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const add = (notif: Notification) => {

    setNotifications((prev) => [...prev, notif]);

    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
  };

  useEffect(() => {

    const onSongAdded = () => {
      add(NotificationFactory.success("🎵 Song added !"));
    };

    const onSongDeleted = () => {
      add(NotificationFactory.error("🗑️ Song deleted !"));
    };

    const onPlaylistCreated = () => {
      add(NotificationFactory.info("📁 Playlist created !"));
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

  return (
    <div className="notifications">

      {notifications.map((n) => (
        <div key={n.id} className={n.type}>
          {n.message}
        </div>
      ))}

    </div>
  );
}