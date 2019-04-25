import React from 'react'
import MixerChannel from './MixerChanel/MixerChanel.jsx'

// import '../../styles/index.css'

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
      <div>
        <div className='flexcontainer'>
          {chanels}
        </div>
        <div>
          <div className='center'>
            <label>Crossfader</label>
          </div>
          <div className='center'>
            <input id='crossfader' type='range' min='-1' max='1' step='0.015625'
              value={crossfaderValue} onChange={() => this.changeCrossfader()}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Mixer;
