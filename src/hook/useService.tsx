import { getServiceCache } from "../metadata/Injectable";

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

function getService(service: any) {
  if (service.name) {
    const cache = getServiceCache();
    return cache[service.name]?.instance;
  }
}

export function useService<T>(service: Type<T>): T;
export function useService<A>(service: [Type<A>]): [A];
export function useService<A, B>(service: [Type<A>, Type<B>]): [A, B];
export function useService<A, B, C>(
  service: [Type<A>, Type<B>, Type<C>]
): [A, B, C];
export function useService<A, B, C, D>(
  service: [Type<A>, Type<B>, Type<C>, Type<D>]
): [A, B, C, D];
export function useService<A, B, C, D, E>(
  service: [Type<A>, Type<B>, Type<C>, Type<D>, Type<E>]
): [A, B, C, D, E];
export function useService<A, B, C, D, E, F>(
  service: [Type<A>, Type<B>, Type<C>, Type<D>, Type<E>, Type<F>]
): [A, B, C, D, E, F];
export function useService<A, B, C, D, E, F, G>(
  service: [Type<A>, Type<B>, Type<C>, Type<D>, Type<E>, Type<F>, Type<G>]
): [A, B, C, D, E, F, G];
export function useService<A, B, C, D, E, F, G, H>(
  service: [
    Type<A>,
    Type<B>,
    Type<C>,
    Type<D>,
    Type<E>,
    Type<F>,
    Type<G>,
    Type<H>
  ]
): [A, B, C, D, E, F, G, H];
export function useService<A, B, C, D, E, F, G, H, I, J>(
  service: [
    Type<A>,
    Type<B>,
    Type<C>,
    Type<D>,
    Type<E>,
    Type<F>,
    Type<G>,
    Type<H>,
    Type<I>,
    Type<J>
  ]
): [A, B, C, D, E, F, G, H, I, J];
export function useService(service: any): any {
  if (Array.isArray(service)) return service.map(getService);
  return getService(service);
}
