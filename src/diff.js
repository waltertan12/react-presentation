import listDiff from 'list-diff2'

const isVNode = vNode => (typeof vNode === 'object');

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

        if (prevSibling && (prevSibling.count > 0)) {
            currentIndex += prevSibling.count + 1;
        } else {
            currentIndex += 1;
        }

        prevSibling = prevChild;

        _diff(prevChild, nextChild, patches, currentIndex);
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
const _diff = (prevNode, nextNode, patches, index) => {
    const currentPatch = [];

    if (typeof nextNode === 'undefined') {
        // The list diff should take care of this case

    } else if (typeof prevNode === 'string'  && typeof nextNode === 'string') {
        // If the text nodes do not have the same text, replace it; otherwise, do nothing
        if (prevNode !== nextNode) {
            currentPatch.push({ type: 'TEXT', node: prevNode, patch: nextNode }); 
        } 

    // Nodes are the same
    } else if (isVNode(prevNode) && isVNode(nextNode) && prevNode.tagName == nextNode.tagName) {
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

    _diff(prevNode, nextNode, patches, 0);

    return patches;
};

export default diff;

