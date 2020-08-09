import { Router } from "./demo/router";
import { SyntheticEvent } from './event-delegator/synthetic-event';
// @ts-ignore
import { diff } from 'diff';
import { getState, setState} from './demo/app-state';
// @ts-ignore
import { mount, reconcile } from 'dom';
import qs from 'query-string';

// Do some stuff w/ state
const onSubmit = () => {
    const { todos } = getState();
    setState({
        input: '',
        todos: [...todos, { content: getState().input, timestamp: Date.now() }],
    }, render);
};
const onKeyUp = (event: SyntheticEvent<HTMLInputElement, KeyboardEvent>) => {
    setState({
        input: event.target?.value || '',
    }, render)
};
const onDeleteTodo = (index: number) => {
    const { todos } = getState();
    setState({
        todos: todos.slice(0, index).concat(todos.slice(index + 1)),
    }, render);
};

// Mount the initial app
const root = document.getElementById('app');
let app = Router({
    path: window.location.pathname,
    basePath: '/react-presentation',
    todoAppProps: {
        onSubmit,
        onKeyUp,
        onDeleteTodo,
        ...getState(),
    }
});

const mounted = mount(app, root);
const render = () => {
    const  { query } = qs.parseUrl(window.location.href);
    const nextApp = Router({
        path: window.location.pathname,
        basePath: '/react-presentation',
        todoAppProps: {
            onSubmit,
            onKeyUp,
            onDeleteTodo,
            ...getState(),
        }
    });
    const diffs = diff(app, nextApp);
    if (query.logApps) {
        console.log({ app, nextApp });
    }

    if (query.logDiffs) {
        console.log(diffs);
    }

    if (query.disableReconcile) {
        // noop
    } else {
        reconcile(mounted, diffs);
        app = nextApp;
    }
};


if (module.hot) {
    module.hot.accept();
}
