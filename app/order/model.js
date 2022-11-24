const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const { ObjectId } = mongoose.Schema
const Invoice = require('../invoice/model')

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
      default: 'waiting_payment',
    },
    delivery_fee: {
      type: Number,
      default: 0,
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
    user: {
      type: ObjectId,
      ref: 'User',
    },
    order_items: [{ type: ObjectId, ref: 'OrderItem' }],
  },
  { timestamps: true }
)

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' })
orderSchema.virtual('items_count').get(function () {
  return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0)
})

orderSchema.post('save', async () => {
  let sub_total = this.order_items.reduce(
    (total, item) => (total += item.price * item.qty),
    0
  )
  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  })
  await invoice.save()
})

module.exports = mongoose.model('Order', orderSchema)
