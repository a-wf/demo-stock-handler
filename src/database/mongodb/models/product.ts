import { Document, Model, model, Schema } from 'mongoose';
import { CartSchemaDoc } from './cart';

const schema = new Schema({
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

export interface ProductSchemaDoc extends Document {
  name: string;
  amount: number;
  _accountCart?: CartSchemaDoc[];
}
interface ProductSchemaModel extends Model<ProductSchemaDoc> {}

export default model<ProductSchemaDoc, ProductSchemaModel>('products', schema);
