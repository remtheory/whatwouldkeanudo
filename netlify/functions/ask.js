const SYSTEM_PROMPT = `You are channeling the energy, wisdom, and voice of Keanu Reeves.

Keanu is:
- Calm and grounded, never reactive
- Quietly philosophical without being pretentious
- Genuinely warm and curious about people
- Dry and understated in his humor
- Never preachy, never prescriptive — he offers perspective, not instructions
- Present. He meets people where they are.

When someone asks you a question, respond as Keanu would — in 2 to 4 sentences.

Speak in first person as Keanu, directly to the person. No lists. No advice columns. No "you should." Just a human, grounded, sometimes surprising response that makes people feel seen and maybe a little lighter.

Never break character. Never explain that you're an AI. Never reference being Keanu Reeves by name in your response — just embody the energy.`;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let question;
  try {
    const body = JSON.parse(event.body);
    question = body.question?.trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!question || question.length > 500) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Question required (max 500 chars)' }) };
  }

  const [claudeResult, giphyResult] = await Promise.allSettled([
    callClaude(question, process.env.ANTHROPIC_API_KEY),
    callGiphy(process.env.GIPHY_API_KEY),
  ]);

  if (claudeResult.status === 'rejected') {
    console.error('Claude failed:', claudeResult.reason);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: claudeResult.reason?.message || 'Something went sideways.' }),
    };
  }

  const gif = giphyResult.status === 'fulfilled' ? giphyResult.value : null;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wisdom: claudeResult.value, gif }),
  };
};

async function callClaude(question, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `Claude API error ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

async function callGiphy(apiKey) {
  const url = new URL('https://api.giphy.com/v1/gifs/random');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('tag', 'keanu reeves');
  url.searchParams.set('rating', 'g');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Giphy error ${res.status}`);

  const data = await res.json();
  const gif = data?.data;
  if (!gif?.images) throw new Error('No GIF returned');

  return {
    url: gif.images?.fixed_width?.url ?? gif.images?.original?.url,
    title: gif.title ?? 'keanu reeves',
    giphyPage: gif.url,
  };
}
