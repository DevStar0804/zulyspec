import React from 'react';
import PropTypes from 'prop-types';
import useSlide, { SlideContext } from '../hooks/use-slide';
import { DeckContext } from '../hooks/use-deck';
import styled, { ThemeContext } from 'styled-components';
import { color } from 'styled-system';

const SlideContainer = styled('div')`
  ${color};
  width: ${({ theme }) => theme.size.width || 1366}px;
  height: ${({ theme }) => theme.size.height || 768}px;
`;
const SlideWrapper = styled('div')`
  ${color};
  overflow-y: scroll;
`;
const TemplateWrapper = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/**
 * Slide component wraps anything going in a slide and maintains
 * the slides' internal state through useSlide.
 */

const Slide = props => {
  const {
    children,
    slideNum,
    backgroundColor,
    textColor,
    template,
    numberOfSlides,
    scaleRatio
  } = props;
  const theme = React.useContext(ThemeContext);
  const { slideElementMap, keyboardControls } = React.useContext(DeckContext);
  const initialState = { currentSlideElement: 0, immediate: false };
  const numberOfSlideElements = slideElementMap[slideNum];
  const [ratio, setRatio] = React.useState(scaleRatio || 1);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
  const slideRef = React.useRef(null);
  const slideWidth = theme.size.width || 1366;
  const slideHeight = theme.size.height || 768;

  const transformForWindowSize = React.useCallback(() => {
    const clientWidth = slideRef.current.parentElement.clientWidth;
    const clientHeight = slideRef.current.parentElement.clientHeight;
    const useVerticalRatio =
      clientWidth / clientHeight > slideWidth / slideHeight;
    const ratio = useVerticalRatio
      ? clientHeight / slideHeight
      : clientWidth / slideWidth;
    setRatio(ratio);
  }, [slideHeight, slideWidth]);

  React.useEffect(() => {
    const clientWidth = slideRef.current.parentElement.clientWidth;
    const clientHeight = slideRef.current.parentElement.clientHeight;
    const useVerticalRatio =
      clientWidth / clientHeight > slideWidth / slideHeight;
    const clientRects = slideRef.current.getClientRects();
    setOrigin({
      x: useVerticalRatio
        ? `${(clientWidth - clientRects[0].width) / 2 / (1 - ratio)}px`
        : 'left',
      y: useVerticalRatio
        ? 'top'
        : `${(clientHeight - clientRects[0].height) / 2 / (1 - ratio)}px`
    });
  }, [ratio, slideHeight, slideWidth, theme]);

  React.useEffect(() => {
    if (!isNaN(scaleRatio)) {
      return;
    }
    transformForWindowSize();
    window.addEventListener('resize', transformForWindowSize);
    return () => {
      window.removeEventListener('resize', transformForWindowSize);
    };
  }, [transformForWindowSize, scaleRatio]);
  const value = useSlide(
    initialState,
    slideNum,
    numberOfSlideElements,
    keyboardControls
  );
  return (
    <SlideContainer
      ref={slideRef}
      backgroundColor={backgroundColor}
      style={{
        transform: `scale(${ratio})`,
        transformOrigin: `${origin.x} ${origin.y}`
      }}
    >
      <TemplateWrapper>
        {typeof template === 'function' &&
          template({ slideNumber: slideNum, numberOfSlides })}
      </TemplateWrapper>
      <SlideWrapper color={textColor}>
        <SlideContext.Provider value={value}>{children}</SlideContext.Provider>
      </SlideWrapper>
    </SlideContainer>
  );
};

Slide.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node.isRequired,
  numberOfSlides: PropTypes.number,
  scaleRatio: PropTypes.number,
  slideNum: PropTypes.number,
  template: PropTypes.func,
  textColor: PropTypes.string
};

Slide.defaultProps = {
  textColor: 'primary',
  backgroundColor: 'tertiary'
};

export default Slide;
