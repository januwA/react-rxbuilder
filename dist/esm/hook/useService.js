import { Injectable, SERVICES } from "../metadata/Injectable";
function getService(service) {
    if (service.name) {
        const cons = Injectable.prototype.constructor;
        return cons[SERVICES][service.name]?.instance;
    }
}
export function useService(service) {
    if (Array.isArray(service))
        return service.map(getService);
    return getService(service);
}
