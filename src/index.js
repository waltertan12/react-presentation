import createNode from 'createNode';
import diff from 'diff';
import reconcile from 'reconcile';
import { mount } from 'dom';

const App = createNode('ul', {}, 
    createNode('li', {}, 'First item'),
    createNode('li', {}, 'Second item')
);

const nextApp = createNode('ul', {}, 
    createNode('li', {}, 'First item'),
    createNode('li', {}, 'Second item'),
    createNode('li', {}, 'Third item')
);

const nextNextApp = createNode('ul', {}, 
    createNode('li', {}, 'First item'),
    createNode('li', {}, 'Second item'),
    createNode('li', {}, 'Third item'),
    createNode('li', {}, nextApp),
    createNode('li', {}, 'Fourth Item', 
        App
    )
);
let patches;
// Mount the initial app
const root = document.getElementById('app');
const mounted = mount(App, root);

debugger;
patches = diff(App, nextNextApp);
console.log(patches);
reconcile(mounted, patches);

debugger;
patches = diff(nextNextApp, App);
console.log(patches);
reconcile(mounted, patches);

debugger;
patches = diff(App, nextApp);
console.log(patches);
reconcile(mounted, patches);

debugger;
patches = diff(nextApp, App);
console.log(patches);
reconcile(mounted, patches);

debugger;
patches = diff(App, nextNextApp);
console.log(patches);
reconcile(mounted, patches);

if (module.hot) {
    module.hot.accept();
}

