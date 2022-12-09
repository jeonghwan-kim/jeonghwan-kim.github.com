const fs = require("fs")
const path = require("path")
const { Sequelize, DataTypes } = require("sequelize")

const basename = path.basename(__filename)
const sequelize = new Sequelize("sqlite::memory:")

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
  })
  .forEach(file => {
    const Model = require(path.join(__dirname, file))
    Model["initialize"](sequelize)
  })

Object.values(sequelize.models)
  .filter(model => typeof model.associate === "function")
  .filter(model => model.associate(sequelize.models))

module.exports = {
  sequelize,
}
