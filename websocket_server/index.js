import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    let animationInterval;

    ws.on("message", (message) => {
        const { action } = JSON.parse(message);

        if (action === "start") {
            clearInterval(animationInterval); // Ensure no duplicate intervals
            animationInterval = setInterval(() => {
                const animationData = {
                    x: Math.random() * 400,
                    y: Math.random() * 400,
                };
                ws.send(JSON.stringify(animationData));
            }, 100);
        } else if (action === "stop") {
            clearInterval(animationInterval);
            animationInterval = null;
            ws.send(JSON.stringify({ stop: true })); // Send stop signal
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        clearInterval(animationInterval);
    });
});

server.listen(5001, () => console.log("WebSocket Server running on port 5001"));
