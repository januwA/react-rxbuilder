import { getService } from "../metadata/Injectable";
export function useService(...klasses) {
    return klasses.map((s) => { var _a; return (_a = getService(s)) === null || _a === void 0 ? void 0 : _a.instance; });
}
