import { createNode } from '../virtual-dom';

interface MenuProps {
	basePath: string;
}

export const Menu = ({ basePath = ''}: MenuProps) => (
	createNode('div', { className: 'container' },
		createNode('h1', { className: 'h1' },
			'Menu'
		),
		createNode('ul', { className: 'list-group' },
			createNode('li', { className: 'list-group-item' },
				createNode('a', { href: basePath + '/virtual-dom' },
					'Virtual DOM'
				)
			),
			createNode('li', { className: 'list-group-item' },
				createNode('a', { href: basePath + '/basic-render' },
					'Basic Render'
				)
			),
			createNode('li', { className: 'list-group-item' },
				createNode('a', { href: basePath + '/full-render' },
					'Full Render'
				)
			),
			createNode('li', { className: 'list-group-item' },
				createNode('a', { href: basePath + '/fiber' },
					'Fiber'
				)
			),
		),
	)
);
