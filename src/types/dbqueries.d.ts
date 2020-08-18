import {
  AccountNameInterfaceType,
  AccountIdInterfaceType,
  AccountOptionalInterfaceType,
  AccountInterfaceType,
  CartsInterfaceType,
  CartHolderInterfaceType,
  ProductIdAndAmountInterfaceType,
  ProductInterfaceType,
  CartWithoutIdInterfaceType,
  ProductWithoutIdInterfaceType,
  ProductIdInterfaceType,
  ProductIdAndNameInterfaceType,
  AccountIdProductIdInterfaceType,
  CheckResultHoldThisProduct,
  CartInterfaceType,
  CartHolderAndProductInterfaceType
} from 'param-models';

declare module 'dbqueries' {
  export interface DBQueriesFunctions {
    addAccount: ({ username }: AccountNameInterfaceType) => Promise<AccountIdInterfaceType>;
    findAccount: ({ id, username }: AccountOptionalInterfaceType) => Promise<AccountInterfaceType>;
    getAccountByIdAndCarts: ({ id }: AccountIdInterfaceType) => Promise<CartsInterfaceType>;
    deleteCartsByHolder: ({ holder }: CartHolderInterfaceType) => Promise<void>;
    findProductByIdAndUpdateAmount: ({ id, amount }: ProductIdAndAmountInterfaceType) => Promise<ProductInterfaceType>;
    removeAccountById: ({ id }: AccountIdInterfaceType) => Promise<boolean>;
    findAllCartsByHolder: ({ holder }: CartHolderInterfaceType) => Promise<CartWithoutIdInterfaceType[]>;
    addProduct: ({ name, amount }: ProductWithoutIdInterfaceType) => Promise<ProductIdInterfaceType>;
    findAllProducts: ({ id, name }: ProductIdAndNameInterfaceType) => Promise<ProductInterfaceType[]>;
    checkProductIfHoldByAccountId: ({ accountId, productId }: AccountIdProductIdInterfaceType) => Promise<CheckResultHoldThisProduct>;
    findProductByIdAndUpdateAmountIfGTE: ({ id, amount }: ProductIdAndAmountInterfaceType) => Promise<ProductInterfaceType>;
    holdInCart: ({ holder, product, amount }: CartWithoutIdInterfaceType) => Promise<CartInterfaceType>;
    findCartAndUpdateAmount: ({ holder, product, amount }: CartWithoutIdInterfaceType) => Promise<CartInterfaceType>;
    findProduct: ({ id, name }: ProductIdAndNameInterfaceType) => Promise<ProductIdInterfaceType>;
    findHoldersByProductId: ({ id }: ProductIdInterfaceType) => Promise<AccountInterfaceType[]>;
    findCart: ({ holder, product }: CartHolderAndProductInterfaceType) => Promise<CartInterfaceType>;
    removeCart: ({ holder, product }: CartHolderAndProductInterfaceType) => Promise<boolean>;
  }
}
