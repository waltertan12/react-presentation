import listDiff from 'list-diff2'
import { isObject } from './utils';

const isVNode = vNode => (vNode && typeof vNode === 'object' && vNode.tagName);

/**
 * Returns the given object or an empty object
 *
 * @param  {Object|undefined} diff
 * @return {Object}
 */
const getDiff = diff => (diff || {});

/**
 * @param  {Object} prevProps
 * @param  {Object} nextProps
 * @return {}
 */
const diffProps = (prevProps, nextProps) => {
    let diff;

    // Diff the props
    Object
        .keys(prevProps)
        .forEach(prevPropKey => {
            // A prop has been removed
            if (!nextProps.hasOwnProperty(prevPropKey)) {
                diff = getDiff(diff);
                diff[prevPropKey] = undefined;
            }

            const prevProp = prevProps[prevPropKey];
            const nextProp = nextProps[prevPropKey];

            // Props are the same
            if (prevProp === nextProp) {
                // no op

            // Props are objects so we need to do additional checks
            } else if (isObject(prevProp) && isObject(nextProp)) {
                // Prototypes are different which means they are different
                if (Object.getPrototype(prevProp) !== Object.getPrototype(nextProp)) {
                    diff = getDiff();
                    diff[prevPropKey] = nextProp;
                // Prototypes are the same so run diffProps on the props
                } else {
                    const propDiff = diffProps(prevProp, nextProp);
                    if (propDiff) {
                        diff = getDiff(diff);
                        diff[prevPropKey] = propDiff;
                    }
                }

            // They are different
            } else {
                diff = getDiff(diff);
                diff[prevPropKey] = nextProp;
            }
        });

    // Check if there are any props that need to be added
    Object
        .keys(nextProps)
        .forEach(nextPropKey => {
            if (!prevProps.hasOwnProperty(nextPropKey)) {
                diff = getDiff(diff);
                diff[nextPropKey] = nextProps[nextPropKey];
            }
        });

    return diff;
};

const diffChildren = (prevNode, nextNode, patches, currentPatch, index) => {
    const prevChildren = prevNode.children;
    let nextChildren = nextNode.children;
    const diffs = listDiff(prevChildren, nextChildren, 'key');
    nextChildren = diffs.children;

    if (diffs.moves.length) {
        currentPatch.push({ type: 'REORDER', node: prevNode, patch: diffs.moves});
    }

    // This is the child to the left of the current working child i.e. it is the left sibling
    // Let it be undefined because the first node will have no left sibling
    let prevSibling;
    let currentIndex = index;

    prevChildren.forEach((prevChild, prevChildIndex) => {
        const nextChild = nextChildren[prevChildIndex];
        
        currentIndex += 1
        if (prevSibling && (prevSibling.count > 0)) {
            currentIndex += prevSibling.count;
        }

        prevSibling = prevChild;

        performDiff(prevChild, nextChild, patches, currentIndex);
    });
};

/**
 * Diff the prevNode and nextNode, depth first (preorder traversal)
 * 
 * @param  {Object|String|undefined} prevNode
 * @param  {Object|String|undefined} nextNode
 * @return {Object}                  patches  An object with data for reconciliation
 * @param  {Number}                  index    The index of a specific node if traversing depth first
 */
const performDiff = (prevNode, nextNode, patches, index) => {
    const currentPatch = [];

    if (prevNode && !nextNode) {
        // The list diff should take care of this case

    } else if (typeof prevNode === 'string'  && typeof nextNode === 'string') {
        // If the text nodes do not have the same text, replace it; otherwise, do nothing
        if (prevNode !== nextNode) {
            currentPatch.push({ type: 'TEXT', node: prevNode, patch: nextNode }); 
        } 

    // Nodes are the same
    } else if (isVNode(prevNode) && isVNode(nextNode) && (prevNode.tagName === nextNode.tagName)) {
        // Diff the props
        const propsPatch = diffProps(prevNode.props, nextNode.props);
        if (propsPatch) {
            currentPatch.push({ type: 'PROPS', node: prevNode, patch: propsPatch });
        }

        // Diff the children now
        diffChildren(prevNode, nextNode, patches, currentPatch, index);

    // Nodes are different, replace them
    } else {
        currentPatch.push({ type: 'NODE', node: prevNode, patch: nextNode });
    }

    if (currentPatch.length) {
        patches[index] = currentPatch;
    }
};

/**
 * Diff the prevNode and nextNode depth first (preorder traversal)
 * 
 * @param  {Object|String|undefined} prevNode
 * @param  {Object|String|undefined} nextNode
 * @return {Array}                   patches
 */
const diff = (prevNode, nextNode) => {
    const patches = {};

    performDiff(prevNode, nextNode, patches, 0);

    return patches;
};

export default diff;

