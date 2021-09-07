import { FC, ReactNode } from "react";
import { UnaryFunction } from "rxjs";
import { Constructor } from "../metadata/Injectable";
export declare const RxService: FC<{
    children: (...args: any) => ReactNode;
    pipe?: UnaryFunction<any, any>;
    services?: Constructor<any>[];
}>;
export interface OnCreate {
    OnCreate(): any;
}
export interface OnChanged {
    OnChanged(): any;
}
export interface OnUpdate {
    OnUpdate(): any;
}
//# sourceMappingURL=RxService.d.ts.map