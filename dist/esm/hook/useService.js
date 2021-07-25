import { getServiceCache } from "../metadata/Injectable";
const getService = (service) => {
    var _a;
    return (_a = getServiceCache()[service.name]) === null || _a === void 0 ? void 0 : _a.instance;
};
export function useService(...klasses) {
    return klasses.map(getService);
}
