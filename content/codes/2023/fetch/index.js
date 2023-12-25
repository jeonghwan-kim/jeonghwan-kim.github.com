const http = require("http")
const fs = require("fs")
const path = require("path")

function get(req, res) {
  res.writeHead(200)
  res.end("get")
}

function post(req, res) {
  let body = ""
  req.on("data", chunk => {
    body += chunk
  })
  req.on("end", () => {
    res.writeHead(200, {
      "content-type": req.headers["content-type"],
    })
    res.end(body)
  })
}

async function chunk(req, res) {
  // 헤더 응답.
  res.writeHead(200, {
    "content-type": "text/plain",
  })

  // 1초씩 지연하면서 청크 응답.
  for await (const i of Array(5).keys()) {
    res.write(`chunk ${i}\n`)
    await new Promise(res => setTimeout(res, 1000))
  }

  // 응답 종료.
  res.end()
}

function fail(req, res) {
  res.writeHead(400)
  res.end("Bad Request")
}

function json(req, res) {
  res.writeHead(200, {
    "content-type": "application/json",
  })
  res.end(JSON.stringify({ foo: "bar" }))
}

function image(req, res) {
  fs.readFile("./firefox-logo.svg", (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end("Fail to read a file")
      return
    }

    res.writeHead(200, {
      "content-type": "image/svg+xml",
    })
    console.log("conent", content)
    res.end(content)
  })
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

const server = http.createServer((req, res) => {
  console.log(req.url)

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  res.setHeader("access-control-allow-origin", "*")

  if (pathname === "/get") return get(req, res)
  if (pathname === "/post") return post(req, res)
  if (pathname === "/chunk") return chunk(req, res)
  if (pathname === "/fail") return fail(req, res)
  if (pathname === "/json") return json(req, res)
  if (pathname === "/image") return image(req, res)
  return index(req, res)
})

server.listen(3000, () => {
  console.log("server is running ::3000")
})
