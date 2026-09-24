const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the body of a "create appointment" request.
 *
 * Matches the Appointment schema exactly:
 * {
 *   provider,       // required, ObjectId string
 *   service,        // required, ObjectId string
 *   customerName,   // required, string
 *   customerEmail,  // required, valid email
 *   customerPhone,  // optional
 *   startTime,      // required, valid date
 *   endTime,        // required, valid date, after startTime
 *   notes           // optional, max 1000 chars
 * }
 */
function validateAppointmentInput(req, res, next) {
  const {
    provider,
    service,
    customerName,
    customerEmail,
    startTime,
    endTime,
    notes,
  } = req.body;
  const errors = [];

  if (!provider) errors.push('provider is required');
  if (!service) errors.push('service is required');

  if (!customerName || !customerName.trim()) {
    errors.push('customerName is required');
  } else if (customerName.trim().length > 100) {
    errors.push('customerName must be 100 characters or fewer');
  }

  if (!customerEmail) {
    errors.push('customerEmail is required');
  } else if (!EMAIL_PATTERN.test(customerEmail)) {
    errors.push('customerEmail must be a valid email');
  }

  if (!startTime) errors.push('startTime is required');
  if (!endTime) errors.push('endTime is required');

  if (startTime && Number.isNaN(Date.parse(startTime))) {
    errors.push('startTime must be a valid date');
  }
  if (endTime && Number.isNaN(Date.parse(endTime))) {
    errors.push('endTime must be a valid date');
  }

  if (
    startTime &&
    endTime &&
    !Number.isNaN(Date.parse(startTime)) &&
    !Number.isNaN(Date.parse(endTime))
  ) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      errors.push('startTime must be before endTime');
    }
    if (start < new Date()) {
      errors.push('startTime cannot be in the past');
    }
  }

  if (notes && notes.length > 1000) {
    errors.push('notes must be 1000 characters or fewer');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

/**
 * Validates query parameters for an availability check.
 *
 * Expected query: ?providerId=...&serviceId=...&date=YYYY-MM-DD
 * serviceId is required because availabilityService.getAvailableSlots()
 * sizes each slot to the service's durationMinutes.
 */
function validateAvailabilityQuery(req, res, next) {
  const { providerId, serviceId, date } = req.query;
  const errors = [];

  if (!providerId) errors.push('providerId query param is required');
  if (!serviceId) errors.push('serviceId query param is required');

  if (!date) {
    errors.push('date query param is required');
  } else {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      errors.push('date query param must use YYYY-MM-DD format');
    } else if (Number.isNaN(Date.parse(`${date}T00:00:00`))) {
      errors.push('date query param must be a valid date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

/**
 * Validates the body of a provider registration request.
 * Matches the Provider schema's required fields.
 */
function validateProviderRegistration(req, res, next) {
  const { name, businessName, slug, email, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('name is required');
  if (!businessName || !businessName.trim()) errors.push('businessName is required');

  if (!slug) {
    errors.push('slug is required');
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.toLowerCase())) {
    errors.push('slug must use lowercase letters, numbers, and hyphens only');
  }

  if (!email) {
    errors.push('email is required');
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.push('email must be a valid email');
  }

  if (!password) {
    errors.push('password is required');
  } else if (password.length < 8) {
    errors.push('password must be at least 8 characters');
  } else if (Buffer.byteLength(password, 'utf8') > 72) {
    errors.push('password must not exceed 72 bytes');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

/**
 * Validates the body of a provider login request.
 */
function validateProviderLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('email is required');
  if (!password) errors.push('password is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = {
  validateAppointmentInput,
  validateAvailabilityQuery,
  validateProviderRegistration,
  validateProviderLogin,
};
