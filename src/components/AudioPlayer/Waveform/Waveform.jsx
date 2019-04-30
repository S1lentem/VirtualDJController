import React from 'react'
import WaveSurfer from 'wavesurfer.js'

const WAVEFORM_CANVAS = 'waveform';

class Waveform extends React.Component{
  constructor(props){
    super(props)
    const id = props.audioSource.getId();
    this.state = {
      audioSource: props.audioSource,
      waveform: null,
      currentTime: 0,
      isSeek: false
    }

    this.state.audioSource.addUploadListener(audioSource => {
      const media = audioSource.getMedia()
      if (!this.state.waveform) {
        const wavesurfer = WaveSurfer.create({
          container: document.getElementById(WAVEFORM_CANVAS + id),
          waveColor: '#696969',
          progressColor: '#DC143C',
          height: 64
        });

        wavesurfer.on('seek', () => {
          if (this.state.isSeek){
            media.currentTime = wavesurfer.getCurrentTime();
          }
        });

        media.addEventListener('timeupdate', event => {
          if (this.state.isSeek){
            this.setState({isSeek: false});
          } else {
            let currentTime = audioSource.getAudioTimeManger().getCurrentTime();
            let duration = audioSource.getAudioTimeManger().getDuration();
            wavesurfer.seekTo(currentTime / duration);
          }
        });

        this.setState({waveform: wavesurfer});
      }
      this.state.waveform.load(media.src);
    });
  }

  render(){
    const id = this.state.audioSource.getId();
    return (
      <div id={WAVEFORM_CANVAS + id}
          onClick={event => this.setState({isSeek: true})}>
      </div>
    );
  }
}

export default Waveform;
