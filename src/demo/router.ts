import { Menu } from './menu';
import { VirtualNode } from '../virtual-dom/create-node';
import { VirtualDomApp } from './virtual-dom';
import { StubTodoApp } from "./stub-todo-app";
import {NotFound} from "./not-found";
import {TodoApp, TodoAppProps} from "./todo-app";

type TodoApp = (props: TodoAppProps) => VirtualNode;
interface Routes {
	[key: string]: string | VirtualNode | TodoApp;
}

const routes: Routes = {
	'/virtual-dom': VirtualDomApp,
	'/basic-render': StubTodoApp,
	'/full-render': TodoApp,
	'/fiber': 'fiber',
};

interface DemoAppProps {
	path: string;
	basePath: string;
	todoAppProps: TodoAppProps;
}

export const Router = ({ path, basePath, todoAppProps }: DemoAppProps): string | VirtualNode => {
    const normalizedPath = path.replace(basePath, '');
    if (normalizedPath === '/') {
    	return Menu({ basePath });
	}

	const component = routes[normalizedPath] || NotFound();
    if (typeof component === 'function') {
    	return component(todoAppProps);
	}

    return component;
};
