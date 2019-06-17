## Perseus Redux

Perseus Redux is a reimplimentation of Khan Academy's [Perseus](https://github.com/Khan/perseus/)
framework for answering questions. It has been designed for integration
with WebWork.

You can see a [demo](https://siefkenj.github.io/perseus-redux/). JSON authored in Khan Academy's
[Perseus Lab](https://github.com/Khan/perseus/) can be copy-and-pasted into the 
[Perseus Redux Demo](https://siefkenj.github.io/perseus-redux/).

### Using Perseus Redux

Perseus Redux is built using React and create-react-app, though
with some overrides to the build process.
You can use `node` and `npm` to build and develop, or grab the pre-built javascript
and css files.

Include

```
	<script scr="https://siefkenj.github.io/perseus-redux/static/js/perseus-redux.min.js"></script>
	<link rel="stylesheet" href="https://siefkenj.github.io/perseus-redux/static/css/perseus-redux.css">
```

in your HTML file. A global `PerseusRedux` object should be available. Follow the example
html in [public/example.html](public/example.html) for a template of how to interact with PerseusRedux or
interact with the example [live](https://siefkenj.github.io/perseus-redux/example.html).

#### Multiplie Copies of React

Perseus Redux comes with its own copy of react. Because Perseus Redux uses React Hooks, it must
be rendered using its version of react which is available as `PerseusRedux.React` and `PerseusRedux.ReactDOM`



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
