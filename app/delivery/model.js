const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const deliveryAddressSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama alamat tidak boleh kosong.'],
      maxLength: [255, 'Panjang maksimal alamat adalah 255 karakter.'],
    },
    kabupaten: {
      type: String,
      required: [true, 'Nama kabupaten/kota tidak boleh kosong.'],
      maxLength: [255, 'Panjang maksimal kabupaten adalah 255 karakter.'],
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
    user: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryAddress', deliveryAddressSchema);
