import React from "react";
import KAS from "../../libs/kas.js";
import classNames from "classnames";
import { InlineMarkdownRenderer } from "../inline-markdown-renderer";
import { makeWidgetStateful } from "../utils/state-manager";

import "../../css/widgets/matrix.css";

const NORMAL_DIMENSIONS = {
    INPUT_MARGIN: 3,
    INPUT_HEIGHT: 30,
    INPUT_WIDTH: 40
};

// are two matrices the same?
function matrixEqual(mat1, mat2) {
    return JSON.stringify(mat1) === JSON.stringify(mat2);
}

// strip whitespace from all the matrix entries
function stripMatrixWhitespace(matrix) {
    return matrix.map(row => row.map(v => v.replace(/\s+/g, "")));
}

// find the smallest size that will hold non-empty/non-whitespace
// values in `matrix`. The smallest possible is 1x1
function findEnclosingDimensions(matrix) {
    function isEmpty(v) {
        return !v.trim();
    }
    let rowMax = 0,
        colMax = 0;
    matrix.forEach((row, i) => {
        row.forEach((v, j) => {
            if (!isEmpty(v)) {
                rowMax = Math.max(rowMax, i);
                colMax = Math.max(colMax, j);
            }
        });
    });
    return [rowMax + 1, colMax + 1];
}

class MatrixExpression {
    constructor(matrix) {
        this._mat = matrix || [[]];
        this.rows = this._mat.length;
        this.cols = (this._mat || [[]])[0].length;
        this._emptyExpression = KAS.parse("").expr;

        // parse the matrix
        this._parsedMat = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => "")
        );
        this._unparsedEntries = {};
        this._mat.forEach((row, i) => {
            row.forEach((v, j) => {
                const parsed = KAS.parse("" + v);
                if (parsed.parsed) {
                    this._parsedMat[i][j] = parsed.expr;
                } else {
                    this._unparsedEntries[[i, j]] = parsed.error;
                }
            });
        });
        this.didParse = Object.keys(this._unparsedEntries).length === 0;
        this.isEmpty =
            this.didParse &&
            this._parsedMat.every(row => row.every(v => v.print() === ""));
        this.flattened = [];
        this._parsedMat.forEach(row => {
            row.forEach(v => {
                this.flattened.push(v);
            });
        });
    }
    elm(i, j) {
        return this._parsedMat[i][j] || this._emptyExpression;
    }
}

function checkAnswer(props, state = props.state) {
    const { options, id } = props;
    const { answers } = options;
    const { contents } = state;

    const parsedContents = new MatrixExpression(contents);
    const parsedAnswer = new MatrixExpression(answers);

    // if the user input didn't parse, it's incomplete
    if (!parsedContents.didParse) {
        return {
            status: "incomplete",
            message: `The entries (${Object.keys(
                parsedContents._unparsedEntries
            ).join("), (")}) in ${id} couldn't be parsed`
        };
    }

    if (parsedContents.isEmpty) {
        return {
            status: "incomplete",
            message: `Type a math expression into ${id}`
        };
    }

    // check each value to see if it matches the answer
    for (let i = 0; i < parsedContents.flattened.length; i++) {
        const expr1 = parsedContents.flattened[i];
        const expr2 = parsedAnswer.flattened[i];

        if (!expr1 || !expr2) {
            // if either of the expressions are empty, there is some kind
            // kind of error
            console.warn(
                "Trying to compare a size-mismatched or improperly parsed matrices",
                parsedContents,
                parsedAnswer
            );
            continue;
        }

        const result = KAS.compare(expr1, expr2);
        if (!result.equal) {
            return {
                status: "incorrect",
                message: `You have not entered the correct value for ${id}`
            };
        }
    }
    return {
        status: "correct",
        message: ""
    };
}

function generateDefaultState(props) {
    const [rows, cols] = (props.options || {}).matrixBoardSize || [1, 1];
    return {
        contents: Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => "")
        )
    };
}

export function MatrixWidget(props) {
    const { options, id, state, setState } = props;
    const [rows, cols] = options.matrixBoardSize;

    const dimensions = NORMAL_DIMENSIONS;
    const { INPUT_MARGIN, INPUT_HEIGHT, INPUT_WIDTH } = dimensions;

    // set up some state
    const [cursorPos, setCursorPos] = React.useState([0, 0]);
    const { contents } = state;
    const setContents = c => {
        const newState = { ...state, contents: c };
        const status = checkAnswer(props, newState);
        setState({ ...newState, status });
    };
    //const [contents, setContents] = React.useState();

    let [enclosingRow, enclosingCol] = findEnclosingDimensions(contents);
    enclosingRow = Math.max(enclosingRow, cursorPos[0] + 1);
    enclosingCol = Math.max(enclosingCol, cursorPos[1] + 1);
    const bracketHeight = enclosingRow * (INPUT_HEIGHT + 2 * INPUT_MARGIN);
    const bracketOffset = enclosingCol * (INPUT_WIDTH + 2 * INPUT_MARGIN);

    function cellChanger(row, col) {
        return e => {
            const val = e.target.value;
            const newContents = contents.map((r, i) =>
                r.map((v, j) => (row === i && col === j ? val : v))
            );
            setContents(newContents);
        };
    }
    function cellFocuser(row, col) {
        return e => {
            setCursorPos([row, col]);
        };
    }
    function cellBur() {
        const newContents = stripMatrixWhitespace(contents);
        if (!matrixEqual(contents, newContents)) {
            setContents(newContents);
        }
        setCursorPos([0, 0]);
    }

    const cells = contents.map((row, i) => {
        const rowId = (id + "-" + i).replace(" ", "");
        return (
            <div key={rowId} className="matrix-row">
                {row.map((val, j) => {
                    const cellId = (id + "-" + i + "-" + j).replace(" ", "");
                    const inside = i < enclosingRow && j < enclosingCol;
                    const outside = !inside;
                    return (
                        <span key={cellId} className="matrix-input-field">
                            <input
                                className={classNames({ inside, outside })}
                                type="text"
                                style={{
                                    height: INPUT_HEIGHT,
                                    width: INPUT_WIDTH,
                                    margin: INPUT_MARGIN
                                }}
                                value={val}
                                onChange={cellChanger(i, j)}
                                onFocus={cellFocuser(i, j)}
                                onBlur={cellBur}
                            />
                        </span>
                    );
                })}
            </div>
        );
    });

    return (
        <div className="perseus-matrix">
            <div className="matrix-prefix">
                <InlineMarkdownRenderer>
                    {options.prefix}
                </InlineMarkdownRenderer>
            </div>
            <div
                className="matrix-input"
                style={{
                    verticalAlign: -(rows > 1
                        ? ((rows - 1) / 2) * INPUT_HEIGHT + 2 * INPUT_MARGIN
                        : 0)
                }}
            >
                <div
                    className="matrix-bracket bracket-left"
                    style={{ height: bracketHeight }}
                />
                <div
                    className="matrix-bracket bracket-right"
                    style={{ height: bracketHeight, left: bracketOffset }}
                />
                {cells}
            </div>
            <div className="matrix-suffix">
                <InlineMarkdownRenderer>
                    {options.suffix}
                </InlineMarkdownRenderer>
            </div>
        </div>
    );
}

const Matrix = makeWidgetStateful(MatrixWidget, generateDefaultState);
export { Matrix };
