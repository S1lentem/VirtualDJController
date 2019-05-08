import React from 'react';

import './Visualizer.css'

export default class Visualizer extends React.Component {

  render(){

    return (
      <canvas id='visual'></canvas>
    );
  }

  componentDidUpdate(prevProps, prevState){
    const analyser = this.props.analyser;
    if (analyser){
      const canvas = document.getElementById('visual');
      const ctx = canvas.getContext('2d');

        analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight, x;

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        x = 0;
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#696969";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < bufferLength; i++){
          barHeight = dataArray[i] / 2;

          var r = barHeight + (25 * (i/bufferLength));
          var g = 250 * (i/bufferLength);
          var b = 50;

          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      }
      renderFrame();
    }
  }
}
