import mongoose from 'mongoose';
const Schema: typeof mongoose.Schema = mongoose.Schema;

const schema: mongoose.Schema<any> = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

schema.index({ name: 1 }, { unique: true });

schema.virtual('_accountCart', {
  ref: 'carts',
  localField: '_id',
  foreignField: 'product'
});

const Products: mongoose.Model<mongoose.Document, {}> = mongoose.model('products', schema);

export default Products;
