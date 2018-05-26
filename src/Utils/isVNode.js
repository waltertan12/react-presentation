/**
 * Returns true if the the given argument is a virtual node
 *
 * @param  {mixed}   vNode
 * @return {boolean}
 */
export const isVNode = vNode => (vNode && typeof vNode === 'object' && vNode.tagName);
