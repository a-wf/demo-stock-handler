declare module 'param-models' {
  export interface AccountInterfaceType {
    id: string | number;
    username: string;
  }

  export interface AccountNameInterfaceType {
    username: string;
  }

  export interface AccountIdInterfaceType {
    id: string | number;
  }

  export interface AccountOptionalInterfaceType {
    id?: string | number;
    username?: string;
  }

  export interface ProductInterfaceType {
    id: string | number;
    name: string;
    amount: number;
  }

  export interface ProductOptionalInterfaceType {
    id?: string | number;
    name?: string;
    amount?: number;
  }

  export interface ProductIdInterfaceType {
    id: string | number;
  }

  export interface ProductNameInterfaceType {
    name: string;
  }

  export interface ProductAmountInterfaceType {
    amount: number;
  }

  export interface CartInterfaceType {
    id: string | number;
    holder: string | number;
    product: string | number;
    amount: number;
  }

  export interface CartOptionalInterfaceType {
    id?: string | number;
    holder?: string | number;
    product?: string | number;
    amount?: number;
  }

  export interface CartIdInterfaceType {
    id: string | number;
  }

  export interface CartHolderInterfaceType {
    holder: string | number;
  }

  export interface CartProductInterfaceType {
    product: string | number;
  }

  export interface CartAmountInterfaceType {
    amount: number;
  }
}
