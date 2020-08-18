declare module 'token-auth' {
  export interface Credential {
    username: string;
    password: string;
  }

  export interface CredentialWithToken {
    username: string;
    password: string;
    token: string;
  }
}
