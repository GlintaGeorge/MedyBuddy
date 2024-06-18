export const doctorVerifyEmailPage = (name: string, token: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
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
        <p>Hi, <span class="name">${name}</span>,</p>
        <p>Welcome to MediBuddy. Use the following link to verify your email address:</p>
        <p style="text-align: center;">
          <a href="http://localhost:5173/doctor/verify_token/${token}" class="button" style="color:white">Verify Email</a>
        </p>
        <p>If you didn't sign up for an account on MediBuddy, you can ignore this email.</p>
        <div class="footer">
          <p>&copy; 2024 MediBuddy</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };
  