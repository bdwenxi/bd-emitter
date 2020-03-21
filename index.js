const EventEmitter = require('./packages/bd-emitter/dist/bd-emitter.umd');

const emitter = new EventEmitter();

emitter.on('search', function (...args) {
    console.log(...args);
});

emitter.emit('search', 'Baidu');
emitter.emit('search', 'Baidu');
