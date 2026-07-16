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

const LOCAL_STORAGE_KEY = "haroon_portfolio_stats";

const defaultStats = [
  {
    id: "stat_1",
    value: "120+",
    label: "Projects Completed",
    description: "Custom web applications, e-commerce stores, and high-converting marketing landing pages.",
    icon: "Trophy",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "stat_2",
    value: "20+",
    label: "Businesses Scaled",
    description: "Partnerships with small businesses, SaaS startups, and service providers to drive real leads.",
    icon: "Users",
    color: "from-rose-500 to-pink-500"
  },
  {
    id: "stat_3",
    value: "<0.8s",
    label: "Page Load Speeds",
    description: "Engineered for rapid interactions, keeping bounce rates low and conversions maximum.",
    icon: "Zap",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "stat_4",
    value: "99%",
    label: "Success Rate",
    description: "Outstanding communication, flawless delivery, and lifetime support reliability.",
    icon: "TrendingUp",
    color: "from-emerald-500 to-teal-500"
  }
];

const getLocalStats = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing local stats, resetting to defaults", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultStats));
  return defaultStats;
};

const saveLocalStats = (stats) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
};

export const statsService = {
  async getStats() {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "stats"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (list.length === 0) {
          if (auth && auth.currentUser) {
            console.log("Firestore stats collection is empty. Seeding defaults...");
            const seedPromises = defaultStats.map(async (stat) => {
              const { id, ...data } = stat;
              await setDoc(doc(db, "stats", id), data);
              return { id, ...data };
            });
            return await Promise.all(seedPromises);
          } else {
            console.log("Firestore stats collection is empty. Public visitor - returning default local stats.");
            return getLocalStats();
          }
        }

        // Sort by id or maintain original order
        return list.sort((a, b) => a.id.localeCompare(b.id));
      } catch (error) {
        console.warn("Firestore stats fetch error, falling back to localStorage:", error.message || error);
        return getLocalStats();
      }
    } else {
      return getLocalStats();
    }
  },

  async addStat(stat) {
    if (db) {
      try {
        const docRef = await addDoc(collection(db, "stats"), stat);
        return { id: docRef.id, ...stat };
      } catch (error) {
        console.error("Firestore add stat error:", error);
        throw error;
      }
    }

    const local = getLocalStats();
    const id = "stat_" + Date.now();
    const created = { id, ...stat };
    local.push(created);
    saveLocalStats(local);
    return created;
  },

  async updateStat(id, updatedFields) {
    if (db) {
      try {
        const docRef = doc(db, "stats", id);
        await setDoc(docRef, updatedFields, { merge: true });
        return { id, ...updatedFields };
      } catch (error) {
        console.error("Firestore update stat error:", error);
        throw error;
      }
    }

    const local = getLocalStats();
    const idx = local.findIndex(s => s.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedFields };
      saveLocalStats(local);
      return local[idx];
    }
    throw new Error(`Stat with ID ${id} not found.`);
  },

  async deleteStat(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "stats", id));
        return id;
      } catch (error) {
        console.error("Firestore delete stat error:", error);
        throw error;
      }
    }

    const local = getLocalStats();
    const filtered = local.filter(s => s.id !== id);
    saveLocalStats(filtered);
    return id;
  }
};
