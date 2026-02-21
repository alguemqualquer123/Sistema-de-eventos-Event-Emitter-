const { EventEmitter } = require('./EventEmitter.js');
const { createEventEmitter } = require('./EventEmitter.js');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion failed: ${message}`);
  }
  console.log(`✅ ${message}`);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ ${message}\n   Expected: ${expected}\n   Got: ${actual}`);
  }
  console.log(`✅ ${message}`);
}

function testBasicOn() {
  console.log('\n📦 Test: Basic on() functionality');
  const emitter = new EventEmitter();
  let called = false;
  
  emitter.on('test', () => {
    called = true;
  });
  
  emitter.emit('test');
  assert(called, 'Listener should be called');
}

function testMultipleListeners() {
  console.log('\n📦 Test: Multiple listeners for same event');
  const emitter = new EventEmitter();
  let count = 0;
  
  emitter.on('test', () => count++);
  emitter.on('test', () => count++);
  emitter.on('test', () => count++);
  
  emitter.emit('test');
  assertEqual(count, 3, 'All three listeners should be called');
}

function testListenerArguments() {
  console.log('\n📦 Test: Listener receives correct arguments');
  const emitter = new EventEmitter();
  let receivedArgs = [];
  
  emitter.on('data', (...args) => {
    receivedArgs = args;
  });
  
  emitter.emit('data', 'hello', 42, { key: 'value' });
  assertEqual(receivedArgs.length, 3, 'Should receive 3 arguments');
  assertEqual(receivedArgs[0], 'hello', 'First arg should be "hello"');
  assertEqual(receivedArgs[1], 42, 'Second arg should be 42');
  assertEqual(receivedArgs[2].key, 'value', 'Third arg should be object');
}

function testOff() {
  console.log('\n📦 Test: off() removes listener');
  const emitter = new EventEmitter();
  let count = 0;
  
  const listener = () => count++;
  
  emitter.on('test', listener);
  emitter.emit('test');
  assertEqual(count, 1, 'Count should be 1 after first emit');
  
  emitter.off('test', listener);
  emitter.emit('test');
  assertEqual(count, 1, 'Count should still be 1 after removing listener');
}

function testOnce() {
  console.log('\n📦 Test: once() executes only once');
  const emitter = new EventEmitter();
  let count = 0;
  
  emitter.once('test', () => count++);
  
  emitter.emit('test');
  emitter.emit('test');
  emitter.emit('test');
  
  assertEqual(count, 1, 'Listener should be called only once');
}

function testOnceWithArguments() {
  console.log('\n📦 Test: once() receives arguments correctly');
  const emitter = new EventEmitter();
  let receivedValue = null;
  
  emitter.once('data', (value) => {
    receivedValue = value;
  });
  
  emitter.emit('data', 'test-value');
  assertEqual(receivedValue, 'test-value', 'Should receive correct value');
  
  emitter.emit('data', 'another-value');
  assertEqual(receivedValue, 'test-value', 'Should not update on second emit');
}

function testOffWithOnce() {
  console.log('\n📦 Test: off() works with once() listeners');
  const emitter = new EventEmitter();
  let count = 0;
  
  const listener = () => count++;
  
  emitter.once('test', listener);
  emitter.off('test', listener);
  emitter.emit('test');
  
  assertEqual(count, 0, 'Listener should not be called after being removed');
}

function testEmitReturnValue() {
  console.log('\n📦 Test: emit() return value');
  const emitter = new EventEmitter();
  
  let result = emitter.emit('nonexistent');
  assertEqual(result, false, 'Should return false when no listeners');
  
  emitter.on('exists', () => {});
  result = emitter.emit('exists');
  assertEqual(result, true, 'Should return true when listeners exist');
}

function testRemoveAllListeners() {
  console.log('\n📦 Test: removeAllListeners()');
  const emitter = new EventEmitter();
  let count = 0;
  
  emitter.on('test1', () => count++);
  emitter.on('test2', () => count++);
  emitter.on('test1', () => count++);
  
  emitter.removeAllListeners('test1');
  emitter.emit('test1');
  emitter.emit('test2');
  
  assertEqual(count, 1, 'Only test2 listener should be called');
  
  emitter.removeAllListeners();
  emitter.emit('test2');
  
  assertEqual(count, 1, 'No listeners should be called after removing all');
}

function testListenerCount() {
  console.log('\n📦 Test: listenerCount()');
  const emitter = new EventEmitter();
  
  assertEqual(emitter.listenerCount('test'), 0, 'Initial count should be 0');
  
  emitter.on('test', () => {});
  assertEqual(emitter.listenerCount('test'), 1, 'Count should be 1');
  
  emitter.on('test', () => {});
  emitter.on('test', () => {});
  assertEqual(emitter.listenerCount('test'), 3, 'Count should be 3');
  
  emitter.once('test', () => {});
  assertEqual(emitter.listenerCount('test'), 4, 'Count should include once listeners');
}

function testEventNames() {
  console.log('\n📦 Test: eventNames()');
  const emitter = new EventEmitter();
  
  let names = emitter.eventNames();
  assertEqual(names.length, 0, 'Should have no event names initially');
  
  emitter.on('event1', () => {});
  emitter.on('event2', () => {});
  emitter.on('event3', () => {});
  
  names = emitter.eventNames();
  assertEqual(names.length, 3, 'Should have 3 event names');
  assert(names.includes('event1'), 'Should include event1');
  assert(names.includes('event2'), 'Should include event2');
  assert(names.includes('event3'), 'Should include event3');
}

