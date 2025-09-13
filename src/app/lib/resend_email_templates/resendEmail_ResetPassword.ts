'use server'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

// ✅ Use correct SMTPTransport.Options typing
const transportOptions: SMTPTransport.Options = {
  host: 'smtp.resend.com',
  port: 465, // Port should be a number, not a string
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
}

const transport = nodemailer.createTransport(transportOptions)

type SendEmailProps = {
  clEmail: string
  clResetLink: string
  clParent_name: string
}

export const resendEmail_ResetPassword = async (
  data: SendEmailProps
): Promise<void> => {
  const {
    clEmail: email,
    clResetLink: resetLink,
    clParent_name: parent_name,
  } = data
  await transport.sendMail({
    from: {
      name: 'Kevin Lengkeek',
      address: 'kevinl@lovetransfusion.org',
    },
    to: email,
    subject: 'Reset Your Password',
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f7fa" style="padding: 20px;">
    <tr>
      <td>
        <table align="center" cellpadding="0" cellspacing="0" width="600" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2E8EDD; padding: 20px 30px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #333333;">
              <p style="font-size: 16px; margin: 0 0 20px;">Hi ${
                parent_name || 'there'
              },</p>
              <p style="font-size: 16px; margin: 0 0 20px;">We received a request to reset your password for your Love Transfusion account.</p>
              <p style="font-size: 16px; margin: 0 0 20px;">Click the button below to reset it:</p>

              <a href="${resetLink}" style="background-color: #2E8EDD; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>

              <p style="font-size: 14px; margin: 20px 0 0; color: #777;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
              <p style="font-size: 14px; color: #777;">This link will expire in 1 hour.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              © ${new Date().getFullYear()} Love Transfusion. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  })
}
