
function getOfflineResponse(userPrompt) {
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
}

export async function chatWithAssistant(prompt) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      let errorMessage = `Server responded with status: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorMessage = `Server Error (${response.status}): ${errData.error}${errData.message ? ' - ' + errData.message : ''}`;
        }
      } catch (e) {
        // Fallback to text if not JSON
        try {
          const errText = await response.text();
          if (errText) {
            errorMessage += ` - ${errText}`;
          }
        } catch (_) {}
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Assistant Error (falling back to client-side smart response):", error);
    console.warn("TIP: If you are running locally in VS Code, make sure you ran the backend Express server (node server.js or npm run dev) on port 3000, and open http://localhost:3000 to avoid proxy errors.");
    return getOfflineResponse(prompt);
  }
}
