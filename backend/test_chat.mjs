import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing Gemini Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: 'Hello, who are you?' }] }
        ]
      })
    });
    console.log('Status:', res.status, res.statusText);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
