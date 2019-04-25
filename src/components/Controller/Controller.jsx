import React from 'react'

import AudioPlayer from '../AudioPlayer/AudioPlayer.jsx'
import Mixer from '../Mixer/Mixer'
import AudioSource from '../../infrastructure/AudioSource'

// import '../../styles/index.css'
import './Controller.css'

const audio1Path = 'tst.mp3'
const audio2Path = 'tst2.mp3'

const COUNT_AUDIO_PLAYER = 2;

class Controller extends React.Component {
  render(){
    const leftAudioPlayers = [];
    const rightAudioPlayers = [];
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

    return (
      <div className='flexcontainer'>
        {leftAudioPlayers}
        <Mixer audioSources={audioSources} />
        {rightAudioPlayers}
      </div>
    );
  }
}

export default Controller;
