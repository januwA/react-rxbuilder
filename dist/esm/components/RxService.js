import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { combineLatest, debounceTime, mapTo, pipe, } from "rxjs";
import { getServiceCache } from "../metadata/Injectable";
export const RxService = ({ children, pipes }) => {
    const [_, setstate] = useState(0);
    useEffect(() => {
        const subjects = Object.values(getServiceCache()).map((e) => e.service$);
        let sub;
        if (subjects.length) {
            const stream = combineLatest(subjects);
            sub = stream
                .pipe(pipes ? pipes : pipe(mapTo(undefined), debounceTime(10)))
                .subscribe(() => setstate((prev) => prev + 1));
        }
        return () => {
            if (sub)
                sub.unsubscribe();
        };
    }, []);
    return _jsx(_Fragment, { children: children() }, void 0);
};
