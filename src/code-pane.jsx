import React from "react/addons";
import highlight from "highlight.js";
import Base from "./base";
import Radium from "radium";

@Radium
class CodePane extends Base {
  createMarkup() {
    const language = highlight.getLanguage(this.props.lang);
    const markup = highlight.highlightAuto(this.props.source, language ? language.aliases : undefined);
    return {
      __html: markup.value
    };
  }
  render() {
    return (
      <pre style={[this.context.styles.components.codePane.pre, this.getStyles(), this.props.style]}>
        <code
          className="hljs"
          style={this.context.styles.components.codePane.code}
          dangerouslySetInnerHTML={this.createMarkup()}/>
      </pre>
    );
  }
}

CodePane.contextTypes = {
  styles: React.PropTypes.object
};

CodePane.propTypes = {
  lang: React.PropTypes.string,
  source: React.PropTypes.string,
  style: React.PropTypes.object
};

CodePane.defaultProps = {
  lang: "",
  source: ""
};

export default CodePane;
