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
export function observable(data, changed, objcache) {
    if (!isLikeOnject(data) || objcache.has(data))
        return data;
    objcache.set(data, true);
    for (const key in data) {
        const value = data[key];
        if (isLikeOnject(value))
            data[key] = observable(value, changed, objcache);
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
            value = observable(value, changed, objcache);
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
