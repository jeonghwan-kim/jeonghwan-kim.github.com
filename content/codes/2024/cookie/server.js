const https = require("https")
const fs = require("fs")

const certOptions = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
}

const server = https.createServer(certOptions, (req, res) => {
  const cookie = req.headers["cookie"]
  console.log(cookie)
  if (cookie && cookie.includes("sid")) {
    res.end("again.")
    return
  }

  res.setHeader("Set-Cookie", "sid=1; Secure; httpOnly")
  res.end("first.")
})

server.listen(3000, () => {
  console.log("server is running ::3000")
})
