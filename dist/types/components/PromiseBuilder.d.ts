import React, { ReactNode } from "react";
import { AsyncSnapshot } from "./AsyncSnapshot";
interface PromiseBuilderProps<T> {
    promise: Promise<T>;
    children: (value: AsyncSnapshot<T>) => ReactNode;
}
interface PromiseBuilderStates<T> {
    snap: AsyncSnapshot<T>;
}
export declare class PromiseBuilder<T> extends React.Component<PromiseBuilderProps<T>, PromiseBuilderStates<T>> {
    private _activeCallbackIdentity?;
    state: {
        snap: AsyncSnapshot<T>;
    };
    private _subscribe;
    private _unsubscribe;
    componentDidMount(): void;
    componentDidUpdate(prevProps: PromiseBuilderProps<T>): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=PromiseBuilder.d.ts.map