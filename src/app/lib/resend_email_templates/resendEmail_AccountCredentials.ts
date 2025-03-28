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
  email: string
  password: string
  parent_name: string
}

export const resendEmail_AccountCredentials = async (
  data: SendEmailProps
): Promise<void> => {
  const { email, password, parent_name } = data
  await transport.sendMail({
    from: {
      name: 'Kevin Lengkeek',
      address: 'kevinl@lovetransfusion.com',
    },
    to: email,
    subject: 'Your LoveTransfusion Account Info',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Account Info</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
      <table align="center" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f7fa" style="padding: 20px;">
        <tr>
          <td>
            <table align="center" cellpadding="0" cellspacing="0" width="600" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #2E8EDD; padding: 20px 30px; color: #ffffff; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">Welcome to Love Transfusion</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; color: #333333;">
                  <p style="font-size: 16px; margin: 0 0 20px;">Hi ${parent_name},</p>
                  <p style="font-size: 16px; margin: 0 0 20px;">Your account has been successfully created. Here are your login details:</p>

                  <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 16px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0;"><strong>Email:</strong></td>
                      <td style="padding: 8px 0;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Password:</strong></td>
                      <td style="padding: 8px 0;">${password}</td>
                    </tr>
                  </table>

                  <p style="font-size: 14px; color: #777;">For security, we recommend changing your password after logging in.</p>
                  <br />
                  <a href="https://www.lovetransfusion.com/login" style="background-color: #2E8EDD; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Log In Now</a>
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
    </html>`,
  })
}
