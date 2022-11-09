const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'field nama makanan tidak boleh kosong.'],
      trim: true,
      minlength: [3, 'Panjang nama makanan minimal 3 karakter '],
    },
    description: {
      type: String,
      maxlength: [1000, 'Panjang description maksimal 1000 karakter'],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    tag: {
      type: ObjectId,
      ref: 'Tag',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Product', productSchema)
