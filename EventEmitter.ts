type Listener = (...args: any[]) => void;

interface ListenerWrapper {
  listener: Listener;
  once: boolean;
  originalListener?: Listener;
}

export class EventEmitter {
  private events: Map<string, ListenerWrapper[]>;

  constructor() {
    this.events = new Map();
  }

  on(eventName: string, listener: Listener): this {
    const listeners = this.events.get(eventName);
    const wrapper: ListenerWrapper = { listener, once: false };

    if (listeners) {
      listeners.push(wrapper);
    } else {
      this.events.set(eventName, [wrapper]);
    }

    return this;
  }

  off(eventName: string, listener: Listener): this {
    const listeners = this.events.get(eventName);

    if (!listeners) {
      return this;
    }

    const index = listeners.findIndex(
      (wrapper) => wrapper.listener === listener || wrapper.originalListener === listener
    );

    if (index !== -1) {
      listeners.splice(index, 1);

      if (listeners.length === 0) {
        this.events.delete(eventName);
      }
    }

    return this;
  }

  once(eventName: string, listener: Listener): this {
    const onceWrapper: Listener = (...args: any[]) => {
      this.off(eventName, onceWrapper);
      listener(...args);
    };

    const wrapper: ListenerWrapper = {
      listener: onceWrapper,
      once: true,
      originalListener: listener,
    };

    const listeners = this.events.get(eventName);

    if (listeners) {
      listeners.push(wrapper);
    } else {
      this.events.set(eventName, [wrapper]);
    }

    return this;
  }

  emit(eventName: string, ...args: any[]): boolean {
    const listeners = this.events.get(eventName);

    if (!listeners || listeners.length === 0) {
      return false;
    }

    const listenersToCall = [...listeners];

    for (const wrapper of listenersToCall) {
      wrapper.listener(...args);
    }

    return true;
  }

  removeAllListeners(eventName?: string): this {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }

    return this;
  }

  listenerCount(eventName: string): number {
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}
