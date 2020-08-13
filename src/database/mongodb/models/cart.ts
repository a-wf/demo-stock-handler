import mongoose from 'mongoose';
const Schema: typeof mongoose.Schema = mongoose.Schema;

const schema: mongoose.Schema<any> = new Schema({
  holder: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});
schema.index({ holder: 1, product: 1 }, { unique: true });

schema.virtual('_account', {
  ref: 'accounts',
  localField: 'holder',
  foreignField: '_id'
});

schema.virtual('_product', {
  ref: 'products',
  localField: 'product',
  foreignField: '_id'
});

const Cart: mongoose.Model<mongoose.Document, {}> = mongoose.model('carts', schema);

export default Cart;
