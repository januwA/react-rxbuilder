import "reflect-metadata";
import { Subject } from "rxjs";
export const SERVICES = "__SERVICES__";
export const DEFAULT_STATIC_INSTANCE = "ins";
function isLikeOnject(value) {
    return typeof value === "object" && value !== null;
}
function getOwnPropertyDescriptor(target, key) {
    if (!(key in target))
        return;
    const des = Object.getOwnPropertyDescriptor(target, key);
    if (des)
        return des;
    return getOwnPropertyDescriptor(Object.getPrototypeOf(target), key);
}
function observable(data, changed) {
    if (!observable.prototype.objcache) {
        observable.prototype.objcache = new WeakMap();
    }
    const objcache = observable.prototype.objcache;
    if (!isLikeOnject(data) || objcache.has(data))
        return data;
    objcache.set(data, true);
    for (const key in data) {
        const value = data[key];
        if (isLikeOnject(value))
            data[key] = observable(value, changed);
    }
    const proxy = new Proxy(data, {
        get(target, key) {
            const des = getOwnPropertyDescriptor(target, key);
            if (des?.value && typeof des.value === "function")
                return des.value.bind(proxy);
            if (des?.get)
                return des.get.call(proxy);
            return target[key];
        },
        set(target, key, value, receiver) {
            const des = getOwnPropertyDescriptor(target, key);
            value = observable(value, changed);
            if (des?.set)
                des.set.call(proxy, value);
            else
                target[key] = value;
            changed();
            return true;
        },
    });
    objcache.set(proxy, true);
    return proxy;
}
export function Injectable(staticInstance = DEFAULT_STATIC_INSTANCE) {
    const cons = Injectable.prototype.constructor;
    cons[SERVICES] ??= {};
    return function (target) {
        const className = target.name;
        if (className in cons[SERVICES])
            return;
        const cache = (cons[SERVICES][className] = {});
        const args = [];
        const paramtypes = Reflect.getMetadata("design:paramtypes", target) ?? [];
        for (const pa of paramtypes) {
            if (pa.name in cons[SERVICES]) {
                args.push(cons[SERVICES][pa.name].instance);
            }
        }
        const instance = Reflect.construct(target, args);
        const proxyInstance = observable(instance, () => service$.next(void 0));
        const service$ = new Subject();
        cache.instance = proxyInstance;
        cache.service$ = service$;
        target.prototype.constructor[staticInstance.trim().length ? staticInstance : DEFAULT_STATIC_INSTANCE] = proxyInstance;
    };
}
