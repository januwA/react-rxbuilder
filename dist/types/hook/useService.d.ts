export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export declare function useService<T>(service: Type<T>): T;
export declare function useService<A>(service: [Type<A>]): [A];
export declare function useService<A, B>(service: [Type<A>, Type<B>]): [A, B];
export declare function useService<A, B, C>(service: [Type<A>, Type<B>, Type<C>]): [A, B, C];
export declare function useService<A, B, C, D>(service: [Type<A>, Type<B>, Type<C>, Type<D>]): [A, B, C, D];
export declare function useService<A, B, C, D, E>(service: [Type<A>, Type<B>, Type<C>, Type<D>, Type<E>]): [A, B, C, D, E];
export declare function useService<A, B, C, D, E, F>(service: [Type<A>, Type<B>, Type<C>, Type<D>, Type<E>, Type<F>]): [A, B, C, D, E, F];
export declare function useService<A, B, C, D, E, F, G>(service: [Type<A>, Type<B>, Type<C>, Type<D>, Type<E>, Type<F>, Type<G>]): [A, B, C, D, E, F, G];
export declare function useService<A, B, C, D, E, F, G, H>(service: [
    Type<A>,
    Type<B>,
    Type<C>,
    Type<D>,
    Type<E>,
    Type<F>,
    Type<G>,
    Type<H>
]): [A, B, C, D, E, F, G, H];
export declare function useService<A, B, C, D, E, F, G, H, I, J>(service: [
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
]): [A, B, C, D, E, F, G, H, I, J];
//# sourceMappingURL=useService.d.ts.map