// Application Error Type
export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode?: number;

    constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode?: number) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message: string = 'Authentication failed', code: string = 'AUTH_ERROR') {
        super(message, code, 401);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

// Validation Error
export class ValidationError extends AppError {
    public readonly fieldErrors?: Record<string, string>;

    constructor(message: string = 'Validation failed', fieldErrors?: Record<string, string>) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
        this.fieldErrors = fieldErrors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
