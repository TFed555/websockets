//клиентская сторона вебсокета

let url = "ws://localhost:3000"
let ws = new WebSocket(url);

const c = document.querySelector("#canvas");
let picker = document.querySelector("input[type=color]");


let ctx = c.getContext("2d");
let flag = false;
let currentColor = picker.value;

let line = []

const open = {
  type: 'Open'
}


function getCursorPos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return {x, y}
}

ws.onopen = function(event) {
  console.log('Connection opened');
  ws.send(JSON.stringify(open));
};

ws.onmessage = function(event) {
  console.log("Server response:", JSON.parse(event.data));
  let data = JSON.parse(event.data);
  if (data.type == "connect") {
    flag = true;
    for (let i = 0; i < data.list_.length; i += 1) {
      line.push(JSON.parse(data.list_[i]));
    }
    paint();
    flag = false;
  }
  else if (data.type == "color") {
    currentColor = data.color;
    paint();
  }
  else {
    flag = true;
    line.length = 0;
    line.push(data.object);
    paint();
    flag = false;
  }

};

function paint() {
  console.log(currentColor);
  ctx.lineWidth = 10;
  for (i=0; i < line.length; i+=1) {
    let coordb = line[i];
    ctx.strokeStyle = coordb.color;
    if (coordb.par == 'down') {
      ctx.beginPath();
      ctx.moveTo(coordb.x, coordb.y);
    }
    else if (coordb.par == 'move' && flag == true) {
      ctx.lineTo(coordb.x, coordb.y);
      ctx.stroke();
    }
    else {
      ctx.moveTo(coordb.x, coordb.y);
      ctx.beginPath();
    }
  }
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};

picker.addEventListener("input", function() {
  currentColor = picker.value;
  ws.send(JSON.stringify({type: 'Color', color: picker.value}));
});

c.addEventListener( 'mousedown', function(e)
{
  const pos = getCursorPos(c, e);
  flag = true;
  ctx.strokeStyle = currentColor;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  ws.send(JSON.stringify({x: pos.x, y: pos.y, par: 'down', color: currentColor}));
});

c.addEventListener( 'mouseup', function(e) {
  flag = false;
  ctx.strokeStyle = currentColor;
  ctx.beginPath();
  const pos = getCursorPos(c, e);
  ws.send(JSON.stringify({x: pos.x, y: pos.y, par: 'up', color: currentColor}));
});

c.addEventListener( 'mousemove', function(e) {
  const pos = getCursorPos(c, e);
  if (flag) {
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ws.send(JSON.stringify({x: pos.x, y: pos.y, par: 'move', color: currentColor}));
  }
});

ws.onclose = event => {
  console.log('Connection closed');
};
