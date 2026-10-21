
function getOfflineResponse(userPrompt, history = []) {
  const p = (userPrompt || "").toLowerCase().trim();
  const isFollowUp = Array.isArray(history) && history.length > 1;

  if (p.includes("contact") || p.includes("whatsapp") || p.includes("hire") || p.includes("phone") || p.includes("email") || p.includes("reach")) {
    return `You can connect directly with Haroon via WhatsApp or Email—he responds quickly to provide free consultations and project estimates:\n\n* **WhatsApp**: [Chat with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.) (+92 321 4576734)\n* **Email**: haroonashraf.dev@gmail.com\n\nWould you like to schedule a quick discovery chat?`;
  }

  if (p.includes("price") || p.includes("cost") || p.includes("budget") || p.includes("how much") || p.includes("rate") || p.includes("quote") || p.includes("fee")) {
    return `Haroon offers flexible, milestone-based pricing tailored to your specific scope:\n\n* **High-Converting Landing Pages**: Fast turnaround with sub-second performance and animations.\n* **Custom Web Apps & Dashboards**: Full-stack React/MERN architectures.\n* **E-Commerce Solutions**: Fast storefronts with WhatsApp or Stripe checkouts.\n\nTell me a bit about your project requirements, or message Haroon directly on WhatsApp for an instant custom quote:\n\n[Get a Free Quote on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hey%20Haroon%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20my%20web%20project.)`;
  }

  if (p.includes("project") || p.includes("work") || p.includes("portfolio") || p.includes("site") || p.includes("website") || p.includes("example")) {
    return `Here are some of Haroon's top featured builds:\n\n* **[Curated Smart Finds](https://smart-finds.vercel.app/)** — Ultra-fast gadget e-commerce platform.\n* **[Trendwave Store](https://trendwave-store.vercel.app/)** — Modern apparel storefront with 1-click WhatsApp checkout.\n* **[E-Learning Hub SaaS](https://lms-wqmc.vercel.app/)** — LMS SaaS with automated certificate generation.\n* **[Bukhari Farms Portal](https://bukhari-farm.vercel.app/)** — Agricultural operations and sales ledger platform.\n\nAre you looking to build an online store, SaaS application, or a landing page?`;
  }

  if (p.includes("speed") || p.includes("performance") || p.includes("fast") || p.includes("seo") || p.includes("0.8")) {
    return `Haroon specializes in ultra-fast web experiences with sub-second page loads (< 0.8s) and 95+ PageSpeed scores.\n\nHe uses modern bundling with Vite, asset compression, and clean SEO architecture to maximize conversion rates and search rankings.\n\nAre you looking to speed up an existing website or build a new high-speed web app?`;
  }

  if (p.includes("skill") || p.includes("tech") || p.includes("stack") || p.includes("react") || p.includes("mern") || p.includes("tailwind") || p.includes("node") || p.includes("mongodb")) {
    return `Haroon’s technical stack is built for modern, high-speed full-stack development:\n\n* **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion\n* **Backend & Database**: Node.js, Express, MongoDB (MERN Stack), REST APIs\n* **Optimization**: Core Web Vitals, SEO, mobile-first responsive architecture\n\nDo you have specific tech stack preferences for your project?`;
  }

  if (p.includes("hi") || p.includes("hello") || p.includes("hey") || p.includes("greetings") || p.includes("who are you")) {
    if (isFollowUp) {
      return `Hey! Glad to continue our conversation. What else can I help you explore regarding Haroon's web development work?`;
    }
    return `Hello! I'm Haroon's AI representative. Haroon is a front-end and full-stack web developer specializing in ultra-fast React websites, high-converting landing pages, and MERN stack apps.\n\nHow can we help your business today? Feel free to ask about his work, skills, or getting a project quote!`;
  }

  return `That sounds like a great project! Haroon specializes in creating custom, high-performance web solutions built specifically to drive real business growth.\n\nCould you share a few details about your desired features or launch timeline? You can also connect with Haroon directly on WhatsApp for a quick consultation:\n\n[Chat with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%20would%20like%20to%20discuss%20a%20project.)`;
}

export async function chatWithAssistant(prompt, history = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      let errorMessage = `Server responded with status: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorMessage = `Server Error (${response.status}): ${errData.error}${errData.message ? ' - ' + errData.message : ''}`;
        }
      } catch (e) {
        try {
          const errText = await response.text();
          if (errText) errorMessage += ` - ${errText}`;
        } catch (_) {}
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.warn("Assistant falling back to contextual smart response:", error?.message || error);
    return getOfflineResponse(prompt, history);
  }
}

