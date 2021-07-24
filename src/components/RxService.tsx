import { useEffect, FC, useState, ReactNode } from "react";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  mapTo,
  pipe,
  Subscription,
  UnaryFunction,
} from "rxjs";
import { getServiceCache } from "../metadata/Injectable";

export const RxService: FC<{
  children: () => ReactNode;
  pipes?: UnaryFunction<any, any>;
}> = ({ children, pipes }) => {
  const [_, setstate] = useState(0);

  useEffect(() => {
    const subjects: BehaviorSubject<any>[] = Object.values(
      getServiceCache()
    ).map((e) => e.service$);

    let sub: Subscription | undefined;

    if (subjects.length) {
      const stream = combineLatest(subjects);
      sub = stream
        .pipe(pipes ? pipes : pipe(mapTo(undefined), debounceTime(10)))
        .subscribe(() => setstate((prev) => prev + 1));
    }

    return () => {
      if (sub) sub.unsubscribe();
    };
  }, []);

  return <>{children()}</>;
};
