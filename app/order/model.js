const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { ObjectId } = mongoose.Schema;

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
      kota: {
        type: String,
        required: [true, 'Nama kabupaten/kota tidak boleh kosong.'],
        maxLength: [255, 'Panjang maksimal kabupaten adalah 255 karakter.'],
      },
      code_kota: {
        type: String,
        required: [true, 'Kode Kota tidak boleh kosong.'],
      },
      provinsi: {
        type: String,
        required: [true, 'Nama provinsi tidak boleh kosong.'],
        maxLength: [255, 'Panjang maksimal provinsi adalah 255 karakter.'],
      },
      detail: {
        type: String,
        required: [true, 'Detail tidak boleh kosong.'],
        maxLength: [1000, 'Panjang maksimal detail alamat adalah 1000 karakter.'],
      },
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
    total: {
      type: Number,
      required: [true, 'Total tidak boleh kosong.'],
    },
    order_items: [{ type: ObjectId, ref: 'OrderItem' }],
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });
orderSchema.virtual('items_count').get(function () {
  return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0);
});

module.exports = mongoose.model('Order', orderSchema);
