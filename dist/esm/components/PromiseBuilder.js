import React from "react";
import { AsyncSnapshot, ConnectionState } from "./AsyncSnapshot";
export class PromiseBuilder extends React.Component {
    constructor() {
        super(...arguments);
        this._activeCallbackIdentity = null;
        this.state = {
            snap: AsyncSnapshot.nothing(),
        };
    }
    _subscribe() {
        this.setState((prev) => ({
            snap: prev.snap.inState(ConnectionState.waiting),
        }));
        const callbackIdentity = {};
        this._activeCallbackIdentity = callbackIdentity;
        this.props.promise
            .then((value) => {
            if (this._activeCallbackIdentity == callbackIdentity) {
                this.setState({
                    snap: AsyncSnapshot.withData(ConnectionState.done, value),
                });
            }
        })
            .catch((err) => {
            if (this._activeCallbackIdentity == callbackIdentity) {
                this.setState({
                    snap: AsyncSnapshot.withError(ConnectionState.done, err),
                });
            }
        });
    }
    _unsubscribe() {
        this._activeCallbackIdentity = null;
    }
    componentDidMount() {
        this._subscribe();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.promise !== this.props.promise) {
            if (this._activeCallbackIdentity !== null) {
                this._unsubscribe();
                this.state.snap = this.state.snap.inState(ConnectionState.none);
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
