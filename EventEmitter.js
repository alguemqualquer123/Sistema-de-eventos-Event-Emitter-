'use strict';

const MAX_LISTENERS = Infinity;
const defaultMaxListeners = 10;

class EventEmitter {
  constructor() {
    this._events = Object.create(null);
    this._onceWrap = null;
  }

  getMaxListeners() {
    return this._maxListeners ?? defaultMaxListeners;
  }

  setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
      throw new TypeError(`n must be a positive number: ${n}`);
    }
    this._maxListeners = n;
    return this;
  }

  on(eventName, listener, options = {}) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    const events = this._events;
    const isOnce = options.once === true;
    const key = isOnce ? `${eventName}:once` : eventName;

    let listeners = events[key];

    if (!listeners) {
      listeners = [];
      events[key] = listeners;
    }

    const wrapped = isOnce
      ? this._wrapOnceListener(eventName, listener)
      : listener;

    listeners.push({
      listener: wrapped,
      original: isOnce ? listener : wrapped,
      once: isOnce
    });

    return this;
  }

  once(eventName, listener) {
    return this.on(eventName, listener, { once: true });
  }

  off(eventName, listener) {
    if (typeof listener !== 'function') {
      return this;
    }

    const events = this._events;
    const regularKey = eventName;
    const onceKey = `${eventName}:once`;

    let removed = false;

    const processList = (key) => {
      const list = events[key];
      if (!list || list.length === 0) return;

      for (let i = list.length - 1; i >= 0; i--) {
        const item = list[i];
        if (item.original === listener || item.listener === listener) {
          list.splice(i, 1);
          removed = true;
        }
      }

      if (list.length === 0) {
        delete events[key];
      }
    };

    processList(regularKey);
    processList(onceKey);

    return this;
  }

  addListener(eventName, listener, options) {
    return this.on(eventName, listener, options);
  }

  removeListener(eventName, listener) {
    return this.off(eventName, listener);
  }

  removeAllListeners(eventName) {
    const events = this._events;

    if (!eventName) {
      for (const key in events) {
        delete events[key];
      }
    } else {
      delete events[eventName];
      delete events[`${eventName}:once`];
    }

    return this;
  }

  emit(eventName, ...args) {
    const events = this._events;
    const regularListeners = events[eventName];
    const onceListeners = events[`${eventName}:once`];

    if (!regularListeners && !onceListeners) {
      return false;
    }

    const toCall = [];

    if (regularListeners) {
      for (let i = 0; i < regularListeners.length; i++) {
        toCall.push(regularListeners[i].listener);
      }
    }

    if (onceListeners) {
      for (let i = 0; i < onceListeners.length; i++) {
        toCall.push(onceListeners[i].listener);
      }
      delete events[`${eventName}:once`];
    }

    for (let i = 0; i < toCall.length; i++) {
      try {
        toCall[i].apply(this, args);
      } catch (err) {
        this.emit('error', err);
      }
    }

    return true;
  }

  listenerCount(eventName) {
    const events = this._events;
    const regular = events[eventName];
    const once = events[`${eventName}:once`];

    let count = 0;
    if (regular) count += regular.length;
    if (once) count += once.length;

    return count;
  }

  listeners(eventName) {
    const events = this._events;
    const regular = events[eventName] || [];
    const once = events[`${eventName}:once`] || [];

    return [...regular, ...once].map(item => item.original || item.listener);
  }

  rawListeners(eventName) {
    const events = this._events;
    return (events[eventName] || []).map(item => item.listener);
  }

  eventNames() {
    const events = this._events;
    const names = [];

    for (const key in events) {
      if (key.endsWith(':once')) continue;
      names.push(key);
    }

    return names;
  }

  _wrapOnceListener(eventName, listener) {
    const self = this;
    let fired = false;

    const wrapped = function(...args) {
      if (fired) return;
      fired = true;
      self.off(eventName, wrapped);
      listener.apply(this, args);
    };

    return wrapped;
  }

  listenerCountOld(eventName) {
    return this.listenerCount(eventName);
  }

  getMaxListenersOld() {
    return this.getMaxListeners();
  }
}

function createEventEmitter() {
  return new EventEmitter();
}

module.exports = { EventEmitter, createEventEmitter };
