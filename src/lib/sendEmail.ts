import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendBookEmail(to: string, bookUrl: string, title: string) {
  await resend.emails.send({
    from: 'BonusPlay <noreply@bonusplay.com>',
    to,
    subject: `Your Book: ${title}`,
    html: `
      <p>Thanks for your purchase!</p>
      <p><a href="\${bookUrl}">Click here to download your PDF</a></p>
    `,
  })
}
