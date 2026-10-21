import { GoogleGenAI } from "@google/genai";

const HAROON_KNOWLEDGE = `
Haroon Ashraf is a talented Front-End and Full-Stack Web Developer & Freelancer specializing in building lightning-fast, high-converting websites and scalable web applications.

KEY CAPABILITIES:
- Frontend: React, TypeScript, Tailwind CSS, Framer Motion, HTML5, Modern CSS, Responsive Mobile-First Design.
- Full-Stack / Backend: Node.js, Express, MongoDB (MERN Stack), REST APIs, Firebase.
- Performance & SEO: Sub-second load speeds (< 0.8s), 95+ Google PageSpeed / Core Web Vitals, SEO architecture, asset optimization.
- Custom Web Apps & E-Commerce: High-converting landing pages, SaaS dashboards, e-commerce storefronts with direct WhatsApp checkout or Stripe integration.

PORTFOLIO HIGHLIGHTS:
1. Curated Smart Finds (https://smart-finds.vercel.app/): High-speed gadget e-commerce platform engineered for peak conversions.
2. Trendwave Store (https://trendwave-store.vercel.app/): Modern apparel storefront featuring rapid 1-click WhatsApp order processing.
3. E-Learning Hub SaaS (https://lms-wqmc.vercel.app/): Full-featured LMS platform with automated student certificate generation.
4. Bukhari Farms Portal (https://bukhari-farm.vercel.app/): Modern agricultural inventory and secure sales ledger application.

CONTACT & HIRING DETAILS:
- WhatsApp: +92 321 4576734 (Direct chat: https://api.whatsapp.com/send?phone=923214576734)
- Email: haroonashraf.dev@gmail.com
- Availability: Open for freelance projects, custom web application contracts, website redesigns/speed boosts, and full-time MERN developer roles.
- Collaboration: Works with international clients across US, UK, Middle East, and globally. Offers free consultations and personalized proposals within minutes.
`;

const SYSTEM_INSTRUCTION = `You are "Haroon's Bot", the smart, warm, and highly capable AI Project Consultant on Haroon Ashraf's official portfolio website.

YOUR ROLE & GOALS:
1. Act as a natural, friendly, human-like technical representative. Speak conversationally—like a knowledgeable project manager or lead developer on Haroon's team.
2. Actively listen to what the client tells you. Understand their specific goals (e.g. building an online store, redesigning a sluggish website, launching a SaaS MVP, or exploring tech stacks).
3. Provide genuine, intelligent technical insight rather than generic filler. If they ask about speed, explain how Haroon optimizes assets and code for <0.8s load times. If they ask about e-commerce, discuss UX, fast checkouts, and mobile responsiveness.
4. Multi-turn Memory: Remember details the client provides (their name, project type, timeline, or pain points) across the conversation and refer back to them naturally.
5. ANTI-REPETITION (CRITICAL):
   - Do NOT repeat the same boilerplate sentences or phrases.
   - Do NOT spam the WhatsApp link in every message. Introduce WhatsApp or email when it naturally makes sense—such as when the user asks about pricing, timeline, hiring, getting a quote, or indicates they're ready to start.
   - Vary your wording and tone dynamically.
6. Keep responses concise, structured, and easy to read (typically 2 to 4 sentences or a few crisp bullet points).
7. Format with clean Markdown (bolding for key concepts, bullet lists when comparing features or listing steps).
8. When sharing contact links, use standard markdown:
   [Chat with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.)

Context about Haroon:
${HAROON_KNOWLEDGE}`;

