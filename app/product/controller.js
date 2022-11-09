const path = require('path')
const fs = require('fs')
const config = require('../config')
const Product = require('./model')
const Category = require('../category/model')
const Tag = require('../tag/model')

const store = async (req, res, next) => {
  try {
    let payload = req.body

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' },
      })
      if (category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category
      }
    }

    if (payload.tag && payload.length > 0) {
      let tag = await Tag.find({
        name: { $in: payload.tag },
      })
      if (tag.length) {
        payload = { ...payload, tag: tag.map((t) => t._id) }
      } else {
        delete payload.tag
      }
    }

    if (req.file) {
      let tmp_path = req.file.path
      let originalExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ]
      let filename = req.file.filename + '.' + originalExt
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      )

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)
      src.pipe(dest)

      src.on('end', async () => {
        try {
          let product = new Product({ ...payload, image_url: filename })
          await product.save()
          return res.json(product)
        } catch (err) {
          fs.unlinkSync(target_path)
          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            })
          }
          next(err)
        }
      })
      src.on('error', async () => {
        next(err)
      })
    } else {
      let product = new Product(payload)
      await product.save()
      return res.json(product)
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      })
    }
    next(err)
  }
}

const index = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0, q = '', category = '', tag = [] } = req.query

    let criteria = {}

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' },
      }
    }

    if (category.length) {
      let categoryRes = await Category.findOne({
        name: { $regex: `${category}`, $options: 'i' },
      })
      if (categoryRes) {
        criteria = { ...criteria, category: categoryRes._id }
      }
    }

    if (tag.length) {
      let tagRes = await Tag.find({ name: { $in: tag } })
      if (tagRes.length > 0) {
        criteria = { ...criteria, tag: { $in: tagRes.map((t) => t._id) } }
      }
    }

    let count = await Product.find().countDocuments()

    const result = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tag')
    res.json({
      data: result,
      count,
    })
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    let payload = req.body
    let { id } = req.params

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' },
      })
      if (category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category
      }
    }

    if (payload.tag && payload.tag.length > 0) {
      let tag = await Tag.find({
        name: { $in: payload.tag },
      })
      if (tag.length) {
        payload = { ...payload, tag: tag.map((t) => t._id) }
      } else {
        delete payload.tag
      }
    }

    if (req.file) {
      let tmp_path = req.file.path
      let originalExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ]
      let filename = req.file.filename + '.' + originalExt
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      )

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)
      src.pipe(dest)

      src.on('end', async () => {
        try {
          let product = await Product.findById(id)
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }
          product = await Product.findByIdAndUpdate(
            id,
            { ...payload, image_url: filename },
            {
              new: true,
              runValidators: true,
            }
          )
          return res.json(product)
        } catch (err) {
          fs.unlinkSync(target_path)
          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            })
          }
          next(err)
        }
      })
      src.on('error', async () => {
        next(err)
      })
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      })
      return res.json(product)
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      })
    }
    next(err)
  }
}

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id)
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage)
    }
    return res.json({
      message: `Product ${product.name} berhasil dihapus.`,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { store, index, update, destroy }
