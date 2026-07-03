import { GoogleGenAI } from "@google/genai";

const HAROON_BIO = `
Haroon is a dedicated Front-end Web Developer and Freelancer with deep expertise in React, Tailwind CSS, and Framer Motion. 
He is currently expanding his skill set into the MERN stack (MongoDB, Express, React, Node.js).
His primary services include:
1. High-performance Landing Pages: Built with React and optimized for conversion.
2. Custom Web Applications: Responsive and interactive SPAs.
3. UI/UX Implementation: Bringing complex designs to life using Framer Motion and modern CSS.
4. Maintenance and Scaling: Optimizing existing web projects.

Stack: React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, JavaScript (ES6+), HTML5, CSS3.
Currently Learning: Node.js, Express, MongoDB.
Approach: Mobile-first, performance-oriented, and user-centric.
Goal: To help businesses grow through better digital experiences and land a full-time MERN stack position.
`;

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

  const { prompt } = body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Robust keyword-based offline responder in case of network/DNS/API key issues
  const getOfflineResponse = (userPrompt) => {
    const p = (userPrompt || "").toLowerCase();
    
    if (p.includes("hi") || p.includes("hello") || p.includes("hey") || p.includes("greetings") || p.includes("who are you") || p.includes("intro")) {
      return `Hello! I am Haroon’s AI representative. He specializes in building high-performance, conversion-focused web applications using React, Tailwind, and the MERN stack.\n\nHow can I help you scale your business today? Feel free to ask about his projects, skills, or contact him directly on WhatsApp!`;
    }
    
    if (p.includes("price") || p.includes("cost") || p.includes("budget") || p.includes("how much") || p.includes("rate") || p.includes("pricing")) {
      return `Haroon can absolutely build a customized solution for your budget and business goals!\n\nHe offers flexible pricing based on the project scope. Let's discuss your exact requirements on WhatsApp—he is online right now and responds within minutes to provide a free consultation and personalized proposal:\n\n[Chat on WhatsApp to Start Your Project](https://api.whatsapp.com/send?phone=923214576734&text=Hey%2C%20I%20am%20looking%20to%20develop%20a%20high-performance%20website%20for%20my%20business.%20Let's%20connect%20to%20discuss%20our%20project%20requirements%20and%20timeline.)`;
    }
    
    if (p.includes("project") || p.includes("work") || p.includes("portfolio") || p.includes("site") || p.includes("website") || p.includes("example")) {
      return `Haroon has built several outstanding, high-performance web projects. Here are some of his highlighted creations:\n\n*   **Curated Smart Finds**: An ultra-fast, conversion-optimized gadget store ([Live Demo](https://smart-finds.vercel.app/))\n*   **Trendwave Store**: A modern clothing storefront featuring instant WhatsApp ordering ([Live Demo](https://trendwave-store.vercel.app/))\n*   **E-Learning Hub SaaS**: A professional full-stack LMS platform with auto-certificate generation ([Live Demo](https://lms-wqmc.vercel.app/))\n*   **Bukhari Farms Portal**: A modern agriculture portal tracking sales logs securely ([Live Demo](https://bukhari-farm.vercel.app/))\n\nWould you like to build something similar? Let's chat on WhatsApp to discuss your project!`;
    }

    if (p.includes("skill") || p.includes("tech") || p.includes("stack") || p.includes("react") || p.includes("mern") || p.includes("tailwind") || p.includes("node") || p.includes("mongodb")) {
      return `Haroon’s professional tech stack is highly optimized for modern, high-speed interfaces and full-stack performance:\n\n*   **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion\n*   **Backend & Database**: Node.js, Express, MongoDB (MERN Stack)\n*   **Conversions & Speed**: Mobile-first designs, SEO boost, and optimized page loads\n\nHe is ready to leverage these skills to build a premium web experience for you. Let's connect on WhatsApp to get started!`;
    }

    if (p.includes("contact") || p.includes("whatsapp") || p.includes("hire") || p.includes("phone") || p.includes("email") || p.includes("connect")) {
      return `You can connect with Haroon directly on WhatsApp! He is active right now and usually responds within minutes to provide a free consultation and customized quote:\n\n[Chat on WhatsApp to Start Your Project](https://api.whatsapp.com/send?phone=923214576734&text=Hey%2C%20I%20am%20looking%20to%20develop%20a%20high-performance%20website%20for%20my%20business.%20Let's%20connect%20to%20discuss%20our%20project%20requirements%20and%20timeline.)`;
    }

    // Default friendly response
    return `Haroon can absolutely build that customized solution for you! Let's discuss your exact goals on WhatsApp. He is online right now and responds within minutes to provide a free consultation and personalized proposal:\n\n[Chat on WhatsApp to Start Your Project](https://api.whatsapp.com/send?phone=923214576734&text=Hey%2C%20I%20am%20looking%20to%20develop%20a%20high-performance%20website%20for%20my%20business.%20Let's%20connect%20to%20discuss%20our%20project%20requirements%20and%20timeline.)`;
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not configured. Falling back to local responder.");
    return res.status(200).json({ text: getOfflineResponse(prompt) });
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  try {
    // Helper to wrap promise with a timeout
    const withTimeout = (promise, ms) => {
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Timeout: Gemini API connection took too long"));
        }, ms);
      });
      return Promise.race([
        promise.then((res) => {
          clearTimeout(timeoutId);
          return res;
        }),
        timeoutPromise
      ]);
    };

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction: `You are Haroon's elite, highly persuasive Personal AI Representative. Your absolute mission is to win client trust, showcase Haroon's skills/projects, and drive them to book a custom project on WhatsApp.

RESPONSE GUIDELINES:
1. **Extremely Short, Concise & Scannable**: Clients dislike long text. Always limit responses to 1-2 punchy sentences or clear, short bullet points.
2. **Explain Skills & Projects Eloquently**: 
   - **Skills**: High-performance React, MERN Stack (Node.js, Express, MongoDB), TypeScript, Tailwind CSS, Framer Motion, and conversions/SEO.
   - **Top Projects**:
     * **Curated Smart Finds**: E-Commerce gadget platform optimized for high-conversions (https://smart-finds.vercel.app/)
     * **Trendwave Store**: Premium clothes boutique with instant WhatsApp ordering (https://trendwave-store.vercel.app/)
     * **E-Learning Hub SaaS**: Full-stack LMS with automated certificate builders (https://lms-wqmc.vercel.app/)
     * **Bukhari Farms Portal**: Modern agriculture portal with secure sales logs (https://bukhari-farm.vercel.app/)
3. **No Sticking / Positive Route**: If you are unsure, have insufficient details, or if the client asks about custom budgets, pricing, or timelines, immediately respond with: "Haroon can absolutely build that customized solution for you! Let's discuss your exact goals on WhatsApp. He is online right now and responds within minutes to provide a free consultation and personalized proposal."
4. **WhatsApp Link**: Always provide this exact link whenever appropriate (e.g. asking about pricing, projects, services, custom quotes, or when stuck):
[Chat on WhatsApp to Start Your Project](https://api.whatsapp.com/send?phone=923214576734&text=Hey%2C%20I%20am%20looking%20to%20develop%20a%20high-performance%20website%20for%20my%20business.%20Let's%20connect%20to%20discuss%20our%20project%20requirements%20and%20timeline.)

Context about Haroon:
${HAROON_BIO}`,
          temperature: 0.6,
          maxOutputTokens: 250,
        },
      }),
      5000 // 5 seconds timeout
    );

    const text = response.text || "I'm sorry, I couldn't process that request.";
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Connection Error or Timeout. Falling back to local smart responder. Error details:", error);
    // If it's a timeout, DNS lookup / network error or any API issue, gracefully serve the offline fallback!
    return res.status(200).json({ text: getOfflineResponse(prompt) });
  }
}
