import { isObject } from './utils';
import { EventDelegator } from './eventDelegator';

const removeProp = (node, propKey, prop, prevProps) => {
    // Previous props don't exist, so there's nothing to remove
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

const applyObjectProp = (node, propKey, prop, prevProps) => {
    // const prevProp = prevProps ? prevProps[propKey] : undefined;

    // TODO: 
    if (false) {
        // They are different types of objects
    }

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
