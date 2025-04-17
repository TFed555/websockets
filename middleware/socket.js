//серверная сторона вебсокета ws

import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 3000});

wss.on("connection", onConnect);
let listCoords = [];

function onConnect(client) {
    console.log("Connection opened");

    client.on("message", (message) => {
      const data = JSON.parse(message);
      // console.log(data);
      if (data.type == 'Open') {
        client.send(JSON.stringify({list_:listCoords, type: "connect"}));
      }

      else if (data.type == 'Color') {
        client.send(JSON.stringify({color:data.color, type:"color"}));
      }

      else {
        listCoords.push(message.toString());
        wss.clients.forEach( _client => {
          if(_client != client && _client.readyState === _client.OPEN){
            _client.send(JSON.stringify({object:data, type: "draw"}));
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

console.log("Сервер запущен на 3000 порту");