// Intelligent multi-turn offline responder for resilience
function generateContextualOfflineResponse(userPrompt, history = []) {
  const p = (userPrompt || "").toLowerCase().trim();
  const historyText = history.map(h => (h.content || "").toLowerCase()).join(" ");
  const isFollowUp = history.length > 1;

  // Contact / WhatsApp / Hire intent
  if (p.includes("contact") || p.includes("whatsapp") || p.includes("hire") || p.includes("phone") || p.includes("email") || p.includes("talk to haroon") || p.includes("reach")) {
    return `You can reach Haroon directly via WhatsApp or Email—he's active and typically responds within minutes:

* **WhatsApp**: [Chat with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%27d%20like%20to%20discuss%20a%20web%20project.) (+92 321 4576734)
* **Email**: haroonashraf.dev@gmail.com

Would you like him to prepare a customized project proposal or schedule a quick discovery call?`;
  }

  // Pricing / Quote / Cost intent
  if (p.includes("price") || p.includes("cost") || p.includes("budget") || p.includes("how much") || p.includes("rate") || p.includes("quote") || p.includes("fee")) {
    if (historyText.includes("ecommerce") || p.includes("store") || p.includes("shop")) {
      return `For e-commerce platforms, pricing depends on features like product catalog size, custom payment gateways, or 1-click WhatsApp checkout. 

Haroon offers transparent project rates with zero surprise fees. Tell me a bit about your product line or launch timeline, or connect with him directly on WhatsApp for an exact quote:

[Get an Instant Project Quote on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hey%20Haroon%2C%20I%20am%20looking%20for%20a%20quote%20on%20an%20e-commerce%20website.)`;
    }
    return `Haroon provides transparent, milestone-based pricing tailored to your exact project scope:

* **High-Converting Landing Pages**: Fast turnaround with sub-second speeds and custom animations.
* **Custom Web Apps & Portals**: Scalable React/MERN architectures with responsive dashboards.
* **E-Commerce Solutions**: Modern storefronts optimized for maximum sales conversion.

To give you an accurate estimate, what core features or pages do you envision for your site? You can also message Haroon directly on WhatsApp for a fast estimate:

[Discuss Pricing with Haroon](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%27d%20like%20to%20get%20a%20quick%20quote%20for%20a%20web%20project.)`;
  }

  // Portfolio / Projects intent
  if (p.includes("project") || p.includes("portfolio") || p.includes("work") || p.includes("sample") || p.includes("example") || p.includes("case study")) {
    return `Here are four of Haroon's featured production builds:

1. **[Curated Smart Finds](https://smart-finds.vercel.app/)** — Ultra-fast gadget e-commerce store with high-conversion product UX.
2. **[Trendwave Store](https://trendwave-store.vercel.app/)** — Modern fashion storefront with instantaneous 1-click WhatsApp checkout.
3. **[E-Learning Hub SaaS](https://lms-wqmc.vercel.app/)** — Full-stack educational portal with automated certificate generation.
4. **[Bukhari Farms Portal](https://bukhari-farm.vercel.app/)** — Clean agricultural dashboard and secure sales transaction records.

Which type of project aligns closest with what you are looking to build?`;
  }

  // Speed / Performance / SEO intent
  if (p.includes("speed") || p.includes("performance") || p.includes("fast") || p.includes("seo") || p.includes("load") || p.includes("0.8") || p.includes("core web")) {
    return `Haroon engineers every website to achieve **sub-second page load times (< 0.8s)** and 95+ Google PageSpeed scores through:

* **Vite & Modern Bundling**: Ultra-efficient tree-shaking and dynamic code-splitting.
* **Next-Gen Media Delivery**: WebP compression, lazy loading, and responsive image sizing.
* **Semantic SEO & Clean DOM**: Structured schemas and optimized rendering for peak search engine rankings.

Is your current website feeling slow, or are you looking to launch a new high-speed project from scratch?`;
  }

  // Tech stack / Skills intent
  if (p.includes("skill") || p.includes("tech") || p.includes("stack") || p.includes("react") || p.includes("mern") || p.includes("tailwind") || p.includes("node") || p.includes("mongo") || p.includes("typescript")) {
    return `Haroon works with a modern, production-proven tech stack:

* **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, HTML5/CSS3.
* **Backend & Database**: Node.js, Express, MongoDB (MERN Stack), REST APIs, Firebase.
* **Tooling & Workflow**: Vite, Git/GitHub, Vercel, responsive cross-browser testing.

He focuses on clean, maintainable architecture built for long-term scalability. Do you have an existing tech stack in place, or would you like recommendations for your project?`;
  }

  // Greeting / Introduction intent
  if (p.includes("hi") || p.includes("hello") || p.includes("hey") || p.includes("greetings") || p.includes("good morning") || p.includes("good afternoon") || p.includes("who are you")) {
    if (isFollowUp) {
      return `Hey again! Glad to continue chatting. Tell me more about what you'd like to achieve with your website or app.`;
    }
    return `Hello! Welcome to Haroon's portfolio. I'm Haroon's AI representative. 

Haroon is a dedicated web developer specializing in ultra-fast React websites, conversion-driven landing pages, and MERN stack applications.

How can we help your business today? Feel free to ask about his portfolio, technical skills, or request a customized project quote!`;
  }

  // Affirmations or short follow-ups
  if (p === "yes" || p === "sure" || p === "ok" || p === "okay" || p === "sounds good" || p === "tell me more" || p === "cool") {
    return `Awesome! To help us craft the ideal solution, tell me a little about your project goals:

1. What industry or business is this website for?
2. Do you have a preferred timeline or launch target?

Alternatively, feel free to hop on a quick chat with Haroon on WhatsApp:
[Connect with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%20am%20ready%20to%20discuss%20my%20project.)`;
  }

  // Default contextual inquiry
  return `That sounds like an exciting opportunity! Haroon specializes in creating custom, high-performance web solutions built specifically to drive results for clients.

Could you share a few more details about your goals, key features, or reference websites you like? 

If you prefer to discuss details directly with Haroon, he is available right now:
[Chat with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20let%27s%20discuss%20my%20web%20project%20requirements.)`;
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body safely
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { prompt, history = [] } = body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey.trim() === "") {
    return res.status(200).json({ text: generateContextualOfflineResponse(prompt, history) });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Build structured conversation contents from history
    const contents = [];
    
    // Add up to 8 recent history items for rich multi-turn memory without exceeding context
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (!item || !item.content) continue;
        const role = item.role === 'user' ? 'user' : 'model';
        contents.push({
          role: role,
          parts: [{ text: String(item.content) }]
        });
      }
    }

    // Append the current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt.trim() }]
    });

    // Wrap with a comfortable 12s timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Gemini API call timed out")), 12000);
    });

    const apiCallPromise = ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    const text = response.text?.trim() || generateContextualOfflineResponse(prompt, history);

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Error in /api/chat (using contextual fallback):", error?.message || error);
    return res.status(200).json({ text: generateContextualOfflineResponse(prompt, history) });
  }
}

