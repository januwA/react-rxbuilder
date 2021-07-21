import React, { ReactNode } from "react";
import { Observable } from "rxjs";
import { AsyncSnapshot } from "./AsyncSnapshot";
interface RxBuilderProps<T> {
    stream: Observable<T>;
    children: (value: AsyncSnapshot<T>) => ReactNode;
}
interface RxBuilderStates<T> {
    snap: AsyncSnapshot<T>;
}
export declare class RxBuilder<T> extends React.Component<RxBuilderProps<T>, RxBuilderStates<T>> {
    private _sub?;
    state: {
        snap: AsyncSnapshot<T>;
    };
    private afterConnected;
    private afterData;
    private afterError;
    private afterDone;
    private afterDisconnected;
    private _subscribe;
    private _unsubscribe;
    componentDidMount(): void;
    componentDidUpdate(prevProps: RxBuilderProps<T>): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=RxBuilder.d.ts.map