import React from "react";
import ReactDOM from "react-dom";
import { Base64 } from "js-base64";
import QuestionRenderer from "./components/renderer.js";
import KAS from "./libs/kas.js";
import { generateStoreForWidgetTree } from "./components/utils/state-manager.js";
import MathQuill, { addStyles as addMathquillStyles } from "react-mathquill";
import { removeProperties } from "@babel/types";
MathQuill.addMathquillStyles = addMathquillStyles;

//MathQuill.addMathquillStyles()
//PerseusRedux.ReactDOM.render(
//    PerseusRedux.React.createElement(PerseusRedux.QuestionRenderer, {
//        question: qq.question
//    }),
//    document.getElementById("xxx")
//);

const createStore = generateStoreForWidgetTree;

// Some helper functions
function initializeStore(store, state) {
    console.log("restoring state", state);
    store.dispatch({ type: "@action.restoreState", payload: state });
}

// Look at the state of all the widgets and return
// a collective status
function statusFromState(state, question = { widgets: {} }) {
    let statuses = { correct: [], incorrect: [], incomplete: [] };
    let messages = { correct: [], incorrect: [], incomplete: [] };
    // store the formatted versions of the question and the answer
    const formatted = {
        contents: { str: [], tex: [] },
        answer: { str: [], tex: [] }
    };
    try {
        // collect the statuses of the widgets from the state
        // The state for each widget looks like { status: {status: "xxx", ...}, message: ..., ...}
        for (const id in state.widgets) {
            const widgetStatus = state.widgets[id].status || {
                status: "incomplete",
                message: `Incomplete answer for ${id}`
            };
            messages[widgetStatus.status].push(widgetStatus.message);
            statuses[widgetStatus.status].push(id);

            // collect any formatted answers
            if (widgetStatus.formatted) {
                formatted.contents.str.push(
                    widgetStatus.formatted.contents.str
                );
                formatted.contents.tex.push(
                    widgetStatus.formatted.contents.tex
                );
                formatted.answer.str.push(widgetStatus.formatted.answer.str);
                formatted.answer.tex.push(widgetStatus.formatted.answer.tex);
            }
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

    // make `formatted` into strings
    formatted.contents.str = formatted.contents.str.join("; ");
    formatted.contents.tex = formatted.contents.tex.join("; ");
    formatted.answer.str = formatted.answer.str.join("; ");
    formatted.answer.tex = formatted.answer.tex.join("; ");

    if (statuses.incomplete.length > 0) {
        return {
            status: "incomplete",
            message: messages.incomplete.join("; "),
            formatted
        };
    }
    if (statuses.incorrect.length > 0) {
        return {
            status: "incorrect",
            message: messages.incorrect.join("; "),
            formatted
        };
    }

    return { status: "correct", message: "", formatted };
}

if (typeof PerseusRedux === "undefined") {
    console.log("perseus-redux loading...");
    window.PerseusRedux = {
        React,
        ReactDOM,
        QuestionRenderer,
        MathQuill,
        generateStoreForWidgetTree,
        createStore, // A friendlier-named version
        initializeStore,
        statusFromState,
        KAS,
        Base64
    };
} else {
    console.log("perseus-redux already loaded");
}

export default window.PerseusRedux;
