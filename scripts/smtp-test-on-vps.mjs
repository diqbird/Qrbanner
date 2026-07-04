import fs from 'fs';
import nodemailer from 'nodemailer';

const env = fs.readFileSync('.env', 'utf8');
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  process.env[m[1]] = v;
}

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '465', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const to = process.env.TEST_TO;

if (!host || !user || !pass) {
  console.log('SMTP_NOT_CONFIGURED');
  process.exit(0);
}

const t = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  await t.verify();
  console.log('VERIFY_OK', host, port);
  if (to) {
    const info = await t.sendMail({
      from: `QRbanner <${process.env.SMTP_FROM || user}>`,
      to,
      subject: 'QRbanner SMTP test',
      text: 'SMTP test OK - ' + new Date().toISOString(),
    });
    console.log('SEND_OK', info.messageId);
    console.log('accepted', JSON.stringify(info.accepted));
    console.log('rejected', JSON.stringify(info.rejected));
    console.log('response', info.response);
  }
} catch (e) {
  console.log('SMTP_ERROR', e.message);
}
