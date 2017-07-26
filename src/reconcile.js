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
const performReconciliation = (node, patches, index) => {
    patches
        .forEach(patch => {
            let parentNode;

            switch (patch.type) {
            // This can mean inserting a new Node or replacing an existing Node
            case 'NODE':
                parentNode = node.parentNode;
                let newNode = render(patch.patch);

                parentNode.appendChild(newNode);
                break;

            // This can mean inserting a new TextNode or replacing an existing TextNode
            case 'TEXT':
                node.textContent = patch;
                break;

            // This one is pretty self explanatory
            case 'REMOVE':
                parentNode = node.parentNode;

                parentNode.removeChild(node);
                break;

            default:
                // no op
            }
        });
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
    console.log(node, index);
    const currentPatches = patches[index.index];
    const nodeList = getStaticNodeArray(node.childNodes); 
    
    nodeList
        .forEach(childNode => {
            index.index += 1;

            reconcile(childNode, patches, index);            
        });

    // Apply the patches to the actual DOM if there are any changes
    if (currentPatches && currentPatches.length) {
        performReconciliation(node, currentPatches, index);
    }
};

export default reconcile;

