import "./Theme.css";
import { useState, useRef, useEffect } from "react";

let x = 0;
let y = 0;

function DrawingApp({ canvasRef: externalCanvasRef }) {
    const [drawing, setDrawing] = useState(false);
    const canvasRef = externalCanvasRef || useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            contextRef.current = canvasRef.current.getContext('2d');
            set_up_canvas();
        }
            console.log(canvasRef.current);
    }, []);

    const handlePointerEnter = (event) => {
        event.currentTarget.style.cursor = 'crosshair';
        console.log('Pointer enters target');
    }
    const handlePointerDown = (event) => {
        setDrawing(true);
        const position = get_canvas_position(event);
        x= (position.x);
        y= (position.y);
        console.log('Pt down coord: ', x, y);
    }
     const handlePointerMove = (event) => {
        if (!drawing) return;
        const position = get_canvas_position(event);
        const context = contextRef.current;
        if(context !== null) {
            context.beginPath();
            context.lineWidth = 5;
            context.strokeStyle = 'black';
            context.lineCap = 'round';
            context.moveTo(x, y);
            x= (position.x);
            y= (position.y);
            console.log('ptmove coord: ', x ,y);
            context.lineTo(x, y);
            context.stroke();
        } else {
            console.log('context not yet mounted');
        }
    }
    const handlePointerUp = (event) => {
        setDrawing(false);
    }
    const handlePointerLeave = (event) => {
        setDrawing(false);
        event.currentTarget.style.cursor = 'revert';
        console.log('Pointer left element');
    }
  function set_up_canvas() {
        contextRef.current.fillStyle = 'white';
        contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function get_canvas_position(event) {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }
        
    return (
        <canvas ref={canvasRef} 
        id="drawing_canvas"
        width= "400"
        height= "400"
        className="border-2 border-dotted border-card-accent-color h-[400px] w-[400px]"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}>
        </canvas>
    );
}

export default DrawingApp;