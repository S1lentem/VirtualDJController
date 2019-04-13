import React from 'react'

import '../../styles/index.css'

const GAIN_SLIEDR_NAME = 'gain';
const PAN_SLIDER_NAME = 'pan';

class MixerChannel extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      source: props.source,
      pan: 0
    }
  }

  changeGain(){
    let audioSource = this.state.source;
    if (audioSource != null && audioSource.isReadyForPlayed()){
      let currentGain = document.getElementById(GAIN_SLIEDR_NAME + audioSource.getId()).value;
      audioSource.setGain(currentGain);
    }
  }

  changePan(){
    const audioSource = this.state.source;
    const currentPan = Number(document
      .getElementById(PAN_SLIDER_NAME + audioSource.getId()).value);
    audioSource.setPanned(currentPan);
    this.setState({pan: currentPan});
  }


  render(){
    const id = this.state.source.getId();
    const panValue = this.state.pan;

    return (
      <div>
        <div>
          <div className='center'>
            <label htmlFor={GAIN_SLIEDR_NAME + id}>Volume</label>
          </div>
          <div>
            <input id={GAIN_SLIEDR_NAME + id} type='range' className='slider'
              onInput={() => this.changeGain()}
              min='0' max='1.25' step='0.0125'/>
          </div>
        </div>
        <div>
          <div className='center'>
            <label htmlFor={PAN_SLIDER_NAME + id}>Pan</label>
          </div>
          <div>
            <input id={PAN_SLIDER_NAME + id} onInput={() => this.changePan()}
              type='range' min='-1' max='1' step='0.0078125' value={panValue}/>
          </div>
        </div>
      </div>
    );
  }
}

export default MixerChannel;
