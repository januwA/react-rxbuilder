import { FC, ReactNode } from "react";
import { UnaryFunction } from "rxjs";
export declare const RxService: FC<{
    children: (...args: any) => ReactNode;
    pipe?: UnaryFunction<any, any>;
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