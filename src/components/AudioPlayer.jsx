import React from 'react'

import '../styles/index.css'
import AudioSource from '../infrastructure/AudioSource'

import WaveformData from 'waveform-data'

const SPEED_SLIEDR_NAME = 'speed';
const GAIN_SLIEDR_NAME = 'gain';
const STATUS_TEXT_NAME = 'status';
const PLAY_BUTTON_NAME = 'play';
const STOP_BUTTON_NAME = 'stop';
const PAUSE_BUTTON_NAME = 'pause';
const LOAD_AUDIO_BUTTON = 'load_audio';
const WAVEFORM_CANVAS = 'waveform';

class AudioPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      audioSource: props.source,
      waveform: null,
      id: props.id,
      isLoaded: false,
      speed: 1
    }
  }

  changeSpeed(){
    if (this.state.speedTimerId){
      clearInterval(this.state.speedTimerId);
    }
    let currentSpeed = Number(document.getElementById(SPEED_SLIEDR_NAME + this.state.id).value);
    this.state.audioSource.setSpeed(currentSpeed);
    this.setState({speed: currentSpeed});
  }

  resetSpeed(){
    let audioSource = this.state.audioSource;
    this.setState({speed: 1});
    if (audioSource != null && audioSource.isReadyForPlayed()){
      this.state.audioSource.setSpeed(1);
    }
  }

  smoothResetSpeed() {
    let audioSource = this.state.audioSource;
    if (audioSource.getSpeed() === undefined){
      return;
    }
    let slider = document.getElementById(SPEED_SLIEDR_NAME + this.state.id);
    let turnDown = audioSource.getSpeed() > 1 ? true : false;
    let value = turnDown ? -0.00625 : 0.00625;

    let timerId = setInterval(() => {
      let currentSpeed = audioSource.getSpeed();
        if ((turnDown && currentSpeed <= 1) ||
            (!turnDown && currentSpeed >= 1)){
          audioSource.setSpeed(1);
          slider.value = 1;
          clearInterval(timerId);
          return;
        }
        slider.value = currentSpeed;
        audioSource.addSpeed(value);

    }, 500);
    this.setState({speedTimerId: timerId});
  }

  loadAuio(){
    const files = document.getElementById(LOAD_AUDIO_BUTTON + this.state.id).files;
    const reader = new FileReader();
    const webAudioBuilder = require('waveform-data/webaudio');
    const audioContext = this.state.audioSource.getContext();
    reader.onload = ev => {
      audioContext.decodeAudioData(ev.target.result).then(buffer => {
        this.state.audioSource.load(buffer);
        this.setState({
          isLoaded: true
        });
      }, false);

    }
    reader.readAsArrayBuffer(files[0]);
  }

  render(){
    let audioSource = this.state.audioSource;
    let isLoaded = this.state.isLoaded;
    let id = this.state.id;

    const speed = this.state.speed;
    console.log(speed);
    return (
        <div>
          <div className='center'>
            <h1>Audio Player {id + 1}</h1>
            <input id={LOAD_AUDIO_BUTTON + id} type='file' accept='audio/'
              onChange={() => this.loadAuio()} />
            <h3 id={STATUS_TEXT_NAME + id}>Audio loading</h3>
          </div>
          <div className='center'>
            <button id={PLAY_BUTTON_NAME + id} onClick={() => audioSource.play()}
              className='margined'  disabled={isLoaded ? false : true}>Play</button>
            <button id={STOP_BUTTON_NAME + id} onClick={() => audioSource.stop()}
              className='margined'  disabled={isLoaded ? false : true}>Stop</button>
            <button id={PAUSE_BUTTON_NAME + id} onClick={() => audioSource.pause()}
              className='margined'  disabled={isLoaded ? false : true}>Pause</button>
            <div>
              <div>
                <input id={SPEED_SLIEDR_NAME + id} type='range' className='slider'
                    value={speed} onInput={() => this.changeSpeed()}
                    onDoubleClick={() => this.resetSpeed()}
                    min='0.5' max='1.5' step='0.0125'/>
                </div>
                <div className='center'>
                  <label htmlFor={SPEED_SLIEDR_NAME + id}>Speed</label>
                </div>
              </div>
              <div>
                <button onClick={() => this.smoothResetSpeed()}>Reset speed</button>
              </div>
            </div>
          </div>
      );
  }
}

export default AudioPlayer;
