// The base interface for user types
export interface User {
    username: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    isPremiumUser: boolean;
    isActive: boolean;
}

// The interface for creating a new user (password is required)
export interface NewUser extends User {
    password: string; // Ensure password is required for new users
}

// The interface for test users (password is optional as it will be hashed)
export interface TestUser extends Partial<Omit<User, 'isAdmin' | 'isPremiumUser' | 'isActive'>> {
    username: string; // Ensure username is required
    email: string;    // Ensure email is required
    hashedpassword?: string;
    is_admin?: boolean;
    is_premium_user?: boolean;
    is_active?: boolean;
}
