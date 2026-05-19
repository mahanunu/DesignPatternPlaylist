type Listener = (data?: any) => void;

class EventBus {

  private events: Record<string, Listener[]> = {};

  on(event: string, callback: Listener) {

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  emit(event: string, data?: any) {

    const listeners = this.events[event];

    if (!listeners) return;

    listeners.forEach((cb) => cb(data));
  }

  off(event: string, callback: Listener) {

    const listeners = this.events[event];

    if (!listeners) return;

    this.events[event] = listeners.filter(
      (cb) => cb !== callback
    );
  }
}

export const eventBus = new EventBus();