import hljs from 'highlightjs';
import { createNode } from "../virtual-dom";
import { StubTodoApp } from './stub-todo-app';

const value = hljs.highlight('json', JSON.stringify(StubTodoApp, null, 4)).value;

export const VirtualDomApp = createNode('div', {},
    createNode('pre', { id: 'idk-man', className: 'hljs lang-json atom-dark' },
        // lmao, this works 😂
        createNode('code', { innerHTML: value }),
    )
);