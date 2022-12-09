const { Model, DataTypes } = require("sequelize")

module.exports = class Group extends Model {
  static initialize(sequelize) {
    this.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    )
  }
}
