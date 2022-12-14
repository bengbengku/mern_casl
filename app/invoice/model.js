const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

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
      nama: {
        type: String,
        required: [true, 'Nama tidak boleh kosong.'],
        maxLength: [255, 'Panjang maksimal alamat adalah 255 karakter.'],
      },
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
);

module.exports = mongoose.model('Invoice', invoiceSchema);
