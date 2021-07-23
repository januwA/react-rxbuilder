import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { combineLatest } from "rxjs";
import { Injectable, SERVICES } from "../metadata/Injectable";
export const RxService = ({ children }) => {
    const [_, setstate] = useState(0);
    useEffect(() => {
        const subjects = Object.values(Injectable.prototype.constructor[SERVICES]).map((e) => e.service$);
        const stream = combineLatest(subjects);
        const sub = stream.subscribe(() => {
            setstate((prev) => prev + 1);
        });
        return () => {
            sub.unsubscribe();
        };
    }, []);
    return _jsx(_Fragment, { children: children() }, void 0);
};
