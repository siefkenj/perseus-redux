import React from "react";
import { InlineMarkdownRenderer } from "../inline-markdown-renderer";
import { makeWidgetStateful } from "../utils/state-manager";

import "../../css/components/radio.css";

function filledArray(length, val) {
    return Array.from({ length }, () => val);
}

function checkAnswer(props, state = props.state) {
    const { options, id } = props;
    const { choices } = options;
    const { selected } = state;

    // for single-select, we must select one of the options
    if (!options.multipleSelect && selected.every(x => !x)) {
        return {
            status: "incomplete",
            message: `You must select at least one options for ${id}`
        };
    }
    // we must match the choices exactly
    if (
        selected.every((x, i) => {
            return x === choices[i].correct;
        })
    ) {
        return { status: "correct" };
    }
    return {
        status: "incorrect",
        message: `You have not selected the correct choice(s) for ${id}`
    };
}

function generateDefaultState(props) {
    return { selected: filledArray(props.options.choices.length, false) };
}

function RadioWidget(props) {
    const { options, id, state, setState } = props;
    // if the same radio group is duplicated multiple times, we want each
    // to act "independently" from the persepctive of the browser (otherwise,
    // they won't mirror each other's behavior)
    const randId = React.useState(("-" + Math.random()).replace(".", ""))[0];

    const { selected } = state;
    const setSelected = selected => {
        // don't mutate `state`. Return a new copy instead
        const newState = { ...state, selected: selected };
        const status = checkAnswer(props, newState);
        setState({ ...newState, status: status });
    };

    const inputType = options.multipleSelect ? "checkbox" : "radio";
    const handleChange = e => {
        let newSelected;
        if (options.multipleSelect) {
            newSelected = [...selected];
        } else {
            newSelected = filledArray(options.choices.length, false);
        }
        newSelected[e.target.value] = e.target.checked;
        setSelected(newSelected);
    };
    const choices = options.choices.map((choice, i) => {
        const optionId = ("radio-option" + id + " " + i).replace(" ", "-");
        return (
            <React.Fragment key={optionId}>
                <input
                    type={inputType}
                    id={optionId}
                    name={id + randId}
                    value={i}
                    checked={selected[i]}
                    onChange={handleChange}
                />
                <label htmlFor={optionId}>
                    <InlineMarkdownRenderer>
                        {choice.content ||
                            (choice.isNoneOfTheAbove && "None of the above")}
                    </InlineMarkdownRenderer>
                </label>
            </React.Fragment>
        );
    });
    return (
        <div className="perseus-widget-radio">
            <h4>
                {options.multipleSelect
                    ? "Select all that apply:"
                    : "Select one:"}
            </h4>
            {choices}
        </div>
    );
}

// Wrapping this widget means `state` and `setState` will get passed in as props
const Radio = makeWidgetStateful(RadioWidget, generateDefaultState);
export { Radio };
