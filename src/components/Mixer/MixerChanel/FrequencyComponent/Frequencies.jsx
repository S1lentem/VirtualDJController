import React from 'react'
import { CircleSlider } from "react-circle-slider";


const HI_FREQUENCY_NAME = 'hi';
const MID_FREQUENCY_NAME = 'mid';
const LOW_FREQUENCY_NAME = 'low';


class Frequencies extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.source.getId(),
      source: props.source,
      low: 0,
      mid: 0,
      hi: 0
    }
  }

  changeLowFrequency(){
    const id = this.state.id;
    const currentLowFrequency = Number(
      document.getElementById(LOW_FREQUENCY_NAME + id).vlaue);
    this.setState({low: currentLowFrequency});
  }

  changeMidFrequency(){
    const id = this.state.id;
    const currentMidFrequency = Number(
      document.getElementById(MID_FREQUENCY_NAME + id).vlaue);
    this.setState({mid: currentMidFrequency});
  }

  changeHiFrequency(){
    const id = this.state.id;
    const currentHiFrequency = Number(
      document.getElementById(HI_FREQUENCY_NAME + id).vlaue);
    this.setState({hi: currentHiFrequency});
  }

  render(){
    const id = this.state.id;

    return (
      <div>

        <CircleSlider size={60} knobRadius={10} progressWidth={5} value={50}
          progressColor={null}/>

        <div>
          <div className='center'>
            <label htmlFor={HI_FREQUENCY_NAME + id}>HI</label>
          </div>
          <div>
            <input id={HI_FREQUENCY_NAME + id} value={this.state.hi}
              type='range' min='-1' max='1' step='0.0078125'/>
          </div>
        </div>
        <div>
          <div className='center'>
            <label htmlFor={MID_FREQUENCY_NAME + id}>MID</label>
          </div>
          <div>
            <input id={MID_FREQUENCY_NAME + id} value={this.state.mid}
              type='range' min='-1' max='1' step='0.0078125'/>
          </div>
        </div>
        <div>
          <div className='center'>
            <label htmlFor={LOW_FREQUENCY_NAME + id}>LOW</label>
          </div>
          <div>
            <input id={LOW_FREQUENCY_NAME + id} value={this.state.low}
              type='range' min='-1' max='1' step='0.0078125'/>
          </div>
        </div>
      </div>
    )
  }
}

export default Frequencies;
