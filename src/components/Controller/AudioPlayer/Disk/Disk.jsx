import React from 'react'

import './Disk.css'
import diskImg from './disk.png'

const DISK_NAME = 'disk';

export default class Disk extends React.Component{
  setStatus(status){
    const img = document.getElementById(DISK_NAME + this.props.id);
    switch (status) {
      case 'played':
        img.style.animationPlayState = 'running';
        break;
      case 'suspended':
        img.style.animationPlayState = 'paused';
        break;
      case 'stoped':
        img.style.animationPlayState = 'paused';
        // img.style.animationPlayState = 'initial';
      default:

    }
  }


  render() {
    const id = this.props.id;
    const borderClass = id % 2 === 0 ? 'audiodisk-red' : 'audiodisk-blue'
    return <img src={diskImg} alt='disk' id={DISK_NAME + id}
            className={'audiodisk ' + borderClass}/>
  }
}
