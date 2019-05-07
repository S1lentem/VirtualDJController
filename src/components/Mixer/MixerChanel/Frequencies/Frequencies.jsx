import React from 'react'
import { CircleSlider } from "react-circle-slider";


// import * as skins from 'react-rotary-knob-skins-pack';

import FixedKnob from '../../FixedKnob/FixedKnob'

const HI_FREQUENCY_NAME = 'hi';
const MID_FREQUENCY_NAME = 'mid';
const LOW_FREQUENCY_NAME = 'low';


class Frequencies extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.source.getId(),
      source: props.source,
      low: 0,
      mid: 0,
      hi: 0
    }
  }

  changeLowFrequency(value){
    this.state.source.getFrequencyManager().setLowFrequency(value);
    this.setState({low: value});
  }

  changeMidFrequency(value){
    this.state.source.getFrequencyManager().setMidFrequency(value);
    this.setState({mid: value});
  }

  changeHiFrequency(value){
    this.state.source.getFrequencyManager().setHiFrequency(value);
    this.setState({hi: value});
  }

  render(){
    return (
      <div>
        <div>
          <label>HI</label>
          <FixedKnob min={-10} max={10} colorId={3}
            onChange={value => this.changeHiFrequency(value)} />
        </div>
        <div>
          <label>MID</label>
          <FixedKnob min={-10} max={10} colorId={2}
            onChange={value => this.changeMidFrequency(value)} />
        </div>
        <div>
          <label>LOW</label>
          <FixedKnob min={-10} max={10} colorId={1}
            onChange={value => this.changeLowFrequency(value)} />
        </div>
      </div>
    )
  }
}

export default Frequencies;
