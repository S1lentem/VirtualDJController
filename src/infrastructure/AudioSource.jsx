class AudioSource {
  constructor(id){
    this.context = new window.AudioContext();
    this.id = id;
  }

  load(buffer){
    this.buffer = buffer;
    this.source = null;
    this.gainNode = null;
    this.panNode = null;
    this.status = AudioTrackStatus.stoped;
  }

  createAudioSource(audioContext, buffer){
    this.source = audioContext.createBufferSource();
    this.gainNode = this.context.createGain();
    this.panNode = this.context.createStereoPanner();
    this.status = AudioTrackStatus.stoped;

    this.source.buffer = buffer;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.panNode);
    this.panNode.connect(this.context.destination);
  }

  play(){
    if (this.status === AudioTrackStatus.stoped){
      this.createAudioSource(this.context, this.buffer);
      this.source.start();
    } else if (this.status === AudioTrackStatus.suspended) {
      this.context.resume();
    } else {
      return;
    }
    this.status = AudioTrackStatus.played;
  }

  pause(){
    if (this.status == AudioTrackStatus.played){
      this.context.suspend();
      this.status = AudioTrackStatus.suspended;
    }
  }

  stop(){
    this.source.stop();
    if (this.status == AudioTrackStatus.suspended){
      this.context.resume();
    }
    this.status = AudioTrackStatus.stoped;
  }

  setGain(value){
    this.gainNode.gain.value = value;
  }

  setSpeed(value){
    this.source.playbackRate.value = value;
  }

  setPanned(value){
    this.panNode.pan.value = value;
  }

  addSpeed(value){
    this.source.playbackRate.value += value;
  }

  getSpeed(){
    return this.source.playbackRate.value;
  }

  isReadyForPlayed(){
    return this.source != null;
  }

  getContext(){
    return this.context;
  }

  getId(){
    return this.id;
  }
}

var AudioTrackStatus = Object.freeze({
  'stoped': 0,
  'suspended': 1,
  'played': 2
});


export default AudioSource;
