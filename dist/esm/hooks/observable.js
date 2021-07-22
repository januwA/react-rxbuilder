function isLikeOnject(value) {
    return typeof value === "object" && value !== null;
}
function getOwnPropertyDescriptor(target, key) {
    if (!(key in target))
        return;
    const des = Object.getOwnPropertyDescriptor(target, key);
    if (des)
        return des;
    return getOwnPropertyDescriptor(Object.getPrototypeOf(target), key);
}
export function observable(data, changed) {
    if (!isLikeOnject(data))
        return data;
    for (const key in data) {
        const value = data[key];
        if (isLikeOnject(value))
            data[key] = observable(value, changed);
    }
    const proxy = new Proxy(data, {
        get(target, key) {
            const des = getOwnPropertyDescriptor(target, key);
            if (des?.value && typeof des.value === "function")
                return des.value.bind(proxy);
            if (des?.get)
                return des.get.call(proxy);
            return target[key];
        },
        set(target, key, value, receiver) {
            const des = getOwnPropertyDescriptor(target, key);
            value = observable(value, changed);
            if (des?.set)
                des.set.call(proxy, value);
            else
                target[key] = value;
            changed();
            return true;
        },
    });
    return proxy;
}
