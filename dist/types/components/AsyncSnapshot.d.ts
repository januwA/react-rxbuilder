export declare enum ConnectionState {
    none = 0,
    waiting = 1,
    active = 2,
    done = 3
}
export declare class AsyncSnapshot<T> {
    connectionState: ConnectionState;
    data?: T | undefined;
    error?: any;
    private constructor();
    static nothing<T>(): AsyncSnapshot<T>;
    static waiting(): AsyncSnapshot<undefined>;
    static withData(state: ConnectionState, data: any): AsyncSnapshot<any>;
    static withError<T>(state: ConnectionState, error: any): AsyncSnapshot<T>;
    get hasData(): boolean;
    get hasError(): boolean;
    get requireData(): T;
    get rdata(): T;
    inState(state: ConnectionState): AsyncSnapshot<T>;
    toString(): string;
}
//# sourceMappingURL=AsyncSnapshot.d.ts.map