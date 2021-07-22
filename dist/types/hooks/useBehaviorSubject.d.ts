/// <reference types="react" />
import { BehaviorSubject } from "rxjs";
export declare function observable(data: any, changed: () => void): any;
export declare function useBehaviorSubject<T>(init: T, autoUnsubscribe?: boolean): [
    BehaviorSubject<T>,
    React.Dispatch<React.SetStateAction<BehaviorSubject<T>>>
];
//# sourceMappingURL=useBehaviorSubject.d.ts.map