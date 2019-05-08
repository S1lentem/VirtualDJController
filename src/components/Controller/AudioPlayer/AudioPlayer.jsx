import React from 'react'
import { guess } from 'web-audio-beat-detector';

import Waveform from'./Waveform/Waveform'
import Oscilloscope from './Oscilloscope/Oscilloscope';
import diskImg from './disk.jpg'
import styled, {css, keyframes} from "styled-components"

import './AudioPlayer.css'


const SPEED_SLIEDR_NAME = 'speed';
const STATUS_TEXT_NAME = 'status';
const PLAY_BUTTON_NAME = 'play';
const STOP_BUTTON_NAME = 'stop';
const PAUSE_BUTTON_NAME = 'pause';
const LOAD_AUDIO_BUTTON = 'load_audio';
const AUDIO_TAG = 'audio'
const DISK_NAME = 'disk';

class AudioPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      audioSource: props.source,
      waveform: null,
      isLoaded: false,
      speed: 1,
      audioName: null,
      playingState: 'stop'
    }
    this.state.audioSource.addUploadListener(audioSource =>{
      const speed = Number(document.getElementById(SPEED_SLIEDR_NAME +
                                                   this.props.id).value);
      audioSource.setSpeed(speed);
    });
  }

  changeSpeed(){
    if (this.state.speedTimerId){
      clearInterval(this.state.speedTimerId);
    }
    let currentSpeed = Number(document.getElementById(SPEED_SLIEDR_NAME + this.props.id).value);
    this.state.audioSource.setSpeed(currentSpeed);
    this.setState({speed: currentSpeed});
  }

  resetSpeed(){
    this.setState({speed: 1});
    this.state.audioSource.setSpeed(1);
  }

  smoothResetSpeed() {
    let audioSource = this.state.audioSource;
    if (audioSource.getSpeed() === undefined){
      return;
    }
    let slider = document.getElementById(SPEED_SLIEDR_NAME + this.props.id);
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
    const files = document.getElementById(LOAD_AUDIO_BUTTON + this.props.id).files;

    reader.onload = ev => {
      this.state.audioSource.load(ev.target.result);
      const audioName = files[0].name;
      this.setState({
        isLoaded: true,
        audioName: audioName.substr(0, audioName.lastIndexOf('.')) || audioName,
        playingState: 'stoped'
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
    if (this.state.audioSource.getAudioTimeManger().getLoopTime() !== value){
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

  getAngleDiskComponent(){
    const image = document.getElementById(DISK_NAME + this.props.id);
    if (!image){
      return 0;
    }

    const valueRotate = window.getComputedStyle(image, null)
        .getPropertyValue('transform');

    if (valueRotate == 'none'){
      return 0;
    }

    const values = valueRotate.split('(')[1].split(')')[0].split(',');
    let degree = Math.round(Math.asin(values[1]) * (180/Math.PI));
    if (values[0] < 0){
      degree = 180 - degree;
    }
    if (degree < 0) {
      degree += 360;
    }
    return degree;
  }

  getStyleForDisk(state){
    let angle = this.getAngleDiskComponent() % 360;
    const color = this.props.id % 2 === 0 ? '#B22222' : '#00008B';
    if (state === 'played'){
      const spin = keyframes`
        from {transform: rotate(${angle}deg);}
        to {transform: rotate(${angle+360}deg);}
      `
      const animation = css`${spin} 5s linear infinite normal`

      return styled.img`
        width: 12rem;
        height: 12rem;
        border-radius: 50%;
        border: 0.25rem solid ${color};
        animation: ${animation};
      `
    } else {
      angle = state === 'stoped' ? 0 : angle;
      return styled.img`
        width: 12rem;
        height: 12rem;
        border-radius: 50%;
        border: 0.25rem solid ${color};
        transform: rotate(${angle}deg);
      `
    }
  }


  render(){
    const audioSource = this.state.audioSource;
    const isLoaded = this.state.isLoaded;
    const id = this.props.id;
    const speed = this.state.speed;

    const DISK = this.getStyleForDisk(this.state.playingState);


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
            <h4 id={STATUS_TEXT_NAME + id}>
              {this.state.audioName}
            </h4>
            <label className='file-upload' value='Upload audio file'>
              <input id={LOAD_AUDIO_BUTTON + id} type='file' accept='audio/'
                onChange={() => this.loadAuio()} />
              Load audio
            </label>
          </div>

          <audio id={AUDIO_TAG + id} />

          <div className='audio-block'>
            <label className='waveform-status'>
              {this.state.audioName === null ? 'Audio not load' : null}
            </label>
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
            <DISK src={diskImg} alt='disk'
              id={DISK_NAME + id}/>
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
