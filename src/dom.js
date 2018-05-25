import { EventDelegator } from './eventDelegator';

/**
 * Turns virtual nodes into actual DOM nodes
 * 
 * @param  {Object} vNode   An object representing a Node (and its children) in the DOM
 * @return {Node}   domNode An actual DOM version of the given virtual node
 */
export const render = vNode => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    const domNode = document.createElement(vNode.tagName);

    applyProps(domNode, vNode.props);

    vNode.children
        .map(render)
        .forEach(domNode.appendChild.bind(domNode));

    return domNode;
};

const applyProps = (node, props) => {
    Object.keys(props)
        .forEach(propKey => {
            const prop = props[propKey];

            if (typeof prop === 'string' || typeof prop === 'number') {
                node[propKey] = prop;
            } else if (typeof prop === 'object') {
                Object.keys(prop)
                    .forEach(attributeName => {
                        node[propKey][attributeName] = prop[attributeName];
                    });
            } else if (propKey.substring(0, 2) === 'on' && typeof prop === 'function') {
                const eventType = propKey.substring(2).toLowerCase();
                EventDelegator.registerHandler(node, eventType, prop);
            }
        });
};

/**
 * Mount the virtual DOM to the actual DOM
 * 
 * @param  {Object} vNode       An object representing a Node in the DOM
 * @param  {Node}   root        The root container for the application 
 * @return {Node}   nodeToMount The actual Node that got mounted to the root
 */
export const mount = (vNode, root) => {
    const nodeToMount = render(vNode);

    // This is only for the demo... The app should probably never re-mount like this
    if (!root.childNodes.length) {
        root.appendChild(nodeToMount);
    } else {
        root.replaceChild(nodeToMount, root.childNodes[0]);  
    }

    return nodeToMount;
};

