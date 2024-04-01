// const express = require('express');
// const app = express();
// const server = app.listen(4242, 'localhost');

// app.get('/',(req, res) => {
//     console.log("4242 server running...");
//     res.send("hello world!");
// });

const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({port: 4343});

//반드시 wss.clients.forEach를 사용해야 모든 사용자에게 다 send를 할 수 있음
function broadcast(wss, data) {
    wss.clients.forEach(function each(client) {
        client.send(`${data}`);
    });
}

activeUser = []; //현재 방에 접속해 있는 유저

wss.on("connection", wsocket => {
    console.log("someone joined websocket server");
    wsocket.isAlive = true;
    wsocket.on("message", name => { //반드시 on의 이름을 message로 해야한다. (websocket 한정)
        console.log(`${name} enter the room`);
        wsocket.username = name; //wsocket에 변수 추가
        activeUser.push(name); 
        broadcast(wss, activeUser);
        console.log(wss.clients.size); //debug
    });

    wsocket.on('close', function() {
        //여기에 퇴장 명단 작성
        console.log("something close: ");
    })
})

/*
WebSocket Connection을 Close 할 때 Server와 Client 사이의 일련의 handshake 과정을 거쳐야 한다.
그렇기 때문에 만약 Client 쪽에서 네트워크에 문제가 생겨 일방적으로 연결이 끊기게 되면
handshake 과정이 이뤄지지 않아 서버에서는 해당 Connection이 연결이 끊겼는지 알 수 없다.
*/
//주기적으로 모든 websocket connection에게 ping을 보내
//connection 상태 확인
// const interval = setInterval(function ping() {
//     for(client in wss.clients) {
//         console.log(client.username);
//     }
// }, 1000);

