const jwt = require('jsonwebtoken')
const { getToken, policyFor } = require('../utils')
const config = require('../app/config')
const User = require('../app/user/model')

const decoteToken = () => {
  return async (req, res, next) => {
    try {
      let token = getToken(req)
      if (!token) return next()
      req.user = jwt.verify(token, config.secretKey)

      let user = await User.findOne({ token: { $in: [token] } })
      if (!user) {
        res.json({ error: 1, message: 'Token expired.' })
      }
    } catch (err) {
      if (err && err.name === 'JsonWebTokenError') {
        return res.json({
          error: 1,
          message: err.message,
        })
      }
      next(err)
    }

    return next()
  }
}

const policy_check = (action, subject) => {
  return (req, res, next) => {
    let policy = policyFor(req.user)
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You're not allowed to ${action} ${subject}`,
      })
    }
    next()
  }
}

module.exports = { decoteToken, policy_check }
