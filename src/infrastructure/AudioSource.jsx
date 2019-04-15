import AudioTimeManager from './AudioTimeManager'

const defaultSpeed = 1;
const defaultGain = 1;

class AudioSource {

  constructor(id){
    this.context = new window.AudioContext();
    this.id = id;

    this.uploadedListeners = [];
    this.audioTimeManager = new AudioTimeManager(this.context, this.id);

    this.source = this.context.createBufferSource();
    this.gainNode = this.context.createGain();
    this.crossafaderGainNode = this.context.createGain();
    this.panNode = this.context.createStereoPanner();
    this.scriptNode =  this.context.createScriptProcessor();

    this.source.connect(this.scriptNode);
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.crossafaderGainNode);
    this.crossafaderGainNode.connect(this.panNode);
    this.panNode.connect(this.context.destination);

    this.audioTimeManager.onStoped = manager => {
      const buffer = this.source.buffer;

      this.source.disconnect(this.scriptNode);
      this.source.disconnect(this.gainNode);

      this.source = this.context.createBufferSource();
      this.source.buffer = buffer;

      this.source.connect(this.scriptNode);
      this.source.connect(this.gainNode);

      manager.loadSource(this.source);
    };
  }

  load(buffer){
    this.source.buffer = buffer;
    this.audioTimeManager.loadSource(this.source, buffer);

    for (var i = 0; i < this.uploadedListeners.length; i++){
      this.uploadedListeners[i](this);
    }
  }

  setGain(value){
    this.gainNode.gain.value = value;
  }

  setSpeed(value){
    if (this.source !== undefined){
      this.source.playbackRate.value = value;
    }
  }

  setPanned(value){
    if (this.source !== undefined){
      this.panNode.pan.value = value;
    }
  }

  addSpeed(value){
    this.source.playbackRate.value += value;
  }

  getSpeed(){
    if (this.source === undefined){
      return undefined;
    }
    return this.source.playbackRate.value;
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
    if (this.crossafaderGainNode !== undefined){
      this.crossafaderGainNode.gain.value = value;
    }
  }

  addUploadListener(listener){
    this.uploadedListeners.push(listener);
  }

  getAudioTimeManger(){
    return this.audioTimeManager;
  }


}

var AudioTrackStatus = Object.freeze({
  'stoped': 0,
  'suspended': 1,
  'played': 2
});


export default AudioSource;
