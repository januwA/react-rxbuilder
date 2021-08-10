import { Constructor } from "../metadata/Injectable";
declare type MapPredicate<T> = T extends Constructor<any> ? InstanceType<T> : never;
declare type Mapped<Arr extends Array<unknown>, Result extends Array<unknown> = []> = Arr extends [] ? [] : Arr extends [infer H] ? [...Result, MapPredicate<H>] : Arr extends [infer Head, ...infer Tail] ? Mapped<[...Tail], [...Result, MapPredicate<Head>]> : Readonly<Result>;
export declare function useService<C extends Constructor<any>, Classes extends C[]>(...klasses: [...Classes]): Mapped<Classes>;
export {};
//# sourceMappingURL=useService.d.ts.map