export interface AuthUser {
  username: string;
  fullName: string;
  email: string;
  address: string;
  isLoggedIn: boolean;
}

export interface RegisteredUser {
  fullName: string;
  email: string;
  password: string;
  address: string;
}
