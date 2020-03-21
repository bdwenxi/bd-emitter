interface IEventFunction extends Function {
    listener?: Function;
}

interface IEventsMap {
    [name: string]: [IEventFunction, Object][];
}

class EventEmitter {
    eventsMap: IEventsMap;

    constructor() {
        this._reset();
    }

    private _reset() {
        this.eventsMap = {};
    }

    on(name: string, listener: Function, context: Object = this): EventEmitter {
        if (!this.eventsMap[name]) {
            this.eventsMap[name] = [];
        }

        this.eventsMap[name].push([listener, context]);
        return this;
    }

    once(name: string, listener: Function, context: Object = this): EventEmitter {
        const cache: IEventFunction = (...args: any[]) => {
            this.off(name, cache);

            listener.apply(context, args);
        };

        cache.listener = listener;

        this.on(name, cache);
        return this;
    }

    off(name?: string, listener?: Function): EventEmitter {
        if (!name && !listener) {
            this._reset();
            return this;
        }

        if (!name) {
            return this;
        }

        if (!listener) {
            this.eventsMap[name] = [];
            return this;
        }

        const events = this.eventsMap[name];

        if (!events) {
            return this;
        }

        const len = events.length;

        for (let i = 0; i < len; i++) {
            const [callback] = events[i];

            if (callback === listener || callback.listener === listener) {
                events.splice(i, 1);
            }
        }

        return this;
    }

    emit(name: string, ...args: any[]) {
        let events = this.eventsMap[name];

        if (!events) {
            return;
        }

        const clonedEvt = [...events];
        const len = clonedEvt.length;

        for (let i = 0; i < len; i++) {
            const [listener, context] = clonedEvt[i];

            if (!!listener && typeof listener === 'function') {
                listener.apply(context, args);
            }
        }
    }
}

export default EventEmitter;