function testChaining() {
  console.log('\n📦 Test: Method chaining');
  const emitter = new EventEmitter();
  let count = 0;
  
  const result = emitter
    .on('test', () => count++)
    .on('test', () => count++)
    .off('test', () => {});
  
  assert(result instanceof EventEmitter, 'Should return EventEmitter instance');
  emitter.emit('test');
  assertEqual(count, 2, 'Both chained listeners should be called');
}

function testMemoryLeak() {
  console.log('\n📦 Test: No memory leak with removed listeners');
  const emitter = new EventEmitter();
  
  for (let i = 0; i < 1000; i++) {
    const listener = () => {};
    emitter.on('test', listener);
    emitter.off('test', listener);
  }
  
  assertEqual(emitter.listenerCount('test'), 0, 'All listeners should be removed');
  assertEqual(emitter.eventNames().length, 0, 'Event should be cleaned up');
}

function testOnceAutoCleanup() {
  console.log('\n📦 Test: once() auto-cleanup after execution');
  const emitter = new EventEmitter();
  
  emitter.once('test', () => {});
  assertEqual(emitter.listenerCount('test'), 1, 'Should have 1 listener before emit');
  
  emitter.emit('test');
  assertEqual(emitter.listenerCount('test'), 0, 'Should have 0 listeners after emit');
  assertEqual(emitter.eventNames().length, 0, 'Event should be cleaned up');
}

function testMultipleOnceListeners() {
  console.log('\n📦 Test: Multiple once() listeners');
  const emitter = new EventEmitter();
  let count = 0;
  
  emitter.once('test', () => count++);
  emitter.once('test', () => count++);
  emitter.once('test', () => count++);
  
  emitter.emit('test');
  assertEqual(count, 3, 'All once listeners should be called');
  
  emitter.emit('test');
  assertEqual(count, 3, 'No listeners should be called on second emit');
}

function testMixedOnAndOnce() {
  console.log('\n📦 Test: Mixed on() and once() listeners');
  const emitter = new EventEmitter();
  let onCount = 0;
  let onceCount = 0;
  
  emitter.on('test', () => onCount++);
  emitter.once('test', () => onceCount++);
  emitter.on('test', () => onCount++);
  
  emitter.emit('test');
  assertEqual(onCount, 2, 'on() listeners should be called');
  assertEqual(onceCount, 1, 'once() listener should be called');
  
  emitter.emit('test');
  assertEqual(onCount, 4, 'on() listeners should be called again');
  assertEqual(onceCount, 1, 'once() listener should not be called again');
}

function testDifferentEvents() {
  console.log('\n📦 Test: Different events are independent');
  const emitter = new EventEmitter();
  let event1Count = 0;
  let event2Count = 0;
  
  emitter.on('event1', () => event1Count++);
  emitter.on('event2', () => event2Count++);
  
  emitter.emit('event1');
  assertEqual(event1Count, 1, 'event1 should be called');
  assertEqual(event2Count, 0, 'event2 should not be called');
  
  emitter.emit('event2');
  assertEqual(event1Count, 1, 'event1 should not be called again');
  assertEqual(event2Count, 1, 'event2 should be called');
}

function testEmitDuringEmit() {
  console.log('\n📦 Test: Emit during emit (nested events)');
  const emitter = new EventEmitter();
  let count = 0;
  
  emitter.on('outer', () => {
    count++;
    emitter.emit('inner');
  });
  
  emitter.on('inner', () => {
    count++;
  });
  
  emitter.emit('outer');
  assertEqual(count, 2, 'Both outer and inner should be called');
}

function testListenerModificationDuringEmit() {
  console.log('\n📦 Test: Adding listener during emit');
  const emitter = new EventEmitter();
  let count = 0;
  
  emitter.on('test', () => {
    count++;
    emitter.on('test', () => count++);
  });
  
  emitter.emit('test');
  assertEqual(count, 1, 'Only first listener should be called');
  
  emitter.emit('test');
  assertEqual(count, 3, 'Both listeners should be called on second emit');
}

function testPerformance() {
  console.log('\n📦 Test: Performance with many listeners');
  const emitter = new EventEmitter();
  const numListeners = 1000;
  let count = 0;
  
  const startSetup = Date.now();
  for (let i = 0; i < numListeners; i++) {
    emitter.on('perf', () => count++);
  }
  const setupTime = Date.now() - startSetup;
  
  const startEmit = Date.now();
  emitter.emit('perf');
  const emitTime = Date.now() - startEmit;
  
  assertEqual(count, numListeners, `All ${numListeners} listeners should be called`);
  console.log(`   Setup time: ${setupTime}ms, Emit time: ${emitTime}ms`);
  assert(setupTime < 100, 'Setup should be fast');
  assert(emitTime < 100, 'Emit should be fast');
}

function runAllTests() {
  console.log('🚀 Starting EventEmitter Test Suite\n');
  console.log('='.repeat(50));
  
  const tests = [
    testBasicOn,
    testMultipleListeners,
    testListenerArguments,
    testOff,
    testOnce,
    testOnceWithArguments,
    testOffWithOnce,
    testEmitReturnValue,
    testRemoveAllListeners,
    testListenerCount,
    testEventNames,
    testChaining,
    testMemoryLeak,
    testOnceAutoCleanup,
    testMultipleOnceListeners,
    testMixedOnAndOnce,
    testDifferentEvents,
    testEmitDuringEmit,
    testListenerModificationDuringEmit,
    testPerformance,
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      test();
      passed++;
    } catch (error) {
      failed++;
      console.error(`\n❌ Test failed: ${test.name}`);
      console.error(error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results:`);
  console.log(`   Total: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed successfully!\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

runAllTests();
