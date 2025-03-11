import express from 'express';
import { WebSocketServer } from 'ws';


const app=express();
const PORT=5001;

const server=app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

const wss=new WebSocketServer({server});

wss.on('connection',(ws)=>{
    ws.on("message",data=>{
        console.log("data from clinet:",data);
        ws.send("Thank you ");
    })

});