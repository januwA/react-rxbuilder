import React from "react";
import { AsyncSnapshot, ConnectionState } from "./AsyncSnapshot";
export class RxBuilder extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            snap: AsyncSnapshot.nothing(),
        };
    }
    afterConnected(current) {
        return current.inState(ConnectionState.waiting);
    }
    afterData(current, data) {
        return AsyncSnapshot.withData(ConnectionState.active, data);
    }
    afterError(current, error) {
        return AsyncSnapshot.withError(ConnectionState.active, error);
    }
    afterDone(current) {
        return current.inState(ConnectionState.done);
    }
    afterDisconnected(current) {
        return current.inState(ConnectionState.none);
    }
    _subscribe() {
        this.setState((prev) => ({
            snap: this.afterConnected(prev.snap),
        }));
        this._sub = this.props.stream.subscribe({
            next: (value) => {
                this.setState((prev) => ({
                    snap: this.afterData(prev.snap, value),
                }));
            },
            error: (err) => {
                this.setState((prev) => ({
                    snap: this.afterError(prev.snap, err),
                }));
            },
            complete: () => {
                this.setState((prev) => ({
                    snap: this.afterDone(prev.snap),
                }));
            },
        });
    }
    _unsubscribe() {
        var _a;
        (_a = this._sub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    componentDidMount() {
        this._subscribe();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.stream !== this.props.stream) {
            if (this._sub) {
                this._unsubscribe();
                this.state.snap = this.afterDisconnected(this.state.snap);
            }
            this._subscribe();
        }
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    render() {
        return this.props.children(this.state.snap);
    }
}
