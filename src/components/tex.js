import React from "react";
//import MathJax from "react-mathjax";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

function TeX(props) {
    const { children, ...rest } = props;
    if (rest.displaystyle) {
        return <BlockMath>{children}</BlockMath>
    }
    return <InlineMath>{children}</InlineMath>;
}

export { TeX };
export default TeX;
