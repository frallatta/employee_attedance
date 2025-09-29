export interface FormLogin {
  email?: string;
  password?: string;
}

export interface FormErrorLogin {
  email?: string[];
  password?: string[];
  message?: string[];
}
