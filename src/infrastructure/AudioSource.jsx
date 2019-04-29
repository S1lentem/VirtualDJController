import AudioTimeManager from './AudioTimeManager'

const defaultSpeed = 1;
const defaultGain = 1;

class AudioSource {

  constructor(id){
    this.context = new window.AudioContext();
    this.id = id;
    this.uploadedListeners = [];
    this.audioTimeManager = new AudioTimeManager(this.context, this.id);

    this.gainNode = this.context.createGain();
    this.crossafaderGainNode = this.context.createGain();
    this.panNode = this.context.createStereoPanner();
    this.scriptNode =  this.context.createScriptProcessor();

    this.gainNode.connect(this.crossafaderGainNode);
    this.crossafaderGainNode.connect(this.panNode);
    this.panNode.connect(this.context.destination);
  }

  load(url, media){
    const source = this.context.createMediaElementSource(media);
    this.media = media;
    this.media.src = url;


    source.connect(this.scriptNode);
    source.connect(this.gainNode);
    this.audioTimeManager.loadSource(this.media);

    for (var i = 0; i < this.uploadedListeners.length; i++){
      this.uploadedListeners[i](this);
    }
  }

  setGain(value){
    this.gainNode.gain.value = value;
  }

  setSpeed(value){
    if (this.media){
      this.media.playbackRate = value;
    }
  }

  setPanned(value){
    this.panNode.pan.value = value;
  }

  addSpeed(value){
    this.media.playbackRate += value;
  }

  getSpeed(){
    return this.media.playbackRate;
  }

  getContext(){
    return this.context;
  }

  getId(){
    return this.id;
  }

  getCrossfaderGain(){
    return this.crossafaderGainNode;
  }

  setCrossfaderGain(value){
    if (!this.crossafaderGainNode){
      this.crossafaderGainNode.gain.value = value;
    }
  }

  addUploadListener(listener){
    this.uploadedListeners.push(listener);
  }

  getAudioTimeManger(){
    return this.audioTimeManager;
  }

  getAudioUrl(){
    return this.media.src;
  }
}

var AudioTrackStatus = Object.freeze({
  'stoped': 0,
  'suspended': 1,
  'played': 2
});


export default AudioSource;
