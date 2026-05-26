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
CRITICAL: The keywords must be what their TARGET AUDIENCE actually TYPES into the Instagram search bar. Ask yourself: what would someone type into Instagram search when looking for this type of account?
GOOD examples: "how to grow on Instagram", "Instagram tips for business owners", "vegan dinner recipes", "wedding cakes Somerset", "things to do in Sydney"
BAD examples: "Instagram growth for female entrepreneurs", "female entrepreneur coach", "lifestyle curator" - these are descriptions, not search terms. Nobody types these into search.
Keep it short. One dash separator maximum.

LINE 2 - FIRST LINE:
Take their draft first line and sharpen it. Keep their voice and idea but make it speak directly to the FOLLOWER's situation, desire or struggle. Never about the creator. Specific enough that the right person thinks "omg this is literally me". Has personality.
Do NOT completely rewrite it if their draft is already good. Just sharpen it.

LINE 3 - CREDIBILITY:
One punchy line using their credibility. Numbers are powerful. Skip entirely if no credibility was provided.

LINE 4 - CTA:
One outcome-driven CTA. Tell people what they will GET or what will HAPPEN. Not a product name. One line only.
If email for collabs: write "collabs: [email]"
If no CTA needed: skip this line.

LINE 5 - LINK:
Just the URL. Nothing else.

FORMATTING RULES:
- EVERY line must start with a relevant emoji
- Use a different emoji for each line
- The CTA line must use 👇 or a downward pointing emoji
- Line breaks between every element
- Simple language, no jargon, no hashtags
- Output ONLY the bio. No explanation, no intro, no commentary.

STUDENT ANSWERS:
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
