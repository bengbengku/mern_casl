const Product = require('../product/model');
const CartItem = require('../cart-item/model');

const update = async (req, res, next) => {
  try {
    const { cart } = req.body;
    console.log(cart);
    const productIds = cart.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });
    let cartItems = cart.map((item) => {
      let relatedProduct = products.find((product) => product._id.toString() === item._id);
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });
    await CartItem.bulkWrite(
      cartItems.map((cartItem) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: cartItem.product,
            },
            update: cartItem,
            upsert: true,
          },
        };
      })
    );

    return res.json(cartItems);
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
    let items = await CartItem.find({ user: req.user._id }).populate('product');

    return res.json(items);
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

module.exports = { update, index };
