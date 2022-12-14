const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const orderItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Panjang nama makanan minimal 3 karakter.'],
      required: [true, 'Name must be filled.'],
    },
    price: {
      type: Number,
      required: [true, 'Harga item tidak boleh kosong.'],
    },
    qty: {
      type: Number,
      required: [true, 'Kuantitas tidak boleh kosong.'],
      min: [1, 'Kuantitas minimal 1'],
    },
    product: {
      type: ObjectId,
      ref: 'Product',
    },
    order: {
      type: ObjectId,
      ref: 'Order',
    },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
