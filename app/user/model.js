const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'nama user tidak boleh kosong.'],
      trim: true,
      minlength: [3, 'Panjang nama user minimal 3 karakter '],
      maxlength: [255, 'Panjang nama user maksimal 255 karakter '],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, 'Email tidak boleh kosong.'],
      maxlength: [255, 'Panjang email maksimal 255 karakter '],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password tidak boleh kosong'],
      maxlength: [255, 'Panjang password maksimal 255 karakter '],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    token: [String],
  },
  { timestamps: true }
)

userSchema.path('email').validate(
  (value) => {
    const EMAIL_RE =
      /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/
    return EMAIL_RE.test(value)
  },
  (attr) => `${attr.value} harus merupakan email yang valid.`
)

userSchema.path('email').validate(
  async (value) => {
    try {
      const count = await mongoose.model('User').count({ email: value })
      return !count
    } catch (error) {
      throw error
    }
  },
  (attr) => `${attr.value} sudah terdaftar.`
)

const HASH_ROUND = 10

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hashSync(this.password, HASH_ROUND)
  next()
})

userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' })

module.exports = mongoose.model('User', userSchema)
