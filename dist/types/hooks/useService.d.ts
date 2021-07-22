import { BehaviorSubject } from "rxjs";
export declare function singleton<T>(ctx: T): T;
export declare function useService<T>(service: T, isShared?: boolean): {
    service: T;
    service$: BehaviorSubject<T>;
    destroy: () => void;
};
//# sourceMappingURL=useService.d.ts.map