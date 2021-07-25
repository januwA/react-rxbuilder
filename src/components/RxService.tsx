import { useEffect, FC, useState, ReactNode } from "react";
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  mapTo,
  pipe as rxpipe,
  Subscription,
  tap,
  UnaryFunction,
} from "rxjs";
import { serviceList$ } from "../metadata/Injectable";

/**
 * !只需要在程序中使用一次 RxService
 * @param param0 
 * @returns 
 */
export const RxService: FC<{
  children: (...args: any) => ReactNode;
  pipe?: UnaryFunction<any, any>;
}> = ({ children, pipe }) => {
  const [updateCount, inc] = useState(0);

  useEffect(() => {
    let sub: Subscription | undefined;
    const serviceListSub = serviceList$
      .pipe(
        filter((e) => e.length !== 0),
        map((subjects) => combineLatest(subjects)),
        tap(() => sub?.unsubscribe())
      )
      .subscribe((stream) => {
        sub = stream
          .pipe(pipe ? pipe : rxpipe(mapTo(undefined), debounceTime(10)))
          .subscribe(() => {
            inc((c) => c + 1);
          });
      });

    return () => {
      serviceListSub.unsubscribe();
    };
  }, []);

  return <>{children(updateCount)}</>;
};
