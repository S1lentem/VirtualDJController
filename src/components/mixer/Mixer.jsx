import React from 'react'
import MixerChannel from './MixerChanel'

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
      <div className='flexitem'>
        {chanels}
      </div>
    );
  }
}

export default Mixer;
