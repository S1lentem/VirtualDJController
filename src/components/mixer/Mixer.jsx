import React from 'react'
import MixerChannel from './MixerChanel'

import '../../styles/index.css'

class Mixer extends React.Component {
  constructor (props){
    super(props);
     this.state = {
       sources: props.audioSources
     }
   }


  render() {
   const chanels = this.state.sources.map(source => (
      <MixerChannel source={source} />
   ));
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
            <input type='range' min='0' max='1' step='0.0078125'/>
          </div>
        </div>
      </div>
    );
  }
}

export default Mixer;
