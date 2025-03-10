// import React, { useEffect, useState, useRef } from "react";
// import gsap from "gsap";

// const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6", "#AF52DE"];

// const WebSocketAnimation = () => {
//     const [socket, setSocket] = useState(null);
//     const [animationData, setAnimationData] = useState({ x: 200, y: 200 });
//     const canvasRef = useRef(null);
//     const circleRef = useRef({ x: 200, y: 200 });
//     const colorWaveRef = useRef(null);

//     useEffect(() => {
//         const ws = new WebSocket("ws://localhost:5001");

//         ws.onopen = () => console.log("Connected to WebSocket Server");
//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.x !== undefined && data.y !== undefined) {
//                 setAnimationData(data);
//             }
//         };
//         ws.onclose = () => console.log("WebSocket Disconnected");

//         setSocket(ws);

//         return () => ws.close();
//     }, []);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         const animate = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.fillStyle = "blue";
//             ctx.beginPath();
//             ctx.arc(circleRef.current.x, circleRef.current.y, 20, 0, Math.PI * 2);
//             ctx.fill();
//             requestAnimationFrame(animate);
//         };

//         animate();
//     }, []);

//     useEffect(() => {
//         gsap.to(circleRef.current, {
//             x: animationData.x,
//             y: animationData.y,
//             duration: 0.6,
//             ease: "power3.out",
//         });
//     }, [animationData]);

//     // Color wave animation at the top
//     useEffect(() => {
//         const changeColors = () => {
//             gsap.to(colorWaveRef.current, {
//                 background: colors[Math.floor(Math.random() * colors.length)],
//                 duration: 1.5,
//                 ease: "power2.inOut",
//                 onComplete: changeColors,
//             });
//         };
//         changeColors();
//     }, []);

//     const startAnimation = () => socket?.send(JSON.stringify({ action: "start" }));
//     const stopAnimation = () => {
//         socket?.send(JSON.stringify({ action: "stop" }));
//         setAnimationData({ x: 200, y: 200 }); // Reset position
//     };

//     return (
//         <div style={styles.container}>
//             <div ref={colorWaveRef} style={styles.colorWave}></div>

//             <div style={styles.content}>
//                 <canvas ref={canvasRef} width={400} height={400} style={styles.canvas} />
//                 <div style={styles.buttonContainer}>
//                     <button onClick={startAnimation} style={styles.button}>Start</button>
//                     <button onClick={stopAnimation} style={styles.button}>Stop</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100vh",
//         backgroundColor: "#fff",
//         overflow: "hidden",
//     },
//     colorWave: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "15vh",
//         backgroundColor: "#FF3B30",
//         transition: "background 1.5s ease-in-out",
//     },
//     content: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "100%",
//         maxWidth: "500px",
//         padding: "20px",
//     },
//     canvas: {
//         border: "1px solid black",
//         borderRadius: "10px",
//         width: "100%",
//         maxWidth: "400px",
//         height: "auto",
//     },
//     buttonContainer: {
//         marginTop: "20px",
//         display: "flex",
//         gap: "15px",
//     },
//     button: {
//         padding: "12px 20px",
//         fontSize: "18px",
//         cursor: "pointer",
//         borderRadius: "8px",
//         border: "none",
//         background: "#007aff",
//         color: "white",
//         fontWeight: "bold",
//         transition: "background 0.3s ease",
//     },
// };

// export default WebSocketAnimation;

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
