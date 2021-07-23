import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { observable } from "./observable";

const SERVICE = "__SERVICE__";

/**
 * 初始化单例和流
 * @param ctx
 * @returns
 */
function _init<T>(ctx: T): T {
  const prototype = Object.getPrototypeOf(ctx);
  const cons = prototype.constructor;

  const proxyInstance: T = observable(
    ctx,
    () => service$.next(proxyInstance),
    new WeakMap()
  );

  const service$ = new BehaviorSubject<T>(proxyInstance);

  cons[SERVICE] = {
    instance: proxyInstance,
    service$,
  };
  return proxyInstance;
}

/**
 * 创建单例,返回单例
 * @param ctx
 * @returns
 */
export function singleton<T>(ctx: T): T {
  const prototype = Object.getPrototypeOf(ctx);
  const staticCtx = Object.getOwnPropertyDescriptor(prototype, "constructor");

  if (!staticCtx) {
    throw new Error("singleton Error: can't get constructor function");
  }

  const cons = staticCtx.value;

  if (!cons.hasOwnProperty(SERVICE)) return _init(ctx);
  return cons[SERVICE].instance;
}

/**
 * 组件的工作只管用户体验，而不用顾及其它
 *
 * 组件应该把诸如从服务器获取数据、验证用户输入或直接往控制台中写日志等工作委托给各种服务。通过把各种处理任务定义到可服务类中，你可以让它被任何组件使用
 *
 * @param service
 * @returns
 */
export function useService<T>(
  service: T,
  isShared = true
): [service: T, service$: BehaviorSubject<T>, destroy: () => void] {
  if (!isShared) {
    // 临时 service
    const proxyService: T = observable(
      service,
      () => service$.next(proxyService),
      new WeakMap()
    );
    const [service$] = useState(new BehaviorSubject<T>(proxyService));
    useEffect(() => {
      return () => service$.unsubscribe();
    }, []);
    return [proxyService, service$, () => {}];
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
      (cons[SERVICE].service$ as BehaviorSubject<T>).unsubscribe();
    cons[SERVICE].service$ = null;
    delete cons[SERVICE];
  };

  return [cons[SERVICE].instance as T, cons[SERVICE].service$, destroy];
}
