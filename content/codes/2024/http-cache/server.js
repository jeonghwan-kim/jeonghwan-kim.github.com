const http = require("http")
const fs = require("fs")

function index(req, res) {
  const filePath = "./index.html"

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(500)
      res.end("Error")
      return
    }

    // 파일 수정시간
    const modified = stat.mtime
    const etag = `${stat.mtime.getTime().toString(16)}-${stat.size.toString(
      16
    )}`

    // 내용 기반 캐시
    if (req.headers["if-none-match"]) {
      const noneMatch = req.headers["if-none-match"]
      const isFresh = noneMatch === etag

      if (isFresh) {
        res.writeHead(304)
        res.end()
        return
      }
    }

    // 시간 기반 캐시
    if (req.headers["if-modified-since"]) {
      const modifiedSince = new Date(req.headers["if-modified-since"])
      const isFresh = !(
        Math.floor(modifiedSince.getTime() / 1000) <
        Math.floor(modified.getTime() / 1000)
      )

      if (isFresh) {
        res.writeHead(304)
        res.end()
        return
      }
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500)
        res.end("Error")
        return
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
        "Last-Modified": modified.toUTCString(),
        ETag: etag,
        "Cache-Control": "max-age=10",
        // Expires: new Date(2024, 12, 1).toUTCString(),
      })
      res.end(content)
    })
  })
}

const server = http.createServer((req, res) => {
  console.log(req.url)

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  if (pathname === "/") return index(req, res)
})

server.listen(3000, () => {
  console.log("server is running on ::3000")
})
