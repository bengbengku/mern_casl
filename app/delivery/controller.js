const { subject } = require('@casl/ability')
const { policyFor } = require('../../utils')
const DeliveryAddress = require('./model')

const store = async (req, res, next) => {
  try {
    let payload = req.body
    let user = req.user
    let address = new DeliveryAddress({ ...payload, user: user._id })
    await address.save()
    return res.json(address)
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      })
    }
    next(err)
  }
}

const update = async (req, res, next) => {
  let policy = policyFor(req.user)
  try {
    let { _id, ...payload } = req.body
    let { id } = req.params
    let address = new DeliveryAddress.findById(id)
    let subjectAddress = subject('DeliveryAddress', {
      ...address,
      user_id: address.user,
    })
    if (!policy.can('update', subjectAddress)) {
      return res.json({
        error: 1,
        message: "You're not allowed to modify this resource",
      })
    }
    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
    })
    res.json(address)
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      })
    }
    next(err)
  }
}

module.exports = { store, update }
