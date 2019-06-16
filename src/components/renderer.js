import React from "react";
import PerseusMarkdown from "./utils/perseus-markdown";
import { generateStoreForWidgetTree } from "./utils/state-manager";
import { StoreProvider } from "easy-peasy";
import { Radio } from "./widgets/radio";
import { Matrix } from "./widgets/matrix";
import { Expression } from "./widgets/expression";
import { Dropdown } from "./widgets/dropdown";

function missingWidgetFactory(type) {
    return function MissingWidget(props) {
        const { id } = props;
        return (
            <em>
                [[missing widget type: '{type}' id: '{id}']]
            </em>
        );
    };
}

const availableWidgets = {
    radio: Radio,
    matrix: Matrix,
    expression: Expression,
    dropdown: Dropdown
};

function getWidget(type) {
    return availableWidgets[type] || missingWidgetFactory(type);
}

// Render a question and all subwidgets. State is tracked via
// a redux store created by `QuestionRenderer`.
function QuestionRenderer(props) {
    const { children, question, onChange, ...rest } = props;
    const { content, widgets } = question;
    // get a persistent redux store for managing all the states of
    // inlculded widgets
    const _store = React.useState(generateStoreForWidgetTree)[0];
    // we might have passed in a store. If so, use that store instead.
    // however, because hooks cannot be called conditionally, we must
    // get `_store` even if we aren't using it.
    const store = rest.store || _store;

    const parsed = PerseusMarkdown.parse(content);

    // Set up an onChange callback by subscribing to the store.
    // By doing this, we get notified of every single "change" (even if the change is empty);
    store.subscribe(() => {
        if (onChange) {
            onChange(store.getState());
        }
    });

    // here is where we render the individual widgets in the parsed
    // markdown tree.
    const rules = {
        widget: {
            react: (node, output, state) => {
                const widgetProps = widgets[node.id];
                if (!widgetProps) {
                    console.warn("Cannot find properties for ", node);
                }
                const Widget = getWidget(node.widgetType);
                return <Widget key={state.key} {...node} {...widgetProps} />;
            }
        }
    };

    // PerseusMarkdown has a bunch of default rendering rules. Override
    // some of them and create a new renderer that will turn an ast
    // into react components.
    const markdownRenderer = PerseusMarkdown.ruleOverrideOutput(rules);

    return (
        <StoreProvider store={store}>{markdownRenderer(parsed)}</StoreProvider>
    );
}

export { QuestionRenderer };
export default QuestionRenderer;
