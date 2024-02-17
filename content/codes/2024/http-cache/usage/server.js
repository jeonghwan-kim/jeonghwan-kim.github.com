const http = require("http")
const fs = require("fs")
const path = require("path")

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`)
  let filename = pathname.replace(/^\//, "") || "index.html"

  // 요청한 파일
  const filePath = path.resolve(__dirname, "dist", filename)

  // 파일 정보
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(500)
      res.end("Error")
      return
    }

    const modified = stat.mtime
    const etag = `${stat.mtime.getTime().toString(16)}-${stat.size.toString(
      16
    )}`

    // 내용 기반 캐싱
    if (req.headers["if-none-match"]) {
      const noneMatch = req.headers["if-none-match"]

      const isFresh = noneMatch === etag

      if (isFresh) {
        res.writeHead(304)
        res.end()
        return
      }
    }

    // 시간 기반 캐싱
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

    // 수정일이 오랜된 경우
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500)
        res.end("Error")
        return
      }

      if (filePath.endsWith(".html")) {
        res.setHeaders("Cache-Control", "no-cache")
      } else {
        res.setHeaders("Cache-Control", "max-age=31536000")
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
        "Last-Modified": modified.toUTCString(),
        ETag: etag,
      })

      res.end(content)
    })
  })
})

server.listen(3000, () => {
  console.log("server is running on ::3000")
})
