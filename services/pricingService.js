import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LOCAL_STORAGE_KEY = "haroon_portfolio_pricing";

const defaultPricing = {
  projectTypes: [
    {
      id: "landing",
      name: "High-Converting Landing Page",
      basePrice: 199,
      baseDays: 5,
      icon: "Zap",
      description: "Perfect for small businesses, products, or service providers looking to generate instant leads."
    },
    {
      id: "mern",
      name: "MERN Full-Stack WebApp",
      basePrice: 599,
      baseDays: 14,
      icon: "Laptop",
      description: "Custom database applications, client management portals, or software products built from scratch."
    },
    {
      id: "ecommerce",
      name: "Conversion E-Commerce Store",
      basePrice: 399,
      baseDays: 8,
      icon: "ShoppingBag",
      description: "A beautiful shopping platform optimized to sell with checkout flows, filtering, and WhatsApp fast orders."
    },
    {
      id: "figma",
      name: "Figma to React Code",
      basePrice: 149,
      baseDays: 3,
      icon: "PenTool",
      description: "Pixel-perfect translation of your static design drawings into premium responsive Tailwind components."
    }
  ],
  features: [
    { id: "auth", name: "User Authentication", price: 99, days: 2, desc: "Secure sign-ins, profile control, and passwords" },
    { id: "payment", name: "Stripe & Payment Gateway", price: 149, days: 3, desc: "Accept credit card payments and secure checkout" },
    { id: "database", name: "Cloud Database Integration", price: 120, days: 2, desc: "Firestore or Cloud SQL database for persistent data storage" },
    { id: "chat", name: "AI Chatbot or Messaging", price: 199, days: 3, desc: "Gemini AI assistant to guide and answer user inquiries" },
    { id: "seo", name: "Premium SEO & Schema Setup", price: 79, days: 1, desc: "JSON-LD rich metadata injection to rank #1 on Google" },
    { id: "multilang", name: "Multi-Language Support", price: 99, days: 2, desc: "Support international audiences with full translations" }
  ]
};

const getLocalPricing = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing local pricing, resetting to defaults", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultPricing));
  return defaultPricing;
};

const saveLocalPricing = (pricing) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pricing));
};

export const pricingService = {
  async getPricing() {
    if (db) {
      try {
        const docRef = doc(db, "pricing", "config");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          if (auth && auth.currentUser) {
            console.log("Pricing config doc does not exist in Firestore. Auto-seeding defaults...");
            await setDoc(docRef, defaultPricing);
            return defaultPricing;
          } else {
            console.log("Pricing config doc does not exist in Firestore. Public visitor - returning default local pricing.");
            return getLocalPricing();
          }
        }
      } catch (error) {
        console.warn("Firestore pricing fetch error, falling back to localStorage:", error.message || error);
        return getLocalPricing();
      }
    } else {
      return getLocalPricing();
    }
  },

  async updatePricing(updatedPricing) {
    if (db) {
      try {
        const docRef = doc(db, "pricing", "config");
        await setDoc(docRef, updatedPricing);
        return updatedPricing;
      } catch (error) {
        console.error("Firestore pricing update error:", error);
        throw error;
      }
    }

    saveLocalPricing(updatedPricing);
    return updatedPricing;
  }
};
