const Joi = require('joi');

const createAvailabilitySchema = Joi.object({
  dayOfWeek: Joi.string()
    .trim()
    .lowercase()
    .valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
    .required()
    .messages({
      'string.empty': 'Day of week is required',
      'any.only': 'Day of week must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday',
      'any.required': 'Day of week is required'
    }),

  startTime: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Start time must be a valid date',
      'date.format': 'Start time must be in ISO format',
      'any.required': 'Start time is required'
    }),

  endTime: Joi.date()
    .iso()
    .greater(Joi.ref('startTime'))
    .required()
    .messages({
      'date.base': 'End time must be a valid date',
      'date.format': 'End time must be in ISO format',
      'date.greater': 'End time must be after start time',
      'any.required': 'End time is required'
    })
}).custom((value, helpers) => {
  const startTime = new Date(value.startTime);
  const endTime = new Date(value.endTime);
  
  const durationMs = endTime - startTime;
  const durationHours = durationMs / (1000 * 60 * 60);
  
  if (durationHours > 24) {
    return helpers.error('any.invalid', { 
      message: 'Availability window cannot exceed 24 hours' 
    });
  }
  
  if (durationHours < 0.5) {
    return helpers.error('any.invalid', { 
      message: 'Availability window must be at least 30 minutes' 
    });
  }
  
  return value;
});

const updateAvailabilitySchema = Joi.object({
  dayOfWeek: Joi.string()
    .trim()
    .lowercase()
    .valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
    .optional()
    .messages({
      'any.only': 'Day of week must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday'
    }),

  startTime: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'Start time must be a valid date',
      'date.format': 'Start time must be in ISO format'
    }),

  endTime: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'End time must be a valid date',
      'date.format': 'End time must be in ISO format'
    })
}).min(1)
.custom((value, helpers) => {
  if (value.startTime && value.endTime) {
    const startTime = new Date(value.startTime);
    const endTime = new Date(value.endTime);
    
    if (endTime <= startTime) {
      return helpers.error('any.invalid', { 
        message: 'End time must be after start time' 
      });
    }
    
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours > 24) {
      return helpers.error('any.invalid', { 
        message: 'Availability window cannot exceed 24 hours' 
      });
    }
    
    if (durationHours < 0.5) {
      return helpers.error('any.invalid', { 
        message: 'Availability window must be at least 30 minutes' 
      });
    }
  }
  
  return value;
});

const availabilityIdSchema = Joi.object({
  availabilityId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid availability ID format',
      'any.required': 'Availability ID is required'
    })
});

const bulkAvailabilitySchema = Joi.object({
  availabilities: Joi.array()
    .items(
      Joi.object({
        dayOfWeek: Joi.string()
          .trim()
          .lowercase()
          .valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
          .required()
          .messages({
            'string.empty': 'Day of week is required',
            'any.only': 'Day of week must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday',
            'any.required': 'Day of week is required'
          }),

        startTime: Joi.date()
          .iso()
          .required()
          .messages({
            'date.base': 'Start time must be a valid date',
            'date.format': 'Start time must be in ISO format',
            'any.required': 'Start time is required'
          }),

        endTime: Joi.date()
          .iso()
          .greater(Joi.ref('startTime'))
          .required()
          .messages({
            'date.base': 'End time must be a valid date',
            'date.format': 'End time must be in ISO format',
            'date.greater': 'End time must be after start time',
            'any.required': 'End time is required'
          })
      })
    )
    .min(1)
    .max(7)
    .unique('dayOfWeek')
    .required()
    .messages({
      'array.min': 'At least one availability entry is required',
      'array.max': 'Cannot have more than 7 availability entries (one per day)',
      'array.unique': 'Each day of week can only have one availability entry',
      'any.required': 'Availabilities array is required'
    })
});

module.exports = {
  createAvailabilitySchema,
  updateAvailabilitySchema,
  availabilityIdSchema,
  bulkAvailabilitySchema
};