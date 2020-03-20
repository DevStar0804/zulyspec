import React from 'react/addons';
import assign from 'object-assign';
import cloneWithProps from 'react/lib/cloneWithProps';
import Radium from 'radium';
import _ from 'lodash';

const Style = Radium.Style;

const TransitionGroup = React.addons.TransitionGroup;

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.state = {
      lastSlide: null
    };
  }
  componentDidMount() {
    this.setState({
      lastSlide: 'slide' in this.context.router.state.params ?
        parseInt(this.context.router.state.params.slide) : 0
    });
    this._attachEvents();
  }
  componentWillUnmount() {
    this._detchEvents();
  }
  _attachEvents() {
    window.addEventListener('keydown', this._handleKeyPress);
  }
  _detachEvents() {
    window.removeEventListener('keydown', this._handleKeyPress);
  }
  _handleKeyPress(e) {
    let event = window.event ? window.event : e;
    event.keyCode === 37 && this._prevSlide();
    event.keyCode === 39 && this._nextSlide();
  }
  _prevSlide() {
    let slide = 'slide' in this.context.router.state.params ?
      parseInt(this.context.router.state.params.slide) : 0;
    this.setState({
      lastSlide: slide
    });
    if (this._checkFragments(slide, false)) {
      if (slide > 0) {
        this.context.router.transitionTo('/' + (slide - 1));
      }
    }
  }
  _nextSlide() {
    let slide = 'slide' in this.context.router.state.params ?
      parseInt(this.context.router.state.params.slide) : 0;
    this.setState({
      lastSlide: slide
    });
    if(this._checkFragments(slide, true)) {
      if (slide < this.props.children.length - 1) {
        this.context.router.transitionTo('/' + (slide + 1));
      }
    }
  }
  _checkFragments(slide, forward) {
    let store = this.context.flux.stores.SlideStore;
    let fragments = store.getState().fragments;
    if (slide in fragments) {
      let count = _.size(fragments[slide]);
      let visible = _.filter(fragments[slide], function(s){
        return s.visible === true
      });
      let hidden = _.filter(fragments[slide], function(s){
        return s.visible !== true
      });
      if (forward === true && visible.length !== count) {
        this.context.flux.actions.SlideActions.updateFragment({
          fragment: hidden[0],
          visible: true
        });
        return false;
      }
      if (forward === false && hidden.length !== count) {
        this.context.flux.actions.SlideActions.updateFragment({
          fragment: visible[_.size(visible) - 1],
          visible: false
        });
        return false;
      }
      return true;
    } else {
      return true;
    }
  }
  _renderSlide() {
    let slide = 'slide' in this.context.router.state.params ?
      parseInt(this.context.router.state.params.slide) : 0;
    let child = this.props.children[slide];
    return cloneWithProps(
      child,
      {
        key: slide,
        slideIndex: slide,
        lastSlide: this.state.lastSlide,
        transition: child.props.transition.length ?
          child.props.transition :
          this.props.transition,
        transitionDuration: child.props.transition.transitionDuration ?
          child.props.transitionDuration :
          this.props.transitionDuration
      });
  }
  render() {
    let styles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',

    };
    return (
      <div style={styles}>
        <TransitionGroup component="div">
          {this._renderSlide()}
        </TransitionGroup>
        <Style rules={this.context.styles.global} />
      </div>
    )
  }
}

Deck.displayName = 'Deck';

Deck.defaultProps = {
  transitionDuration: 500
};

Deck.contextTypes = {
  styles: React.PropTypes.object,
  router: React.PropTypes.object,
  flux: React.PropTypes.object
};

export default Deck;