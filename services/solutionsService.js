import { db, auth } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from "firebase/firestore";

const LOCAL_STORAGE_KEY = "haroon_portfolio_solutions";

const defaultSolutions = [
  {
    id: "sol_1",
    title: "Website Development",
    tagline: "MODERN FULL-STACK ENGINEERING",
    description: "End-to-end, dynamic web applications engineered with MERN Stack (MongoDB, Express, React, and Node.js) or custom frontend architectures. Tailored for automated workflows, robust cloud dashboards, and high security.",
    icon: "Cpu",
    benefits: ["MERN Stack Applications", "Custom Admin Dashboards", "Secure Auth integrations"],
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/10 hover:border-indigo-500/30"
  },
  {
    id: "sol_2",
    title: "Social Media Marketing",
    tagline: "HIGH-CONVERSION ENGAGEMENT",
    description: "Supercharge your brand presence across modern digital platforms. We craft strategic target campaigns, high-impact asset designs, and audience funnels optimized for maximum organic conversion.",
    icon: "Megaphone",
    benefits: ["Targeted Campaign Setup", "Conversion Funnel Optimization", "Audience Growth Tracking"],
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/10 hover:border-rose-500/30"
  },
  {
    id: "sol_3",
    title: "Figma to React / Tailwind",
    tagline: "PIXEL-PERFECT FIDELITY",
    description: "Transforming high-fidelity static Figma drafts into flawless, production-ready, interactive web components. Completely responsive and semantic.",
    icon: "Layout",
    benefits: ["Clean Modular Elements", "Stunning Framer Motion", "Adaptive Grid layouts"],
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/10 hover:border-amber-500/30"
  },
  {
    id: "sol_4",
    title: "Lighthouse Speed & SEO Audit",
    tagline: "ORGANIC SCALE ENGINE",
    description: "Boost your search engine visibility. We optimize loading speeds under 0.8s, inject deep JSON-LD metadata schema markups, and configure clean indexability maps.",
    icon: "Globe",
    benefits: ["99+ Performance Scores", "Rich Snippets & Meta", "Fast CDN & Asset Delivery"],
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10 hover:border-emerald-500/30"
  }
];

const getLocalSolutions = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const hasOldData = parsed.some(s => s.title === "MERN Stack Applications" || s.title === "Custom E-Commerce Storefronts");
      if (hasOldData) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing local solutions, resetting to defaults", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSolutions));
  return defaultSolutions;
};

const saveLocalSolutions = (solutions) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(solutions));
};

export const solutionsService = {
  async getSolutions() {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "solutions"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (list.length === 0) {
          if (auth && auth.currentUser) {
            console.log("Firestore solutions collection is empty. Seeding defaults...");
            const seedPromises = defaultSolutions.map(async (sol) => {
              const { id, ...data } = sol;
              await setDoc(doc(db, "solutions", id), data);
              return { id, ...data };
            });
            return await Promise.all(seedPromises);
          } else {
            console.log("Firestore solutions collection is empty. Public visitor - returning default local solutions.");
            return getLocalSolutions();
          }
        }

        return list.sort((a, b) => a.id.localeCompare(b.id));
      } catch (error) {
        console.warn("Firestore solutions fetch error, falling back to localStorage:", error.message || error);
        return getLocalSolutions();
      }
    } else {
      return getLocalSolutions();
    }
  },

  async getSolution(id) {
    if (db) {
      try {
        const docRef = doc(db, "solutions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
      } catch (error) {
        console.warn("Firestore getSolution error, falling back to local list:", error);
      }
    }
    const local = getLocalSolutions();
    const found = local.find(s => s.id === id);
    if (found) return found;
    throw new Error(`Solution with ID ${id} not found.`);
  },

  async addSolution(solution) {
    const formatted = {
      ...solution,
      benefits: Array.isArray(solution.benefits) 
        ? solution.benefits 
        : solution.benefits.split(",").map(b => b.trim()).filter(Boolean)
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, "solutions"), formatted);
        return { id: docRef.id, ...formatted };
      } catch (error) {
        console.error("Firestore add solution error:", error);
        throw error;
      }
    }

    const local = getLocalSolutions();
    const id = "sol_" + Date.now();
    const created = { id, ...formatted };
    local.push(created);
    saveLocalSolutions(local);
    return created;
  },

  async updateSolution(id, updatedFields) {
    const formatted = {
      ...updatedFields,
      benefits: Array.isArray(updatedFields.benefits) 
        ? updatedFields.benefits 
        : updatedFields.benefits.split(",").map(b => b.trim()).filter(Boolean)
    };

    if (db) {
      try {
        const docRef = doc(db, "solutions", id);
        await setDoc(docRef, formatted, { merge: true });
        return { id, ...formatted };
      } catch (error) {
        console.error("Firestore update solution error:", error);
        throw error;
      }
    }

    const local = getLocalSolutions();
    const idx = local.findIndex(s => s.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...formatted };
      saveLocalSolutions(local);
      return local[idx];
    }
    throw new Error(`Solution with ID ${id} not found.`);
  },

  async deleteSolution(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "solutions", id));
        return id;
      } catch (error) {
        console.error("Firestore delete solution error:", error);
        throw error;
      }
    }

    const local = getLocalSolutions();
    const filtered = local.filter(s => s.id !== id);
    saveLocalSolutions(filtered);
    return id;
  }
};
