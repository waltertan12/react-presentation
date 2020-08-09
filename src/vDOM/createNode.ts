export interface Prop {
	[key: string]: string | number | boolean | Function | Prop;
}

export interface VirtualNode {
	tagName: string;
	props: Prop;
	count: number;
	children: (string | VirtualNode)[];
}

/**
 * Creates a virtual node
 * 
 * @param  {String}             tagName  The type of tag to create e.g. 'p', 'ul', 'li', 'div', etc
 * @param  {Object}             props    The properties of the node e.g. className, id, style, etc
 * @param  {...[Object|string]} children
 * @return {Object}                      A virtual node aka an object with tagName, props, children, and count of
 *                                       descendents
 */
export const createNode = (tagName: string, props: Prop, ...children: (string | VirtualNode)[]): VirtualNode => {
    const count = children.length +
        children.reduce((descendents: number, child: VirtualNode | string) => {
            if (typeof child !== 'string' && child.count) {
                return descendents + child.count;
            }

            return descendents;
        }, 0);

    return { tagName, props, children, count };
};
