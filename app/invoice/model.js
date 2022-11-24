const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const invoiceSchema = mongoose.Schema(
  {
    sub_total: {
      type: Number,
      required: [true, 'sub_total tidak boleh kosong.'],
    },
    delivery_fee: {
      type: Number,
      required: [true, 'delivery_fee tidak boleh kosong.'],
    },
    delivery_address: {
      provinsi: {
        type: String,
        required: [true, 'Nama provinsi tidak boleh kosong.'],
      },
      kabupaten: {
        type: String,
        required: [true, 'Nama kabupaten tidak boleh kosong.'],
      },
      kecamatan: {
        type: String,
        required: [true, 'Nama kecamatan tidak boleh kosong.'],
      },
      kelurahan: {
        type: String,
        required: [true, 'Nama kelurahan tidak boleh kosong.'],
      },
      detail: { type: String },
    },
    total: {
      type: Number,
      required: [true, 'Total tidak boleh kosong.'],
    },
    payment_status: {
      type: String,
      enum: ['waiting_payment', 'paid'],
      default: 'waiting_payment',
    },
    user: { type: ObjectId, ref: 'User' },
    order: { type: ObjectId, ref: 'Order' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Invoice', invoiceSchema)
