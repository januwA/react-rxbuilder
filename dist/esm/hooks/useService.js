import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { observable } from "./observable";
const SERVICE = "__SERVICE__";
function _init(ctx) {
    const prototype = Object.getPrototypeOf(ctx);
    const cons = prototype.constructor;
    const proxyInstance = observable(ctx, () => service$.next(proxyInstance), new WeakMap());
    const service$ = new BehaviorSubject(proxyInstance);
    cons[SERVICE] = {
        instance: proxyInstance,
        service$,
    };
    return proxyInstance;
}
export function singleton(ctx) {
    const prototype = Object.getPrototypeOf(ctx);
    const staticCtx = Object.getOwnPropertyDescriptor(prototype, "constructor");
    if (!staticCtx) {
        throw new Error("singleton Error: can't get constructor function");
    }
    const cons = staticCtx.value;
    if (!cons.hasOwnProperty(SERVICE))
        return _init(ctx);
    return cons[SERVICE].instance;
}
export function useService(service, isShared = true) {
    if (!isShared) {
        const proxyService = observable(service, () => service$.next(proxyService), new WeakMap());
        const [service$] = useState(new BehaviorSubject(proxyService));
        useEffect(() => {
            return () => service$.unsubscribe();
        }, []);
        return [proxyService, service$, () => { }];
    }
    const prototype = Object.getPrototypeOf(service);
    const staticCtx = Object.getOwnPropertyDescriptor(prototype, "constructor");
    if (!staticCtx) {
        throw new Error("useService Error: can't get constructor function");
    }
    const cons = staticCtx.value;
    if (!cons.hasOwnProperty(SERVICE)) {
        _init(service);
    }
    const destroy = () => {
        cons[SERVICE].instance = null;
        if (cons[SERVICE].service$)
            cons[SERVICE].service$.unsubscribe();
        cons[SERVICE].service$ = null;
        delete cons[SERVICE];
    };
    return [cons[SERVICE].instance, cons[SERVICE].service$, destroy];
}
