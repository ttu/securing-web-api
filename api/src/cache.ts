const CACHE: Map<string, any> = new Map();

export const add = <T>(key: string, value: T) => {
  CACHE.set(key, value);
};

export const get = <T>(key: string): T | undefined => {
  return CACHE.has(key) ? CACHE.get(key) : undefined;
};
