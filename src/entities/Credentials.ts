// Login Credentials Type
export interface Credentials {
    username: string;
    password: string;
}

// Registration Credentials Type (TODO: Backend not implemented)
export interface RegisterCredentials extends Credentials {
    confirmPassword?: string;
    name?: string;
}
