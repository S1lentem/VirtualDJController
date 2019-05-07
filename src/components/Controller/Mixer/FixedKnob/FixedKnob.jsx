import React from 'react';
import { render } from 'react-dom';
import { Knob } from 'react-rotary-knob';
import * as skins from 'react-rotary-knob-skin-pack';

import './FixedKnob.css';

export default class FixedKnob extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: props.defaultValue !== undefined ? props.defaultValue : 0,
      max: this.props.max !== undefined ? this.props.max : 100,
      min: this.props.min !== undefined ? this.props.min : 0
    }
    this.handleOfChange = this.handleOfChange.bind(this);
  }

  handleOfChange(value){
    if (Math.abs(value - this.state.value) > this.state.max / 8){
      return;
    }
    this.setState({value});
    if (this.props.onChange){
      this.props.onChange(value);
    }
  }

  render(){
    let skin = skins.s13;
    if (this.props.colorId){
      switch (this.props.colorId) {
        case 1:
        skin = skins.s13;
        break;
        case 2:
        skin = skins.s14;
        break;
        case 3:
        skin = skins.s15;
        break;
      }
    }

    return (
      <div className='knob'>
        <Knob
          style={{ display: "inline-block" }}
          unlockDistance={0}
          skin={skin}
          preciseMode={false}
          onChange={this.handleOfChange}
          value={this.state.value}
          min={this.state.min}
          max={this.state.max}
        />
    </div>
  );
  }

}
