import "reflect-metadata";
import { BehaviorSubject } from "rxjs";

const SERVICES = "__SERVICES__";
const DEFAULT_STATIC_INSTANCE = "ins";

export interface ServiceCache {
  staticInstance?: any;
  instance: any;
  service$: BehaviorSubject<any>;
}

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

function observable(obj: any, changed: () => void) {
  observable.prototype.objcache ??= new WeakMap();
  const objcache: WeakMap<any, any> = observable.prototype.objcache;

  if (!isLikeOnject(obj)) return obj;

  if (objcache.has(obj)) return objcache.get(obj) ?? obj;

  objcache.set(obj, undefined);

  for (const key in obj) {
    const value = obj[key];
    // 递归代理
    if (isLikeOnject(value)) obj[key] = observable(value, changed);
  }

  const proxy: any = new Proxy(obj, {
    get(target: any, key: any) {
      const des = getOwnPropertyDescriptor(target, key);
      if (des?.value && typeof des.value === "function") {
        return des.value.bind(proxy);
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

export function getServiceCache(): {
  [sname: string]: ServiceCache;
} {
  return Injectable.prototype.constructor[SERVICES] ?? {};
}

function getServiceList(): BehaviorSubject<any>[] {
  return Object.values(getServiceCache()).map((e) => e.service$);
}

/**
 * service 列表流
 */
export const serviceList$ = new BehaviorSubject<BehaviorSubject<any>[]>([]);

/**
 * 创建一个服务
 *
 * ! 不要在服务内使用箭头函数
 * @param staticInstance 默认将单例保存在静态属性`ins`上
 * @returns
 */
export function Injectable(staticInstance = DEFAULT_STATIC_INSTANCE) {
  const cons = Injectable.prototype.constructor;
  cons[SERVICES] ??= {};

  return function <T extends { new (...args: any[]): {} }>(target: T) {
    const className = target.name;

    if (className in cons[SERVICES]) return;
    cons[SERVICES][className] = {};

    const paramtypes: any[] =
      Reflect.getMetadata("design:paramtypes", target) ?? [];
    const args: any[] = paramtypes
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

    if (staticInstance.trim()) {
      target.prototype.constructor[staticInstance] = proxyInstance;
    }

    serviceList$.next(getServiceList());
  };
}
