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

console.log(App);

// Mount the initial app
const root = document.getElementById('app');
// const mounted = mount(App, root);

if (module.hot) {
    module.hot.accept();
}

