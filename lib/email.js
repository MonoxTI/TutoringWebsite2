import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }) {
  await resend.emails.send({
    from: "Assembled Tutoring <no-reply@assembledtutoring.co.za>",
    to,
    subject,
    html,
  })
}