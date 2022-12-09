const webpack = require("webpack")
const path = require("path")
const middleware = require("webpack-dev-middleware")
const compiler = webpack(require("../webpack.config"))
const express = require("express")
const device = require("express-device")
const app = express()

process.env.NODE_ENV = process.env.NODE_ENV || "development"

if (process.env.NODE_ENV === "development") {
  // 웹팩 설정
  app.use(
    "/dist",
    middleware(compiler, {
      // webpack-dev-middleware options
    })
  )
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../public")))
}

app.use(device.capture())

app.get("/api/greeting", (req, res) => {
  setTimeout(() => {
    res.json({ data: "Hello world!" })
  }, 200)
})

app.get("*", (req, res) => {
  if (req.device.type === "desktop") {
    res.sendFile(path.resolve(__dirname, `../public/desktop.html`))
    return
  }

  // 모바일 버전
  res.sendFile(path.resolve(__dirname, "../public/mobile.html"))
})

module.exports = app
