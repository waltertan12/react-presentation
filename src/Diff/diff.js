import { diffProps } from 'Diff/diffProps';
import { isObject, isVNode } from 'Utils';
import { listDiff } from 'Diff/listDiff';

/**
 * Diff the prevNode and nextNode
 *
 * This runs a depth first preorder traversal of the virtual DOM tree
 *
 * @param  {vNode|undefined} prevNode
 * @param  {vNode|undefined} nextNode
 * @param  {Array}           currentPatch
 * @param  {number}          index
 */
export const diffChildren = (prevNode, nextNode, currentPatch, index) => {
    let patches = {};

    const prevChildren = prevNode.children;
    let nextChildren = nextNode.children;
    const listPatch = listDiff(prevChildren, nextChildren);
    nextChildren = listPatch.list;

    /* 
     * This is the child to the left of the current working child i.e. it is the left sibling
     *
     * We let it be undefined initially because the first node will have no left sibling
     *
     * This variable is needed to keep track of the currentIndex
     */
    let prevSibling;
    let currentIndex = index;

    prevChildren.forEach((prevChild, prevChildIndex) => {
        const nextChild = nextChildren[prevChildIndex];
        
        currentIndex += 1
        if (prevSibling && (prevSibling.count > 0)) {
            currentIndex += prevSibling.count;
        }

        prevSibling = prevChild;

        const childPatch = diff(prevChild, nextChild, patches, currentIndex);
        patches = Object.assign(patches, childPatch);
    });

    nextChildren
        .slice(prevChildren.length)
        .forEach(nextChild => {
            const childPatch = diff(null, nextChild, patches, index);
            patches = Object.assign(patches, childPatch);
        });

    if (listPatch.moves && (listPatch.moves.inserts.length || listPatch.moves.removes.length)) {
        currentPatch.push({ type: 'REORDER', node: prevNode, patch: listPatch.moves});
    }

    return patches;
};

/**
 * Diff the prevNode and nextNode
 *
 * This traverses the virutal DOM tree in a depth-first preorder fashion
 * 
 * @param  {Object|String|undefined} prevNode
 * @param  {Object|String|undefined} nextNode
 * @return {Object}                  patches  An object with data for reconciliation
 * @param  {Number}                  index    The index of a specific node if traversing depth first
 */
export const diff = (prevNode, nextNode, patches = {}, index = 0) => {
    const currentPatch = [];

    // Remove the node if it not longer exists
    if (prevNode && !nextNode) {
        currentPatch.push({ type: 'REMOVE', node: prevNode, patch: null });

    // Add a node if it didn't previously exist
    } else if (!prevNode && nextNode) {
        currentPatch.push({ type: 'INSERT', node: prevNode, patch: nextNode });

    // Both nodes are text nodes
    } else if (typeof prevNode === 'string' && typeof nextNode === 'string') {
        // If the text nodes do not have the same text, replace it; otherwise, do nothing
        if (prevNode !== nextNode) {
            currentPatch.push({ type: 'TEXT', node: prevNode, patch: nextNode }); 
        } 

    // Nodes are the same type
    } else if (isVNode(prevNode) && isVNode(nextNode) && (prevNode.tagName === nextNode.tagName)) {
        // Diff the props
        const propsPatch = diffProps(prevNode.props, nextNode.props);
        if (propsPatch) {
            currentPatch.push({ type: 'PROPS', node: prevNode, patch: propsPatch });
        }

        // Diff the children now
        const childrenPatch = diffChildren(
            prevNode,
            nextNode,
            currentPatch,
            index
        );

        patches = Object.assign(patches, childrenPatch)

    // Nodes are different types, replace them
    } else {
        currentPatch.push({ type: 'REPLACE', node: prevNode, patch: nextNode });
    }

    // Insert the current patch to the total list of patches
    if (currentPatch.length) {
        patches[index] = currentPatch;
    }

    return patches;
};
