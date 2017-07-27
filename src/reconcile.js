import { render } from './dom'

const getStaticNodeArray = nodeList => {
    const nodeArray = [];
    const len = nodeList.length

    for (let i = 0; i < len; i += 1) {
        let node = nodeList[i];
        nodeArray.push(node);
    }

    return nodeArray;
};

/**
 * Manipulate the DOM
 * 
 * @param  {Node}   node    The DOM node to update
 * @param  {Array}  patches An array containing data about DOM manipulation
 */
const performReconciliation = (node, patches) => {
    // TODO
};

/**
 * Apply the patches the diff algorithm found
 * The reconciler must traverse the tree the EXACT same way the diff traversed the tree, otherwise it will incorrectly
 * apply patches
 * 
 * @param  {Node}   node    The actual DOM node representing the current App
 * @param  {Object} patches Diffs that need to be applied to the actual DOM
 * @param  {Object} index   The depth first index of the node
 *                          This needs to be an object because you can't pass primitives by reference
 */
const reconcile = (node, patches, index = { index: 0 }) => {
    // TODO
};

export default reconcile;

