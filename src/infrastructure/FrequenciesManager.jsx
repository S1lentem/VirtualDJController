class FrequenciesManager{
    constructor(audioContext){
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

      this.low.connect(this.mid);
      this.mid.connect(this.high);

    }

    getFirstNode(){
      return this.low;
    }

    getLastNode(){
      return this.high;
    }

    getHiFrequency(){
      return this.high.gain.value;
    }

    setHiFrequency(value){
      this.high.gain.value = value;
    }

    getMidFrequency(){
      return this.mid.gain.value;
    }

    setMidFrequency(value){
      this.mid.gain.value = value;
    }

    getLowFrequency(){
      return this.low.gain.value;
    }

    setLowFrequency(value){
      this.low.gain.value = value;
    }


}

export default FrequenciesManager;
