const nodemailer = require('nodemailer');

// Configure transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generic low-level email sender.
// Everything else builds on this function.
async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        '"Appointment Booking" <no-reply@example.com>',
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending failed:', error);

    throw new Error('Failed to send email');
  }
}

//Sends a welcome email after a user creates an account.
async function sendWelcomeEmail({ toEmail, customerName }) {
  return sendEmail({
    to: toEmail,
    subject: 'Welcome to Appointment Booking',
    text: `Hi ${customerName},

Welcome to Appointment Booking!

Your account has been successfully created.

You can now use your account to book and manage your appointments.

Thank you for joining us.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to Appointment Booking!</h2>

        <p>Hi ${customerName},</p>

        <p>
          Your account has been successfully created.
        </p>

        <p>
          You can now use your account to book and manage
          your appointments.
        </p>

        <p>Thank you for joining us.</p>
      </div>
    `,
  });
}

// Sends a booking confirmation email.
// Pass plain values, not model instances.
async function sendBookingConfirmation({
  toEmail,
  customerName,
  providerName,
  startTime,
}) {
  const formattedTime = new Date(startTime).toLocaleString();

  return sendEmail({
    to: toEmail,
    subject: 'Appointment Confirmed',
    text: `Hi ${customerName},

Your appointment with ${providerName} is confirmed for ${formattedTime}.

If you need to reschedule or cancel, please log in to your account.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Appointment Confirmed</h2>

        <p>Hi ${customerName},</p>

        <p>
          Your appointment with
          <strong>${providerName}</strong>
          is confirmed for
          <strong>${formattedTime}</strong>.
        </p>

        <p>
          If you need to reschedule or cancel,
          please log in to your account.
        </p>
      </div>
    `,
  });
}

//Sends an appointment cancellation notice.
async function sendCancellationNotice({
  toEmail,
  customerName,
  startTime,
}) {
  const formattedTime = new Date(startTime).toLocaleString();

  return sendEmail({
    to: toEmail,
    subject: 'Appointment Cancelled',
    text: `Hi ${customerName},

Your appointment scheduled for ${formattedTime} has been cancelled.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Appointment Cancelled</h2>

        <p>Hi ${customerName},</p>

        <p>
          Your appointment scheduled for
          <strong>${formattedTime}</strong>
          has been cancelled.
        </p>
      </div>
    `,
  });
}

//Sends an appointment reminder.
//Can be triggered by a scheduled job.
async function sendReminder({
  toEmail,
  customerName,
  providerName,
  startTime,
}) {
  const formattedTime = new Date(startTime).toLocaleString();

  return sendEmail({
    to: toEmail,
    subject: 'Appointment Reminder',
    text: `Hi ${customerName},

This is a reminder of your upcoming appointment with ${providerName} on ${formattedTime}.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Appointment Reminder</h2>

        <p>Hi ${customerName},</p>

        <p>
          This is a reminder of your upcoming appointment with
          <strong>${providerName}</strong>
          on
          <strong>${formattedTime}</strong>.
        </p>
      </div>
    `,
  });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendCancellationNotice,
  sendReminder,
};