import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { observable } from "./observable";
const SERVICE = "__SERVICE__";
const SINGLETON = "__SINGLETON__";
export function singleton(ctx) {
    const prototype = Object.getPrototypeOf(ctx);
    const staticCtx = Object.getOwnPropertyDescriptor(prototype, "constructor");
    if (!staticCtx) {
        throw new Error("singleton Error: can't get constructor function");
    }
    const cons = staticCtx.value;
    if (!cons.hasOwnProperty(SINGLETON)) {
        cons[SINGLETON] = {
            instance: null,
        };
    }
    return cons[SINGLETON].instance
        ? cons[SINGLETON].instance
        : (cons[SINGLETON].instance = ctx);
}
export function useService(service, isShared = true) {
    if (!isShared) {
        const proxyService = observable(service, () => service$.next(proxyService));
        const [service$] = useState(new BehaviorSubject(proxyService));
        useEffect(() => {
            return () => service$.unsubscribe();
        }, []);
        return {
            service: proxyService,
            service$: service$,
            destroy: () => {
            },
        };
    }
    const prototype = Object.getPrototypeOf(service);
    const staticCtx = Object.getOwnPropertyDescriptor(prototype, "constructor");
    if (!staticCtx) {
        throw new Error("useService Error: can't get constructor function");
    }
    const cons = staticCtx.value;
    if (!cons.hasOwnProperty(SERVICE)) {
        cons[SERVICE] = {
            service: null,
            service$: null,
        };
    }
    const destroy = () => {
        cons[SERVICE].service = null;
        if (cons[SERVICE].service$)
            cons[SERVICE].service$.unsubscribe();
        cons[SERVICE].service$ = null;
    };
    if (cons[SERVICE].service) {
        return {
            service: cons[SERVICE].service,
            service$: cons[SERVICE].service$,
            destroy,
        };
    }
    else {
        const proxyService = observable(service, () => service$.next(proxyService));
        if (cons[SINGLETON] && cons[SINGLETON].instance) {
            cons[SINGLETON].instance = proxyService;
        }
        const [service$] = useState(new BehaviorSubject(proxyService));
        cons[SERVICE].service = proxyService;
        cons[SERVICE].service$ = service$;
        return {
            service: proxyService,
            service$: service$,
            destroy,
        };
    }
}
