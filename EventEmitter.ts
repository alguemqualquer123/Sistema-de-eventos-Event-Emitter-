type ListenerFn<T extends unknown[] = unknown[]> = (...args: T) => void;

interface ListenerObject {
  listener: ListenerFn;
  original: ListenerFn;
  once: boolean;
}

export interface EventEmitterOptions {
  wildcard?: boolean;
  delimiter?: string;
}

const defaultMaxListeners = 10;

export class EventEmitter {
  private _events: Record<string, ListenerObject[]> = Object.create(null);
  private _maxListeners?: number;
  private _eventsOptions?: EventEmitterOptions;

  static defaultMaxListeners = 10;

  constructor(options?: EventEmitterOptions) {
    if (options) {
      this._eventsOptions = options;
    }
  }

  getMaxListeners(): number {
    return this._maxListeners ?? defaultMaxListeners;
  }

  setMaxListeners(n: number): this {
    if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
      throw new TypeError(`n must be a positive number: ${n}`);
    }
    this._maxListeners = n;
    return this;
  }

  on(eventName: string, listener: ListenerFn, options?: { once?: boolean }): this {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    const isOnce = options?.once === true;
    const key = isOnce ? `${eventName}:once` : eventName;

    let listeners = this._events[key];

    if (!listeners) {
      listeners = [];
      this._events[key] = listeners;
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

  once(eventName: string, listener: ListenerFn): this {
    return this.on(eventName, listener, { once: true });
  }

  off(eventName: string, listener: ListenerFn): this {
    if (typeof listener !== 'function') {
      return this;
    }

    const regularKey = eventName;
    const onceKey = `${eventName}:once`;

    const processList = (key: string) => {
      const list = this._events[key];
      if (!list || list.length === 0) return;

      for (let i = list.length - 1; i >= 0; i--) {
        const item = list[i];
        if (item.original === listener || item.listener === listener) {
          list.splice(i, 1);
        }
      }

      if (list.length === 0) {
        delete this._events[key];
      }
    };

    processList(regularKey);
    processList(onceKey);

    return this;
  }

  addListener(eventName: string, listener: ListenerFn, options?: { once?: boolean }): this {
    return this.on(eventName, listener, options);
  }

  removeListener(eventName: string, listener: ListenerFn): this {
    return this.off(eventName, listener);
  }

  removeAllListeners(eventName?: string): this {
    if (!eventName) {
      for (const key in this._events) {
        delete this._events[key];
      }
    } else {
      delete this._events[eventName];
      delete this._events[`${eventName}:once`];
    }

    return this;
  }

  emit(eventName: string, ...args: unknown[]): boolean {
    const regularListeners = this._events[eventName];
    const onceListeners = this._events[`${eventName}:once`];

    if (!regularListeners && !onceListeners) {
      return false;
    }

    const toCall: ListenerFn[] = [];

    if (regularListeners) {
      for (let i = 0; i < regularListeners.length; i++) {
        toCall.push(regularListeners[i].listener);
      }
    }

    if (onceListeners) {
      for (let i = 0; i < onceListeners.length; i++) {
        toCall.push(onceListeners[i].listener);
      }
      delete this._events[`${eventName}:once`];
    }

    for (let i = 0; i < toCall.length; i++) {
      try {
        toCall[i](...args);
      } catch (err) {
        this.emit('error', err as Error);
      }
    }

    return true;
  }

  listenerCount(eventName: string): number {
    const regular = this._events[eventName];
    const once = this._events[`${eventName}:once`];

    let count = 0;
    if (regular) count += regular.length;
    if (once) count += once.length;

    return count;
  }

  listeners(eventName: string): ListenerFn[] {
    const regular = this._events[eventName] || [];
    const once = this._events[`${eventName}:once`] || [];

    return [...regular, ...once].map(item => item.original || item.listener);
  }

  rawListeners(eventName: string): ListenerFn[] {
    return (this._events[eventName] || []).map(item => item.listener);
  }

  eventNames(): string[] {
    const names: string[] = [];

    for (const key in this._events) {
      if (key.endsWith(':once')) continue;
      names.push(key);
    }

    return names;
  }

  private _wrapOnceListener(eventName: string, listener: ListenerFn): ListenerFn {
    let fired = false;

    const wrapped: ListenerFn = (...args: unknown[]) => {
      if (fired) return;
      fired = true;
      this.off(eventName, wrapped);
      listener(...args);
    };

    return wrapped;
  }
}

export type { ListenerFn };
