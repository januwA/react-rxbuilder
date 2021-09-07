import { Constructor, getService } from "../metadata/Injectable";

// https://stackoverflow.com/questions/68506919
type MapPredicate<T> = T extends Constructor<any> ? InstanceType<T> : never;

type Mapped<
  Arr extends Array<unknown>,
  Result extends Array<unknown> = []
  > = Arr extends []
  ? []
  : Arr extends [infer H]
  ? [...Result, MapPredicate<H>]
  : Arr extends [infer Head, ...infer Tail]
  ? Mapped<[...Tail], [...Result, MapPredicate<Head>]>
  : Readonly<Result>;

/**
 * 不强制在组件中使用
 * 
 * ```ts
 * const [c, lz] = useService(CountService, LazyService);
 * ```
 */
export function useService<C extends Constructor<any>, Classes extends C[]>(
  ...klasses: [...Classes]
): Mapped<Classes> {
  return klasses.map((s) => getService(s)?.instance) as Mapped<Classes>;
}
