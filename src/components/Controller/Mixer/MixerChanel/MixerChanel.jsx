import React from 'react'
import Frequencies from './Frequencies/Frequencies'
import FixedKnob from '../FixedKnob/FixedKnob'

import './MixerChanel.css'

const GAIN_SLIEDR_NAME = 'gain';

class MixerChannel extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      source: props.source,
    }
  }

  changeGain(){
    let audioSource = this.state.source;
    if (audioSource){
      let currentGain = document.getElementById(GAIN_SLIEDR_NAME + audioSource.getId()).value;
      audioSource.setGain(currentGain);
    }
  }

  render(){
    const id = this.state.source.getId();

    return (
      <div className='chanel'>
        <div className='content-center'>
          <Frequencies source={this.state.source} />
        </div>
        <div className='content-center'>
          <label htmlFor={GAIN_SLIEDR_NAME + id}>Volume</label>
        </div>
        <div className='content-center'>
          <input id={GAIN_SLIEDR_NAME + id} type='range' className='volume-slider'
            onInput={() => this.changeGain()}
            min='0' max='1.25' step='0.0125'/>
        </div>
        <div className='content-center'>
          <label>Balance</label>
            <FixedKnob min={-100} max={100} colorId={1}
              onChange={value => this.state.source.setPanned(value/100)} />
        </div>
      </div>
    );
  }
}

export default MixerChannel;
