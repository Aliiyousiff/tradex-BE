const User = require('../models/User')
const middleware = require('../middleware/index')

const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // Check if user exists
    if (!user) {
      return res
        .status(401)
        .send({ status: 'Error', msg: 'Unauthorized! User not found.' })
    }

    let matched = await middleware.comparePassword(
      user.passwordDigest,
      password
    )

    if (matched) {
      let payload = {
        id: user._id,
        email: user.email
      }
      let token = middleware.createToken(payload)
      return res.send({ user: payload, token, msg: 'helloooo' })
    }

    return res
      .status(401)
      .send({ status: 'Error', msg: 'Unauthorized! Incorrect password.' })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: 'Error',
      msg: 'An error has occurred while logging in!'
    })
  }
}

const Register = async (req, res) => {
  try {
    const { email, password, username } = req.body
    let passwordDigest = await middleware.hashPassword(password)
    let existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(401).send({
        status: 'Error',
        msg: 'A User With that email has already been registered!'
      })
    } else {
      const user = await User.create({ email, passwordDigest, username })
      res.send(user)
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  Login,
  Register
}
