import { getServiceCache } from "../metadata/Injectable";
function getService(service) {
    var _a;
    if (service.name) {
        const cache = getServiceCache();
        return (_a = cache[service.name]) === null || _a === void 0 ? void 0 : _a.instance;
    }
}
export function useService(service) {
    if (Array.isArray(service))
        return service.map(getService);
    return getService(service);
}
