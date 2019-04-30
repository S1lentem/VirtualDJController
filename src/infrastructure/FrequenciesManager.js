
class FrequenciesManager{
    constructor(audioContext, prevNode, nextNode){
      this.low = audioContext.createBiquadFilter();
      this.low.type = 'lowshelf';
      this.low.frequency.value = 320.0;
      this.low.gain.value = 0.0;

      this.mid = audioContext.createBiquadFilter();
      this.mid.type = 'peaking';
      this.mid.frequency.value = 1000.0;
      this.mid.Q.value = 0.5;
      this.mid.gain.value = 0.0;

      this.high = audioContext.createBiquadFilter();
      this.high.type = 'highshelf';
      this.high.frequency.value = 3200.0;
      this.high.gain.value = 0.0;


      prevNode.connect(this.low);
      this.low.connect(this.mid);
      this.mid.connect(this.high);
      this.high.connect(this.nextNode);
    }
}
