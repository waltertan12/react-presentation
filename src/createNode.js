/**
 * Creates a virtual node
 * 
 * @param  {String}             tagName  The type of tag to create e.g. 'p', 'ul', 'li', 'div', etc
 * @param  {Object}             props    The properties of the node e.g. className, id, style, etc
 * @param  {...[Object|string]} children
 * @return {Object}                      A virtual node aka an object with tagName, props, children, and count of
 *                                       descendents
 */
const createNode = (tagName, props, ...children) => {
    return { };
};

export default createNode;

