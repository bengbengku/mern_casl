const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const store = async (req, res, next) => {
  try {
    let payload = req.body;

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tag && payload.tag.length > 0) {
      let tag = await Tag.find({
        name: { $in: payload.tag },
      });
      if (tag.length) {
        payload = { ...payload, tag: tag.map((t) => t._id) };
      } else {
        delete payload.tag;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on('error', async () => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const { q = '', category = '', tag = [] } = req.query;

    let criteria = {};
    let tagSplit = tag.toString().split(',');

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' },
      };
    }

    if (tag.length) {
      let tagRes = await Tag.find({ name: { $in: tagSplit } });
      if (tagRes.length > 0) {
        criteria = { ...criteria, tag: { $in: tagRes.map((t) => t._id) } };
      }
    }

    if (category.length) {
      let categoryRes = await Category.findOne({
        name: { $regex: `${category}`, $options: 'i' },
      });
      if (categoryRes) {
        criteria = { ...criteria, category: categoryRes._id };
      }
    }

    let query = Product.find(criteria);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * pageSize;
    const total = await Product.countDocuments(criteria);

    const pages = Math.ceil(total / pageSize);

    query = query.skip(skip).limit(pageSize);

    if (page > pages) {
      return res.status(404).json({
        status: 'fail',
        message: 'No page found.',
      });
    }

    const results = await query.populate('category').populate('tag');

    res.status(200).json({
      status: 'success',
      data: results,
      count: results.length,
      page,
      pages,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tag && payload.tag.length > 0) {
      let tag = await Tag.find({
        name: { $in: payload.tag },
      });
      if (tag.length) {
        payload = { ...payload, tag: tag.map((t) => t._id) };
      } else {
        delete payload.tag;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          product = await Product.findByIdAndUpdate(
            id,
            { ...payload, image_url: filename },
            {
              new: true,
              runValidators: true,
            }
          );
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on('error', async () => {
        next(err);
      });
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json({
      message: `Product ${product.name} berhasil dihapus.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { store, index, update, destroy };
