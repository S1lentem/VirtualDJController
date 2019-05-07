import React from 'react'
import MixerChannel from './MixerChanel/MixerChanel.jsx'

import './Mixer.css'

class Mixer extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      sources: props.audioSources,
      crossfaderValue: 0,
      leftPlayer: props.audioSources[0],
      rightPlayer: props.audioSources[1]
     }
   }


   changeCrossfader(){
     const crossfaderValue = Number(document.getElementById('crossfader').value);
     const leftPlayer = this.state.leftPlayer;
     const rightPlayer = this.state.rightPlayer;
     if (crossfaderValue < 0){
       rightPlayer.setCrossfaderGain(1 + crossfaderValue);
     } else if (crossfaderValue > 0) {
       leftPlayer.setCrossfaderGain(1 - crossfaderValue);
     } else {
       rightPlayer.setCrossfaderGain(1);
       leftPlayer.setCrossfaderGain(1);
     }
     this.setState({crossfaderValue: crossfaderValue});
   }


  render() {
    const chanels = this.state.sources.map(source => (
        <MixerChannel source={source} />
    ));
    const crossfaderValue = this.state.crossfaderValue;

    return (
      <div className='mixer'>
        <div className='flex-container'>
          {chanels}
        </div>
        <div className='content-center'>
          <label>Crossfader</label><br/>
          <input id='crossfader' type='range' min='-1' max='1' step='0.015625'
            value={crossfaderValue} onChange={() => this.changeCrossfader()}
            className='crossfader-slider'/>
        </div>
      </div>
    );
  }
}

export default Mixer;
