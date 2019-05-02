import React from 'react'

import {AudioPlayer, AUDIO_TAG} from '../AudioPlayer/AudioPlayer'
import Mixer from '../Mixer/Mixer'
import AudioSource from '../../infrastructure/AudioSource'

// import '../../styles/index.css'
import './Controller.css'

const audio1Path = 'tst.mp3'
const audio2Path = 'tst2.mp3'

const COUNT_AUDIO_PLAYER = 2;

class Controller extends React.Component {
  constructor(props){
    super(props);
    const leftAudioPlayers = [], rightAudioPlayers = [];
    const audioSources = [];
    for (var i = 0; i < COUNT_AUDIO_PLAYER; i++){
      let audioSource = new AudioSource(i);
      if (i % 2 === 0){
        leftAudioPlayers.push(<AudioPlayer id={i} source={audioSource}/>);
      } else {
        rightAudioPlayers.push(<AudioPlayer id={i} source={audioSource}/>);
      }
      audioSources.push(audioSource);
    }

    this.state = {
      audioSources: audioSources,
      leftAudioPlayers: leftAudioPlayers,
      rightAudioPlayers: rightAudioPlayers
    }
  }

  render(){
    return (
      <div className='flex-container'>
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
    }
  }
}

export default Controller;
