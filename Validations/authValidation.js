const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),

  businessName: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Business name is required',
      'string.max': 'Business name must not exceed 100 characters',
      'any.required': 'Business name is required'
    }),

  slug: Joi.string()
    .trim()
    .lowercase()
    .max(100)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      'string.empty': 'Slug is required',
      'string.max': 'Slug must not exceed 100 characters',
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
      'any.required': 'Slug is required'
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 72 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[+]?[\d\s-()]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),

  bio: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Bio must not exceed 1000 characters'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required',
      'any.required': 'Refresh token is required'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema
};