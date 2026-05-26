export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'Missing answers' });
  }

  const prompt = `You are Eve Longfield, an Instagram growth coach and copywriter. A Brilliant Bio student has given you their answers below. Write their Instagram bio using the exact framework they just learned.

HERE IS WHAT TO WRITE:

LINE 1 - NAME FIELD:
Write: [Their name] - [searchable keywords]
The keywords must be what their TARGET AUDIENCE would actually TYPE into Instagram search.
Think like a searcher: "how to grow on Instagram", "vegan recipes easy", "wedding cakes Sydney", "things to do in Sydney" — these are search terms.
NOT: "Instagram expert", "female entrepreneur coach", "lifestyle curator" — these are titles nobody searches.
Keep it short and natural. One dash separator maximum.

LINE 2 - FIRST LINE:
Take their draft first line and sharpen it. Keep their voice and idea but make it:
- More specific to their perfect fit follower
- About the FOLLOWER's situation, desire or struggle — never about the creator
- Have personality — not a generic "I help X do Y" statement
- Make the right person think "omg this is literally me"
Do NOT completely rewrite it. Sharpen what they gave you. If their draft is already good, keep it close to the original.

LINE 3 - CREDIBILITY:
One short line using what they provided. Numbers are powerful. Keep it punchy.
If no credibility provided, skip this line entirely.

LINE 4 - CTA:
Write ONE outcome-driven CTA based on what they told you. Tell people what they will GET or what will HAPPEN. Not just a product name. Keep it short — one line maximum.

LINE 5 - LINK:
Just the URL they provided. Nothing else.

FORMATTING RULES:
- Use 1-2 emojis maximum, placed at the start of lines to break up text
- Line breaks between each element
- Under 150 characters for lines 2-5 combined (name field is separate)
- Simple language, no jargon
- No hashtags
- Output ONLY the bio. No explanation, no commentary, no intro text.

STUDENT'S ANSWERS:
${answers}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
