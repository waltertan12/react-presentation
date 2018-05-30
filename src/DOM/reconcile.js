import { applyProps } from 'DOM/applyProps';
import { render } from 'DOM/render';

/**
 * Manipulate the DOM
 * 
 * @param  {Node}   node    The DOM node to update
 * @param  {Array}  patches An array containing data about DOM manipulation
 */
const performReconciliation = (node, patches) => {
    patches
        .forEach(patch => {
            const parentNode = node.parentNode;

            switch (patch.type) {
                case 'REORDER':
                    const childNodeArray = Array.from(node.childNodes);
                    const childNodes = node.childNodes;
                    const moves = patch.patch;
                    const removes = moves.removes;
                    const inserts = moves.inserts;
                    const keyMap = {};

                    removes.forEach(remove => {
                        const childNode = childNodes[remove.from];
                        if (remove.key) {
                            keyMap[remove.key] = childNode;
                        }

                        node.removeChild(childNode);
                    });

                    inserts.forEach(insert => {
                        const childNode = keyMap[insert.to];
                        node.insertBefore(childNode, childNodes[insert.to] || null);
                    });
                    break;

                case 'NODE':
                    if (parentNode) {
                        parentNode.replaceChild(render(patch.patch), node);
                    }
                    break;

                case 'INSERT':
                    if (parentNode) {
                        parentNode.appendChild(render(patch.patch), node);
                    }
                    break;

                case 'REMOVE':
                    if (parentNode) {
                        parentNode.removeChild(node);
                    }
                    break;

                case 'TEXT':
                    node.textContent = patch.patch;
                    break;

                case 'PROPS':
                    applyProps(node, patch.patch, patch.node.props);
                    break;

                default:
                    // no-op
            } 
        });
};

/**
 * Apply the patches the diff algorithm found
 *
 * The reconciler must traverse the tree the EXACT same way the diff traversed the tree, otherwise it will incorrectly
 * apply patches
 * 
 * @param  {Node}   node    The actual DOM node representing the current App
 * @param  {Object} patches Diffs that need to be applied to the actual DOM
 * @param  {Object} index   The depth first index of the node
 *                          This needs to be an object because you can't pass primitives by reference
 */
export const reconcile = (node, patches, index = { index: 0 }) => {
    const currentPatches = patches[index.index];
    const nodeArray = Array.from(node.childNodes);

    nodeArray
        .forEach(childNode => {
            index.index += 1;

            reconcile(childNode, patches, index);
        });

    if (currentPatches && currentPatches.length) {
        performReconciliation(node, currentPatches);
    }
};
