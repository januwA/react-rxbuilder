import "reflect-metadata";
import { BehaviorSubject, debounceTime } from "rxjs";
const SERVICE_ID = "__SERVICE_ID__";
const DEFAULT_STATIC_INSTANCE = "ins";
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
    const proxy = new Proxy(obj, {
        get(target, key) {
            const des = getOwnPropertyDescriptor(target, key);
            if ((des === null || des === void 0 ? void 0 : des.value) && typeof des.value === "function") {
                return des.value.bind(proxy);
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
export function getService(service) {
    const manager = new ServiceManager();
    return manager.get(service);
}
export const GLOBAL_SERVICE_SUBJECT = new BehaviorSubject([]);
class ServiceManager {
    constructor() {
        var _a;
        this.services = {};
        return (_a = ServiceManager.ins) !== null && _a !== void 0 ? _a : (ServiceManager.ins = this);
    }
    getID(service) {
        return service.prototype.constructor[SERVICE_ID];
    }
    setID(service, id) {
        return service.prototype.constructor[SERVICE_ID] = id;
    }
    exist(service) {
        const id = this.getID(service);
        return id && id in this.services;
    }
    get(service) {
        return this.services[this.getID(service)];
    }
    initService(service) {
        const id = this.setID(service, `${++ServiceManager.ID}_${service.name}`);
        return this.services[id] = {};
    }
    get serviceSubjects() {
        return Object.values(this.services).map(e => e.service$);
    }
}
ServiceManager.ID = 0;
const callHook = (t, hook) => {
    if (Reflect.has(t, hook)) {
        Reflect.get(t, hook)();
    }
};
const callCreate = (t) => callHook(t, 'OnCreate');
const callChanged = (t) => callHook(t, 'OnChanged');
const callUpdate = (t) => callHook(t, 'OnUpdate');
export function Injectable(config) {
    config = Object.assign({}, {
        staticInstance: DEFAULT_STATIC_INSTANCE,
        global: true
    }, config);
    const manager = new ServiceManager();
    return function (target) {
        var _a, _b;
        if (manager.exist(target))
            return;
        const args = ((_a = Reflect.getMetadata("design:paramtypes", target)) !== null && _a !== void 0 ? _a : [])
            .filter((param) => manager.exist(param))
            .map((param) => manager.get(param).instance);
        const instance = Reflect.construct(target, args);
        const service = manager.initService(target);
        const proxy = observable(instance, () => {
            callChanged(proxy);
            service$.next(undefined);
        });
        const service$ = new BehaviorSubject(undefined);
        service$.pipe(debounceTime(10)).subscribe(r => {
            callUpdate(proxy);
        });
        service.staticInstance = config === null || config === void 0 ? void 0 : config.staticInstance;
        service.instance = proxy;
        service.service$ = service$;
        if ((_b = config === null || config === void 0 ? void 0 : config.staticInstance) === null || _b === void 0 ? void 0 : _b.trim()) {
            target.prototype.constructor[config.staticInstance] = proxy;
        }
        if (config === null || config === void 0 ? void 0 : config.global)
            GLOBAL_SERVICE_SUBJECT.next(manager.serviceSubjects);
        callCreate(proxy);
    };
}
