export const otpEmail = (otp: string, name: string) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      width: 70%;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #e6e6fa;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    }
    .logo {
      font-size: 1.8em;
      color: #800080; /* Purple color */
      text-decoration: none;
      font-weight: 700;
    }
    .otp-container {
      background-color: #9370DB;
      color: #ffffff;
      margin: 20px auto;
      width: fit-content;
      padding: 15px 20px;
      border-radius: 4px;
      font-size: 1.2em;
      font-weight: bold;
      box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
    }
    .footer {
      margin-top: 20px;
      color: #666;
      font-size: 0.9em;
    }
    p {
      font-size: 1.1em;
      line-height: 1.6;
    }
    .name {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="text-align: center;">
      <a href="#" class="logo" style="color:purple">MediBuddy</a>
    </div>
    <p>Hi, <span class="name">${name}</span>,</p>
    <p>Welcome to MediBuddy. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
    <div class="otp-container">${otp}</div>
    <p>Regards,<br />MediBuddy</p>
    <div class="footer">
      <p>Please do not reply to this email. This email is auto-generated.</p>
    </div>
  </div>
</body>
</html>

    `;
  };


  export const forgotPasswordEmail = (name: string, verificationCode: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            width: 70%;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #e6e6fa;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
          }
          .logo {
            font-size: 1.8em;
            color: #800080; /* Purple color */
            text-decoration: none;
            font-weight: 700;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #9370DB;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          p {
            font-size: 1.1em;
            line-height: 1.6;
          }
          .footer {
            margin-top: 20px;
            color: #666;
            font-size: 0.9em;
            text-align: center;
          }
        </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center;">
          <a href="#" class="logo" style="color:purple">MediBuddy</a>
        </div>
        <p>Dear ${name},</p>
        <p>We have received a request to reset your password. To reset your password, click the button below:</p>
        <p style="text-align: center;">
          <a href="http://localhost:5173/reset_password/${verificationCode}" class="button" style="color:white">Reset Password</a>
        </p>
        <p>If you didn't request a password reset, you can ignore this email. Your password will remain unchanged.</p>
        <p>Thank you for using our service!</p>
        <div class="footer">
          <p>&copy; 2024 MediBuddy</p>
        </div>
      </div>
    </body>
    </html>`;
  };
  