import { getService } from "../metadata/Injectable";
export function useService(...klasses) {
    return klasses.map(getService);
}
