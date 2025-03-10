import React, { useEffect, useState, useRef } from "react";

const WebSocketAnimation = () => {
    const [socket, setSocket] = useState(null);
    const [animationData, setAnimationData] = useState(null);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null); // Track animation frame

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5001");

        ws.onopen = () => console.log("Connected to WebSocket Server");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setAnimationData(data);
        };
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
            animationFrameRef.current = requestAnimationFrame(draw);
        };

        if (animationData) {
            animationFrameRef.current = requestAnimationFrame(draw);
        }

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [animationData]);

    const startAnimation = () => {
        if (socket) {
            socket.send(JSON.stringify({ action: "start" }));
        }
    };

    const stopAnimation = () => {
        if (socket) {
            socket.send(JSON.stringify({ action: "stop" }));
            setAnimationData(null); // Clear animation data
            cancelAnimationFrame(animationFrameRef.current); // Stop rendering
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <canvas ref={canvasRef} width={400} height={400} style={{ border: "1px solid black" }} />
            <br />
            <button onClick={startAnimation} style={{ marginRight: "10px" }}>Start</button>
            <button onClick={stopAnimation}>Stop</button>

            <p style={{ marginTop: "10px" }}>Abhishek Kumar</p>
        </div>
    );
};

export default WebSocketAnimation;
