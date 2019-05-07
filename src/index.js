import React from 'react';
import {render} from 'react-dom';

import Controller from './components/Controller/Controller.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'

import './index.css'

class Main extends React.Component {
  constructor(props){
    super(props);

    this.state ={
      analyser: null
    }

    this.updateanalyser = analyser => {
      this.setState({analyser: analyser});
    }
  }

  render(){
    return (
      <div>
        <Header analyser={this.state.analyser}/>
        <Controller updateanalyser={this.updateanalyser}/>
        <Footer analyser={this.state.analyser} />
      </div>
      );
  }
}

render(<Main />, document.getElementById('root'));
