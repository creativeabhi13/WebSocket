import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const WebSocketAnimation = () => {
    const [socket, setSocket] = useState(null);
    const [animationData, setAnimationData] = useState({ x: 200, y: 200 });
    const canvasRef = useRef(null);
    const circleRef = useRef({ x: 200, y: 200 });
    const gradientRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5001");

        ws.onopen = () => console.log("Connected to WebSocket Server");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.x !== undefined && data.y !== undefined) {
                setAnimationData(data);
            }
        };
        ws.onclose = () => console.log("WebSocket Disconnected");

        setSocket(ws);

        return () => ws.close();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(circleRef.current.x, circleRef.current.y, 20, 0, Math.PI * 2);
            ctx.fill();
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    useEffect(() => {
        gsap.to(circleRef.current, {
            x: animationData.x,
            y: animationData.y,
            duration: 0.6,
            ease: "power3.out",
        });
    }, [animationData]);

    // Rainbow Gradient Animation at the Top
    useEffect(() => {
        const animateGradient = () => {
            gsap.to(gradientRef.current, {
                backgroundPositionX: ["0%", "100%"],
                duration: 3,
                repeat: -1,
                ease: "linear",
            });
        };
        animateGradient();
    }, []);

    const startAnimation = () => socket?.send(JSON.stringify({ action: "start" }));
    const stopAnimation = () => {
        socket?.send(JSON.stringify({ action: "stop" }));
        setAnimationData({ x: 200, y: 200 }); // Reset position
    };

    return (
        <div style={styles.container}>
            {/* Rainbow Gradient Effect */}
            <div ref={gradientRef} style={styles.gradient}></div>

            <div style={styles.content}>
                <canvas ref={canvasRef} width={400} height={400} style={styles.canvas} />
                <div style={styles.buttonContainer}>
                    <button onClick={startAnimation} style={styles.button}>Start</button>
                    <button onClick={stopAnimation} style={styles.button}>Stop</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "15vh",
        background: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
        backgroundSize: "300% 100%",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "500px",
        padding: "20px",
    },
    canvas: {
        border: "1px solid black",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "400px",
        height: "auto",
    },
    buttonContainer: {
        marginTop: "20px",
        display: "flex",
        gap: "15px",
    },
    button: {
        padding: "12px 20px",
        fontSize: "18px",
        cursor: "pointer",
        borderRadius: "8px",
        border: "none",
        background: "#007aff",
        color: "white",
        fontWeight: "bold",
        transition: "background 0.3s ease",
    },
};

export default WebSocketAnimation;
