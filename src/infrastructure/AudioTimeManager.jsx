class AudioTimeManager {
  constructor(media){
    this.isLoop = false;
    this.startLoopTime = null;
    this.endLoopTime = null;
    this.loopTime = null;

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


export default AudioTimeManager;
