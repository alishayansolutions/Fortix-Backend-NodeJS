export const MESSAGES = {
  SUCCESS: {
    // Admin related
    ADMIN_LOGIN: 'Admin logged in successfully',
    ADMIN_2FA_CODE_SENT: '2FA code sent to your email',
    ADMIN_2FA_VERIFIED: '2FA verification successful',
    ADMIN_2FA_ENABLED: '2FA has been enabled successfully',
    ADMIN_2FA_DISABLED: '2FA has been disabled successfully',

    // User related
    USER_LOGIN: 'User logged in successfully',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    USERS_FETCHED: 'Users fetched successfully',
    USER_FETCHED: 'User fetched successfully'
  },
  ERROR: {
    // Authentication errors
    INVALID_CREDENTIALS: 'Invalid username or password',
    USERNAME_NOT_FOUND: 'Username does not exist',
    EMAIL_NOT_FOUND: 'Email does not exist',
    INVALID_PASSWORD: 'Invalid password',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid or expired token',
    INVALID_2FA_CODE: 'Invalid 2FA code',

    // User related errors
    USER_NOT_FOUND: 'User not found',
    USERNAME_EXISTS: 'Username already exists',
    EMAIL_EXISTS: 'Email already registered',
    NO_UPDATES: 'No updates provided',
    EMAIL_IN_USE: 'Email already in use',
    USERNAME_IN_USE: 'Username already in use',

    // Admin related errors
    ADMIN_NOT_FOUND: 'Admin not found',

    // Generic errors
    SERVER_ERROR: 'Something went wrong',
    VALIDATION_ERROR: 'Validation error',
    RESOURCE_EXISTS: 'Resource already exists'
  }
} as const; 