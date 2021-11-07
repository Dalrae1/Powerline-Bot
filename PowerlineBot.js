const plSocket = require("./PowerlineSocket");
var name = "Dalrae"
var amountOfThreads = 300
var minAmount = 250
var maxPerProxy = 3 // Don't go over 3 or you have a very big chance of getting banned.
var timeBetweenBot = 10
var https = false // Uses a wss connection. Note that you need a valid SSL CERT, CHAIN, and FULLCHAIN for this to function as a encrypted traffic channel
var CountryCode = "US"
var masterServer = "master.powerline.io" // Only used if the value below is ""
var IPToConnect = ""; //Change to override
var useProxies = true // Do not disable this or your actual IP will be banned immediately.
var debugMode = false // Gives verbose telemetry on bot status
var proxies = { // I recommend proxies from https://proxy.webshare.io/login/
  //"IP:Port": NumberOfConnectedBots
  //Example Proxies (Probably dont work)
  "209.127.191.180:9279":0,
  "45.95.96.187:8746":0,
  "45.95.96.237:8796":0,
  "45.95.96.132:8691":0,
  "45.136.228.154:6209":0,
  "45.94.47.66:8110":0,
  "45.94.47.108:8152":0,
  "193.8.56.119:9183":0,
  "45.95.99.226:7786":0,
  "45.95.99.20:7580":0,
  "200.10.38.191:8713":0,
}

function doAction(bot) { // The action to be performed by the bot.
  startTeleport(bot)
}



function randomProperty(object) {
  var keys = Object.keys(object);
  return keys[Math.floor(keys.length * Math.random())];
};
var currentProxy = randomProperty(proxies);
var oldIPToConnect = "";
var inviteCode = "";
var numStartedSockets = 0
var numReadyBots = 0
var bots = []


main()
function waitForBots() {
  if (numReadyBots < minAmount) {
    setTimeout(waitForBots, 100)
  }
  else {
    for (i = 0; i < bots.length; i++) {
      if (debugMode) {
        console.log("Spawning bot "+i)
      }
      numReadyBots = amountOfThreads
      bots[i].spawn(name);
      doAction(bots[i])
    }
  }
}

function startBotCounter() {
  if (numStartedSockets < amountOfThreads) {
    proxies[currentProxy]++
    if (proxies[currentProxy] <= maxPerProxy) {
      numStartedSockets++
      createBot(useProxies, currentProxy)
      setTimeout(startBotCounter, timeBetweenBot)
    }
    else {
      currentProxy = randomProperty(proxies)
      setTimeout(startBotCounter, timeBetweenBot)
    }
  }
}
function main() {
  if (IPToConnect == "") {
    updateIP(CountryCode)
  }
  
  setTimeout(function() {
    if (IPToConnect != "") {
      startBotCounter()
      waitForBots()
    }
    else {
      main()
    }
  }, 1)
}

const WebSocket = require('ws');
const HttpsServer = require('https').createServer;
const fs = require("fs");
const EventEmitter = require("events");
var wss
if (https) {
  const server = HttpsServer({
      ssl: true,
      cert: fs.readFileSync("C:\\wamp64\\bin\\apache\\apache2.4.46\\conf\\key\\dalr.ae\\cert.pem"),
      ca: fs.readFileSync("C:\\wamp64\\bin\\apache\\apache2.4.46\\conf\\key\\dalr.ae\\fullchain.pem"),
      key: fs.readFileSync("C:\\wamp64\\bin\\apache\\apache2.4.46\\conf\\key\\dalr.ae\\privkey.pem")
  })
  wss = new WebSocket.Server({ port: 1338, server: server });
}
else
{
  wss = new WebSocket.Server({ port: 1338});
}


