import { EventDelegator } from 'EventDelegator';
import { isObject } from 'Utils';

/**
 * Removes a prop from a DOM node
 *
 * @param {Node}                   node
 * @param {string}                 propKey
 * @param {Object|string|function} prop
 * @param {Object}                 prevProps
 */
const removeProp = (node, propKey, prop, prevProps) => {
    // Previous props doesn't exist so there's nothing to remove
    if (!prevProps) {
        return;
    }

    const prevProp = prevProps[propKey];
    if (propKey === 'style') {
        Object
            .keys(prevProp)
            forEach(styleName => {
                node.style[styleName] = ''; 
            });

    } else if (propKey === 'attributes') {
        node.removeAttribute(propKey);

    } else if (typeof prevProp === 'string') {
        node[propKey] = '';

    } else {
        node[propKey] = null;
    }
};

/**
 * @param  {Node}   node
 * @param  {string} propKey
 * @param  {Object} prop
 * @param  {Object} prevProps Not sure if I need this
 */
const applyObjectProp = (node, propKey, prop, prevProps) => {
    // If previous prop was not an object but it has now turned into an objec
    if (!isObject(node[propKey])) {
        node[propKey] = {};
    }

    const emptyValue = (propKey === 'style') ? '' : undefined;

    Object
        .keys(prop)
        .forEach(attributeName => {
            const attribute = prop[attributeName];

            node[propKey][key] = (typeof attribute === 'undefined') ? emptyValue : attribute;
        });
    
};

export const applyProps = (node, props, prevProps) => {
    Object.keys(props)
        .forEach(propKey => {
            const prop = props[propKey];

            if (typeof prop === 'undefined') {
                removeProp(node, propKey, prop, prevProps);

            } else if (typeof prop === 'string' || typeof prop === 'number') {
                node[propKey] = prop;

            } else if (typeof prop === 'object') {
                applyObjectProp(node, propKey, prop, prevProps);

            } else if (propKey.substring(0, 2) === 'on' && typeof prop === 'function') {
                const eventType = propKey.substring(2).toLowerCase();

                EventDelegator.registerHandler(node, eventType, prop);
            }
        });
};
