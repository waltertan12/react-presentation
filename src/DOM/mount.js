import { render } from 'DOM/render';

/**
 * Mount the virtual DOM to the actual DOM
 * 
 * @param  {Object} vNode       An object representing a Node in the DOM
 * @param  {Node}   root        The root container for the application 
 * @return {Node}   nodeToMount The actual Node that got mounted to the root
 */
export const mount = (vNode, root) => {
    const nodeToMount = render(vNode);

    // This is only for the demo without the diff
    if (!root.childNodes.length) {
        root.appendChild(nodeToMount);
    } else {
        root.replaceChild(nodeToMount, root.childNodes[0]);  
    }

    return nodeToMount;
};
