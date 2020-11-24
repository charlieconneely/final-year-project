import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator();

const Canvas = () => {

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d');
    context.fillStyle = '#ff7e30';

    const rc = rough.canvas(canvas);
    const rect = generator.rectangle(40, 40, 400, 400);
    const line = generator.line(50, 50, 200, 200);
    rc.draw(rect);
    rc.draw(line);

    rc.rectangle(300, 350, 200, 250, {
        fill: 'blue',
        stroke: 'black',
        hachureAngle: 60,
        hachureGap: 10,
        fillWeight: 5,
        strokeWidth: 5
    });

    rc.rectangle(500, 350, 200, 250, {
        fill: 'white',
        stroke: 'black',
        hachureAngle: 60,
        hachureGap: 10,
        fillWeight: 5,
        strokeWidth: 5
    });
    rc.ellipse(400, 50, 150, 80, {
      fill: '#ff7e30'
    });
  });

  return (
    <canvas id="canvas"
          style={{backgroundColor:'grey'}}
          width={window.innerWidth}
          height={window.innerHeight}>
    </canvas>
  );
}

export default Canvas;
