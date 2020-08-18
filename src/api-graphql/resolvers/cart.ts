import { UserInputError, IResolvers } from 'apollo-server-express';
import queries from '../../services/queries';

const CartResolver: IResolvers = {
  Cart: {
    id: parent => {
      return parent.id;
    },
    amount: parent => {
      return parent.amount;
    },
    holder: async parent => {
      return await queries.getAccount({ accountId: parent.holder });
    },
    product: async parent => {
      const result = await queries.listProducts({ productId: parent.product });
      return result.find(product => product.id.toString() === parent.product.toString());
    }
  },
  Mutation: {
    holdProduct: async (rootValue, args) => {
      const { accountId, productId, amount } = args;
      if (!accountId || !productId || !amount) return new UserInputError('Bad parameters');
      return await queries.holdProduct({ accountId, productId, amount });
    },
    updateCartAmount: async (rootValue, args) => {
      const { accountId, productId, amount } = args;
      if (!accountId || !productId || !amount) return new UserInputError('Bad parameters');
      return await queries.updateCartAmount({ accountId, productId, amount });
    },
    moveCart: async (rootValue, args) => {
      const { accountId, productId } = args;
      if (!accountId || !productId) return new UserInputError('Bad parameters');
      return await queries.moveCart({ accountId, productId });
    }
  }
};

export default CartResolver;
