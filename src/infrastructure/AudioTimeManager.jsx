class AudioTimeManager {
  constructor(audioContext, id){
    this.audioContext = audioContext;
    this.id = id;
    this.isLooping = false;
    this.status = AudioTrackStatus.stoped;

    this.source = null;
    this.buffer = null;

    this.dateStarted = null;
    this
  }

  loadSource(source){
    this.source = source;
    this.source.onended = event =>{
      this.stop();
    }
  }

  play(){
    if (this.status === AudioTrackStatus.stoped){
      this.dateStarted = new Date();
      this.source.start();
    } else if (this.status === AudioTrackStatus.suspended){
      this.audioContext.resume();
    } else {
      return;
    }
    this.status = AudioTrackStatus.played;
  }

  pause(){
    if (this.status === AudioTrackStatus.played){
      this.audioContext.suspend();
      this.status = AudioTrackStatus.suspended;
    }
  }

  stop() {
    this.source.stop();
    if (this.status === AudioTrackStatus.suspended){
      this.audioContext.resume();
    }
    this.status = AudioTrackStatus.stoped;

    if (this.onStoped !== undefined){
      this.onStoped(this);

    }
  }

  setLoop(loopValue){
    console.log(typeof this);
    console.log(this.dateStarted);

    const currentTime = (new Date() - this.dateStarted) / 1000;
    this.source.loopStart = currentTime;
    this.source.loopEnd = currentTime + loopValue;
    this.source.loop = true;
  }

  resetLoop(){
    this.source.loop = false;
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


export default AudioTimeManager;
