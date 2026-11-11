/**
 * MS SEO Agency — optional backend for live auto-send.
 *
 * NOT auto-started. This file only runs when YOU start it:
 *   npm install
 *   npm start            (listens on PORT, default 3000)
 *
 * HOW IT WORKS
 * - Serves the static front-end (index.html, app.js, style.css).
 * - POST /api/send { to, subject, body, from } sends one email through
 *   SMTP using ONLY environment variables. It returns success ONLY when
 *   the SMTP server accepts the message. Anything else is a failure and
 *   the front-end must NEVER mark that mail as sent.
 *
 * PASSWORDS / SECRETS — READ THIS
 * - NEVER put a password or API key in this repo, in chat, or in code.
 * - Set them in Vercel (Project -> Settings -> Environment Variables)
 *   or in Render (Environment tab) as:
 *     SMTP_HOST         e.g. smtp.gmail.com  OR  mail.msseoagency.com
 *     SMTP_PORT         e.g. 587
 *     SMTP_USER         e.g. foundermsseoagency@gmail.com
 *     SMTP_APP_PASSWORD Your Gmail App Password (not your normal Gmail
 *                       password) OR your Hostinger mailbox password.
 *                       For Gmail: Google Account -> Security ->
 *                       2-Step Verification -> App passwords.
 *     SMTP_FROM         Display sender, e.g. "Aqib Ali <foundermsseoagency@gmail.com>"
 * - One SMTP mailbox per deployment. For 50+ parallel sender IDs you need
 *   one deployment / worker per mailbox, or a queue runner that swaps
 *   SMTP_USER per lane. This stub does NOT rotate passwords and does NOT
 *   store any password.
 * - If SMTP_HOST / SMTP_USER / SMTP_APP_PASSWORD are missing, /api/send
 *   returns 503 { ok:false, error:"mailbox_not_connected" } and sends
 *   nothing. That is the honest gate.
 */

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

function transporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
  });
}

app.get('/api/health', (req, res) => {
  const connected = !!transporter();
  res.json({ ok: true, smtp_connected: connected, time: new Date().toISOString() });
});

app.post('/api/send', async (req, res) => {
  const { to, subject, body, from } = req.body || {};
  if (!to || !subject || !body) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }
  const mailer = transporter();
  if (!mailer) {
    // Honest gate: no mailbox connected, so nothing is sent.
    return res.status(503).json({ ok: false, error: 'mailbox_not_connected', detail: 'SMTP env vars (SMTP_HOST / SMTP_USER / SMTP_APP_PASSWORD) are not set on this host.' });
  }
  try {
    const info = await mailer.sendMail({
      from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: body,
    });
    // Only now — server accepted — may the caller mark this as sent.
    return res.json({ ok: true, messageId: info.messageId, accepted: info.accepted });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'smtp_failed', detail: String(err && err.message ? err.message : err) });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`msseoagency server listening on http://localhost:${PORT}`);
  console.log(`SMTP connected: ${!!transporter()} (set SMTP_HOST/SMTP_USER/SMTP_APP_PASSWORD to enable /api/send)`);
});
