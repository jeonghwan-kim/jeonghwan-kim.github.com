const { WebSocketServer } = require("ws")

const wss = new WebSocketServer({
  port: 4000,
})

wss.on("connection", ws => {
  ws.send("안녕")
  ws.on("message", data => {
    console.log(data.toString("utf-8"))
    ws.send(data)
  })
})
