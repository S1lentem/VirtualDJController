import React from 'react'

// import '.././styles/index/css'

import '../../styles/index.css'

class MixerChannel extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      source: props.source
    }
  }

  render(){
    return (
      <div>
        <input type='range' className='slider' min='0' max='1.25' step='0.0125'/>
      </div>
    );
  }
}

export default MixerChannel;
