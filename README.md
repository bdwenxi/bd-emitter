# bd-emitter

A lightweight event emitter implementation base on typescript.

## Getting Started

### Install

Install the `bd-emitter` package via `npm`: 

```shell script
npm install bd-emitter
```

Install the `bd-emitter` package via `yarn`:

```shell script
yarn add bd-emitter
```

#### Import or Require

```js
import EventEmitter from 'bd-emitter';

const EventEmitter = require('bd-emitter');
```

## Usage

```js
import EventEmitter from 'bd-emitter';

const emitter = new EventEmitter();

emitter.on('search', function (...args) {
    console.log(args);
});

setTimeout(
    function () {
        emitter.emit('search', 'Baidu');
    },
    1000
);

```

## API

### on(eventName: string, callback: Function, context: Object)

Register a specific callback to be called on a custom event.

```js
import EventEmitter from 'bd-emitter';

const emitter = new EventEmitter();

const callback = function (...args) {
    console.log(...args);
};

emitter.on('search', callback);
emitter.emit('search', 'Baidu AI'); // Baidu AI
```

### once(eventName: string, callback: Function, context: Object)

Similar to on() but the callback is removed after it is `invoked once`.

```js
import EventEmitter from 'bd-emitter';

const emitter = new EventEmitter();

const callback = function (...args) {
    console.log(...args);
};

emitter.once('search', callback);
emitter.emit('search', 'Baidu AI'); // Baidu AI
emitter.emit('search', 'Baidu AI'); // nothing
```

### off(eventName?: string, listener?: Function)

eventName is optional, if provided only listeners for that event name are removed, otherwise remove all events.

```js
import EventEmitter from 'bd-emitter';

const emitter = new EventEmitter();

const callback = function (...args) {
    console.log(...args);
};

emitter.on('search', callback);
emitter.emit('search', 'Baidu AI'); // Baidu AI
emitter.off('search', callback);
emitter.emit('search', 'Baidu AI'); // nothing
```

```js
import EventEmitter from 'bd-emitter';

const emitter = new EventEmitter();

const callback1 = function (...args) {
    console.log(...args);
};

const callback2 = function (...args) {
    console.log(...args);
};

emitter.on('custom:search', callback1);
emitter.on('custom:navigation', callback2);
emitter.emit('custom:search', 'Baidu Search'); // Baidu Search
emitter.emit('custom:navigation', 'Baidu Navigation'); // Baidu Navigation

emitter.off();

emitter.emit('custom:search', 'Baidu Search'); // nothing
emitter.emit('custom:navigation', 'Baidu Navigation'); // nothing
```

### emit(eventName: string, ...args: any[])

Emits an event of the given type with the given data. 

```js
import EventEmitter from 'bd-emitter';

const emitter = new EventEmitter();

const callback = function (...args) {
    console.log(...args);
};

emitter.on('search', callback);
emitter.emit('search', 'Baidu AI'); // Baidu AI
```

## Running the tests

```shell script
git clone git@github.com:bdwenxi/bd-emitter.git
```
```shell script
yarn
```
```shell script
jest
```

## Contributing

**bdwenxi (bdwenxi@gmail.com)**

## Authors

**bdwenxi (bdwenxi@gmail.com)**

## License

This project is licensed under the MIT License
