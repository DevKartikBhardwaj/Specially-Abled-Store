export function generateVerificationEmail({ userName, code, companyName, logoUrl }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Verification Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f3f2ef;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 480px;
          margin: 40px auto;
          background: #ffffff;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          padding: 32px;
        }
        .logo {
          text-align: center;
          margin-bottom: 24px;
        }
        .logo img {
          width: 100px;
        }
        h1 {
          font-size: 20px;
          margin-bottom: 16px;
          color: #333333;
        }
        p {
          font-size: 16px;
          color: #444444;
          line-height: 1.5;
        }
        .code {
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #0a66c2;
          text-align: center;
          margin: 24px 0;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          text-align: center;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="${logoUrl}" alt="${companyName} Logo">
        </div>
        <h1>Here’s your verification code</h1>
        <p>Hi ${userName},</p>
        <p>Use the code below to verify your email address:</p>
        <div class="code">${code}</div>
        <p>This code is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Thanks,<br>The ${companyName} Team</p>
        <div class="footer">
          © ${new Date().getFullYear()} ${companyName}. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

