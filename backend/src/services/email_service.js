import sgMail from "@sendgrid/mail";

const SUBJECT = "Q1 Sales Executive Summary";

export async function sendSalesSummaryEmail({ recipient, summary }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const sender = process.env.EMAIL_SENDER;

  if (!apiKey || !sender) {
    throw new Error("Email service is not configured correctly.");
  }

  sgMail.setApiKey(apiKey);

  const msg = {
    to: recipient,
    from: sender,
    subject: SUBJECT,
    text: `AI generated report:\n\n${summary}`,
    html: `<p>AI generated report:</p><pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${summary}</pre>`,
  };

  await sgMail.send(msg);
}

