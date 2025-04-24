export interface IRegister {
  username: string;
  enabled: boolean;
  email: string;
  credentials: {
    type: string;
    value: string;
    temporary: boolean;
  }[];
}
