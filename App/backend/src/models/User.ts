export interface User {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isPremiumUser: boolean;
  isActive: boolean;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isPremiumUser: boolean;
  isActive: boolean;
}

export interface TestUser {
  username: string;
  hashedpassword?: string;
  password?: string;
  email: string;
  is_admin?: boolean;
  is_premium_user?: boolean;
  is_active?: boolean;
}
