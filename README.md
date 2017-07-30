# React Presentation
## Setup
- To run this project, you will need the following installed:
    - [Git](https://git-scm.com/)
    - [Node v6.10.0+](https://nodejs.org/en/)
        - [Install via NVM](https://github.com/creationix/nvm)
        - Make sure to run `nvm install v6.10.0 && nvm use v6.10.0` after installing NVM
    - [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- After Git, Node, and Yarn are installed, clone the repository and `cd` into it
    - `git clone https://github.com/waltertan12/ReactPresentation.git && cd ReactPresentation`
- Install the JavaScript dependencies
    - `yarn install`
- Start the development server
    - `yarn start`
- Go to `https://localhost:8888` in any browser
    - If you are using port 8888 for another server, go into `webpack.config.js` and change the port number
- You'll now be able to edit the JavaScript files and see live changes


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

