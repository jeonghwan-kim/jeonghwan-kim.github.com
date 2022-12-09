const { sequelize } = require("./models")
const Group = require("./models/group")
const User = require("./models/user")

sequelize
  .sync()
  .then(async () => {
    const group = new Group({ name: "group1" })
    await group.save()

    console.log(group.toJSON())

    const user = new User({ firstname: "user1", lastname: "kim" })
    user.GroupId = group.id
    await user.save()

    console.log(user.toJSON())

    console.log(user.fullname)

    const users = await User.findByGroup(1)

    console.log(users.length)
  })
  .catch(err => {
    console.error(err)
  })
