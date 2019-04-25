import React from 'react';
import {render} from 'react-dom';

import Controller from './components/Controller/Controller.jsx'

class Main extends React.Component {
  render(){
    return <Controller />
  }
}

render(<Main />, document.getElementById('root'));
