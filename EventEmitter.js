export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    const listeners = this.events.get(eventName);
    const wrapper = { listener, once: false };

    if (listeners) {
      listeners.push(wrapper);
    } else {
      this.events.set(eventName, [wrapper]);
    }

    return this;
  }

  off(eventName, listener) {
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

  once(eventName, listener) {
    const onceWrapper = (...args) => {
      this.off(eventName, onceWrapper);
      listener(...args);
    };

    const wrapper = {
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

  emit(eventName, ...args) {
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

  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }

    return this;
  }

  listenerCount(eventName) {
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}
