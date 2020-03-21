
import EventEmitter from '../src';

describe('bd-emitter test', function () {
    let emitter: EventEmitter;
    const args = ['AIPE-FE', 'AI Studio', 'Notebook'];
    const context = {};

    beforeAll(function () {
        emitter = new EventEmitter();
    });

    afterEach(function () {
        // remove all events after each test suite
        emitter.off();
    });

    it('should bind event with "on" method correctly', function () {
        const listener = jest.fn();
        emitter.on('on:event', listener, context);
        expect(emitter.eventsMap['on:event'].length).toBe(1);
        expect(emitter.eventsMap['on:event'][0][0]).toBe(listener);
        expect(listener).not.toBeCalled();
        emitter.emit('on:event', ...args);
        expect(listener).toBeCalledWith(...args);
    });

    it('should bind event with "once" method correctly', function () {
        const listener = jest.fn();
        emitter.once('once:event', listener);
        expect(listener).not.toBeCalled();
        emitter.emit('once:event', ...args);
        emitter.emit('once:event', ...args);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toBeCalledWith(...args);
    });

    it('Should unbind events correctly', function () {
        const listener = jest.fn();
        emitter.on('off:event', listener);
        emitter.emit('off:event');
        expect(listener).toHaveBeenCalledTimes(1);
        emitter.off('off:event', listener);
        emitter.emit('off:event');
        expect(listener).toHaveBeenCalledTimes(1);
        expect(emitter.eventsMap['off:event'].length).toBe(0);
        emitter.off();
        expect(Object.keys(emitter.eventsMap).length).toBe(0);
    });
});
