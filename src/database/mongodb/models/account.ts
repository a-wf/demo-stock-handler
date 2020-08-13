import mongoose from 'mongoose';
const Schema: typeof mongoose.Schema = mongoose.Schema;

const schema: mongoose.Schema<any> = new Schema({
  username: {
    type: String,
    required: true
  }
});

schema.index({ username: 1 }, { unique: true });

schema.virtual('_accountCart', {
  ref: 'carts',
  localField: '_id',
  foreignField: 'holder'
});

const Accounts = mongoose.model('accounts', schema);

export default Accounts;
