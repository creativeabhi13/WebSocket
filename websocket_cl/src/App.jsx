

import React, { useEffect, useState, useRef } from "react";


const WebSocketAnimation = () => {
    const [socket, setSocket] = useState(null);
    const [animationData, setAnimationData] = useState(null);
    const [showGradient, setShowGradient] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5001");
        ws.onopen = () => console.log("Connected to WebSocket Server");
        ws.onmessage = (event) => setAnimationData(JSON.parse(event.data));
        ws.onclose = () => console.log("WebSocket Disconnected");
        setSocket(ws);
        
        return () => ws.close();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            if (!animationData) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(animationData.x, animationData.y, 20, 0, Math.PI * 2);
            ctx.fill();
        };

        requestAnimationFrame(draw);
    }, [animationData]);

    const startAnimation = () => {
        setShowGradient(true);
        socket?.send(JSON.stringify({ action: "start" }));
    };
    const stopAnimation = () => {
        setShowGradient(false);
        socket?.send(JSON.stringify({ action: "stop" }));
    };

    return (
        <div className="container">
            {showGradient && <div className="gradient-bar animated" />} 
            <canvas ref={canvasRef} width={400} height={400} className="canvas" />
            <br />
            <button onClick={startAnimation} className="btn start">Start</button>
            <button onClick={stopAnimation} className="btn stop">Stop</button>
        </div>
    );
};

export default WebSocketAnimation;
