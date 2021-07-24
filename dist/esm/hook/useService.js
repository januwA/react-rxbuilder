import { Injectable, SERVICES } from "../metadata/Injectable";
function getService(service) {
    var _a;
    if (service.name) {
        const cons = Injectable.prototype.constructor;
        return (_a = cons[SERVICES][service.name]) === null || _a === void 0 ? void 0 : _a.instance;
    }
}
export function useService(service) {
    if (Array.isArray(service))
        return service.map(getService);
    return getService(service);
}
