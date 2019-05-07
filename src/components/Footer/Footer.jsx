import React from 'react'

import Oscilloscope from './Oscilloscope/Oscilloscope'

import './Footer.css'

export default class Footer extends React.Component {
  render(){
    alert(this.props.analyser);
    return (
      <footer className='footer'>
        <Oscilloscope analyzer={this.props.analyzer}/>
      </footer>
    );
  }
}
