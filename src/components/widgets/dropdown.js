import React from "react";
import { makeWidgetStateful } from "../utils/state-manager";

function checkAnswer(props, state = props.state) {
    const { options, id } = props;
    const { choices } = options;
    const { selected } = state;
    console.log(state);

    // selected is a string, so !selected will be true
    // if the string is non-empty
    if (!selected) {
        return {
            status: "incomplete",
            message: `You must select an option for ${id}`
        };
    }
    // we must match the choices exactly
    if (choices[selected].correct) {
        return { status: "correct" };
    }
    return {
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
    const setSelected = c => {
        // don't mutate `state`. Return a new copy instead
        const newState = { ...state, selected: c };
        const status = checkAnswer(props, newState);
        setState({ ...newState, status });
    };

    return (
        <select value={selected} onChange={e => setSelected(e.target.value)}>
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
