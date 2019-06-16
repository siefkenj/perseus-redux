// When this library gets loaded, window.PerseusRedux will be created.
// We want to access that global object, not anything else to avoid
// multiple copies of Redux getting loaded accidentally
import * as _PerseusRedux from "../perseus-redux.js";
// Use the version of React provided by perseus-redux
const { React } = window.PerseusRedux;

let defaultQuestion = {
    question: {
        content:
            "What kind of matrix has a nullspace of $dim=\\vec 9$?\n\n$\\begin{bmatrix}2\\\\3\\\\4\\end{bmatrix}$\n\nfollow [[☃ matrix 1]] me\n\n[[☃ radio 1]]\n\n|| **Table title** ||\nheader 1 | header 2 | header 3\n- | - | -\ndata 1 | data 2 | $\\int x^4$\ndata 4 | data 5 | data 6\ndata 7 | data 8 | data 9",
        images: {},
        widgets: {
            "matrix 1": {
                type: "matrix",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                    static: false,
                    matrixBoardSize: [3, 3],
                    answers: [[]],
                    prefix: "$\\vec A=$ ",
                    suffix: "$\\vec b$",
                    cursorPosition: [0, 0]
                },
                version: {
                    major: 0,
                    minor: 0
                }
            },
            "radio 1": {
                type: "radio",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                    choices: [
                        {
                            correct: false,
                            content: "one"
                        },
                        {
                            correct: true,
                            content: "two $x^2-4$for the win$^\\circ$"
                        }
                    ],
                    randomize: false,
                    multipleSelect: false,
                    countChoices: false,
                    displayCount: null,
                    hasNoneOfTheAbove: false,
                    deselectEnabled: false
                },
                version: {
                    major: 1,
                    minor: 0
                }
            }
        }
    },
    answerArea: {
        calculator: false,
        chi2Table: false,
        periodicTable: false,
        tTable: false,
        zTable: false
    },
    itemDataVersion: {
        major: 0,
        minor: 1
    },
    hints: []
};

defaultQuestion = {
    question: {
        content: "$x=$ [[☃ expression 1]][[☃ dropdown 1]]\n\n[[☃ radio 1]]\n\n",
        images: {},
        widgets: {
            "expression 1": {
                type: "expression",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                    answerForms: [
                        {
                            value: "\\frac{1}{2}",
                            form: false,
                            simplify: false,
                            considered: "correct",
                            key: 0
                        }
                    ],
                    buttonSets: ["basic"],
                    functions: ["f", "g", "h"],
                    times: false
                },
                version: {
                    major: 1,
                    minor: 0
                }
            },
            "dropdown 1": {
                type: "dropdown",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                    static: false,
                    placeholder: "Select",
                    choices: [
                        {
                            content: "$=$",
                            correct: false
                        },
                        {
                            content: "$\\geq$",
                            correct: true
                        },
                        {
                            content: "$\\leq$",
                            correct: false
                        }
                    ]
                },
                version: {
                    major: 0,
                    minor: 0
                }
            },
            "radio 1": {
                type: "radio",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                    choices: [
                        {
                            content: "My super answer",
                            correct: true
                        },
                        {
                            correct: false,
                            content: "My other answer",
                            clue: "Because, you know...."
                        },
                        {
                            isNoneOfTheAbove: true,
                            correct: false,
                            content: ""
                        }
                    ],
                    randomize: false,
                    multipleSelect: true,
                    countChoices: false,
                    displayCount: null,
                    hasNoneOfTheAbove: true,
                    deselectEnabled: false
                },
                version: {
                    major: 1,
                    minor: 0
                }
            }
        }
    },
    answerArea: {
        calculator: false,
        chi2Table: false,
        periodicTable: false,
        tTable: false,
        zTable: false
    },
    itemDataVersion: {
        major: 0,
        minor: 1
    },
    hints: []
};

// Widget to render the JSON content of a question
function QuestionText(props) {
    const { defaultQuestionStr, onChange } = props;
    const [questionStr, setQuestionStr] = React.useState(defaultQuestionStr);
    const [parseError, setParseError] = React.useState(false);

    function setQuestion(questionStr) {
        setQuestionStr(questionStr);
        let newQuestion = {};
        try {
            newQuestion = JSON.parse(questionStr);
            setParseError(false);
            if (onChange) {
                onChange(newQuestion);
            }
        } catch (e) {
            setParseError(true);
            return;
        }
    }
    return (
        <textarea
            className={"question-json" + (parseError ? " parse-error" : "")}
            id="_question"
            value={questionStr}
            onChange={e => {
                setQuestion(e.target.value);
            }}
        />
    );
}

export { defaultQuestion, QuestionText };
