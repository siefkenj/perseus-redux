import React from "react";
import MathQuill, { addStyles as addMathquillStyles } from "react-mathquill";
import { makeWidgetStateful } from "../utils/state-manager";

function generateDefaultState(props) {
    return { contents: "" };
}

function ExpressionWidget(props) {
    const { options, id, state, setState } = props;

    const { contents } = state;
    const setContents = c => {
        // don't mutate `state`. Return a new copy instead
        setState({ ...state, contents: c });
    };

    return (
            <MathQuill
                latex={contents}
                onChange={latex => setContents(latex)}
            />
    );
}

// Wrapping this widget means `state` and `setState` will get passed in as props
const Expression = makeWidgetStateful(ExpressionWidget, generateDefaultState);
export { Expression };
