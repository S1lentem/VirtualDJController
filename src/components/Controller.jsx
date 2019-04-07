import React from 'react'

import AudioPlayer from './AudioPlayer'
import Mixer from './mixer/Mixer'


import '../styles/index.css'

const audio1Path = 'tst.mp3'
const audio2Path = 'tst2.mp3'


class Controller extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
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
