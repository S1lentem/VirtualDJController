import React from 'react'
import WaveSurfer from 'wavesurfer.js'
import { guess } from 'web-audio-beat-detector';

import Waveform from'./Waveform/Waveform'

import './AudioPlayer.css'


const SPEED_SLIEDR_NAME = 'speed';
const GAIN_SLIEDR_NAME = 'gain';
const STATUS_TEXT_NAME = 'status';
const PLAY_BUTTON_NAME = 'play';
const STOP_BUTTON_NAME = 'stop';
const PAUSE_BUTTON_NAME = 'pause';
const LOAD_AUDIO_BUTTON = 'load_audio';
const AUDIO_TAG = 'audio'

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
    this.state.audioSource.addUploadListener(audioSource =>{
      const speed = Number(document.getElementById(SPEED_SLIEDR_NAME +
                                                   this.state.id).value);
      audioSource.setSpeed(speed);
    });
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
    this.state.audioSource.setSpeed(1);
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
    const reader = new FileReader();
    const arrayBufferReader = new FileReader();
    const files = document.getElementById(LOAD_AUDIO_BUTTON + this.state.id).files;
    const mediaElement = document.getElementById(AUDIO_TAG + this.state.id);

    reader.onload = ev => {
      const result = ev.target.result
      this.state.audioSource.load(result, mediaElement);
      this.setState({isLoaded: true});
    }
    reader.readAsDataURL(files[0]);

    arrayBufferReader.onload = event => {
      alert(typeof event.target.result);
      this.state.audioSource.getContext().decodeAudioData(event.target.result, buffer => {
        guess(buffer).then(({bpm, offset}) => this.state
          .audioSource.getAudioTimeManger().setBPM(bpm));
      });
    }


    arrayBufferReader.readAsArrayBuffer(files[0]);

  }

  setLoop(value){
    if (this.state.audioSource.getAudioTimeManger().getLoopTime() != value){
      this.state.audioSource.getAudioTimeManger().setLoop(value);
    } else {
      this.state.audioSource.getAudioTimeManger().resetLoop();
    }
  }


  render(){
    const audioSource = this.state.audioSource;
    const isLoaded = this.state.isLoaded;
    const id = this.state.id;
    const speed = this.state.speed;



    return (
        <div>
          <div className='center'>
            <h1>Audio Player {id + 1}</h1>
            <input id={LOAD_AUDIO_BUTTON + id} type='file' accept='audio/'
              onChange={() => this.loadAuio()} />
            <h3 id={STATUS_TEXT_NAME + id}>Audio loading</h3>
          </div>
          <Waveform audioSource={audioSource} />
          <div className='center'>
            <button id={PLAY_BUTTON_NAME + id}
              onClick={() => audioSource.getAudioTimeManger().play()}
              className='margined'  disabled={isLoaded ? false : true}>Play</button>
            <button id={STOP_BUTTON_NAME + id}
              onClick={() => audioSource.getAudioTimeManger().stop()}
              className='margined'  disabled={isLoaded ? false : true}>Stop</button>
            <button id={PAUSE_BUTTON_NAME + id}
              onClick={() => audioSource.getAudioTimeManger().pause()}
              className='margined'  disabled={isLoaded ? false : true}>Pause</button>
            <div>
              <div>
                <audio id={AUDIO_TAG + id} />
              </div>
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
            <div className='center'>
              <h3>Looping</h3>
              <input type='button' value='1/2'
                onClick={event => this.setLoop(0.5)}/>
              <input type='button' value='1'
                onClick={event => this.setLoop(Number(event.target.value))}/>
              <input type='button' value='2'
                onClick={event => this.setLoop(Number(event.target.value))}/>
              <input type='button' value='4'
                onClick={event => this.setLoop(Number(event.target.value))}/>
              <input type='button' value='8'
                onClick={event => this.setLoop(Number(event.target.value))}/>
            </div>
          </div>
      );
  }
}

export default AudioPlayer;
