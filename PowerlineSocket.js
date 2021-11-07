const ws = require("ws");
const EventEmitter = require("events");
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');

/**
 * @param {String} link
 * @param {Object} options
 */
class plSocket extends EventEmitter {
  constructor(link, useProxies, proxy, options) {
    super();
    this.wsurl = link;
    this.options = options;
    this.bot;
    this.count = 0;
    this.proxy = proxy
    this.connect(useProxies, proxy);
  }
  connect(useProxies, proxy) {
    if (useProxies) {
      this.bot = new ws(this.wsurl, {
        agent: new HttpsProxyAgent(url.parse(`http://${proxy}`))
      });
    }
    else {
      this.bot = new ws(this.wsurl)
    }
    this.bot.on("open", () => {
      this.onopen();
    });
    this.bot.on("close", () => {
      this.onclose();
    });
    this.bot.on("error", (err) => {
      this.onerror(err);
    });
    this.bot.on("message", (msg) => {
      this.onmessage(msg);
    });
  }
  onopen() {
    this.bot.send(new Uint8Array([1, 145, 0, 96, 0]));
    this.bot.send(new Uint8Array([0]));
    this.count++;
    super.emit("open");
  }
  onmessage(msg) {
    super.emit("message", msg);
  }
  onerror(errcode, errmsg) {
    this.bot.close();
    super.emit("error", errcode, errmsg);
  }
  onclose() {
    this.count--;
    this.bot.close();
    super.emit("close");
  }
  close() {
    this.bot.close();
  }
  send(packet) {
    this.bot.send(packet);
  }
  spawn(name) {
    this.encodedSpawnPacket = [3];
    for (let i = 0; i < name.length; i++) {
      this.encodedSpawnPacket.push(name.charCodeAt(i));
      this.encodedSpawnPacket.push(0);
    }
    this.encodedSpawnPacket.push(0);
    this.encodedSpawnPacket.push(0);
    return this.bot.send(new Uint8Array(this.encodedSpawnPacket));
  }
  turn(direction) {
    var a = new ArrayBuffer(3),
        b = new DataView(a);
    b.setUint8(0, 5);
    b.setUint8(1, direction, true);
    b.setUint8(2, 0, true);
    this.bot.send(a);
  }
  addTurnPoint(direction, vector) {
    var c = new ArrayBuffer(11),
        g = new DataView(c),
        f = 0;
    g.setUint8(f, 6);
    f += 1;
    g.setUint8(f, direction, true);
    f += 1;
    g.setFloat32(f, vector, true);
    let isFocused = 1
    g.setUint8(f + 4, isFocused, true);
    this.bot.send(c);
  }
  sendBrutalInput(angle, throttle) {
    var a = new ArrayBuffer(10),
        b = new DataView(a);
    b.setUint8(0, 5);
    b.setFloat64(1, angle, !0);
    b.setUint8(9, throttle, !0);
    this.bot.send(a);
  }
  sendBrutalMouseDown() {
    var b = new ArrayBuffer(2),
        c = new DataView(b);
    c.setUint8(0, 8);
    c.setUint8(1, 1)
    this.bot.send(b);
  }
  sendBrutalMouseUp() {
    var b = new ArrayBuffer(2),
        c = new DataView(b);
    c.setUint8(0, 8);
    c.setUint8(1, 0);
    this.bot.send(b);
  }
  sendWingsSpawn(name, isRespawn) {
    var c = new ArrayBuffer(3 + 2 * name.length),
        e = new DataView(c),
        h = 2;
    isRespawn && (h = 8);
    e.setUint8(0, h);
    e.setUint8(1, Math.floor(5 * Math.random()) + 1);
    e.setUint8(2, Math.floor(5 * Math.random()) + 1);
    for (h = 0; h < name.length; ++h) e.setUint16(3 + 2 * h, name.charCodeAt(h), !0);
    this.bot.send(c);
  }
  sendWingsShoot() {
    var a = new ArrayBuffer(2),
        c = new DataView(a);
    c.setUint8(0, 5);
    c.setUint8(1, 1)
    this.bot.send(a);
  }
  die() {
    var a = new ArrayBuffer(1),
      b = new DataView(a);
    b.setUint8(0, 4)
    this.bot.send(a)
  }
  hello() {
    this.bot.ping()
    var a = new ArrayBuffer(5),
        b = new DataView(a);
    //b.setUint8(0, 171) //Debug
    b.setUint8(0, 191); //not debug
    b.setUint16(1, (1920 / 10) * 1, true);
    b.setUint16(3, (1080 / 10) * 1, true);
    this.bot.send(a);
  }
}

module.exports = plSocket;
