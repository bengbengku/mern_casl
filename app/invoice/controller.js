const Invoice = require('./model');
const mongoose = require('mongoose');

const show = async (req, res, next) => {
  try {
    let orderId = req.params.order_id;

    let invoice = await Invoice.findOne({ order: orderId })
      .populate('order', 'order_items order_number')
      .populate('user', 'full_name email ');

    return res.json(invoice);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { show };
