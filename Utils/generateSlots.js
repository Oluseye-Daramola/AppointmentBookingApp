const { addMinutes, isSameDay, getDayOfWeek, getStartOfDay, getEndOfDay } = require('./timeUtils');

const generateSlotsForDay = (availability, serviceDuration, date, existingAppointments = []) => {
  const slots = [];
  const dayName = getDayOfWeek(date);
  
  const dayAvailability = availability.find(av => av.dayOfWeek === dayName);
  if (!dayAvailability) return slots;

  const dayStart = getStartOfDay(date);
  const dayEnd = getEndOfDay(date);
  
  const availabilityStart = new Date(dayAvailability.startTime);
  const availabilityEnd = new Date(dayAvailability.endTime);
  
  availabilityStart.setFullYear(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());
  availabilityEnd.setFullYear(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());

  const effectiveStart = availabilityStart < dayStart ? dayStart : availabilityStart;
  const effectiveEnd = availabilityEnd > dayEnd ? dayEnd : availabilityEnd;

  let currentTime = new Date(effectiveStart);
  
  while (addMinutes(currentTime, serviceDuration) <= effectiveEnd) {
    const slotEnd = addMinutes(currentTime, serviceDuration);
    
    const isAvailable = !existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);
      
      return (currentTime < appointmentEnd && slotEnd > appointmentStart);
    });

    if (isAvailable) {
      slots.push({
        startTime: new Date(currentTime),
        endTime: slotEnd,
        isAvailable: true
      });
    }

    currentTime = addMinutes(currentTime, serviceDuration);
  }

  return slots;
};

const generateSlotsForRange = (availability, serviceDuration, startDate, endDate, existingAppointments = []) => {
  const allSlots = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const daySlots = generateSlotsForDay(availability, serviceDuration, current, existingAppointments);
    allSlots.push(...daySlots);
    current.setDate(current.getDate() + 1);
  }

  return allSlots;
};

const findAvailableSlots = (availability, serviceDuration, preferredDate, existingAppointments = []) => {
  const requestedDate = new Date(preferredDate);
  return generateSlotsForDay(availability, serviceDuration, requestedDate, existingAppointments);
};

const checkSlotAvailability = (startTime, endTime, existingAppointments = []) => {
  const requestedStart = new Date(startTime);
  const requestedEnd = new Date(endTime);

  const hasConflict = existingAppointments.some(appointment => {
    const appointmentStart = new Date(appointment.startTime);
    const appointmentEnd = new Date(appointment.endTime);
    
    return (requestedStart < appointmentEnd && requestedEnd > appointmentStart);
  });

  return !hasConflict;
};

module.exports = {
  generateSlotsForDay,
  generateSlotsForRange,
  findAvailableSlots,
  checkSlotAvailability
};