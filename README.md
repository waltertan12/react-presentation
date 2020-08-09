# React Presentation
React Presentation is a repo to help explain the benefits of the virtual DOM. This repo contains the essentials
of a virtual DOM, including the following:
- [Virtual DOM markup](src/virtual-dom/createNode.js)
- [Rendering VDOM to the DOM](src/dom/render.js)
- [Diffing](src/diff/diff.js)
- [Reconciliation](src/dom/reconcile.js)

## Requirements
To run this project, you will need the following installed:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-docker)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup
- Clone the repository and `cd` into it
    - `git clone https://github.com/waltertan12/ReactPresentation.git && cd ReactPresentation`
- Start the development server
    - `yarn docker:start`
- Go to [`https://0.0.0.0:8888`](https://localhost:8888) in any browser
    - If you are using port 8888 for another server, go into `webpack.config.js` and change the port number

## Examples
Click [here](https://waltertan12.github.io/ReactPresentation) to see a live example.

```javascript
import { createNode } from 'src/virtual-dom';
import { diff } from 'src/diff';
import { mount, reconcile } from 'src/dom';

const app = (
    createNode('div', {}
        createNode('h1', {}, 'Hello, world :)')
    )
);

const nextApp = (
    createNode('div', {}
        createNode('h1', {}, 'Goodbye, world :(')
    )
);

const root = document.getElementById('app');
const mounted = mount(app, root);
const patches = diff(app, nextApp);
reconcile(mounted, patches);
```

You are also be able to write in JSX via the the Babel plugin [`babel-plugin-transform-react-jsx`](https://babeljs.io/docs/plugins/transform-react-jsx/).
```javascript
import { mount } from 'dom';
import createNode from 'createNode';

const app = (
    <div>
        <h1>Hello, world!</h1>
    </div>
);

mount(
    app,
    document.getElementById('app')
);
```
