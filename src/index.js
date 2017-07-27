import createNode from 'createNode';
import diff from 'diff';
import reconcile from 'reconcile';
import { mount } from 'dom';

// Mount the initial app
const root = document.getElementById('app');
// const mounted = mount(App, root);

if (module.hot) {
    module.hot.accept();
}

