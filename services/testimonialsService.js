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
    name: "Faiza K.",
    role: "Owner, Faiza's Luxury Beauty Salon",
    text: "Working with this agency was a total game-changer. Our online treatment bookings and inquiries increased by 40% in just two weeks thanks to the custom, highly aesthetic inquiry funnel designed for us.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test_2",
    name: "Mohammad Bukhari",
    role: "Founder, Bukhari Goat Farms",
    text: "Our livestock agribusiness went from local status to receiving inquiries from all over the country. The platform is robust, extremely responsive, and loads instantly on mobile which is vital for agricultural buyers.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test_3",
    name: "Alex Thorne",
    role: "Product Manager, Curated Smart Finds",
    text: "The speed and performance improvements were remarkable. Haroon delivered a Lighthouse-perfect storefront that feels incredibly smooth. Bounce rates went down by 30% almost immediately.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
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
