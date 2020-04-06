import { css } from 'react-emotion';

export default css`
  font-family: 'Roboto Mono', monospace;
  font-size: inherit;
  line-height: 1.5;
  direction: ltr;
  text-align: left;
  word-spacing: normal;
  word-break: normal;

  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;

  white-space: pre-wrap;

  &.language-prism.language-prism {
    padding: 0.5rem;
    margin: 0;
    min-height: 100%;
    font-size: 1.25vw;
  }
`;
