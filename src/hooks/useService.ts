import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { observable } from "./observable";

const SERVICE = "__SERVICE__";
const SINGLETON = "__SINGLETON__";

export function singleton<T>(ctx: T): T {
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
): {
  service: T;
  service$: BehaviorSubject<T>;

  /**
   * 销毁流和缓存的单例，通常没必要这样做，service将在app声明其中一直存在
   *
   * isShared = false时会在页面销毁时自动销毁
   */
  destroy: () => void;
} {
  if (!isShared) {
    // 不会共享，页面销毁时自动销毁
    const proxyService = observable(service, () => service$.next(proxyService));
    const [service$] = useState(new BehaviorSubject<T>(proxyService));
    useEffect(() => {
      return () => service$.unsubscribe();
    }, []);

    return {
      service: proxyService as T,
      service$: service$ as BehaviorSubject<T>,
      destroy: () => {
        /* 自动销毁 */
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
      (cons[SERVICE].service$ as BehaviorSubject<T>).unsubscribe();
    cons[SERVICE].service$ = null;
  };

  if (cons[SERVICE].service) {
    // 已经被代理过直接返回数据
    return {
      service: cons[SERVICE].service as T,
      service$: cons[SERVICE].service$,
      destroy,
    };
  } else {
    // 代理数据
    const proxyService: T = observable(service, () =>
      service$.next(proxyService)
    );

    // 是否是使用singleton创建的单例
    if (cons[SINGLETON] && cons[SINGLETON].instance) {
      cons[SINGLETON].instance = proxyService;
    }

    // 创建流
    const [service$] = useState(new BehaviorSubject<T>(proxyService));

    // 写入缓存
    cons[SERVICE].service = proxyService;
    cons[SERVICE].service$ = service$;

    return {
      service: proxyService as T,
      service$: service$ as BehaviorSubject<T>,
      destroy,
    };
  }
}
