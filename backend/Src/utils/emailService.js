import sendEmail from "./sendEmail.js";

const sendVerificationEmail = async (
  email,
  name,
  otp
) => {
  const message = `Hello ${name},

Thank you for signing up with Vendora!

Your verification code is:

${otp}

This code is valid for 10 minutes. For your security, please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
The Vendora Team`;

  return sendEmail(
    email,
    "Vendora Email Verification OTP",
    message
  );
};

const sendWelcomeEmail = async (
  email,
  name
) => {
  const message = `Hello ${name},

Welcome to Vendora!

Your account has been successfully verified and your Vendora account is now ready to use.

You can now:
- Explore products
- Add products to your cart
- Place orders
- Track your purchases

Thank you for choosing Vendora.

Best regards,
The Vendora Team`;

  return sendEmail(
    email,
    "Welcome to Vendora!",
    message
  );
};

const sendLoginNotificationEmail = async (
  email,
  name
) => {
  const message = `Hello ${name},

Your Vendora account was successfully logged in.

If this was you, no action is required.

If you did not make this login, please change your password and secure your account.

Best regards,
The Vendora Team`;

  return sendEmail(
    email,
    "New Login to Your Vendora Account",
    message
  );
};

export {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
};