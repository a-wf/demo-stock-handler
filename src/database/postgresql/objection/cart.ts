import { Model } from 'objection';
import Account from './account';
import Product from './product';

class Cart extends Model {
  id: number;
  holder: number;
  product: number;
  amount: number;

  static get tableName() {
    return 'carts';
  }

  static get relationMappings() {
    return {
      accountId: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'carts.holder',
          to: 'accounts.id'
        }
      },
      productId: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'carts.product',
          to: 'products.id'
        }
      }
    };
  }
}

export default Cart;
