import createNode from 'createNode';
import diff from 'diff';
import reconcile from 'reconcile';
import { mount } from 'dom';

const App = (
    createNode('ul', {},
        createNode('li', {}, 'Item one'),
        createNode('li', {}, 'Item two')
    )
);

const nextApp = (
    createNode('ul', {},
        createNode('li', {}, 'Item one'),
        createNode('li', {}, 'Item two'),
        createNode('li', {}, 'Item three'),
        createNode('li', {},
            createNode('ul', {},
                createNode('li', {}, 'Item four'),
                createNode('li', {}, 'Item five')
            )
        )
    )
);

// Mount the initial app
const root = document.getElementById('app');
const mounted = mount(App, root);

let patches = diff(App, nextApp);
console.log(patches);
reconcile(mounted, patches);

if (module.hot) {
    module.hot.accept();
}

