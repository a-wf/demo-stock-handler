import { Document, Model, model, Schema } from 'mongoose';
import { AccountSchemaDoc } from './account';
import { ProductSchemaDoc } from './product';

const schema = new Schema({
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

export interface CartSchemaDoc extends Document {
  holder: AccountSchemaDoc['_id'];
  product: ProductSchemaDoc['_id'];
  amount: number;
  _account?: AccountSchemaDoc[];
  _product?: ProductSchemaDoc[];
}
interface CartSchemaModel extends Model<CartSchemaDoc> {}

export default model<CartSchemaDoc, CartSchemaModel>('carts', schema);
