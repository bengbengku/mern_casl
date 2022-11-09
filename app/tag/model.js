const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nama tag tidak boleh kosong.'],
    trim: true,
    minlength: [3, 'Panjang nama tag minimal 3 karakter '],
    maxlength: [20, 'Panjang nama tag maksimal 20 karakter '],
  },
})

module.exports = mongoose.model('Tag', tagSchema)
