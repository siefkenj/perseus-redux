import React from "react";
import MathQuill, { addStyles as addMathquillStyles } from "react-mathquill";
import KAS from "../../libs/kas.js";
import { makeWidgetStateful } from "../utils/state-manager";

import "../../css/widgets/expression.css";

const insertBraces = value => {
    // HACK(alex): Make sure that all LaTeX super/subscripts are wrapped
    // in curly braces to avoid the mismatch between KAS and LaTeX sup/sub
    // parsing.
    //
    // What exactly is this mismatch? Due to its heritage of parsing plain
    // text math from <OldExpression />, KAS parses "x^12" as x^(12).
    // This is both generally what the user expects to happen, and is
    // consistent with other computer algebra systems. It is NOT
    // consistent with LaTeX however, where x^12 is equivalent to x^{1}2.
    //
    // Since the only LaTeX we parse comes from MathQuill, this wouldn't
    // be a problem if MathQuill just always gave us the latter version
    // (with explicit braces). However, instead it always gives the former.
    // This behavior is baked in pretty deep; my naive attempts at changing
    // it triggered all sorts of confusing errors. So instead we just make
    // sure to add in any missing braces before grading MathQuill input.
    //
    // TODO(alex): Properly hack MathQuill to always use explicit braces.
    return value.replace(/([_^])([^{])/g, "$1{$2}");
};

/* Content creators input a list of answers which are matched from top to
 * bottom. The intent is that they can include spcific solutions which should
 * be graded as correct or incorrect (or ungraded!) first, then get more
 * general.
 *
 * We iterate through each answer, trying to match it with the user's input
 * using the following angorithm:
 * - Try to parse the user's input. If it doesn't parse then return "not
 *   graded".
 * - For each answer:
 *   ~ Try to validate the user's input against the answer. The answer is
 *     expected to parse.
 *   ~ If the user's input validates (the validator judges it "correct"), we've
 *     matched and can stop considering answers.
 * - If there were no matches or the matching answer is considered incorrect
 */
function checkAnswer(props, state = props.state) {
    const { options, id } = props;
    const { answerForms } = options;
    const { contents } = state;

    const parsedUserInput = KAS.parse(insertBraces(contents));

    // prepare formatted versions of the answers
    const firstValidAnswerForm =
        answerForms.filter(v => v.considered === "correct")[0] || {};
    const parsedAnswer = KAS.parse(firstValidAnswerForm.value || "").expr;

    const ret = {
        formatted: {
            answer: { str: parsedAnswer.print(), tex: parsedAnswer.asTex() },
            contents: {
                str: parsedUserInput.parsed
                    ? parsedUserInput.expr.print()
                    : "-",
                tex: parsedUserInput.parsed
                    ? parsedUserInput.expr.asTex()
                    : "\\space"
            }
        }
    };

    // if the user input didn't parse, it's incomplete
    if (!parsedUserInput.parsed) {
        return {
            ...ret,
            status: "incomplete",
            message: `The math expression you typed in ${id} couldn't be parsed`
        };
    }

    if (parsedUserInput.expr.print() === "") {
        return {
            ...ret,
            status: "incomplete",
            message: `Type a math expression into ${id}`
        };
    }

    // we must match one of the choices
    for (const form of answerForms) {
        // assume answer forms will parse correctly
        const result = KAS.compare(
            parsedUserInput.expr,
            KAS.parse(form.value).expr,
            form
        );
        if (result.equal && form.considered === "correct") {
            return { ...ret, status: "correct" };
        } else if (result.equal && form.considered === "incorrect") {
            return {
                ...ret,
                status: "incorrect",
                message: `You have not entered the correct value for ${id}`
            };
        }
    }
    return {
        ...ret,
        status: "incorrect",
        message: `You have not entered the correct value for ${id}`
    };
}

function generateDefaultState(props) {
    return { contents: "" };
}

function ExpressionWidget(props) {
    const { options, id, state, setState } = props;

    const { contents } = state;
    // on first run, make sure we have access to the formatted answer
    React.useEffect(() => {
        setContents(contents);
    }, []); // eslint-disable-line
    const setContents = c => {
        // don't mutate `state`. Return a new copy instead
        const newState = { ...state, contents: c };
        const status = checkAnswer(props, newState);
        setState({ ...newState, status });
    };

    return (
        <MathQuill
            className="perseus-widget-expression"
            latex={contents}
            onChange={latex => setContents(latex)}
        />
    );
}

// Wrapping this widget means `state` and `setState` will get passed in as props
const Expression = makeWidgetStateful(ExpressionWidget, generateDefaultState);
export { Expression };
