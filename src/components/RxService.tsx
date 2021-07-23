import { useEffect, FC, useState, ReactNode } from "react";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  mapTo,
  pipe,
  UnaryFunction,
} from "rxjs";
import { Injectable, SERVICES } from "../metadata/Injectable";

export const RxService: FC<{
  children: () => ReactNode;
  pipes?: UnaryFunction<any, any>;
}> = ({ children, pipes }) => {
  const [_, setstate] = useState(0);
  
  useEffect(() => {
    const subjects: BehaviorSubject<any>[] = Object.values(
      Injectable.prototype.constructor[SERVICES]
    ).map((e: any) => e.service$);

    const stream = combineLatest(subjects);
    const sub = stream
      .pipe(pipes ? pipes : pipe(mapTo(undefined), debounceTime(10)))
      .subscribe((v) => setstate((prev) => prev + 1));
    return () => sub.unsubscribe();
  }, []);

  return <>{children()}</>;
};
