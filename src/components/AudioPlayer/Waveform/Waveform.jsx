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
      const wavesurfer = WaveSurfer.create({
        container: document.getElementById(WAVEFORM_CANVAS + id),
        waveColor: '#696969',
        progressColor: '#DC143C',
        height: 64
      });

      document.getElementById(WAVEFORM_CANVAS + id).addEventListener('click', event =>{
        this.setState({isSeek: true});
      });

      const media = audioSource.getMedia()
      wavesurfer.on('seek', () => {
        if (this.state.isSeek){
          media.currentTime = wavesurfer.getCurrentTime();
          this.setState({isSeek: false});
        }
      });

      media.addEventListener('timeupdate', event => {
        let currentTime = audioSource.getAudioTimeManger().getCurrentTime();
        let duration = audioSource.getAudioTimeManger().getDuration();
        wavesurfer.seekTo(currentTime / duration);
      });

      wavesurfer.load(media.src);
      this.setState({waveform: wavesurfer});;
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
