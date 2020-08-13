import { Model } from 'objection';
import Cart from './cart';

class Product extends Model {
  static get tableName() {
    return 'products';
  }

  static get relationMappings() {
    return {
      carts: {
        relation: Model.HasManyRelation,
        modelClass: Cart,
        join: {
          from: 'product.id',
          to: 'carts.product'
        }
      }
    };
  }
}

export default Product;
