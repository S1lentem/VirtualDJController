import React from 'react'
import WaveSurfer from 'wavesurfer.js'
import { guess } from 'web-audio-beat-detector';

import Waveform from'./Waveform/Waveform'
import Oscilloscope from './Oscilloscope/Oscilloscope';
import diskImg from './disk.png'


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
      speed: 1,
      audioName: null,
      playingState: 'stop'
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
      this.state.audioSource.load(ev.target.result);
      const audioName = files[0].name;
      this.setState({
        isLoaded: true,
        audioName: audioName.substr(0, audioName.lastIndexOf('.')) || audioName
      });
    }
    reader.readAsDataURL(files[0]);

    arrayBufferReader.onload = event => {
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

  playAudio(){
    this.state.audioSource.getAudioTimeManger().play();
    this.setState({playingState: 'played'});
  }

  stopAudio(){
    this.state.audioSource.getAudioTimeManger().stop()
    this.setState({playingState: 'stoped'});
  }

  pauseAudio(){
    this.state.audioSource.getAudioTimeManger().pause();
    this.setState({playingState: 'suspended'});
  }


  render(){
    const audioSource = this.state.audioSource;
    const isLoaded = this.state.isLoaded;
    const id = this.state.id;
    const speed = this.state.speed;
    const audioName = this.state.audioName !== null ? this.state.audioName:
      'Audio not load'

    const diskCSSSelector = this.state.playingState === 'played' ?
          'audiodisk audiodisk-play' : 'audiodisk'

    console.log('id', id);
    return (
        <div className='audio-player'>
          <div className='audio-block title'>
            <h1 className='content-center title-text'>Audio Player {id + 1}</h1>
            <Oscilloscope
              id = {id}
              analyser={audioSource.getAnalyser()}
              color={id % 2 === 0 ? 'red' : 'blue'}
            />
          </div>
          <div className='audio-block'>
            <div className='flex-container'>
              <h3 id={STATUS_TEXT_NAME + id}>{audioName}</h3>
              <label className='file-upload' value='Upload audio file'>
                <input id={LOAD_AUDIO_BUTTON + id} type='file' accept='audio/'
                  onChange={() => this.loadAuio()} />
                Load audio
              </label>
            </div>
          </div>

          <audio id={AUDIO_TAG + id} />

          <div className='audio-block'>
            <Waveform audioSource={audioSource} />
          </div>

          <div className='content-center audio-block'>
            <button id={PLAY_BUTTON_NAME + id}
              onClick={() => this.playAudio()}
              className='left-radius-button control-button'
              disabled={isLoaded ? false : true}>
              Play
            </button>
            <button id={PAUSE_BUTTON_NAME + id}
              onClick={() => this.pauseAudio()}
              className='control-button'
              disabled={isLoaded ? false : true}>
              Pause
            </button>
            <button id={STOP_BUTTON_NAME + id}
              onClick={() => this.stopAudio()}
              className='control-button right-radius-button'
              disabled={isLoaded ? false : true}>
              Stop
            </button>
          </div>


          <div className='audio-block flex-container'>
            <img src={diskImg} alt='disk' className={diskCSSSelector}/>
            <div>
              <input id={SPEED_SLIEDR_NAME + id} type='range'
                    className='speed-slider'
                    value={speed} onInput={() => this.changeSpeed()}
                    onDoubleClick={() => this.resetSpeed()}
                    min='0.5' max='1.5' step='0.0125'/>
                <div className='content-center'>
                <label htmlFor={SPEED_SLIEDR_NAME + id}
                  className='content-center'>
                  Speed
                </label> <br className='vertical-split'/>
                <button onClick={() => this.smoothResetSpeed()}
                  className='control-button'>
                  Reset speed
                </button>
              </div>
            </div>
          </div>

          <div className='audio-block content-center'>
            <label className=''>Looping</label><br />
            <button className='left-radius-button loop-button'>
              <strong>&lt;&lt;</strong>
            </button>
            <button className='loop-button' onClick={event => this.setLoop(0.5)}>
              <strong>1/2</strong>
            </button>
            <button className='loop-button' onClick={event => this.setLoop(1)}>
              <strong>1</strong>
            </button>
            <button className='loop-button' onClick={event => this.setLoop(2)}>
              <strong>2</strong>
            </button>
            <button className='loop-button' onClick={event => this.setLoop(4)}>
              <strong>4</strong>
            </button>
            <button className='loop-button' onClick={event => this.setLoop(8)}>
              <strong>8</strong>
            </button>
            <button className='right-radius-button loop-button'>
              <strong>&gt;&gt;</strong>
            </button>
          </div>
        </div>
      );
  }



}

export {AudioPlayer, AUDIO_TAG};
