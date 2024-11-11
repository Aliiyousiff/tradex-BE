const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const APP_SECRET = process.env.APP_SECRET

// Hash the password
const hashPassword = async (password) => {
  let hash = await bcrypt.hash(password, SALT_ROUNDS)
  return hash
}

// Compare the password
const comparePassword = async (storedPassword, password) => {
  let match = await bcrypt.compare(password, storedPassword)
  return match
}

// Create JWT Token
const createToken = (payload) => {
  let token = jwt.sign(payload, APP_SECRET, { expiresIn: '1d' }) // Expire token in 1 day
  return token
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const { token } = res.locals
  try {
    let payload = jwt.verify(token, APP_SECRET)
    if (payload) {
      res.locals.payload = payload
      req.user = payload // Attach the user to the request
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'Invalid Token' })
  }
}

// Strip token from Authorization header
const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]
    // console.log('token ::' + token)
    if (token) {
      res.locals.token = token
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'Token Missing or Invalid' })
  }
}

module.exports = {
  stripToken,
  verifyToken,
  createToken,
  comparePassword,
  hashPassword
}
