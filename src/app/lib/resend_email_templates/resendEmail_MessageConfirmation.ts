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
  clFirstName: string
  clLastName: string
  clMessage: string
}

export const resendEmail_MessageConfirmation = async (
  data: SendEmailProps
): Promise<void> => {
  const {
    clEmail: email,
    clFirstName: firstName,
    clLastName: lastName,
    clMessage: message,
  } = data
  await transport.sendMail({
    from: {
      name: 'Kevin Lengkeek',
      address: 'kevinl@lovetransfusion.com',
    },
    to: email,
    subject: 'Your Message Has Been Received',
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f7fa" style="padding: 20px;">
    <tr>
      <td>
        <table align="center" cellpadding="0" cellspacing="0" width="600" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2E8EDD; padding: 20px 30px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Your Message Has Been Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #333333;">
              <p style="font-size: 16px; margin: 0 0 20px;">Hi ${firstName},</p>
              <p style="font-size: 16px; margin: 0 0 20px;">Thank you for reaching out to us. Your message has been successfully submitted. Below are the details:</p>

              <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 4px 0; vertical-align: top;"><strong>Message: </strong></td>
                  <td style="padding: 8px 0;">${message}</td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #777;">We will get back to you as soon as possible. In the meantime, feel free to browse our resources or reply to this email if you have further questions.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              © 2025 Love Transfusion. All rights reserved.
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
