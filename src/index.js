import React from 'react';
import {render} from 'react-dom';

import Controller from './components/Controller/Controller.jsx'
import Header from './components/Header/Header.jsx'

import './index.css'

class Main extends React.Component {
  constructor(props){
    super(props);

    this.state ={
      analyzer: null
    }

    this.updateAnalyzer = analyzer => {
      this.setState({analyzer: analyzer});
    }
  }

  render(){
    return (
      <div>
        <Header analyzer={this.state.analyzer}/>
        <Controller updateAnalyzer={this.updateAnalyzer}/>
      </div>
      );
  }
}

render(<Main />, document.getElementById('root'));
