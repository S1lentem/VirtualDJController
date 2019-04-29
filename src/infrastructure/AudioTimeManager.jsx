class AudioTimeManager {
  constructor(audioContext, id){
    this.audioContext = audioContext;
    this.id = id;
    this.status = AudioTrackStatus.stoped;


    this.isLoop = false;
    this.startLoopTime = null;
    this.endLoopTime = null;
    this.loopTime = null;
  }

  loadSource(media){
    this.media = media;
    this.media.ontimeupdate = evet => {
      if (this.isLoop && this.media.currentTime >= this.endLoopTime){
        this.media.currentTime = this.startLoopTime;
      }
    }
  }

  play(){
    this.media.play();
  }

  pause(){
    this.media.pause();
  }

  stop() {
    this.pause();
    this.media.currentTime = 0;
  }

  setLoop(value){
    this.isLoop = true;
    if (this.startLoopTime == null) {
      this.startLoopTime = this.media.currentTime;
    }
    this.endLoopTime = this.startLoopTime + (value * this.tackt);
    this.loopTime = value;
  }

  resetLoop(){
    this.isLoop = false;
    this.startLoopTime = null;
    this.endLoopTime = null;
    this.loopTime = null;
  }

  isLooping(){
    return this.isLoop;
  }

  getLoopTime(){
    return this.loopTime;
  }

  setBPM(bpm){
    this.bpm = bpm;
    this.tackt = 60 / bpm * 4
  }

  getDuration(){
    return this.media.duration;
  }

  getCurrentTime(){
    return this.media.currentTime;
  }
}


var AudioTrackStatus = Object.freeze({
  'stoped': 0,
  'suspended': 1,
  'played': 2
});


export default AudioTimeManager;
