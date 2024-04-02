// const express = require('express');
// const app = express();
// const server = app.listen(4242, 'localhost');

// app.get('/',(req, res) => {
//     console.log("4242 server running...");
//     res.send("hello world!");
// });

const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({port: 4343});

activeUser = []; //현재 방에 접속해 있는 유저

//반드시 wss.clients.forEach를 사용해야 모든 사용자에게 다 send를 할 수 있음
function broadcast(wss, data) {
    wss.clients.forEach(function each(client) {
        client.send(`${data}`);
    });
}

function datasplit(data) {
    const res = data.split('::');
    return (res); //[0] == data header,[1] == data 
}

function enterUser(name, wsocket) {
    console.log(`${name} enter the room`); //debug
    //색깔 랜덤으로 지정
    const color = Math.floor(Math.random() * 16777215).toString(16);
    const userData = name + '/' + color;
    wsocket.userData = userData; //wsocket에 name 변수 추가
    console.log(userData); //debug
    activeUser.push(userData); 
}

function exitUser(username) {
    const delidx = activeUser.indexOf(username);
    if (delidx > -1)
        activeUser.splice(delidx, 1); //splice()로 지운다.
}

wss.on("connection", wsocket => {
    console.log("someone joined websocket server");
    wsocket.isAlive = true;
    wsocket.on("message", data => { //반드시 on의 이름을 message로 해야한다. (websocket 한정)
        const res = datasplit(data.toString());
        const header = res[0];
        const resData = res[1];
        if (header == "enter") { //someone enter the room
            enterUser(resData, wsocket);
            broadcast(wss, activeUser);
        }
        else if (header == "draw") {
            //그리기 요청 처리
        }
        else {
            console.log("잘못된 요청입니다.");
        }
    });

    wsocket.on('close', function() {
        console.log("someone exit the room");
        exitUser(wsocket.userData);
        broadcast(wss, activeUser); //나갈 때도 명단 업데이트
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

