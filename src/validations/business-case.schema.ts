import * as yup from 'yup';

export const businessCaseValidation = {
  createBusinessCase: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Business case name is required'),
      detection_type: yup
        .string()
        .required('Detection type is required')
        .oneOf(['HARNESS', 'CATTLE', 'SECURITY'], 'Invalid detection type'),
      confidence_threshold: yup
        .number()
        .required('Confidence threshold is required'),
      objects_to_detect: yup
        .array()
        .of(yup.string().required('Object name is required'))
        .required('Objects to detect are required')
        .min(1, 'At least one object must be specified')
    }).required('Request body is required')
  }),

  updateBusinessCase: yup.object({
    params: yup.object({
      id: yup
        .number()
        .required('Business case ID is required')
        .positive('Business case ID must be positive')
    }),
    body: yup.object({
      name: yup
        .string()
        .required('Business case name is required'),
      detection_type: yup
        .string()
        .oneOf(['HARNESS', 'CATTLE', 'SECURITY'], 'Invalid detection type'),
      confidence_threshold: yup
        .number()
        .required('Confidence threshold is required'),
      objects_to_detect: yup
        .array()
        .of(yup.string().required('Object name is required'))
        .min(1, 'At least one object must be specified')
    }).required('Request body is required')
  }),

  getBusinessCaseById: yup.object({
    params: yup.object({
      id: yup
        .number()
        .required('Business case ID is required')
        .positive('Business case ID must be positive')
    })
  })
}; 