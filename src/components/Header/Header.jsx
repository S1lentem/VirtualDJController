import React from 'react'

import Visualizer from './Visualizer/Visualizer'

import './Header.css'

class Header extends React.Component {
  render(){
    return (
      <div className='header'>
        <Visualizer analyser={this.props.analyser}/>
      </div>
    );
  }
}

export default Header;
