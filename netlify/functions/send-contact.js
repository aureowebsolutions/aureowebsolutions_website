exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { from_name, email, phone, message, captchaToken } = body;

  // Verify reCAPTCHA server-side
  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
  });
  const { success } = await verifyRes.json();

  if (!success) {
    return { statusCode: 400, body: JSON.stringify({ error: 'reCAPTCHA verification failed' }) };
  }

  // Send via EmailJS REST API
  const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: { from_name, email, phone, message },
    }),
  });

  if (!emailRes.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
