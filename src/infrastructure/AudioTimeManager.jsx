class AudioTimeManager {
  constructor(audioContext, id){
    this.audioContext = audioContext;
    this.id = id;
    this.isLooping = false;
    this.status = AudioTrackStatus.stoped;

    this.source = null;
    this.buffer = null;

    this.dateStarted = null;
  }

  loadSource(media){
    console.log(media);
    this.media = media;
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

  // setLoop(loopValue){
  //   console.log(typeof this);
  //   console.log(this.dateStarted);
  //
  //   const currentTime = (new Date() - this.dateStarted) / 1000;
  //   this.source.loopStart = currentTime;
  //   this.source.loopEnd = currentTime + loopValue;
  //   this.source.loop = true;
  // }
  //
  // resetLoop(){
  //   this.source.loop = false;
  // }
}


var AudioTrackStatus = Object.freeze({
  'stoped': 0,
  'suspended': 1,
  'played': 2
});


export default AudioTimeManager;
