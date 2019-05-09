import React from 'react'
import { guess } from 'web-audio-beat-detector';

import Waveform from'./Waveform/Waveform'
import Oscilloscope from './Oscilloscope/Oscilloscope';
import Disk from './Disk/Disk'
import './AudioPlayer.css'


const SPEED_SLIEDR_NAME = 'speed';
const STATUS_TEXT_NAME = 'status';
const PLAY_BUTTON_NAME = 'play';
const STOP_BUTTON_NAME = 'stop';
const PAUSE_BUTTON_NAME = 'pause';
const LOAD_AUDIO_BUTTON = 'load_audio';
const AUDIO_TAG = 'audio';

const LOOP_VALUES = ['1/2', '1', '2', '4', '8']

class AudioPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      waveform: null,
      isLoaded: false,
      speed: 1,
      audioName: null,
      currentValueLoop: null
    }
    this.props.source.addUploadListener(audioSource =>{
      const speed = Number(document.getElementById(SPEED_SLIEDR_NAME +
                                                   this.props.id).value);
      audioSource.setSpeed(speed);
    });
    this.diskChild = React.createRef();
  }

  changeSpeed(){
    if (this.state.speedTimerId){
      clearInterval(this.state.speedTimerId);
    }
    let currentSpeed = Number(document.getElementById(SPEED_SLIEDR_NAME +
                                                      this.props.id).value);
    this.props.source.setSpeed(currentSpeed);
    this.setState({speed: currentSpeed});
  }

  resetSpeed(){
    this.setState({speed: 1});
    this.props.source.setSpeed(1);
  }

  smoothResetSpeed() {
    let audioSource = this.props.source;
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
      this.props.source.load(ev.target.result);
      const audioName = files[0].name;
      this.setState({
        isLoaded: true,
        audioName: audioName.substr(0, audioName.lastIndexOf('.')) || audioName
      });
      this.diskChild.current.setStatus('stoped');
    }
    reader.readAsDataURL(files[0]);

    arrayBufferReader.onload = event => {
      this.props.source.getContext().decodeAudioData(event.target.result, buffer => {
        guess(buffer).then(({bpm, offset}) => {
          this.props.source.getAudioTimeManger().setBPM(bpm)
        });
      });
    }

    arrayBufferReader.readAsArrayBuffer(files[0]);
  }

  setLoop(value){
    console.log(value);
    if (this.props.source.getAudioTimeManger().getLoopTime() !== Number(value)){
      this.props.source.getAudioTimeManger().setLoop(Number(value));
      this.setState({currentValueLoop: value});
    } else {
      this.props.source.getAudioTimeManger().resetLoop();
      this.setState({currentValueLoop: null});
    }
  }

  setLeftLoop(){
    const currentValueLoop = this.state.currentValueLoop;
    if (currentValueLoop > 0.5) {
      this.setLoop(currentValueLoop / 2);
    }
  }

  setRightLoop(){
    const currentValueLoop = this.state.currentValueLoop;
    if (currentValueLoop < 8) {
      this.setLoop(currentValueLoop * 2);
    }
  }

  playAudio(){
    this.props.source.getAudioTimeManger().play();
    this.diskChild.current.setStatus('played');
  }

  stopAudio(){
    this.props.source.getAudioTimeManger().stop()
    this.diskChild.current.setStatus('stoped');
  }

  pauseAudio(){
    this.props.source.getAudioTimeManger().pause();
    this.diskChild.current.setStatus('suspended');
  }

  render(){
    const audioSource = this.props.source;
    const isLoaded = this.state.isLoaded;
    const id = this.props.id;
    const speed = this.state.speed;

    const colorClassForLoop = this.props.id % 2 === 0 ? 'red' : 'blue';
    const loopButtons = LOOP_VALUES.map(value => {
        const numberValue = eval(value);
        const isActiveClassName = numberValue === this.state.currentValueLoop ?
              colorClassForLoop : '';
        return (
          <button
            className={'black-button center-button ' + isActiveClassName}
            onClick={event => this.setLoop(numberValue)}>
            {value}
          </button>
        );
      }
    );

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

          <audio

            loop={false}
            id={AUDIO_TAG + id}
            onended={() => alert('oops')}
            />

          <div className='audio-block'>
            <label className='waveform-status'>
              {this.state.audioName === null ? 'Audio not load' : null}
            </label>
            <Waveform audioSource={audioSource} />
          </div>

          <div className='content-center audio-block'>
            <button id={PLAY_BUTTON_NAME + id}
              onClick={() => this.playAudio()}
              className='left-button black-button'
              disabled={isLoaded ? false : true}>
              Play
            </button>
            <button id={PAUSE_BUTTON_NAME + id}
              onClick={() => this.pauseAudio()}
              className='black-button'
              disabled={isLoaded ? false : true}>
              Pause
            </button>
            <button id={STOP_BUTTON_NAME + id}
              onClick={() => this.stopAudio()}
              className='black-button right-button'
              disabled={isLoaded ? false : true}>
              Stop
            </button>
          </div>


          <div className='audio-block flex-container'>
            <Disk id={id} ref={this.diskChild}/>
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
                  className='black-button'>
                  Reset speed
                </button>
              </div>
            </div>
          </div>

          <div className='audio-block content-center'>
            <label className=''>Looping</label><br />
            <button
              className='left-button black-button'
              onClick={() => this.setLeftLoop()}>
              &lt;&lt;
            </button>
              {loopButtons}
            <button
              className='right-button black-button'
              onClick={() => this.setRightLoop()}>
              &gt;&gt;
            </button>
          </div>
        </div>
      );
  }

  componentDidMount(){
    const audio = document.getElementById(AUDIO_TAG + this.props.id);
    audio.addEventListener('ended', () => {
      this.diskChild.current.setStatus('stoped');
      this.props.source.getAudioTimeManger().stop();
    })
  }
}

export {AudioPlayer, AUDIO_TAG};