var MySnakePosition = {x:0.0, y:0.0, direction: 0}
var isTeleporting = false;
var lastMessage = Date.now()
var botsSpawned = 0
wss.on('connection', async function connection(ws, req) {
  console.log("[TELEPORT] Successfully connected to client at "+req.socket.remoteAddress)
  ws.on('message', async function incoming(message) {
    Bit8 = new DataView(new Uint8Array(message).buffer)
    var type = Bit8.getUint8(0)
    if (type == 1) {
      //if (!isTeleporting) {
        var posX = Bit8.getFloat32(1)
        var posY = Bit8.getFloat32(5)
        var direction = Bit8.getUint8(9)
        var speed = Bit8.getUint8(10)
        if (posX != 0.0 && posY != 0.0) {
          MySnakePosition = {x:-posY/10, y:posX/10, Direction: direction, Speed: speed}
          lastMessage = Date.now()
        }
      //}
    }
    else if (type == 2) {
      isTeleporting = Bit8.getUint8(1) == 1
      if (isTeleporting) {
        console.log("[TELEPORT] Bots are now being teleported")
      } else {
        console.log("[TELEPORT] Bots are no longer being teleported")
      }
      if (!isTeleporting) {
        botsSpawned = 0
      }
    }
  })
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}















/////////////////// ACTION FUNCTIONS BELOW ///////////////////

function startWings(bot) {
  setTimeout(function() {
    bot.sendWingsSpawn(name)
    bot.sendWingsShoot()
    startWings(bot)
  }, 500)
}

function startZigzag(bot) {
  bot.spawn(name)
  setTimeout(function() {
    bot.turn(2) //left
    setTimeout(function() {
      bot.turn(3) //down
      setTimeout(function() {
        bot.turn(4) //right
        setTimeout(function() {
          bot.turn(1) //up
          startCircle(bot)
        }, 1000)
      }, 100)
    }, 1000)
  }, 100)
}

function startZigzag(bot) {
  bot.spawn(name)
  setTimeout(function() {
    bot.turn(2) //left
    setTimeout(function() {
      bot.turn(3) //down
      setTimeout(function() {
        bot.turn(2) //left
        setTimeout(function() {
          bot.turn(1) //up
          startZigzag(bot)
        }, 50)
      }, 100)
    }, 50)
  }, 100)
}


function startRandom(bot) {
  setTimeout(function() {
    bot.turn(getRandomInt(1, 4))
    startRandom(bot)
  }, 100)
}

function startDie(bot) {
  setTimeout(function() {
    bot.die()
    setTimeout(function() {
      bot.spawn(name)
      startDie(bot)
    }, 1)
  }, 1)
}
function teleport(bot, x,y) {
  bot.addTurnPoint(2, x)
  bot.addTurnPoint(1, y)
}
function startTeleport(bot) {
  if (isTeleporting && MySnakePosition.x != 0.0 && MySnakePosition.y != 0.0 && Date.now()-lastMessage < 500 && botsSpawned <= 500) {
    if (debugMode) {
      console.log("Teleporting to ("+MySnakePosition.x+", "+MySnakePosition.y+")")
    }


    botsSpawned++
    setTimeout(function() {
      if (MySnakePosition.Direction == 4) {
        teleport(bot, MySnakePosition.x, MySnakePosition.y+(MySnakePosition.Speed+5))
      }
      else if (MySnakePosition.Direction == 2) {
        teleport(bot, MySnakePosition.x, MySnakePosition.y-(MySnakePosition.Speed+5))
      }
      else if (MySnakePosition.Direction == 1) {
        teleport(bot, MySnakePosition.x+(MySnakePosition.Speed+5), MySnakePosition.y)
      }
      else if (MySnakePosition.Direction == 3) {
        teleport(bot, MySnakePosition.x-(MySnakePosition.Speed+5), MySnakePosition.y)
      }
      setTimeout(function() {
        bot.die()
        bot.spawn(name)
        startTeleport(bot)
      }, 100)
    }, 3900)
  } else {
    /*if (botsSpawned > 2000) {
      isTeleporting = false
    }*/
    bot.die()
    setTimeout(function() {
      startTeleport(bot)
    })
  }
}



/////////////////// END OF ACTIONS ///////////////////


















function getNick(data, offset) {
  for (var nick = ""; ; ) {
      var d = data.getUint16(offset, !0);
      offset += 2;
      if (0 == d) break;
      nick += String.fromCharCode(d);
  }
  return { nick: nick, offset: offset };
}

function desterilizeEntity(entity, Bit8, offset, isUpdate) { // Test function to desterilize entities (Not working)
  entity.type = Bit8.getUint8(offset, true)
  offset+=1
  entity.subtype = Bit8.getUint8(offset, true)
  offset+=1
  let nickData = getNick(Bit8, offset)
  offset = nickData.offset
  entity.nick = nickData.nick
  let xPos = Bit8.getFloat32(offset, true)*10
  offset+=4
  let yPos = -Bit8.getFloat32(offset, true)*10
  entity.position = {x: xPos, y: yPos}
  offset+=4
  entity.speed = Bit8.getFloat32(offset, true)
  offset+=4
  entity.length = Bit8.getFloat32(offset, true)
  offset+=5
  entity.pointcount = Bit8.getUint8(offset, true)
  //console.log(entity.pointcount)
  offset+=2
  entity.flags = Bit8.getUint8(offset, true)
  offset+=1
  // These flags are used for rendering stuff
  /*if (entity.flags & 1) { 
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    Bit8.getFloat32(offset, !0);
    offset += 4;
    var C = Bit8.getUint16(offset, !0);
    offset += 2;
    ha = [];
    for (m = 0; m < C; m++) {
        var F = Bit8.getFloat32(offset, !0);
        offset += 4;
        var n = -Bit8.getFloat32(offset, !0);
        offset += 4;
        ha.push({ x: 10 * F, y: 10 * n });
    }
  }
  if (entity.flags & 2) {
    Bit8.getFloat32(offset, !0)
    offset+=4
    -Bit8.getFloat32(offset, !0)
    offset+=4
    Bit8.getUint16(offset, !0)
    offset+=2
  }
  if (entity.flags & 4) {

  }
  if (entity.flags & 8) {
    Bit8.getUint16(offset, !0)
    offset+=2
  }
  if (entity.flags & 16) {
    
  }*/
  if (entity.flags & 32) { // Something for player kill streak
    Bit8.getUint16(offset, !0)
    offset+=2
  }
  if (entity.flags & 64) { // Something for talking
    Bit8.getUint16(offset, !0)
    offset+=1
  }
  entity.talkstamina = Bit8.getUint8(offset, !0)
  offset+=1
  //(Bit8.getUint8(offset, !0)/255)*100 // Something
  offset+=1
  if (isUpdate) {
    entity.points = []
    for (m = 0; m < entity.pointcount; m++) {
      let pointX = Bit8.getFloat32(offset, !0)*10
      offset+=4
      let pointY = -Bit8.getFloat32(offset, !0)*10
      entity.points.push({x: pointX, y: pointY})
      offset+=4
      entity.hue = Bit8.getUint16(offset, !0)
      offset+=2
      Bit8.getUint8(offset)
      offset+=1
    }
  }
  else if (((u = Bit8.getUint8(offset, !0)), offset++, 0 < u)) {
    entity.serverFixPoints = []
    for (m = 0; m < u; m++) {
      pointX = Bit8.getFloat32(offset, !0)*10
      offset+=4
      pointY = Bit8.getFloat32(offset, !0)*10
      offset+=4
      entity.serverFixPoints.push({x: pointX, y:pointY})
    }
  }
  return offset, entity
}


function createBot(useProxies, proxy) {
  if (IPToConnect != "") {
    if (debugMode) {
      console.log("Trying to connect bot...")
    }
      var bot = new plSocket((https && "wss://" || "ws://")+IPToConnect, useProxies, proxy);
      var botAlive = true
      bot.on('open', function () {
        bots.push(bot)
        numReadyBots++
        //console.log("Bot "+numReadyBots+" ready")
        bot.hello()
      });
      bot.on("message", function(m) { // Old way of getting snake position, don't use.
        /*Bit8 = new DataView(new Uint8Array(m).buffer)
        var messageType = Bit8.getUint8(0)
        if (messageType == 163) {
          offset = 1
          var entity = {}
          entity.id = Bit8.getUint8(offset, true)
          offset+=2
          let updateType = Bit8.getUint8(offset, true)
          offset+=1
          if (updateType == 0) {

          }
          else if (updateType == 1) { //Create
            offset, entity = desterilizeEntity(entity, Bit8, offset, true)
            if (entity.nick == "Dalrae") {
              MySnakePosition.x = entity.points[0].x
              MySnakePosition.y = entity.points[0].y
            }
            console.log("Spawned "+entity.nick+" at ("+entity.points[0].x+", "+entity.points[0].y+")")
          }
          //console.log("Received snake")
        }*/
      })

      bot.on("error", function(err) {
        console.log("Proxy: "+bot.proxy)
        console.log("err: "+err)
      })
      bot.on("close", function() {
        console.log("Socket Closed")
        numReadyBots++
        botAlive = false
      })
  }
  else {
    console.log("IP wrong")
    return false
  }
  if (IPToConnect != oldIPToConnect) {
    console.log("Connect Server Changed:\n\tInvite Code: #"+inviteCode+"\n\tIP: "+IPToConnect)
    oldIPToConnect = IPToConnect
  }
  //setTimeout(createBot, 100);
}
function updateIP() {
  const https = require('https')

  const data = CountryCode

  const options = {
    hostname: masterServer,
    port: 443,
    path: '/',
    method: 'PUT',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, res => {
    res.on('data', d => {
      var res = d.toString().split("/")
      if (res) {
        if (res[1] != undefined) {
          var IP = res[0].split(":")[0]
          var roomCode = parseInt(res[1].split("!")[0])
          inviteCode = res[1].split("!")[1]
          var port = roomCode+8080
          IPToConnect = IP+":"+port+"/"+roomCode
        }
        else {
          console.log("Res[1] was undefined. Response: "+res)
        }
      } else {
        var IP = d.toString().split(":")[0]
        var port = d.toString().split(":")[1].split("!")[0]
        inviteCode = d.toString().split(":")[1].split("!")[1]
        IPToConnect = IP+":"+port+"/0"
        
      }
      console.log(IPToConnect)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
  //setTimeout(updateIP, 100);
}
