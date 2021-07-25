import "reflect-metadata";
import { BehaviorSubject } from "rxjs";
const SERVICES = "__SERVICES__";
const DEFAULT_STATIC_INSTANCE = "ins";
function isLikeOnject(value) {
    return typeof value === "object" && value !== null;
}
function likeArrowFunc(f) {
    return !f.prototype;
}
function getOwnPropertyDescriptor(target, key) {
    if (!(key in target))
        return;
    const des = Object.getOwnPropertyDescriptor(target, key);
    if (des)
        return des;
    return getOwnPropertyDescriptor(Object.getPrototypeOf(target), key);
}
function observable(obj, changed) {
    var _a, _b;
    var _c;
    (_a = (_c = observable.prototype).objcache) !== null && _a !== void 0 ? _a : (_c.objcache = new WeakMap());
    const objcache = observable.prototype.objcache;
    if (!isLikeOnject(obj))
        return obj;
    if (objcache.has(obj))
        return (_b = objcache.get(obj)) !== null && _b !== void 0 ? _b : obj;
    objcache.set(obj, undefined);
    for (const key in obj) {
        const value = obj[key];
        if (isLikeOnject(value))
            obj[key] = observable(value, changed);
    }
    function pfunc(fun, ...args) {
        const v = fun.call(this, ...args);
        return changed(), v;
    }
    const proxy = new Proxy(obj, {
        get(target, key) {
            const des = getOwnPropertyDescriptor(target, key);
            if ((des === null || des === void 0 ? void 0 : des.value) && typeof des.value === "function") {
                return likeArrowFunc(des.value)
                    ? pfunc.bind(proxy, des === null || des === void 0 ? void 0 : des.value)
                    : des.value.bind(proxy);
            }
            if (des === null || des === void 0 ? void 0 : des.get)
                return des.get.call(proxy);
            return target[key];
        },
        set(target, key, value) {
            const des = getOwnPropertyDescriptor(target, key);
            value = observable(value, changed);
            if (des === null || des === void 0 ? void 0 : des.set)
                des.set.call(proxy, value);
            else
                target[key] = value;
            changed();
            return true;
        },
    });
    objcache.set(obj, proxy);
    objcache.set(proxy, undefined);
    return proxy;
}
export function getServiceCache() {
    var _a;
    return (_a = Injectable.prototype.constructor[SERVICES]) !== null && _a !== void 0 ? _a : {};
}
export function Injectable(staticInstance = DEFAULT_STATIC_INSTANCE) {
    var _a;
    const cons = Injectable.prototype.constructor;
    (_a = cons[SERVICES]) !== null && _a !== void 0 ? _a : (cons[SERVICES] = {});
    return function (target) {
        var _a;
        const className = target.name;
        if (className in cons[SERVICES])
            return;
        cons[SERVICES][className] = {};
        const paramtypes = (_a = Reflect.getMetadata("design:paramtypes", target)) !== null && _a !== void 0 ? _a : [];
        const args = paramtypes
            .filter((pa) => pa.name in cons[SERVICES])
            .map((pa) => cons[SERVICES][pa.name].instance);
        const instance = Reflect.construct(target, args);
        const proxyInstance = observable(instance, () => {
            service$.next(undefined);
        });
        const service$ = new BehaviorSubject(undefined);
        cons[SERVICES][className].staticInstance = staticInstance;
        cons[SERVICES][className].instance = proxyInstance;
        cons[SERVICES][className].service$ = service$;
        if (staticInstance.trim())
            target.prototype.constructor[staticInstance] = proxyInstance;
    };
}
