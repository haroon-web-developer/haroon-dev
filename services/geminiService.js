import { projects as defaultProjects } from "./projectsData";

function getOfflineResponse(userPrompt, history = [], projects = []) {
  const p = (userPrompt || "").toLowerCase().trim();
  const isFollowUp = Array.isArray(history) && history.length > 1;
  const list = (Array.isArray(projects) && projects.length > 0) ? projects : defaultProjects;

  if (p.includes("contact") || p.includes("whatsapp") || p.includes("hire") || p.includes("phone") || p.includes("email") || p.includes("reach")) {
    return `You can connect directly with Haroon via WhatsApp or Email—he responds quickly to provide free consultations and project estimates:\n\n* **WhatsApp**: [Chat with Haroon on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.) (+92 321 4576734)\n* **Email**: haroonashraf.dev@gmail.com\n\nWould you like to schedule a quick discovery chat?`;
  }

  if (p.includes("price") || p.includes("cost") || p.includes("budget") || p.includes("how much") || p.includes("rate") || p.includes("quote") || p.includes("fee")) {
    return `Haroon offers flexible, milestone-based pricing tailored to your specific scope:\n\n* **High-Converting Landing Pages**: Fast turnaround with sub-second performance and animations.\n* **Custom Web Apps & Dashboards**: Full-stack React/MERN architectures.\n* **E-Commerce Solutions**: Fast storefronts with WhatsApp or Stripe checkouts.\n\nTell me a bit about your project requirements, or message Haroon directly on WhatsApp for an instant custom quote:\n\n[Get a Free Quote on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hey%20Haroon%2C%20I%27d%20like%20to%20get%20a%20quote%20for%20my%20web%20project.)`;
  }

  if (p.includes("project") || p.includes("work") || p.includes("portfolio") || p.includes("site") || p.includes("website") || p.includes("example") || p.includes("case study") || p.includes("demo") || p.includes("show me")) {
    let matched = [];
    if (p.includes("salon") || p.includes("beauty") || p.includes("hair")) {
      matched = list.filter(item => (item.category || "").toLowerCase().includes("salon") || (item.title || "").toLowerCase().includes("salon") || (item.title || "").toLowerCase().includes("beauty"));
    } else if (p.includes("ecommerce") || p.includes("e-commerce") || p.includes("store") || p.includes("shop") || p.includes("gadget") || p.includes("cloth")) {
      matched = list.filter(item => (item.category || "").toLowerCase().includes("commerce") || (item.title || "").toLowerCase().includes("store") || (item.title || "").toLowerCase().includes("finds"));
    } else if (p.includes("saas") || p.includes("lms") || p.includes("learn") || p.includes("course") || p.includes("education")) {
      matched = list.filter(item => (item.category || "").toLowerCase().includes("saas") || (item.category || "").toLowerCase().includes("tech") || (item.category || "").toLowerCase().includes("education") || (item.title || "").toLowerCase().includes("learning"));
    } else if (p.includes("farm") || p.includes("agri") || p.includes("goat") || p.includes("livestock")) {
      matched = list.filter(item => (item.category || "").toLowerCase().includes("agri") || (item.title || "").toLowerCase().includes("farm"));
    } else if (p.includes("analytic") || p.includes("dashboard") || p.includes("insight")) {
      matched = list.filter(item => (item.category || "").toLowerCase().includes("analytic") || (item.title || "").toLowerCase().includes("insight") || (item.title || "").toLowerCase().includes("board"));
    }

    const projectsToShow = matched.length > 0 ? matched : list.slice(0, 4);

    const formattedList = projectsToShow.map(proj => {
      const url = proj.link || proj.url || "#projects";
      return `* **[${proj.title}](${url})** (${proj.category || 'Web App'}) — ${proj.description || ''}`;
    }).join("\n");

    return `Here are the real, live projects currently on Haroon's portfolio:\n\n${formattedList}\n\nWould you like more details on any of these, or would you like to discuss building something similar for your business?`;
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

export async function chatWithAssistant(prompt, history = [], projects = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history, projects }),
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
    return getOfflineResponse(prompt, history, projects);
  }
}


