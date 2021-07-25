import "reflect-metadata";
import { BehaviorSubject } from "rxjs";
export interface ServiceCache {
    staticInstance?: any;
    instance: any;
    service$: BehaviorSubject<any>;
}
export declare function getServiceCache(): {
    [sname: string]: ServiceCache;
};
export declare const serviceList$: BehaviorSubject<BehaviorSubject<any>[]>;
export declare function Injectable(staticInstance?: string): <T extends new (...args: any[]) => {}>(target: T) => void;
//# sourceMappingURL=Injectable.d.ts.map