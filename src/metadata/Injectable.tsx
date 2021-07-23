import "reflect-metadata";
import { Subject } from "rxjs";

export const SERVICES = "__SERVICES__";
export const DEFAULT_STATIC_INSTANCE = "ins";

function isLikeOnject(value: any): boolean {
  return typeof value === "object" && value !== null;
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

function observable(data: any, changed: () => void) {
  if (!observable.prototype.objcache) {
    observable.prototype.objcache = new WeakMap();
  }

  const objcache: WeakMap<any, boolean> = observable.prototype.objcache;

  if (!isLikeOnject(data) || objcache.has(data)) return data;

  objcache.set(data, true);

  for (const key in data) {
    const value = data[key];
    // 递归代理
    if (isLikeOnject(value)) data[key] = observable(value, changed);
  }

  const proxy: any = new Proxy(data, {
    get(target: any, key: any) {
      const des = getOwnPropertyDescriptor(target, key);
      if (des?.value && typeof des.value === "function")
        return des.value.bind(proxy);
      if (des?.get) return des.get.call(proxy);
      return target[key];
    },
    set(target: any, key: any, value: any, receiver: any) {
      const des = getOwnPropertyDescriptor(target, key);
      value = observable(value, changed);
      if (des?.set) des.set.call(proxy, value);
      else target[key] = value;
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

  return function (target: any) {
    const className = target.name;
    if (className in cons[SERVICES]) return;

    const cache: {
      instance?: any;
      service$?: Subject<any>;
    } = (cons[SERVICES][className] = {});

    const args: any[] = [];
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

    // 将单例写入静态属性上
    target.prototype.constructor[
      staticInstance.trim().length ? staticInstance : DEFAULT_STATIC_INSTANCE
    ] = proxyInstance;
  };
}
