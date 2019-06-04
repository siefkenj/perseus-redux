import React from "react";
import { useStore, useActions, action, createStore } from "easy-peasy";

// Creates a new redux store for storing the state of a widget tree
export function generateStoreForWidgetTree() {
    const store = createStore({
        widgets: {},
        setWidgetState: action((state, payload) => {
            const widgetId = payload.widget;
            const widgetState = payload.state;
            state.widgets[widgetId] = widgetState;
        })
    });
    return store;
}

// Custom hook that creates bound state and and setState functions.
// State is managed by an `easy-peasy` store. An individual state is created
// for every unique widgetId passed in.
function useWidgetState(widgetId, defaultState) {
    const state = useStore(state => state.widgets[widgetId]);
    const setWidgetState = useActions(actions => actions.setWidgetState);
    const customizedSetter = state => {
        setWidgetState({ widget: widgetId, state: state });
    };
    if (typeof state === "undefined") {
        return [defaultState, customizedSetter];
    }
    return [state, customizedSetter];
}

// HOC. Wrap `Widget` so tht it receives a `state` and `setState` function
// in its props. `easy-peasy` will manage the state of this widget automatically.
export function makeWidgetStateful(Widget, defaultStateGenerator) {
    return function StatefulWidget(props) {
        const widgetId = props.id;
        const [state, setState] = useWidgetState(
            widgetId,
            defaultStateGenerator(props)
        );
        return <Widget {...props} state={state} setState={setState} />;
    };
}
