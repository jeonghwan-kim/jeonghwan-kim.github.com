const http = require("http")
const fs = require("fs")

function hello(req, res) {
  res.writeHead(200, {
    "content-type": "text/plain",
  })
  res.end("Hello world")
}

function fail(req, res) {
  res.writeHead(400, {
    "content-type": "text/plain",
  })
  res.end("Fail")
}

function index(req, res) {
  fs.readFile("./index.html", (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end("Error")
      return
    }

    res.writeHead(200, {
      "content-type": "text/html",
    })
    res.end(content)
  })
}
function js(req, res) {
  fs.readFile("./main.js", (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end("Error")
      return
    }

    res.writeHead(200, {
      "content-type": "application/javascript",
    })
    res.end(content)
  })
}

function notFound(req, res) {
  res.writeHead(404)
  res.end("페이지를 찾을 수 없습니다.")
}

const server = http.createServer((req, res) => {
  console.log(req.url)

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  if (pathname === "/hello") return hello(req, res)
  if (pathname === "/fail") return fail(req, res)
  if (pathname === "/main.js") return js(req, res)
  if (pathname === "/") return index(req, res)
  return notFound(req, res)
})

server.listen(3000, () => {
  console.log("server is running ::3000")
})
