/**
 * Vercel serverless function — POST /api/send
 *
 * Same honest rules as server.js (the Render backend): sends ONE email
 * through SMTP using ONLY environment variables, and returns success
 * ONLY when the SMTP server accepts the message. Anything else is a
 * failure and the front-end must NEVER mark that mail as sent.
 *
 * Env vars (Vercel Project -> Settings -> Environment Variables):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD, SMTP_FROM (optional)
 * NEVER put a password or API key in the repo, in chat, or in code.
 */

const nodemailer = require('nodemailer');

function readBody(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === 'string') {
    try { return JSON.parse(b); } catch (e) { return {}; }
  }
  return b;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const { to, subject, body, from } = readBody(req);
  if (!to || !subject || !body) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_APP_PASSWORD) {
    // Honest gate: no mailbox connected, so nothing is sent.
    return res.status(503).json({
      ok: false,
      error: 'mailbox_not_connected',
      detail: 'SMTP env vars (SMTP_HOST / SMTP_USER / SMTP_APP_PASSWORD) are not set on this host.'
    });
  }
  const mailer = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
  });
  try {
    const info = await mailer.sendMail({
      from: from || process.env.SMTP_FROM || SMTP_USER,
      to,
      subject,
      text: body,
    });
    // Only now — server accepted — may the caller mark this as sent.
    return res.json({ ok: true, messageId: info.messageId, accepted: info.accepted });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: 'smtp_failed',
      detail: String(err && err.message ? err.message : err),
    });
  }
};
