#!/usr/bin/env node
const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")
const fs = require("fs")
const path = require("path")

function getToday() {
  function padding(digit) {
    if ((digit < 1) | (digit > 31)) throw new Error("알수 없는 날짜(월, 일)")
    return digit < 10 ? `0${digit}` : digit
  }

  const year = new Date().getFullYear().toString()
  const month = padding(new Date().getMonth() + 1)
  const date = padding(new Date().getDate())

  return `${year}-${month}-${date}`
}

function create(argv) {
  const [year, month, date] = argv.date.split("-")
  const templatePath = path.resolve(__dirname, "./post.tpl")
  const template = fs.readFileSync(templatePath, { encoding: "utf-8" })
  const result = template
    .replaceAll("{year}", year)
    .replaceAll("{month}", month)
    .replaceAll("{date}", date)
    .replaceAll("{name}", argv.name)

  const targetFile = `${argv.date}-${argv.name}.md`
  const targetPath = path.join(
    __dirname,
    `..`,
    `/content/blog`,
    year,
    month,
    date
  )
  const target = path.resolve(targetPath, targetFile)

  try {
    fs.mkdirSync(targetPath, { recursive: true })
    fs.writeFileSync(target, result)
  } catch (e) {
    console.error("Faile to write", target)
    console.error(e)
  }
  console.log("Created", target.replace(path.join(__dirname, ".."), ""))
}

yargs(hideBin(process.argv))
  .usage("Usage $0 name --date [string]")
  .demandCommand(2)
  .demandOption(["name"])
  .command(
    "create [name]",
    "새로운 글을 작성합니다.",
    yargs => {
      return yargs
        .positional("name", {
          describe: "글 제목(주소에 포함될 문자)",
        })
        .positional("date", {
          describe: "작성 일",
          default: getToday(),
        })
    },
    create
  )
  .parse()
