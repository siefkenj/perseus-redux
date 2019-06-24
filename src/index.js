//import React from 'react';
//import ReactDOM from 'react-dom';
import "./index.css";
// When this library gets loaded, window.PerseusRedux will be created.
// We want to access that global object, not anything else to avoid
// multiple copies of Redux getting loaded accidentally
import * as _PerseusRedux from "./perseus-redux.js"; // eslint-disable-line
import { defaultQuestion, QuestionText } from "./components/demo.js";

// inputs/textareas are used to ferry data between PerseusRedux
// and the webpage. (This is because Webwork is able to persist
// data in a textbox.) Since webwork is not around to automatically
// persist the data, use local storage.
function saveStateToLocalStorage() {
    const state = {};
    for (const id of ["_question", "_state", "_status", "_messages"]) {
        state[id] = (document.getElementById(id) || {}).value;
    }
    window.localStorage.setItem("PerseusReduxDemoState", JSON.stringify(state));
}
function restoreStateFromLocalStorage() {
    let state = {};
    try {
        state = JSON.parse(
            window.localStorage.getItem("PerseusReduxDemoState")
        );
    } catch (e) {}
    for (const id in state) {
        const elm = document.getElementById(id);
        if (elm) {
            //console.log("setting", id, elm, state[id]);
            elm.value = state[id];
        }
    }
    return state;
}

if (!window.PerseusRedux.hasRenderedDemo) {
    // this file gets included in `index.html` several times, but we only
    // want to execute the code once.
    window.PerseusRedux.hasRenderedDemo = true;
    console.log("demo loading...");
    // We need to use the React and ReactDOM from the PerseusRedux library,
    // or else there will be multiple Reacts that will conflict when rendering
    // elements.
    const {
        React,
        ReactDOM,
        QuestionRenderer,
        MathQuill,
        statusFromState,
        initializeStore
    } = window.PerseusRedux;

    // Load the mathquill styles onto the page
    MathQuill.addMathquillStyles();

    // this function is outside of the component because
    // we want to change the DOM without using react
    function onStateChange(state = {}) {
        const stateStr = JSON.stringify(state);
        const status = statusFromState(state, extraState.question.question);

        document.getElementById("_state").value = stateStr;
        document.getElementById("_status").value = status.status;
        document.getElementById("_messages").value = status.message;
        document.getElementById("_formatted").value = JSON.stringify(
            status.formatted
        );
    }

    const defaultQuestionStr = JSON.stringify(defaultQuestion, null, 4);
    const store = window.PerseusRedux.generateStoreForWidgetTree();
    const extraState = (window.extraState = {});
    function setQuestion(question) {
        extraState.question = question;
        renderQuestionBody();
    }
    setQuestion(defaultQuestion);

    function Demo(props) {
        return (
            <div className="container">
                <div className="left">
                    <button
                        onClick={() => {
                            const elm = document.getElementById("_question");
                            elm.value = defaultQuestionStr;
                            // Changing the `.value` won't trigger a change event,
                            // so manually reset the question
                            setQuestion(defaultQuestion);
                        }}
                    >
                        Reset Question to Default
                    </button>
                    <QuestionText
                        defaultQuestionStr={defaultQuestionStr}
                        onChange={setQuestion}
                    />
                </div>
                <div className="right">
                    <div className="data-storage">
                        Current State: <input id="_state" />
                        Status: <input id="_status" />
                        Messages: <input id="_messages" />
                        Messages: <input id="_formatted" />
                    </div>
                    <div className="question" id="question" />
                </div>
            </div>
        );
    }

    function QuestionBody(props) {
        const { question } = props;
        return (
            <QuestionRenderer
                question={question.question}
                onChange={onStateChange}
                store={store}
            />
        );
    }
    function renderQuestionBody() {
        if (document.getElementById("question")) {
            const questionBody = (
                <QuestionBody question={extraState.question} />
            );
            ReactDOM.render(questionBody, document.getElementById("question"));
        }
    }

    ReactDOM.render(<Demo />, document.getElementById("root"));
    const loadedState = restoreStateFromLocalStorage();
    try {
        initializeStore(store, JSON.parse(loadedState["_state"]));
    } catch (e) {}
    try {
        extraState.question = JSON.parse(loadedState["_question"]);
    } catch (e) {}
    renderQuestionBody();
    window.onbeforeunload = saveStateToLocalStorage;
} else {
    console.log("demo already loaded");
}
