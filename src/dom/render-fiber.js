import { applyProps } from './apply-props';

const workLoop = deadline => {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );

    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop);
};

/**
 * Turns virtual nodes into actual DOM nodes
 *
 * @param  {Object} vNode   An object representing a Node (and its children) in the DOM
 * @return {Node}   domNode An actual DOM version of the given virtual node
 */
export const render = vNode => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    const domNode = document.createElement(vNode.tagName);

    applyProps(domNode, vNode.props);

    vNode.children
        .map(render)
        .forEach(domNode.appendChild.bind(domNode));

    return domNode;
};
