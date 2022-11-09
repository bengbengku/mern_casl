const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nama kategori tidak boleh kosong.'],
    trim: true,
    minlength: [3, 'Panjang nama kategori minimal 3 karakter '],
    maxlength: [20, 'Panjang nama kategori maksimal 20 karakter '],
  },
})

module.exports = mongoose.model('Category', categorySchema)
