export var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["none"] = 0] = "none";
    ConnectionState[ConnectionState["waiting"] = 1] = "waiting";
    ConnectionState[ConnectionState["active"] = 2] = "active";
    ConnectionState[ConnectionState["done"] = 3] = "done";
})(ConnectionState || (ConnectionState = {}));
export class AsyncSnapshot {
    connectionState;
    data;
    error;
    constructor(connectionState, data, error) {
        this.connectionState = connectionState;
        this.data = data;
        this.error = error;
    }
    static nothing() {
        return new AsyncSnapshot(ConnectionState.none, undefined, undefined);
    }
    static waiting() {
        return new AsyncSnapshot(ConnectionState.waiting, undefined, undefined);
    }
    static withData(state, data) {
        return new AsyncSnapshot(state, data, undefined);
    }
    static withError(state, error) {
        return new AsyncSnapshot(state, undefined, error);
    }
    get hasData() {
        return this.data !== undefined;
    }
    get hasError() {
        return this.error !== undefined;
    }
    get requireData() {
        if (this.hasData)
            return this.data;
        if (this.hasError)
            throw this.error;
        throw "Snapshot has neither data nor error";
    }
    inState(state) {
        return new AsyncSnapshot(state, this.data, this.error);
    }
    toString() {
        return `AsyncSnapshot: ${ConnectionState[this.connectionState]}, ${this.data}, ${this.error}`;
    }
}
