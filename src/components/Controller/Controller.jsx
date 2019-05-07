import React from 'react'

import {AudioPlayer, AUDIO_TAG} from './AudioPlayer/AudioPlayer'
import Mixer from './Mixer/Mixer'
import AudioSource from '../../infrastructure/AudioSource'

// import '../../styles/index.css'
import './Controller.css'

const audio1Path = 'tst.mp3'
const audio2Path = 'tst2.mp3'

const COUNT_AUDIO_PLAYER = 2;

class Controller extends React.Component {
  constructor(props){
    super(props);
    const audioContext = new window.AudioContext();
    const leftAudioPlayers = [], rightAudioPlayers = [];
    const audioSources = [];
    for (var i = 0; i < COUNT_AUDIO_PLAYER; i++){
      let audioSource = new AudioSource(i, audioContext);
      if (i % 2 === 0){
        leftAudioPlayers.push(<AudioPlayer id={i} source={audioSource}/>);
      } else {
        rightAudioPlayers.push(<AudioPlayer id={i} source={audioSource}/>);
      }
      audioSources.push(audioSource);
    }
    const analyzer = audioContext.createAnalyser();
    analyzer.connect(audioContext.destination);
    this.state = {
      audioSources,
      leftAudioPlayers,
      rightAudioPlayers,
      analyzer
    };
    props.updateAnalyzer(analyzer);
  }

  render(){
    return (
      <div className='flex-container flex-container-center-content controller'>
        {this.state.leftAudioPlayers}
        <Mixer audioSources={this.state.audioSources} />
        {this.state.rightAudioPlayers}
      </div>
    );
  }

  componentDidMount(){
    const audioSources = this.state.audioSources;
    for (let i = 0; i < audioSources.length; i++){
      const media = document.getElementById(AUDIO_TAG + audioSources[i].getId());
      audioSources[i].linkToMediaElement(media);
      audioSources[i].getLastNode().connect(this.state.analyzer);
    }
  }
}

export default Controller;
