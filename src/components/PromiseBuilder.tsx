import React, { ReactNode } from "react";
import { AsyncSnapshot, ConnectionState } from "./AsyncSnapshot";

interface PromiseBuilderProps<T> {
  promise: Promise<T>;
  children: (value: AsyncSnapshot<T>) => ReactNode;
}

interface PromiseBuilderStates<T> {
  snap: AsyncSnapshot<T>;
}

export class PromiseBuilder<T> extends React.Component<
  PromiseBuilderProps<T>,
  PromiseBuilderStates<T>
> {
  private _activeCallbackIdentity?: any = null;

  state = {
    snap: AsyncSnapshot.nothing<T>(),
  };

  private _subscribe() {
    // 等待连接
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

  private _unsubscribe() {
    this._activeCallbackIdentity = null;
  }

  componentDidMount() {
    this._subscribe();
  }

  componentDidUpdate(prevProps: PromiseBuilderProps<T>) {
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
