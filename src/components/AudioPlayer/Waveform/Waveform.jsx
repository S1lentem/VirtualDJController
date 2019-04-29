import React from 'react'
import WaveSurfer from 'wavesurfer.js'

const WAVEFORM_CANVAS = 'wave';

class Waveform extends React.Component{
  constructor(props){
    super(props)
    const id = props.audioSource.getId();
    this.state = {
      audioSource: props.audioSource,
      waveform: null
    }

    this.state.audioSource.addUploadListener(audioSource => {
      const wavesurfer = WaveSurfer.create({
        container: document.getElementById(WAVEFORM_CANVAS + id),
        waveColor: '#696969',
        progressColor: '#DC143C',
        height: 64
      });
      wavesurfer.load(audioSource.getAudioUrl());
      this.setState({waveform: wavesurfer})
    });
  }

  render(){
    const id = this.state.audioSource.getId();
    return (
      <div id={WAVEFORM_CANVAS + id}>
      </div>
    );
  }
}

export default Waveform;
