/**
 * @param  {mixed}   obj
 * @return {boolean}     Returns true if 'obj' is an Object
 */
export const isObject = obj => (!!obj && typeof obj === 'object' && Array.isArray(obj) === false);
