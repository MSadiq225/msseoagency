/**
 * Vercel serverless function — GET /api/health
 * Reports whether an SMTP mailbox is configured on this host.
 * It never sends mail and never exposes a password.
 */
module.exports = (req, res) => {
  const connected = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_APP_PASSWORD
  );
  res.json({ ok: true, smtp_connected: connected, time: new Date().toISOString() });
};
