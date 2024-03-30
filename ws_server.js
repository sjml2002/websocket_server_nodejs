// const express = require('express');
// const app = express();
// const server = app.listen(4242, 'localhost');

// app.get('/',(req, res) => {
//     console.log("4242 server running...");
//     res.send("hello world!");
// });

const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({port: 4343});
wss.on("connection", wsocket => {
    console.log("someone joined websocket server");
    wsocket.on("message", name => { //반드시 on의 이름을 message로 해야한다. (websocket 한정)
        console.log(`${name} enter the room`);
        wss.clients.username = name; //wss clients에 변수 추가
        const recentName = wss.clients.username;

        //wss.broadcast
        //반드시 wss.clients.forEach를 사용해야 모든 사용자에게 다 send를 할 수 있음
        wss.clients.forEach(function each(client) {
            client.send(`${recentName} servering`);
        });
    });
})

