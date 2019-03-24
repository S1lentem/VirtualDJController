import React from 'react'

import '../styles/index.css'
import AudioSource from '../infrastructure/AudioSource'

const SPEED_SLIEDR_NAME = 'speed';
const GAIN_SLIEDR_NAME = 'gain';
const STATUS_TEXT_NAME = 'status';
const PLAY_BUTTON_NAME = 'play';
const STOP_BUTTON_NAME = 'stop';
const PAUSE_BUTTON_NAME = 'pause';

const MESSAGE_FOR_LOADING = 'Audio loading';
const MESSAGE_FOR_ERROR_LOADING = 'Error decoding file';

class AudioPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      audioSource: null,
      id: props.id,
      isLoaded: false
    }
    this.loadSoundFile(props.path);
  }


  loadSoundFile(url){
    let context = new window.AudioContext();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = e => {
      context.decodeAudioData(xhr.response,
      decodedArrayBuffer => {
        this.setState({
          audioSource: new AudioSource(context, decodedArrayBuffer),
          isLoaded: true
        });
        this.chaingeLoadStatus('Audio uploaded');
      }, e => this.chaingeLoadStatus(MESSAGE_FOR_ERROR_LOADING));
    };
    xhr.onprogress = e => this.updateStatusLoading();
    xhr.send();
  }

  chaingeLoadStatus(message){
    let textView = document.getElementById(STATUS_TEXT_NAME + this.state.id);
    textView.innerHTML = message;
  }

  updateStatusLoading(){
    let statusView = document.getElementById(STATUS_TEXT_NAME + this.state.id);
    if (statusView.innerHTML.length < 16){
      statusView.innerHTML += '.';
    } else {
      statusView.innerHTML = MESSAGE_FOR_LOADING;
    }

  }

  /*TO DO: Added decorater */
  changeGain(){
    let audioSource = this.state.audioSource
    if (audioSource != null && audioSource.isReadyForPlayed()){
      let currentGain = document.getElementById(GAIN_SLIEDR_NAME + this.state.id).value;
      this.state.audioSource.setGain(currentGain);
    }
  }

  /*TO DO: Added decorater */
  changeSpeed(){
    let audioSource = this.state.audioSource;
    if (audioSource != null && audioSource.isReadyForPlayed()){
      if (this.state.speedTimerId){
        clearInterval(this.state.speedTimerId);
      }
      let currentSpeed = document.getElementById(SPEED_SLIEDR_NAME + this.state.id).value;
      audioSource.setSpeed(currentSpeed);
    }
  }

  resetSpeed(){
    let audioSource = this.state.audioSource;
    let speedSlider = document.getElementById(SPEED_SLIEDR_NAME + this.state.id);
    speedSlider.value = 1;
    if (audioSource != null && audioSource.isReadyForPlayed()){
      this.state.audioSource.setSpeed(1);
    }
  }


  /*TO DO: Added decorater */
  smoothResetSpeed() {
    let audioSource = this.state.audioSource;
    if (audioSource != null && audioSource.isReadyForPlayed()){
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
          slider.value += value;
          audioSource.addSpeed(value);

      }, 500);
      this.setState({speedTimerId: timerId});
    }
  }

  render(){
    let audioSource = this.state.audioSource;
    let isLoaded = this.state.isLoaded;
    let id = this.state.id;
    return (
        <div className='flexitem'>
          <div>
            <h1>This is audio player {id}</h1>
            <h3 id={STATUS_TEXT_NAME + id}>Audio loading</h3>
          </div>
          <div>
            <button id={PLAY_BUTTON_NAME + id} onClick={() => audioSource.play()}
              className='margined'  disabled={isLoaded ? false : true}>Play</button>
            <button id={STOP_BUTTON_NAME + id} onClick={() => audioSource.stop()}
              className='margined'  disabled={isLoaded ? false : true}>Stop</button>
            <button id={PAUSE_BUTTON_NAME + id} onClick={() => audioSource.pause()}
              className='margined'  disabled={isLoaded ? false : true}>Pause</button>
            <div className='flexcontainer'>
                <div className='flexitem '>
                <div>
                  <label htmlFor='gain' className='center'>Volume</label>
                </div>
                <div>
                  <input id={GAIN_SLIEDR_NAME + id} type='range' className='slider'
                      onInput={() => this.changeGain()}
                      min='0' max='1.25' step='0.0125'/>
                </div>
              </div>
              <div className=''>
                <div>
                  <label htmlFor='speed'>Speed</label>
                </div>
                <div>
                  <input id={SPEED_SLIEDR_NAME + id} type='range' className='slider'
                      onInput={() => this.changeSpeed()}
                      onDoubleClick={() => this.resetSpeed()}
                      min='0.5' max='1.5' step='0.0125'/>
                </div>
                <div>
                  <button onClick={() => this.smoothResetSpeed()}>Reset speed</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default AudioPlayer;
