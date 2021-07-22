export enum ConnectionState {
  none,
  waiting,
  active,
  done,
}

export class AsyncSnapshot<T> {
  private constructor(
    public connectionState: ConnectionState,
    public data?: T,
    public error?: any
  ) {}

  static nothing<T>() {
    return new AsyncSnapshot<T>(ConnectionState.none, undefined, undefined);
  }

  static waiting() {
    return new AsyncSnapshot(ConnectionState.waiting, undefined, undefined);
  }

  static withData(state: ConnectionState, data: any) {
    return new AsyncSnapshot(state, data, undefined);
  }

  static withError<T>(state: ConnectionState, error: any) {
    return new AsyncSnapshot<T>(state, undefined, error);
  }

  get hasData(): boolean {
    return this.data !== undefined;
  }

  get hasError(): boolean {
    return this.error !== undefined;
  }

  get requireData(): T {
    if (this.hasData) return this.data!;
    if (this.hasError) throw this.error!;
    throw "Snapshot has neither data nor error";
  }

  /**
   * 我更新喜欢这种方式，所以添加了一个
   */
  get rdata(): T {
    return this.requireData;
  }

  inState(state: ConnectionState): AsyncSnapshot<T> {
    return new AsyncSnapshot<T>(state, this.data, this.error);
  }

  toString(): string {
    return `AsyncSnapshot: ${ConnectionState[this.connectionState]}, ${
      this.data
    }, ${this.error}`;
  }
}
