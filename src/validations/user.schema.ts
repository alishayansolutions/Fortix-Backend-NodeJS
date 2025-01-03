import * as yup from 'yup';

export const userValidation = {
  login: yup.object({
    body: yup.object({
      email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
    }).required('Request body is required')
  }),

  createUser: yup.object({
    body: yup.object({
      username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
      email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    }).required('Request body is required')
  }),

  updateUser: yup.object({
    params: yup.object({
      id: yup
        .number()
        .required('User ID is required')
        .positive('User ID must be positive')
    }),
    body: yup.object({
      username: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .optional(),
      email: yup
        .string()
        .email('Invalid email format')
        .optional(),
      password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .optional(),
      is_active: yup
        .boolean()
        .optional()
    }).required('Request body is required')
  }),

  getUserById: yup.object({
    params: yup.object({
      id: yup
        .number()
        .required('User ID is required')
        .positive('User ID must be positive')
    })
  }),

  deleteUser: yup.object({
    params: yup.object({
      id: yup
        .number()
        .required('User ID is required')
        .positive('User ID must be positive')
    })
  })
}; 