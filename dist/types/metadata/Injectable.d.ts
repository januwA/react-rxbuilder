import "reflect-metadata";
import { BehaviorSubject } from "rxjs";
export declare type Constructor<T> = new (...args: any[]) => T;
export interface ServiceCache {
    staticInstance?: any;
    instance: any;
    service$: BehaviorSubject<any>;
}
export declare function getService(service: Constructor<any>): any;
export declare const serviceSubjects$: BehaviorSubject<BehaviorSubject<any>[]>;
export declare function Injectable(staticInstance?: string): (target: Constructor<any>) => void;
//# sourceMappingURL=Injectable.d.ts.map