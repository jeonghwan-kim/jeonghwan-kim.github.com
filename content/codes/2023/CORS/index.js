const http = require("http")
const fs = require("fs")

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  let filePath = "./static/index.html"
  let contentType = "text/html"

  console.log("debug", req.method, req.url)

  if (req.url === "/resource.json") {
    filePath = "./static/resource.json"
    contentType = "application/json"
  }

  if (req.url === "/myfont.otf") {
    filePath = "./static/myfont.otf"
    contentType = "font/otf"
  }

  if (req.url === "/popup.html") {
    filePath = "./static/popup.html"
    contentType = "text/html"
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end("Error")
      return
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "PUT",
      "Access-Control-Allow-Headers": "X-Foo,X-Bar",
      "Access-Control-Max-Age": "5",
    })
    res.end(content)
  })
})

server.listen(port, () => console.log(`server is running localhost:${port}`))
