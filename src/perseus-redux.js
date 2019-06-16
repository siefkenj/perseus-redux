import React from "react";
import ReactDOM from "react-dom";
import QuestionRenderer from "./components/renderer.js";
import KAS from "./libs/kas.js";
import { generateStoreForWidgetTree } from "./components/utils/state-manager.js";
import MathQuill, { addStyles as addMathquillStyles } from "react-mathquill";
MathQuill.addMathquillStyles = addMathquillStyles;

//MathQuill.addMathquillStyles()
//PerseusRedux.ReactDOM.render(
//    PerseusRedux.React.createElement(PerseusRedux.QuestionRenderer, {
//        question: qq.question
//    }),
//    document.getElementById("xxx")
//);

// Some helper functions
function initializeStore(store, state) {
    console.log("restoring state", state);
    store.dispatch({ type: "@action.restoreState", payload: state });
}

// get the status fom
function statusFromState(state, question = { widgets: {} }) {
    let statuses = { correct: [], incorrect: [], incomplete: [] };
    let messages = { correct: [], incorrect: [], incomplete: [] };
    try {
        // collect the statuses of the widgets from the state
        for (const id in state.widgets) {
            const widgetStatus = state.widgets[id].status || {
                status: "incomplete",
                message: `Incomplete answer for ${id}`
            };
            messages[widgetStatus.status].push(widgetStatus.message);
            statuses[widgetStatus.status].push(id);
        }
        // there may have been widgets whose state was not in the state object.
        // check the quesiton object to make sure we haven't missed any
        for (const id in question.widgets) {
            if (!state.widgets[id]) {
                messages["incomplete"].push(`Incomplete answer for ${id}`);
                statuses["incomplete"].push(id);
            }
        }
    } catch (e) {
        console.log("Error when reading state", e);
    }

    if (statuses.incomplete.length > 0) {
        return {
            status: "incomplete",
            message: messages.incomplete.join("; ")
        };
    }
    if (statuses.incorrect.length > 0) {
        return {
            status: "incorrect",
            message: messages.incorrect.join("; ")
        };
    }

    return { status: "correct", message: "" };
}

if (typeof PerseusRedux === "undefined") {
    console.log("perseus-redux loading...");
    window.PerseusRedux = {
        React,
        ReactDOM,
        QuestionRenderer,
        MathQuill,
        generateStoreForWidgetTree,
        initializeStore,
        statusFromState,
        KAS
    };
} else {
    console.log("perseus-redux already loaded");
}

export default window.PerseusRedux;
