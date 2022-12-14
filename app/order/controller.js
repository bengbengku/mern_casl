const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../delivery/model');
const Order = require('./model');
const { Types } = require('mongoose');
const OrderItem = require('../order-item/model');
const Invoice = require('../invoice/model');

const store = async (req, res, next) => {
  try {
    let { delivery_fee, delivery_address, subtotal, total } = req.body;

    let items = await CartItem.find({ user: req.user._id }).populate('product');
    if (!items) {
      return res.json({
        error: 1,
        message: "You're not create order because you have not items in cart.",
      });
    }
    let address = await DeliveryAddress.findById(Types.ObjectId(delivery_address));
    let order = new Order({
      _id: new Types.ObjectId(),
      status: 'waiting_payment',
      delivery_fee: delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kota: address.kota,
        code_kota: address.code_kota,
        detail: address.detail,
      },
      total,
      user: req.user._id,
    });
    let orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
        image_url: item.product.image_url,
      }))
    );
    orderItems.forEach((item) => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });

    let invoices = new Invoice({
      user: req.user._id,
      order: order._id,
      sub_total: subtotal,
      delivery_fee: delivery_fee,
      total,
      delivery_address: {
        nama: address.nama,
        provinsi: address.provinsi,
        kota: address.kota,
        code_kota: address.code_kota,
        detail: address.detail,
      },
    });
    invoices.save();
    return res.json(order);
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

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;

    let count = await Order.find({ user: req.user._id }).countDocuments();
    let orders = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('order_items')
      .sort('-createdAt');

    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
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

module.exports = { store, index };
