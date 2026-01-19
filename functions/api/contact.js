export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, company, service, message } = body;

    // Validate required fields
    if (!name || !email || !service) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format email content
    const emailContent = `
New Contact Form Submission from L'Ambassador School

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Interested In: ${service}
Message: ${message || 'No message provided'}

---
Sent from lambassadorschool.com contact form
    `.trim();

    // Send email using Cloudflare Email Routing (via MailChannels)
    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'info@lambassadorschool.com', name: "L'Ambassador School" }],
          },
        ],
        from: {
          email: 'noreply@lambassadorschool.com',
          name: 'L\'Ambassador School Website',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `New Enquiry: ${service} - from ${name}`,
        content: [
          {
            type: 'text/plain',
            value: emailContent,
          },
        ],
      }),
    });

    if (emailResponse.ok || emailResponse.status === 202) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const errorText = await emailResponse.text();
      console.error('Email send failed:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
