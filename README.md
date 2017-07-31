# React Presentation
React Presentation is a repo to help explain the benefits of the virtual DOM. This repo contains the essentials
of a virtual DOM, including the following:
- [Virtual DOM markup](./src/createNode.js)
- [Rendering VDOM to the DOM](./src/dom.js)
- [Diffing](./src/diff.js)
- [Reconciliation](./src/reconcile.js)

## Requirements
To run this project, you will need the following installed:
- [Git](https://git-scm.com/)
- [Node v6.10.0+](https://nodejs.org/en/)
    - [Install via NVM](https://github.com/creationix/nvm)
    - Make sure to run `nvm install v6.10.0 && nvm use v6.10.0` after installing NVM
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Setup
- Clone the repository and `cd` into it
    - `git clone https://github.com/waltertan12/ReactPresentation.git && cd ReactPresentation`
- Install the JavaScript dependencies
    - `yarn install`
- Start the development server
    - `yarn start`
- Go to `https://localhost:8888` in any browser
    - If you are using port 8888 for another server, go into `webpack.config.js` and change the port number

## Stages
This demo is broken into 4 different stages
- Stage 0: Virtual DOM markup 
    - `git checkout stage-0`
- Stage 1: Rendering the Virtual DOM
    - `git checkout stage-1`
- Stage 2: Diffing
    - `git checkout stage-2`
- Stage 3: Reconciliation
    - `git checkout stage-3`

## Examples
```javascript
import { dom } from 'dom';
import createNode from 'createNode';
import diff from 'diff';
import reconcile from 'reconcile';

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

const app = <div>
    <h1>Hello, world!</h1>
</div>;

mount(
    app,
    document.getElementById('app')
);
```
