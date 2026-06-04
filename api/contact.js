const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://allinmediafactory.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, service, message, mesaj } = req.body || {};

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const msg = message || mesaj || '—';
    const svc = service || '—';

    await transporter.sendMail({
      from: `"All In Media Site" <${process.env.GMAIL_USER}>`,
      to: 'contact@allinmediafactory.com',
      replyTo: email.trim(),
      subject: `Mesaj nou de pe site — ${svc}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:12px;">
          <h2 style="margin:0 0 24px;color:#7c3aed">Mesaj nou — All In Media</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:120px">Nume</td><td style="padding:8px 0;font-weight:600">${name.trim()}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${phone?.trim() || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Serviciu</td><td style="padding:8px 0">${svc}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#fff;border-radius:8px;border:1px solid #eee">
            <p style="margin:0;color:#333;line-height:1.6">${msg.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#999">Trimis de pe allinmediafactory.com</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
