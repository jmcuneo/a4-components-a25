import "./Theme.css"
import { useState } from "react";

function DrawingApp() {
    const [drawing, setDrawing] = useState(false);

    return (
        <canvas class="w-350 h-350" id="drawing_canvas">
        </canvas>
    );
}

export default DrawingApp;