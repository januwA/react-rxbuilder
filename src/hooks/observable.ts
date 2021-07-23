function isLikeOnject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function getOwnPropertyDescriptor(
  target: any,
  key: any
): PropertyDescriptor | undefined {
  if (!(key in target)) return;
  const des = Object.getOwnPropertyDescriptor(target, key);
  if (des) return des;
  return getOwnPropertyDescriptor(Object.getPrototypeOf(target), key);
}

/**
 *
 * @param data 需要被代理的数据，必须是 object
 * @param changed 触发set之后会触发changed
 * @param objcache 避免递归对象
 * @returns
 */
export function observable(
  data: any,
  changed: () => void,
  objcache: WeakMap<any, boolean>
) {
  if (!isLikeOnject(data) || objcache.has(data)) return data;

  objcache.set(data, true);

  for (const key in data) {
    const value = data[key];
    // 递归代理
    if (isLikeOnject(value)) data[key] = observable(value, changed, objcache);
  }

  const proxy: any = new Proxy(data, {
    get(target: any, key: any) {
      const des = getOwnPropertyDescriptor(target, key);
      if (des?.value && typeof des.value === "function")
        return des.value.bind(proxy);
      if (des?.get) return des.get.call(proxy);
      return target[key];
    },
    set(target: any, key: any, value: any, receiver: any) {
      const des = getOwnPropertyDescriptor(target, key);
      value = observable(value, changed, objcache);
      if (des?.set) des.set.call(proxy, value);
      else target[key] = value;
      changed();
      return true;
    },
  });
  return proxy;
}
