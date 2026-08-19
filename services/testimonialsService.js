import { db, auth } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc
} from "firebase/firestore";

const LOCAL_STORAGE_KEY = "haroon_portfolio_testimonials";

const defaultTestimonials = [
  {
    id: "test_1",
    name: "Hamza Tariq",
    role: "Founder, Islamabad Retail Collective (Sector F-11)",
    text: "Haroon-Dev built an excellent custom e-commerce website for my business in Islamabad. He integrated Bank Alfalah and JazzCash gateways with sub-0.8s load speeds. Our online orders tripled in the first month. Best web developer in Islamabad!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    location: "Sector F-11, Islamabad",
    projectType: "Custom E-Commerce & Payment Gateway"
  },
  {
    id: "test_2",
    name: "Daniyal Malik",
    role: "Managing Director, Apex Property Group (Blue Area, Islamabad)",
    text: "Top-rated freelance web developer in Islamabad. Haroon re-engineered our Blue Area corporate real estate portal with React, Node.js, and local Google SEO schema. We now rank #1 on Google for commercial real estate in Islamabad.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    location: "Blue Area, Islamabad",
    projectType: "Corporate Portal & Local SEO"
  },
  {
    id: "test_3",
    name: "Dr. Ayesha Siddiqui",
    role: "Director, Islamabad Aesthetics & Dental Clinic (Sector F-7)",
    text: "Haroon is hands down the best React and MERN stack developer in Islamabad. He converted our complex Figma design into a pixel-perfect patient booking portal with SMS notifications. In-person coordination in Islamabad was seamless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    location: "Sector F-7, Islamabad",
    projectType: "Figma to React & Booking Engine"
  },
  {
    id: "test_4",
    name: "Bilal Ahmed",
    role: "Co-Founder, CloudScale Labs (Bahria Town / DHA Islamabad)",
    text: "Haroon-Dev delivered exceptional MERN stack architecture with 100/100 Lighthouse mobile score. As a tech founder in Islamabad, finding a developer with this level of clean code and reliability is rare. Highly recommended across the Twin Cities.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    location: "DHA / Bahria Town, Islamabad",
    projectType: "SaaS Dashboard & API Infrastructure"
  }
];

const getLocalTestimonials = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing local testimonials, resetting to defaults", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultTestimonials));
  return defaultTestimonials;
};

const saveLocalTestimonials = (testimonials) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(testimonials));
};

export const testimonialsService = {
  async getTestimonials() {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (list.length === 0) {
          if (auth && auth.currentUser) {
            console.log("Firestore testimonials collection is empty. Seeding defaults...");
            const seedPromises = defaultTestimonials.map(async (test) => {
              const { id, ...data } = test;
              await setDoc(doc(db, "testimonials", id), data);
              return { id, ...data };
            });
            return await Promise.all(seedPromises);
          } else {
            console.log("Firestore testimonials collection is empty. Public visitor - returning default local testimonials.");
            return getLocalTestimonials();
          }
        }

        return list.sort((a, b) => a.id.localeCompare(b.id));
      } catch (error) {
        console.warn("Firestore testimonials fetch error, falling back to localStorage:", error.message || error);
        return getLocalTestimonials();
      }
    } else {
      return getLocalTestimonials();
    }
  },

  async addTestimonial(testimonial) {
    const formatted = {
      ...testimonial,
      rating: Number(testimonial.rating) || 5
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, "testimonials"), formatted);
        return { id: docRef.id, ...formatted };
      } catch (error) {
        console.error("Firestore add testimonial error:", error);
        throw error;
      }
    }

    const local = getLocalTestimonials();
    const id = "test_" + Date.now();
    const created = { id, ...formatted };
    local.push(created);
    saveLocalTestimonials(local);
    return created;
  },

  async updateTestimonial(id, updatedFields) {
    const formatted = {
      ...updatedFields,
      rating: Number(updatedFields.rating) || 5
    };

    if (db) {
      try {
        const docRef = doc(db, "testimonials", id);
        await setDoc(docRef, formatted, { merge: true });
        return { id, ...formatted };
      } catch (error) {
        console.error("Firestore update testimonial error:", error);
        throw error;
      }
    }

    const local = getLocalTestimonials();
    const idx = local.findIndex(t => t.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...formatted };
      saveLocalTestimonials(local);
      return local[idx];
    }
    throw new Error(`Testimonial with ID ${id} not found.`);
  },

  async deleteTestimonial(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "testimonials", id));
        return id;
      } catch (error) {
        console.error("Firestore delete testimonial error:", error);
        throw error;
      }
    }

    const local = getLocalTestimonials();
    const filtered = local.filter(t => t.id !== id);
    saveLocalTestimonials(filtered);
    return id;
  }
};
