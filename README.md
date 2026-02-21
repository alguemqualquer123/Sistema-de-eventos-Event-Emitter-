# tiny-emitter

Lightweight EventEmitter implementation with TypeScript support.

## Install

```bash
npm install tiny-emitter
```

## Usage

### JavaScript / TypeScript

```javascript
const { EventEmitter } = require('tiny-emitter');
// or ESM
import { EventEmitter } from 'tiny-emitter';

const emitter = new EventEmitter();

emitter.on('data', (msg) => {
  console.log('received:', msg);
});

emitter.emit('data', 'hello');
```

## API

### `on(eventName, listener)` / `addListener(eventName, listener)`

Register a listener for an event.

```javascript
emitter.on('message', (data) => {
  console.log(data);
});
```

### `once(eventName, listener)`

Register a one-time listener.

```javascript
emitter.once('init', () => {
  console.log('initialized');
});
```

### `off(eventName, listener)` / `removeListener(eventName, listener)`

Remove a listener.

```javascript
const handler = (msg) => console.log(msg);
emitter.on('msg', handler);
emitter.off('msg', handler);
```

### `emit(eventName, ...args)`

Emit an event. Returns `true` if listeners were called.

```javascript
emitter.emit('update', { id: 1, name: 'test' });
```

### `removeAllListeners(eventName?)`

Remove all listeners, or those for the specified event.

```javascript
emitter.removeAllListeners('update');
emitter.removeAllListeners(); // remove all
```

### `listenerCount(eventName)`

Get the number of listeners for an event.

```javascript
console.log(emitter.listenerCount('update'));
```

### `listeners(eventName)`

Get all listeners for an event.

```javascript
console.log(emitter.listeners('update'));
```

### `eventNames()`

Get all registered event names.

```javascript
console.log(emitter.eventNames());
```

### `setMaxListeners(n)`

Set max listeners (default: 10).

```javascript
emitter.setMaxListeners(20);
```

### `getMaxListeners()`

Get max listeners value.

```javascript
console.log(emitter.getMaxListeners());
```

## TypeScript

Full type definitions are included.

```typescript
import { EventEmitter } from 'tiny-emitter';

interface UserEvent {
  id: number;
  name: string;
}

const emitter = new EventEmitter<UserEvent>();

emitter.on('user:login', ({ id, name }) => {
  console.log(`User ${name} (${id}) logged in`);
});

emitter.emit('user:login', { id: 1, name: 'John' });
```

## Build

```bash
npm run build
```

## License

MIT
