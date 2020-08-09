export const isObject = (obj: any): obj is object => (!!obj && typeof obj === 'object' && Array.isArray(obj) === false);
