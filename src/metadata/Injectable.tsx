import "reflect-metadata";
import { BehaviorSubject, debounceTime } from "rxjs";

const SERVICE_ID = "__SERVICE_ID__";
const DEFAULT_STATIC_INSTANCE = "ins";

export type Constructor<T> = new (...args: any[]) => T;

export interface ServiceCache {
  staticInstance?: string;
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

export function getService(service: Constructor<any>) {
  const manager = new ServiceManager();
  return manager.get(service)
}

export const GLOBAL_SERVICE_SUBJECT = new BehaviorSubject<BehaviorSubject<any>[]>([]);


class ServiceManager {
  static ID = 0;
  static ins: ServiceManager;

  private services: {
    [id: string]: ServiceCache
  } = {}
  constructor() {
    return ServiceManager.ins ??= this;
  }

  getID(service: Constructor<any>): string {
    return service.prototype.constructor[SERVICE_ID];
  }

  setID(service: Constructor<any>, id: string) {
    return service.prototype.constructor[SERVICE_ID] = id;
  }

  exist(service: Constructor<any>) {
    const id: string | undefined = this.getID(service);
    return id && id in this.services;
  }

  get(service: Constructor<any>) {
    return this.services[this.getID(service)]
  }

  initService(service: Constructor<any>): ServiceCache {
    const id = this.setID(service, `${++ServiceManager.ID}_${service.name}`);
    return this.services[id] = {} as ServiceCache;
  }

  get serviceSubjects() {
    return Object.values(this.services).map(e => e.service$);
  }
}

const callHook = (t: any, hook: string) => {
  if (Reflect.has(t, hook)) {
    Reflect.get(t, hook)()
  }
}
const callCreate = (t: any) => callHook(t, 'OnCreate')
const callChanged = (t: any) => callHook(t, 'OnChanged')
const callUpdate = (t: any) => callHook(t, 'OnUpdate')


/**
 * 创建一个服务
 *
 * ! 不要在服务内使用箭头函数
 */
export function Injectable(config?: {
  global?: boolean
  staticInstance?: string
}) {
  config = Object.assign({}, {
    staticInstance: DEFAULT_STATIC_INSTANCE,
    global: true
  }, config)
  const manager = new ServiceManager();

  return function (target: Constructor<any>) {
    if (manager.exist(target)) return;

    const args: any[] = (Reflect.getMetadata("design:paramtypes", target) as any[] ?? [])
      .filter((param) => manager.exist(param))
      .map((param) => manager.get(param).instance);
    const instance = Reflect.construct(target, args);


    const service = manager.initService(target);
    const proxy = observable(instance, () => {
      callChanged(proxy)
      service$.next(undefined);
    });


    const service$ = new BehaviorSubject(undefined);

    service$.pipe(debounceTime(10)).subscribe(r => {
      callUpdate(proxy)
    });

    service.staticInstance = config?.staticInstance;
    service.instance = proxy;
    service.service$ = service$;

    if (config?.staticInstance?.trim()) {
      target.prototype.constructor[config.staticInstance] = proxy;
    }

    if (config?.global) GLOBAL_SERVICE_SUBJECT.next(manager.serviceSubjects);
    callCreate(proxy)
  };
}