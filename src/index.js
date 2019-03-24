import React from 'react';
import {render} from 'react-dom';

import Controller from './components/Controller'

class Main extends React.Component {
  render(){
    return <Controller />
  }
}

render(<Main />, document.getElementById('root'));
