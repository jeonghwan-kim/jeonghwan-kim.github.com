const http = require("http")
const fs = require("fs")

async function chunk(req, res) {
  // 5번 쪼게서 응답할 것이다.
  const iterateCount = 5
  // 헤더 응답.
  res.writeHead(200, {
    "content-type": "text/plain",
    "content-length": iterateCount * 8,
  })
  // 1초씩 지연하면서 청크 응답.
  for await (const i of Array(iterateCount).keys()) {
    res.write(`chunk ${i}.`)
    await new Promise(res => setTimeout(res, 1000))
    console.log(`chunk ${i}. 전달함`)
  }
  // 응답 종료.
  res.end()
}

function upload(req, res) {
  res.writeHead(200, {
    "content-type": "text/plain",
  })
  res.end("success")
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

  if (pathname === "/chunk") return chunk(req, res)
  if (pathname === "/upload") return upload(req, res)
  return index(req, res)
})

server.listen(3000, () => {
  console.log("server is running ::3000")
})
