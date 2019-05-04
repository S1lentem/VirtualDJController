import AudioTimeManager from './AudioTimeManager'
import FrequenciesManager from './FrequenciesManager'

const defaultSpeed = 1;
const defaultGain = 1;

class AudioSource {

  constructor(id, media){
    this.context = new window.AudioContext();
    this.id = id;
    this.uploadedListeners = [];

    this.gainNode = this.context.createGain();
    this.crossafaderGainNode = this.context.createGain();
    this.panNode = this.context.createStereoPanner();

    this.gainNode.connect(this.crossafaderGainNode);
    this.crossafaderGainNode.connect(this.panNode);

    this.FrequenciesManager = new FrequenciesManager(this.context);
    this.panNode.connect(this.FrequenciesManager.getFirstNode());
    this.FrequenciesManager.getLastNode().connect(this.context.destination);
  }


  linkToMediaElement(media){
    this.audioTimeManager = new AudioTimeManager(this.context, this.id, media);
    this.source = this.context.createMediaElementSource(media);
    this.media = media;

    this.source.connect(this.gainNode);
  }

  load(url){
    this.media.src = url;
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
    if (this.crossafaderGainNode){
      this.crossafaderGainNode.gain.value = value;
    }
  }

  addUploadListener(listener){
    this.uploadedListeners.push(listener);
  }

  getAudioTimeManger(){
    return this.audioTimeManager;
  }

  getFrequencyManager(){
    return this.FrequenciesManager;
  }

  getMedia(){
    return this.media;
  }
}

var AudioTrackStatus = Object.freeze({
  'stoped': 0,
  'suspended': 1,
  'played': 2
});


export default AudioSource;
