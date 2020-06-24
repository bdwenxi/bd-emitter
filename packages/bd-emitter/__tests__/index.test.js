var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import EventEmitter from '../src';
describe('bd-emitter test', function () {
    var emitter;
    var args = ['AIPE-FE', 'AI Studio', 'Notebook'];
    var context = {};
    beforeAll(function () {
        emitter = new EventEmitter();
    });
    afterEach(function () {
        // remove all events after each test suite
        emitter.off();
    });
    it('should bind event with "on" method correctly', function () {
        var _a;
        var listener = jest.fn();
        emitter.on('on:event', listener, context);
        expect(emitter.eventsMap['on:event'].length).toBe(1);
        expect(emitter.eventsMap['on:event'][0][0]).toBe(listener);
        expect(listener).not.toBeCalled();
        emitter.emit.apply(emitter, __spread(['on:event'], args));
        (_a = expect(listener)).toBeCalledWith.apply(_a, __spread(args));
    });
    it('should bind event with "once" method correctly', function () {
        var _a;
        var listener = jest.fn();
        emitter.once('once:event', listener);
        expect(listener).not.toBeCalled();
        emitter.emit.apply(emitter, __spread(['once:event'], args));
        emitter.emit.apply(emitter, __spread(['once:event'], args));
        expect(listener).toHaveBeenCalledTimes(1);
        (_a = expect(listener)).toBeCalledWith.apply(_a, __spread(args));
    });
    it('Should unbind events correctly', function () {
        var listener = jest.fn();
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
