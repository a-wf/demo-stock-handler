import { Model } from 'objection';
import Cart from './cart';

class Account extends Model {
  id: number;
  username: string;

  static get tableName() {
    return 'accounts';
  }

  static get relationMappings() {
    return {
      carts: {
        relation: Model.HasManyRelation,
        modelClass: Cart,
        join: {
          from: 'accounts.id',
          to: 'carts.holder'
        }
      }
    };
  }
}

export default Account;
