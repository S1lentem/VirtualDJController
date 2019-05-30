import React from 'react';

import './Oscilloscope.css'

export default class Oscilloscope extends React.Component {

  render(){
    return (
      <canvas id={'osc' + this.props.id} className='osc'></canvas>
    );
  }

  componentDidUpdate(prevProps, prevState){
    const analyser = this.props.analyser;

    if (analyser){
      const canvas = document.getElementById('osc' + this.props.id);
      const ctx = canvas.getContext('2d');

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        analyser.getByteTimeDomainData(dataArray);
        ctx.fillStyle = "#C0C0C0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.props.color ? this.props.color : 'black';

        ctx.beginPath();

        let sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++){
          let v = dataArray[i] / 128.0;
          let y = v * canvas.height / 2;

          if (i===0){
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
      renderFrame();
    }
  }
}
