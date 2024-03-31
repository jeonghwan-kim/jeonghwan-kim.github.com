const http = require("http")

const server = http.createServer((req, res) => {
  const cookie = req.headers["cookie"]

  console.log(cookie)

  res.setHeader("Set-Cookie", "sid=1;")
  res.end("hello.")
})

server.listen(3000, () => {
  console.log("server is running ::3000")
})
