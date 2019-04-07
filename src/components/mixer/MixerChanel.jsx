import React from 'react'

import '../../styles/index.css'

const GAIN_SLIEDR_NAME = 'gain';

class MixerChannel extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      source: props.source
    }
  }

  changeGain(){
    let audioSource = this.state.source;
    if (audioSource != null && audioSource.isReadyForPlayed()){
      let currentGain = document.getElementById(GAIN_SLIEDR_NAME + audioSource.getId()).value;
      audioSource.setGain(currentGain);
    }
  }

  render(){
    const id = this.state.source.getId();

    return (
      <div>
        <label htmlFor={GAIN_SLIEDR_NAME + id} className='center'>Volume</label>
        <input id={GAIN_SLIEDR_NAME + id} type='range' className='slider'
            onInput={() => this.changeGain()}
            min='0' max='1.25' step='0.0125'/>
      </div>
    );
  }
}

export default MixerChannel;
