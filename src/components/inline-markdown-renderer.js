import React from "react";
import PerseusMarkdown from "./utils/perseus-markdown";
// Like Renderer, but only handles markdown
// and the markdown is assumed to be `inline`
export function InlineMarkdownRenderer(props) {
    const { children } = props;
    const parsed = PerseusMarkdown.parseInline(children);
    const markdownRenderer = PerseusMarkdown.ruleOverrideOutput({});
    return <>{markdownRenderer(parsed)}</>;
}
