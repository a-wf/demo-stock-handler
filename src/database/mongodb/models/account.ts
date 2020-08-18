import { Document, Model, model, Schema } from 'mongoose';
import { CartSchemaDoc } from './cart';

const schema = new Schema({
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

export interface AccountSchemaDoc extends Document {
  username: string;
  _accountCart?: CartSchemaDoc[];
}
interface AccountSchemaModel extends Model<AccountSchemaDoc> {}

export default model<AccountSchemaDoc, AccountSchemaModel>('accounts', schema);
