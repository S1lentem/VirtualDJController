import React from 'react';

import './Oscilloscope.css'

export default class Oscilloscope extends React.Component {

  render(){

    return (
      <canvas id='osc'></canvas>
    );
  }

  componentDidUpdate(prevProps, prevState){
    const analyser = this.props.analyzer;

    if (analyser){
      alert('create');
      const canvas = document.getElementById('osc');
      const ctx = canvas.getContext('2d');

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / bufferLength) * 1.5;

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        analyser.getByteTimeDomainData(dataArray);
        ctx.fillStyle = "#696969";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 0)";

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
