import React from 'react'

import AudioPlayer from './AudioPlayer'
import Mixer from './mixer/Mixer'


import '../styles/index.css'

const audio1Path = 'tst.mp3'
const audio2Path = 'tst2.mp3'

const COUNT_AUDIO_PLAYER = 2;

class Controller extends React.Component {


  render(){
    // const leftAudioPlayers = [];
    // const rightAudioPlayers = [];
    // for (var i = 0; i < COUNT_AUDIO_PLAYER; i++){
    //
    // }

    return (
      <div className='flexcontainer'>
        <AudioPlayer path={audio1Path} id={1} className='flexitem'/>
        <Mixer audioSources={[1,2]} />
        <AudioPlayer path={audio2Path} id={2} className='flexitem'/>
      </div>
    );
  }
}

export default Controller;
