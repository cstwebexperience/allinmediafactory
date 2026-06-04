// Vercel serverless function — trimite emailul de contact prin Resend
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    // body poate veni deja parsat (Vercel) sau ca string
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};

    // suporta atat campurile EN cat si RO
    const name    = (body.name || body.nume || '').trim();
    const email   = (body.email || '').trim();
    const phone   = (body.phone || body.telefon || '').trim();
    const service = (body.service || body.serviciu || '—').trim();
    const message = (body.message || body.mesaj || '—').trim();

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ success: false, error: 'Email not configured' });

    const FROM = process.env.MAIL_FROM || 'All In Media <onboarding@resend.dev>';
    const TO   = (process.env.MAIL_TO || 'cstwebexperience@gmail.com')
                   .split(',').map(s => s.trim()).filter(Boolean);

    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:12px;">
        <h2 style="margin:0 0 24px;color:#7c3aed">Mesaj nou — All In Media</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:120px">Nume</td><td style="padding:8px 0;font-weight:600">${esc(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${esc(phone) || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Serviciu</td><td style="padding:8px 0">${esc(service)}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#fff;border-radius:8px;border:1px solid #eee">
          <p style="margin:0;color:#333;line-height:1.6">${esc(message).replace(/\n/g,'<br>')}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#999">Trimis de pe allinmediafactory.com</p>
      </div>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: email,
        subject: `Mesaj nou de pe site — ${service}`,
        html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error:', r.status, detail);
      return res.status(502).json({ success: false, error: 'Mail provider error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
