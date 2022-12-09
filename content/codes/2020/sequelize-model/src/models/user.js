const { Model, DataTypes } = require("sequelize")

module.exports = class User extends Model {
  static initialize(sequelize) {
    this.init(
      {
        firstname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.Group)
  }

  static findByGroup(GroupId) {
    return this.findAll({ where: { GroupId } })
  }

  get fullname() {
    return this.firstname + " " + this.lastname
  }
}
