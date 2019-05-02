import React from 'react';
import {render} from 'react-dom';

import Controller from './components/Controller/Controller.jsx'
import Header from './components/Header/Header.jsx'

import './index.css'

class Main extends React.Component {
  render(){
    return (
      <div>
        <Header />
        <Controller />
      </div>
      );
  }
}

render(<Main />, document.getElementById('root'));
