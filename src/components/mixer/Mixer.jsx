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
   //  alert(this.state.sources);
   //  const chanels = [1,2].map(audioSource => {
   //    return (<Mixer source={audioSource} />);
   // });
   const chanels = this.state.sources.map(source => (
      <MixerChannel source={source} />
   ));

    return (
      <div className='flexitem'>
        <h1>{chanels}</h1>
      </div>
    );
  }
}

export default Mixer;
