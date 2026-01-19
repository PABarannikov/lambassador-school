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

    // Send email using Web3Forms (free, no API key needed for basic use)
    const emailResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'f1c66897-12fa-4144-8688-9ebef8a09aa7',
        subject: `New Enquiry: ${service} - from ${name}`,
        from_name: "L'Ambassador School Website",
        name: name,
        email: email,
        company: company || 'Not provided',
        service: service,
        message: message || 'No message provided',
      }),
    });

    const result = await emailResponse.json();

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('Email send failed:', result);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: result.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
