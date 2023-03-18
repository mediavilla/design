import React, { useRef, useEffect } from "react";
import styles from '@/styles/Canvas.module.css'

function Canvas({ width, height, selectedOption }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // clear canvas
        context.clearRect(0, 0, width, height);

        // draw line in the middle of the canvas
        if (selectedOption === 'mirrorSides') {
            context.beginPath();
            context.moveTo(width / 2, 0);
            context.lineTo(width / 2, height);
            context.strokeStyle = '#ccc';
            context.stroke();
        }
    }, [width, height, selectedOption]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.canvas}
            width={width}
            height={height}
        />
    );
}





export default Canvas;

