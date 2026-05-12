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