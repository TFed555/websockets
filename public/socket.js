//клиентская сторона вебсокета

let url = "ws://localhost:3000"
let ws = new WebSocket(url);

const c = document.querySelector("#canvas");

let ctx = c.getContext("2d");
let log = console.log();
let flag = false;

let line = []

const open = {
  type: 'Open'
}

function getCursorPos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // console.log(x, y);
  return {x, y}
}

ws.onopen = function(event) {
  console.log('Connection opened');

  ws.send(JSON.stringify(open));
  // let len = event.data;
  // console.log('EVENT ONOPEN', len);
  // for (let i=0; i < len; i+=1) {
  //   line.push(event.data);
  // }
  // paint();
};

ws.onmessage = function(event) {
  console.log("Server response:", JSON.parse(event.data));
  // let data = event.data;
  let data = JSON.parse(event.data);
  if (data.type == "connect") {
    flag = true;
    for (let i = 0; i < data.list_.length; i += 1) {
      line.push(JSON.parse(data.list_[i]));
    }
    console.log(line);
    paint();
    flag = false;
  }
  else {
    flag = true;
    line.length = 0;
    line.push(data.object);
    paint();
    flag = false;
  }


  // let len = event.data;
  // console.log('EVENT ONOPEN', len);
  // for (let i=0; i < len; i+=1) {
  //   line.push(event.data);
  // }


  // paint();

  // line.push(event.data);
  // console.log(event.data);
  // // console.log("Value of line:", line);
  // paint();
  // if (line.length > 1) {
  //   paint()
  // }
};

function paint() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 10;
  // console.log('Paint() line:',line.length);
  for (i=0; i < line.length; i+=1) {
    let coordb = line[i];
    // let coordb = JSON.parse(line[i]);
    // let coorde = JSON.parse(line[i+1]);

    // console.log(coordb);
    // console.log(coorde);

    if (coordb.par == 'down') {
      ctx.beginPath();
      ctx.moveTo(coordb.x, coordb.y);
    }
    else if (coordb.par == 'move' && flag == true) {
      ctx.lineTo(coordb.x, coordb.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(coordb.x, coordb.y);
    }
    else {
      ctx.moveTo(coordb.x, coordb.y);
      ctx.beginPath();
    }
    // ctx.moveTo(coordb.x, coordb.y);
    // ctx.lineTo(coorde.x, coorde.y);
  }

  // line.length = 0;
  // console.log(line);

};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};

c.addEventListener( 'mousedown', function(e)
{
  const pos = getCursorPos(c, e);
  flag = true;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  ws.send(JSON.stringify({x: pos.x, y: pos.y, par: 'down'}));
});

c.addEventListener( 'mouseup', function(e) {
  flag = false;
  ctx.beginPath();
  const pos = getCursorPos(c, e);
  ws.send(JSON.stringify({x: pos.x, y: pos.y, par: 'up'}));
});

c.addEventListener( 'mousemove', function(e) {
  const pos = getCursorPos(c, e);
  if (flag) {
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ws.send(JSON.stringify({x: pos.x, y: pos.y, par: 'move'}));
  }
});


ws.onclose = event => {
  console.log('Connection closed');
};
