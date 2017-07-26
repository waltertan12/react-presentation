/**
 * Diff the prevNode and nextNode, depth first (preorder traversal)
 * 
 * @param  {Object|String|undefined} prevNode
 * @param  {Object|String|undefined} nextNode
 * @return {Object}                  patches  An object with data for reconciliation
 * @param  {Number}                  index    The index of a specific node if traversing depth first
 */
const _diff = (prevNode, nextNode, patches, index, maxIndex) => {
    const currentPatches = [];

    // The new tree does not have this node so remove it
    if (!nextNode) {
        currentPatches.push({ type: 'REMOVE', node: prevNode, patch: nextNode });

    // The new tree has a node that didn't previously exists so add it to the new tree
    } else if (nextNode && !prevNode) {
        if (index - 1 >= maxIndex) {
            index = maxIndex;
            if (!patches[index]) {
                patches[index] = [];
            }

            patches[index].push({ type: 'NODE', node: prevNode, patch: nextNode });

        // We're not at the very end yet
        } else {
            currentPatches.push({ type: 'NODE', node: prevNode, patch: nextNode });
            index -= 1;
        }

    // The nodes we're comparing are both text nodes
    } else if (typeof prevNode === 'string' && typeof nextNode === 'string') {
        // If the text is different, replace the text
        if (prevNode !== nextNode) {
            currentPatches.push({ type: 'TEXT', node: prevNode, patch: nextNode });
        }

    // Both are normal nodes with the same tag name
    } else if (prevNode.tagName && nextNode.tagName && (prevNode.tagName === nextNode.tagName)) {
        // We need to diff their children
        const prevLength = prevNode.children.length;
        const nextLength = nextNode.children.length;
        let prevSibling;

        let currentIndex = index;
        // Diff each equivalent child (read, child with the same index)
        for (let i = 0; i < prevLength || i < nextLength; i += 1) {
            let prevChild = prevNode.children[i];
            let nextChild = nextNode.children[i];

            // Since we're going through the tree recursively, we need to update the current index i.e. we're exploring
            // the children first so we need to increment the index for each child and its descedents
            currentIndex += 1;
            if (prevSibling && prevSibling.count) {
                currentIndex += prevSibling.count;
            }

            prevSibling = prevChild;

            _diff(prevChild, nextChild, patches, currentIndex, maxIndex);
        }

    // The nodes are of different types. This could be 'p' vs 'li' or TextNode vs 'div' 
    } else {
        currentPatches.push({ type: 'NODE', node: prevNode, patch: nextNode });
    }

    // Store the differences, if there are any
    if (currentPatches.length > 0) {
        patches[index] = currentPatches;
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
    let patches = {};

    _diff(prevNode, nextNode, patches, 0, prevNode.count);

    return patches;
};

export default diff;

