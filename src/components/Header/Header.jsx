import React from 'react'

import Visualizer from './Visualizer/Visualizer'

import './Header.css'

class Header extends React.Component {
  render(){
    return (
      <div className='header'>
        <label className='header-text'>By S1lentem</label>
        <Visualizer analyser={this.props.analyser}/>
      </div>
    );
  }
}

export default Header;
