const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // Using Gmail service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VoteChain Account Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1976d2;">VoteChain Account Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with VoteChain. Your account verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; letter-spacing: 3px;">
            ${otp}
          </span>
        </div>
        <p>This code will expire in 10 minutes. Please use this code to verify your account.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message from VoteChain. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send approval notification email
const sendApprovalEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VoteChain Account Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4caf50;">VoteChain Account Approved</h2>
        <p>Hello ${name},</p>
        <p>Congratulations! Your VoteChain account has been approved. You can now access all voting features.</p>
        <p>Visit VoteChain and start participating in democratic processes securely and transparently.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
             style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Login to VoteChain
          </a>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message from VoteChain. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
};

// Send election notification email
const sendElectionNotification = async (email, name, electionTitle, electionId) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `New Election: ${electionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ff9800;">New Election Available</h2>
        <p>Hello ${name},</p>
        <p>A new election has been created that you may participate in:</p>
        <h3 style="color: #1976d2;">${electionTitle}</h3>
        <p>Cast your vote securely on the blockchain and help make democratic decisions.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/vote/${electionId}" 
             style="background-color: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Vote Now
          </a>
        </div>
        <p>Remember to vote before the election closes!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message from VoteChain. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending election notification email:', error);
    return false;
  }
};

// Send election results email
const sendElectionResults = async (email, name, electionTitle, results) => {
  // Format results for email
  const resultsHtml = results.map(candidate => 
    `<p><strong>${candidate.name}:</strong> ${candidate.votes} votes</p>`
  ).join('');

  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Election Results: ${electionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4caf50;">Election Results</h2>
        <p>Hello ${name},</p>
        <p>The results are in for the election:</p>
        <h3 style="color: #1976d2;">${electionTitle}</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          ${resultsHtml}
        </div>
        <p>Thank you for participating in the democratic process. Your vote matters!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message from VoteChain. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending election results email:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendVerificationEmail,
  sendApprovalEmail,
  sendElectionNotification,
  sendElectionResults
};