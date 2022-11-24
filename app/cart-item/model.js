const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema

const cartItemSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama makanan minimal 3 karakter'],
    required: [true, 'name must be filled'],
  },
  qty: {
    type: Number,
    required: [true, 'qty must be filled'],
    min: [1, 'Minimal qty adalah 1'],
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: String,
  user: {
    type: ObjectId,
    ref: 'User',
  },
  product: {
    type: ObjectId,
    ref: 'Product',
  },
})

module.exports = mongoose.model('CartItem', cartItemSchema)
