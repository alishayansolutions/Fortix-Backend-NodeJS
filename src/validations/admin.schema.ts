import * as yup from 'yup';

export const adminValidation = {
  login: yup.object({
    body: yup.object({
      username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
    }).required('Request body is required')
  }),

  verify2FA: yup.object({
    body: yup.object({
      token: yup
        .string()
        .required('2FA token is required'),
      code: yup
        .string()
        .required('2FA code is required')
        .matches(/^[0-9]{6}$/, '2FA code must be 6 digits')
    }).required('Request body is required')
  }),
}; 