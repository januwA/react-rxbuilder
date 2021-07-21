import React, { ReactNode } from "react";
import { Observable, Subscription } from "rxjs";
import { AsyncSnapshot, ConnectionState } from "./AsyncSnapshot";

interface RxBuilderProps<T> {
  stream: Observable<T>;
  children: (value: AsyncSnapshot<T>) => ReactNode;
}

interface RxBuilderStates<T> {
  snap: AsyncSnapshot<T>;
}

export class RxBuilder<T> extends React.Component<RxBuilderProps<T>, RxBuilderStates<T>> {
  private _sub?: Subscription;

  state = {
    snap: AsyncSnapshot.nothing<T>(),
  };

  // 现在已连接到流
  private afterConnected(current: AsyncSnapshot<T>): AsyncSnapshot<T> {
    return current.inState(ConnectionState.waiting);
  }

  // 数据事件后
  private afterData(current: AsyncSnapshot<T>, data: T): AsyncSnapshot<T> {
    return AsyncSnapshot.withData(ConnectionState.active, data);
  }

  // 流抛出错误后
  private afterError(current: AsyncSnapshot<T>, error: any): AsyncSnapshot<T> {
    return AsyncSnapshot.withError(ConnectionState.active, error);
  }

  // 流终止后
  private afterDone(current: AsyncSnapshot<T>): AsyncSnapshot<T> {
    return current.inState(ConnectionState.done);
  }

  // 不再连接到流
  private afterDisconnected(current: AsyncSnapshot<T>): AsyncSnapshot<T> {
    return current.inState(ConnectionState.none);
  }

  // 订阅流
  private _subscribe() {
    // 等待连接
    this.setState((prev) => ({
      snap: this.afterConnected(prev.snap),
    }));

    this._sub = this.props.stream.subscribe({
      next: (value: T) => {
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

  // 取消订阅
  private _unsubscribe() {
    this._sub?.unsubscribe();
  }

  componentDidMount() {
    this._subscribe();
  }

  componentDidUpdate(prevProps: RxBuilderProps<T>) {
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
