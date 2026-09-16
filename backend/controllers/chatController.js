import asyncHandler from 'express-async-handler';
import Profile from '../models/Profile.js';
import Certification from '../models/Certification.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import BlogPost from '../models/BlogPost.js';

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window

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

// Portfolio context system prompt builder with full dynamic data
const getSystemPrompt = ({ profile, certs = [], projects = [], skills = [], experiences = [], blogs = [] }) => {
  const name = profile?.hero?.fullName || 'Suraj Prakash';
  const tagline = profile?.hero?.tagline || 'Building scalable, modern, and high-performance applications.';
  const roles = profile?.hero?.roles?.join(', ') || 'Full Stack Developer, Cloud Engineer';
  const shortDesc = profile?.hero?.shortDescription || '';
  const email = profile?.socials?.email || 'contact@example.com';
  const github = profile?.socials?.githubUrl || 'https://github.com';
  const linkedin = profile?.socials?.linkedinUrl || 'https://linkedin.com';
  const twitter = profile?.socials?.twitterUrl || '';

  const aboutParagraphs = [
    profile?.about?.paragraph1,
    profile?.about?.paragraph2,
    profile?.about?.paragraph3,
  ].filter(Boolean).join(' ');

  const quickInfo = profile?.about?.quickInfo
    ? `Location: ${profile.about.quickInfo.location || 'Remote/India'}, Education: ${profile.about.quickInfo.education || ''}, Experience: ${profile.about.quickInfo.experience || ''}`
    : '';

  // Certifications list
  const certsList = certs.length > 0
    ? certs.map((c, i) => `${i + 1}. "${c.name}" issued by ${c.issuer} (${c.issueDate || 'N/A'})${c.credentialId ? ` [Credential ID: ${c.credentialId}]` : ''}${c.credentialUrl ? ` [URL: ${c.credentialUrl}]` : ''}`).join('\n')
    : 'No individual certifications loaded yet.';

  // Projects list
  const projectsList = projects.length > 0
    ? projects.map((p, i) => `${i + 1}. "${p.title}": ${p.description || ''} | Tech Stack: ${(p.techStack || []).join(', ')}${p.link ? ` | Live: ${p.link}` : ''}${p.githubLink ? ` | GitHub: ${p.githubLink}` : ''}`).join('\n')
    : 'Full-stack applications built using MERN and modern cloud platforms.';

  // Work experience & Education
  const workList = experiences.filter(e => e.type === 'work').map((e, i) => 
    `${i + 1}. Role: ${e.role} at ${e.company} (${e.duration}) - ${e.location || 'Remote'}${e.employmentType ? ` [${e.employmentType}]` : ''}: ${e.description || ''} (Skills: ${(e.skills || []).join(', ')})`
  ).join('\n') || 'Full Stack development experience building production-grade web applications.';

  const eduList = experiences.filter(e => e.type === 'education').map((e, i) => 
    `${i + 1}. ${e.role || e.degree || 'Degree'} from ${e.company} (${e.duration})${e.grade ? ` - Grade/Score: ${e.grade}` : ''}${e.description ? ` - ${e.description}` : ''}`
  ).join('\n') || 'Computer Science & Engineering degree.';

  // Skills grouped
  const skillsByCategory = {};
  skills.forEach(s => {
    const cat = s.category || 'General';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(`${s.name}${s.level ? ` (${s.level}%)` : ''}`);
  });
  const skillsList = Object.keys(skillsByCategory).length > 0
    ? Object.entries(skillsByCategory).map(([cat, list]) => `- ${cat}: ${list.join(', ')}`).join('\n')
    : 'MERN Stack (MongoDB, Express, React, Node.js), JavaScript, TypeScript, Python, Tailwind CSS, Docker, AWS, Git';

  // Blogs list
  const blogsList = blogs.length > 0
    ? blogs.map((b, i) => `${i + 1}. "${b.title}": ${b.excerpt || ''} (Tags: ${(b.tags || []).join(', ')})`).join('\n')
    : '';

  return `You are the friendly, intelligent AI Portfolio Assistant for ${name}'s personal portfolio website.
Your mission is to represent ${name} with high accuracy, warmth, and professionalism to visitors, recruiters, and clients.

IDENTITY RULES:
- When asked "who are you", "what is your name", or similar identity questions: State clearly that you are ${name}'s AI Portfolio Assistant. You are an AI assistant helping visitors learn about ${name}.
- When asked about ${name}, talk in the third person ("Suraj is...", "He specializes in...").
- When asked about certifications, projects, skills, education, or work history, ALWAYS answer with the exact, rich details from the data below! Never say you don't have the certifications or details because they are fully provided below.
- Keep responses engaging, accurate, and neatly structured with bullet points or bold text where appropriate.

=== REAL PORTFOLIO DATA FOR ${name.toUpperCase()} ===

1. PROFILE & BIO:
- Full Name: ${name}
- Current Roles: ${roles}
- Tagline: ${tagline}
- Short Summary: ${shortDesc}
- About Details: ${aboutParagraphs}
- Quick Info: ${quickInfo}
- Contact Email: ${email}
- GitHub: ${github}
- LinkedIn: ${linkedin}
${twitter ? `- Twitter/X: ${twitter}` : ''}
- Resume / CV: Available directly on the portfolio via the "Download CV" buttons in the Hero, About, and Experience sections.

2. CERTIFICATIONS & CREDENTIALS:
${certsList}

3. PROJECTS:
${projectsList}

4. WORK EXPERIENCE:
${workList}

5. EDUCATION:
${eduList}

6. SKILLS & TECHNOLOGIES:
${skillsList}

${blogsList ? `7. ARTICLES & BLOGS:\n${blogsList}\n` : ''}

=== RESPONSE GUIDELINES ===
- If asked for all certifications or credentials: List all of them clearly from the Certifications section above with issuer and date.
- If asked for projects: Highlight his key projects with their technologies and brief descriptions.
- If asked about hiring, freelance, or contact: Provide his contact email (${email}) and LinkedIn profile.
- If asked about skills or tech stack: Group them clearly (Frontend, Backend, Database, Cloud/Tools).
- Maintain a helpful, confident, polite, and professional tone at all times.`;
};

