import "reflect-metadata";
import { BehaviorSubject } from "rxjs";

export const SERVICES = "__SERVICES__";
export const DEFAULT_STATIC_INSTANCE = "ins";

function isLikeOnject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function likeArrowFunc(f: Function): boolean {
  return !f.prototype;
}

function getOwnPropertyDescriptor(
  target: any,
  key: any
): PropertyDescriptor | undefined {
  if (!(key in target)) return;
  const des = Object.getOwnPropertyDescriptor(target, key);
  if (des) return des;
  return getOwnPropertyDescriptor(Object.getPrototypeOf(target), key);
}

function observable(obj: any, changed: () => void) {
  if (!observable.prototype.objcache) {
    observable.prototype.objcache = new WeakMap();
  }

  const objcache: WeakMap<any, any> = observable.prototype.objcache;

  if (!isLikeOnject(obj)) return obj;

  if (objcache.has(obj)) return objcache.get(obj) ?? obj;

  objcache.set(obj, undefined);

  for (const key in obj) {
    const value = obj[key];
    // 递归代理
    if (isLikeOnject(value)) obj[key] = observable(value, changed);
  }

  // 代理函数
  function pfunc(this: any, fun: any, ...args: any[]) {
    const v = fun.call(this, ...args);
    return changed(), v;
  }

  const proxy: any = new Proxy(obj, {
    get(target: any, key: any) {
      const des = getOwnPropertyDescriptor(target, key);
      if (des?.value && typeof des.value === "function") {
        return likeArrowFunc(des.value)
          ? pfunc.bind(proxy, des?.value)
          : des.value.bind(proxy);
      }

      if (des?.get) return des.get.call(proxy);
      return target[key];
    },
    set(target: any, key: any, value: any) {
      const des = getOwnPropertyDescriptor(target, key);
      value = observable(value, changed);
      if (des?.set) des.set.call(proxy, value);
      else target[key] = value;
      changed();
      return true;
    },
  });

  objcache.set(obj, proxy);
  objcache.set(proxy, undefined);

  return proxy;
}

export function Injectable(staticInstance = DEFAULT_STATIC_INSTANCE) {
  const cons = Injectable.prototype.constructor;
  cons[SERVICES] ??= {};

  return function <T extends { new (...args: any[]): {} }>(target: T) {
    const className = target.name;
    if (className in cons[SERVICES]) return;

    const cache: {
      staticInstance?: any;
      instance?: any;
      service$?: BehaviorSubject<any>;
    } = (cons[SERVICES][className] = {});

    const args: any[] = [];
    const paramtypes = Reflect.getMetadata("design:paramtypes", target) ?? [];
    for (const pa of paramtypes) {
      if (pa.name in cons[SERVICES])
        args.push(cons[SERVICES][pa.name].instance);
    }

    const instance = Reflect.construct(target, args);
    const proxyInstance = observable(instance, () => {
      service$.next(undefined);
    });
    const service$ = new BehaviorSubject(undefined);
    cache.staticInstance = staticInstance;
    cache.instance = proxyInstance;
    cache.service$ = service$;

    if (staticInstance.trim())
      target.prototype.constructor[staticInstance] = proxyInstance;
  };
}
