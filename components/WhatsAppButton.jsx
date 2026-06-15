import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phone = "923214576734";

  const message =
    "Hey🖐, I am looking to develop a high-performance website for my business. Let's connect to discuss our project requirements and timeline.";

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 group flex items-center 
      bg-gradient-to-r from-indigo-600 to-pink-400 hover:bg-indigo-500
      text-white 
      px-4 py-3 md:px-5 
      rounded-full 
      shadow-lg shadow-indigo-600/30
      transition-all duration-300 hover:scale-105
      hover:shadow-indigo-500/40"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle
        size={20}
        className="transition-transform duration-300 group-hover:rotate-12"
      />

      <span className="hidden md:inline text-sm font-semibold ml-2">
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
