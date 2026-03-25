import asyncHandler from 'express-async-handler';

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowData = rateLimitMap.get(ip);

  if (!windowData || now - windowData.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }

  if (windowData.count >= RATE_LIMIT_MAX) {
    return false;
  }

  windowData.count++;
  return true;
};

// Portfolio context system prompt
const SYSTEM_PROMPT = `You are an AI assistant for Suraj Prakash's portfolio website. You are helpful, friendly, and knowledgeable about Suraj's work.

About Suraj:
- Full Stack Developer specializing in MERN stack (MongoDB, Express, React, Node.js)
- Experienced with modern web technologies including React, Next.js, Tailwind CSS, and more
- Passionate about building beautiful, responsive, and performant web applications

You can help visitors with:
- Questions about Suraj's skills, projects, and experience
- General web development questions
- Information about hiring or collaborating with Suraj
- Navigation help on the portfolio website

Keep responses concise (2-3 sentences max) and friendly. If you don't know something specific about Suraj, suggest the visitor check the relevant page or use the contact form.`;

// @desc    Chat with AI assistant
// @route   POST /api/chat
// @access  Public
const chatWithAI = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  // Rate limiting
  const clientIp = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(clientIp)) {
    res.status(429);
    throw new Error('Too many requests. Please wait a moment before sending another message.');
  }

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    // Fallback responses when API key is not configured
    const fallbackResponses = [
      "Thanks for your message! I'm Suraj's portfolio assistant. While the AI service is being configured, feel free to explore the portfolio or use the contact form to reach out directly.",
      "Hi there! The AI chat is currently in setup mode. You can browse Suraj's projects, skills, and experience using the navigation above, or send a message through the contact page.",
      "Welcome! I'm not fully connected yet, but you can learn about Suraj by visiting the About, Projects, and Skills pages. For direct inquiries, please use the Contact form.",
    ];
    
    return res.json({
      reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      fallback: true,
    });
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Sorry, I could not process that.';

    res.json({ reply, fallback: false });
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    
    // Fallback gracefully since the API key might be expired or out of credits
    const fallbackResponses = [
      "Thanks for your message! The AI service is currently unavailable, but please feel free to explore the portfolio or use the contact form to reach out directly.",
      "Hi there! The AI chat is experiencing some technical difficulties. You can browse Suraj's projects, skills, and experience using the navigation above, or send a message through the contact page.",
      "Welcome! I'm having trouble reaching the AI brain right now, but you can learn about Suraj by visiting the About, Projects, and Skills pages. For direct inquiries, please use the Contact form.",
    ];
    
    res.json({
      reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      fallback: true,
    });
  }
});

export { chatWithAI };