// Intelligent portfolio fallback generator when API is unreachable
const getSmartPortfolioReply = (query, { certs = [], projects = [], skills = [], experiences = [], profile = null }) => {
  const lower = query.toLowerCase().trim();
  const name = profile?.hero?.fullName || 'Suraj Prakash';

  // Identity / Name of the assistant
  if (
    lower.includes('your name') ||
    lower.includes("what's your name") ||
    lower.includes('who are you') ||
    lower.includes('who are u') ||
    lower.includes('what are you') ||
    lower === 'name' ||
    lower === 'what is your name'
  ) {
    return `I am ${name}'s AI Portfolio Assistant! 🤖 I'm here to answer any questions about Suraj's projects, certifications, skills, experience, and help you get in touch with him.`;
  }

  // Certifications query
  if (lower.includes('certif') || lower.includes('credential') || lower.includes('license') || lower.includes('degree') || lower.includes('give me all')) {
    if (certs.length > 0) {
      const list = certs.map((c, idx) => `• **${c.name}** - Issued by ${c.issuer}${c.issueDate ? ` (${c.issueDate})` : ''}`).join('\n');
      return `Here are Suraj Prakash's certifications:\n\n${list}\n\nYou can also view full credentials and verifiable links in the Certifications section of the portfolio!`;
    }
    return `Suraj has completed several professional certifications in Full Stack Development, Cloud Computing, and Modern Web Architectures. Please check the Certifications section on this site for direct credential links!`;
  }

  // Projects query
  if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio') || lower.includes('build') || lower.includes('app')) {
    if (projects.length > 0) {
      const list = projects.slice(0, 4).map(p => `• **${p.title}**: ${p.description || ''} (Tech: ${(p.techStack || []).join(', ')})`).join('\n');
      return `Here are some of Suraj's featured projects:\n\n${list}\n\nExplore more details and live demos under the Projects section!`;
    }
    return `Suraj has developed multiple production-grade web applications featuring the MERN stack, secure authentication, and responsive modern UIs. Explore the Projects section for live demos and GitHub repositories!`;
  }

  // Skills query
  if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack') || lower.includes('language') || lower.includes('framework')) {
    if (skills.length > 0) {
      const skillNames = skills.map(s => s.name).slice(0, 15).join(', ');
      return `Suraj is skilled in: ${skillNames}, and more! Visit the Skills section to view his full technical proficiency and tools breakdown.`;
    }
    return `Suraj specializes in Full Stack development with the MERN stack (MongoDB, Express, React, Node.js), JavaScript, TypeScript, Tailwind CSS, RESTful APIs, and cloud deployments.`;
  }

  // Experience / Education
  if (lower.includes('experience') || lower.includes('background') || lower.includes('education') || lower.includes('college') || lower.includes('job') || lower.includes('company')) {
    if (experiences.length > 0) {
      const list = experiences.slice(0, 3).map(e => `• **${e.role}** at **${e.company}** (${e.duration}): ${e.description || ''}`).join('\n');
      return `Here is a summary of Suraj's background:\n\n${list}\n\nVisit the Experience & Education section for his complete timeline!`;
    }
    return `Suraj has solid hands-on experience building scalable web apps and designing clean architectures. Check out the Experience & Education section for detailed timelines.`;
  }

  // Contact / Hire
  if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('reach') || lower.includes('message') || lower.includes('call')) {
    const email = profile?.socials?.email || 'surajprak201@gmail.com';
    return `You can reach Suraj directly via email at **${email}**, or connect through LinkedIn and GitHub. You can also send a message right here using the Contact page!`;
  }

  // Resume / CV
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('download')) {
    return `You can download Suraj's latest resume directly by clicking the **"Download CV"** button available on the Home page, About section, and Experience section!`;
  }

  // Dynamic answer request
  if (lower.includes('dynamic') || lower.includes('detail') || lower.includes('tell me more')) {
    const roles = profile?.hero?.roles?.join(', ') || 'Full Stack Developer';
    return `Suraj Prakash is a ${roles} with expertise in building modern, scalable web applications. He has ${projects.length} showcase projects and ${certs.length} verified certifications. Ask me about his projects, skills, certifications, work experience, or how to contact him!`;
  }

  // Greetings
  if (
    lower.includes('hi') ||
    lower.includes('hello') ||
    lower.includes('hey') ||
    lower.startsWith('yo') ||
    lower.includes('good morning') ||
    lower.includes('good evening')
  ) {
    return `Hello! 👋 I'm Suraj's AI Portfolio Assistant. I can share details about his certifications, projects, work experience, skills, or how to get in touch. What would you like to explore?`;
  }

  if (lower.includes('thanks') || lower.includes('thank you')) {
    return `You're very welcome! Let me know if you need any other information about Suraj or his work. 😊`;
  }

  return `Suraj Prakash is a passionate Full Stack Developer focused on building clean, performant web applications. You can ask me about his certifications, projects, skills, work experience, or reach out to him directly via the Contact section!`;
};

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
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    res.status(429);
    throw new Error('Too many requests. Please wait a moment before sending another message.');
  }

  // Fetch all portfolio data concurrently for rich, real-time dynamic context
  let portfolioData = {
    profile: null,
    certs: [],
    projects: [],
    skills: [],
    experiences: [],
    blogs: []
  };

  try {
    const [profileRes, certsRes, projectsRes, skillsRes, expRes, blogsRes] = await Promise.allSettled([
      Profile.findOne().lean(),
      Certification.find({}).sort({ issueDate: -1 }).lean(),
      Project.find({}).sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find({}).sort({ category: 1, order: 1 }).lean(),
      Experience.find({}).sort({ createdAt: -1 }).lean(),
      BlogPost.find({ published: true }).select('title excerpt tags slug').sort({ createdAt: -1 }).limit(10).lean()
    ]);

    if (profileRes.status === 'fulfilled' && profileRes.value) portfolioData.profile = profileRes.value;
    if (certsRes.status === 'fulfilled' && certsRes.value) portfolioData.certs = certsRes.value;
    if (projectsRes.status === 'fulfilled' && projectsRes.value) portfolioData.projects = projectsRes.value;
    if (skillsRes.status === 'fulfilled' && skillsRes.value) portfolioData.skills = skillsRes.value;
    if (expRes.status === 'fulfilled' && expRes.value) portfolioData.experiences = expRes.value;
    if (blogsRes.status === 'fulfilled' && blogsRes.value) portfolioData.blogs = blogsRes.value;
  } catch (e) {
    console.error('Error querying portfolio database for AI context:', e.message);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key configured, use the smart portfolio responder
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return res.json({
      reply: getSmartPortfolioReply(message, portfolioData),
      fallback: true,
    });
  }

  const systemPrompt = getSystemPrompt(portfolioData);

  // Format contents for Gemini API:
  // Must strictly alternate user -> model -> user -> model and start with user
  const contents = [];
  let expecting = 'user';

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (!msg || !msg.content || typeof msg.content !== 'string') continue;
      const role = msg.role === 'user' ? 'user' : 'model';
      if (role === expecting) {
        contents.push({
          role,
          parts: [{ text: msg.content.trim() }]
        });
        expecting = expecting === 'user' ? 'model' : 'user';
      }
    }
  }

  // If last item in history is a user turn, pop it so the current message replaces it
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents.pop();
  }

  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    // Use gemini-2.5-flash for real-time generative responses
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: contents.slice(-10), // Keep rich conversation context
        generationConfig: {
          maxOutputTokens: 500, // Sufficient tokens to list all certifications or projects
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errDetail = await response.text();
      console.error(`Gemini API responded with error ${response.status}:`, errDetail);
      throw new Error(`Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error('No text generated by Gemini model');
    }

    return res.json({ reply, fallback: false });
  } catch (error) {
    console.error('Chat AI Error:', error.message);
    // Intelligent fallback so visitor always gets an accurate dynamic answer
    return res.json({
      reply: getSmartPortfolioReply(message, portfolioData),
      fallback: true,
    });
  }
});

export { chatWithAI };

