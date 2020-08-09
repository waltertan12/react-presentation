import { VirtualNode } from '../virtual-dom/create-node';

/**
 * Returns true if the the given argument is a virtual node
 *
 * @param  {any}   vNode
 * @return {boolean}
 */
export const isVNode = (vNode: any): vNode is VirtualNode => (!!vNode && typeof vNode === 'object' && vNode.tagName);
