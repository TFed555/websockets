//серверная сторона вебсокета ws

// const fs = require('fs');
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 3000});

wss.on("connection", onConnect);
let listCoords = [];

function onConnect(client) {
    console.log("Connection opened");

  //   wss.clients.forEach( client => {
  //   client.send(listCoords.length);
  //   for (let i=0; i < listCoords.length;i+=1) {
  //       client.send(listCoords[i]);
  //   }
  // })

    // client.send(listCoords.length);
    //   // client.send(listCoords);
    // for (let i=0; i < listCoords.length;i+=1) {
    //     client.send(listCoords[i]);
    // }
    // console.log('OnConnect event:', listCoords);


    client.on("message", (message) => {
      const data = JSON.parse(message);
      console.log(data);
      if (data.type == 'Open') {
          client.send(JSON.stringify({list_:listCoords, type: "connect"}));
      //   client.send(listCoords.length);
      //   for (let i=0; i < listCoords.length;i+=1) {
      //     client.send(listCoords[i]);
      // }
    }

    else {
      listCoords.push(message.toString());
      wss.clients.forEach( _client => {
        // console.log(strClient, message.toString());
        // console.log(message.toString());
        // console.log(listCoords);
        // console.log(listCoords);
        if(_client != client && _client.readyState === _client.OPEN){
          _client.send(JSON.stringify({object:data, type:"draw"}));
        }
    });
    }
      });

      client.on("close", () => {
        console.log("Server: Connection closed");
      });

      client.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
}
// wss.on("close", () => {
//   console.log("Server: Connection closed");
// });

console.log("Сервер запущен на 3000 порту");
