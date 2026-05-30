// Netlify Function: track-lead.js
// Sends server-side conversion events to Meta Conversions API

const PIXEL_ID = '1021839713606468';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = 'v19.0';

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check token is configured
  if (!ACCESS_TOKEN) {
    console.error('META_ACCESS_TOKEN environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { eventName = 'Lead', userData = {}, customData = {} } = payload;

  // Build the event data for Meta CAPI
  const eventData = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: userData.sourceUrl || 'https://bixsolution.site',
        user_data: {
          client_ip_address: event.headers['x-forwarded-for'] || event.headers['client-ip'] || '',
          client_user_agent: event.headers['user-agent'] || '',
          ...(userData.email && { em: userData.email }),
          ...(userData.phone && { ph: userData.phone }),
        },
        custom_data: {
          ...customData,
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', result);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Failed to send event to Meta', details: result }),
      };
    }

    console.log('Meta CAPI success:', result);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, result }),
    };
  } catch (err) {
    console.error('Network error calling Meta CAPI:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Network error', message: err.message }),
    };
  }
};
