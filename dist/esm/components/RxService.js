import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { combineLatest, debounceTime, filter, map, mapTo, pipe as rxpipe, tap, } from "rxjs";
import { serviceList$ } from "../metadata/Injectable";
export const RxService = ({ children, pipe }) => {
    const [updateCount, inc] = useState(0);
    useEffect(() => {
        let sub;
        const serviceListSub = serviceList$
            .pipe(filter((e) => e.length !== 0), map((subjects) => combineLatest(subjects)), tap(() => sub === null || sub === void 0 ? void 0 : sub.unsubscribe()))
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
    return _jsx(_Fragment, { children: children(updateCount) }, void 0);
};
