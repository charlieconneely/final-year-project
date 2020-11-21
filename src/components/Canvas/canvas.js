import React, { useRef, useEffect } from 'react';

const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.75;

    const context = canvas.getContext('2d');

    context.fillStyle = '#ff7e30';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    /* Outline canvas border */
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
  }, []);

  return <canvas  ref={canvasRef} {...props}/>
}

export default Canvas;
