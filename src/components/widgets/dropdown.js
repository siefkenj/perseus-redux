import React from "react";
import { makeWidgetStateful } from "../utils/state-manager";

import "../../css/widgets/dropdown.css";

function checkAnswer(props, state = props.state) {
    const { options, id } = props;
    const { choices } = options;
    const { selected } = state;

    // prepare formatted versions of the answers
    const formattedAnswer = (
        choices.filter(c => c.correct)[0] || { content: "ERROR" }
    ).content;
    const ret = {
        formatted: {
            contents: {
                str: choices[selected].content,
                tex: `\\text{${choices[selected].content}}`
            },
            answer: { str: formattedAnswer, tex: `\\text{${formattedAnswer}}` }
        }
    };

    // selected is a string, so !selected will be true
    // if the string is non-empty
    if (!selected) {
        return {
            ...ret,
            status: "incomplete",
            message: `You must select an option for ${id}`
        };
    }
    // we must match the choices exactly
    if (choices[selected].correct) {
        return { ...ret, status: "correct" };
    }
    return {
        ...ret,
        status: "incorrect",
        message: `You have not selected the correct choice for ${id}`
    };
}

function generateDefaultState(props) {
    return { selected: "" };
}

function DropdownWidget(props) {
    const { options, id, state, setState } = props;

    const { selected } = state;
    // on first run, make sure we have access to the formatted answer
    React.useEffect(() => {
        setSelected(selected);
    }, []); // eslint-disable-line
    const setSelected = c => {
        // don't mutate `state`. Return a new copy instead
        const newState = { ...state, selected: c };
        const status = checkAnswer(props, newState);
        setState({ ...newState, status });
    };

    return (
        <select
            className="perseus-widget-dropdown"
            value={selected}
            onChange={e => setSelected(e.target.value)}
        >
            <option value="" disabled>
                {options.placeholder}
            </option>
            {options.choices.map(({ content }, i) => {
                return (
                    <option key={i} value={i}>
                        {content}
                    </option>
                );
            })}
        </select>
    );
}

// Wrapping this widget means `state` and `setState` will get passed in as props
const Dropdown = makeWidgetStateful(DropdownWidget, generateDefaultState);
export { Dropdown };
