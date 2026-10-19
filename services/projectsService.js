import { db, auth } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  writeBatch,
  onSnapshot
} from "firebase/firestore";
import { projects as defaultProjects } from "../components/projectsData";

const LOCAL_STORAGE_KEY = "haroon_portfolio_projects";

// Helper to sort projects strictly by their order index
const sortProjectsByOrder = (projects) => {
  return [...projects].sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : 9999;
    const orderB = typeof b.order === "number" ? b.order : 9999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id || "").localeCompare(b.id || "");
  });
};

// Helper to seed localStorage if empty
const getLocalProjects = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sortProjectsByOrder(parsed);
      }
    } catch (e) {
      console.error("Error parsing local projects, resetting to defaults", e);
    }
  }
  // If empty or corrupted, seed and store with sequential order
  const seeded = defaultProjects.map((p, idx) => ({
    ...p,
    order: typeof p.order === "number" ? p.order : idx
  }));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
  return sortProjectsByOrder(seeded);
};

const saveLocalProjects = (projects) => {
  const normalized = sortProjectsByOrder(projects).map((p, idx) => ({
    ...p,
    order: idx
  }));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const projectsService = {
  // Get all projects, sorted by position order
  async getProjects() {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const list = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));

        if (list.length === 0) {
          if (auth && auth.currentUser) {
            console.log("Firestore projects collection is empty. Auto-seeding with ordered defaults...");
            const seedPromises = defaultProjects.map(async (p, idx) => {
              const { id, ...dataWithoutId } = p;
              const payload = { ...dataWithoutId, order: idx };
              await setDoc(doc(db, "projects", id), payload);
              return { id, ...payload };
            });
            const seeded = await Promise.all(seedPromises);
            return sortProjectsByOrder(seeded);
          } else {
            console.log("Firestore projects collection empty. Returning default local projects.");
            return getLocalProjects();
          }
        }

        // Return ordered list
        return sortProjectsByOrder(list);
      } catch (error) {
        console.warn("Firestore fetch error, falling back to localStorage:", error.message || error);
        return getLocalProjects();
      }
    } else {
      return getLocalProjects();
    }
  },

  // Real-time live subscription for portfolio visitors
  subscribeProjects(onUpdate) {
    if (db) {
      try {
        const unsubscribe = onSnapshot(
          collection(db, "projects"),
          (snapshot) => {
            if (!snapshot.empty) {
              const list = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
              }));
              onUpdate(sortProjectsByOrder(list));
            } else {
              onUpdate(getLocalProjects());
            }
          },
          (error) => {
            console.warn("Firestore onSnapshot error, using local fallback:", error);
            onUpdate(getLocalProjects());
          }
        );
        return unsubscribe;
      } catch (err) {
        console.warn("Could not attach Firestore onSnapshot:", err);
      }
    }

    // Fallback if db is unavailable or offline
    onUpdate(getLocalProjects());
    return () => {};
  },

  // Reorder projects (batch update to Firestore and localStorage)
  async reorderProjects(orderedProjects) {
    // 1. Assign strict sequential 0..N order
    const updatedList = orderedProjects.map((proj, idx) => ({
      ...proj,
      order: idx
    }));

    // 2. Save immediately to LocalStorage
    saveLocalProjects(updatedList);

    // 3. Persist to Firestore in an atomic batch
    if (db) {
      try {
        const batch = writeBatch(db);
        updatedList.forEach((proj, idx) => {
          if (proj.id) {
            const docRef = doc(db, "projects", proj.id);
            batch.set(docRef, { order: idx }, { merge: true });
          }
        });
        await batch.commit();
        console.log(`[projectsService] Successfully synced order for ${updatedList.length} projects to Firestore.`);
      } catch (error) {
        console.error("Failed to commit batch reorder to Firestore:", error);
        // Fallback: try individual updates if batch failed
        try {
          await Promise.all(
            updatedList.map(p => 
              setDoc(doc(db, "projects", p.id), { order: p.order }, { merge: true })
            )
          );
        } catch (subErr) {
          console.error("Individual order updates also failed:", subErr);
        }
      }
    }

    return updatedList;
  },

  // Add new project with configurable position ('start' or 'end')
  async addProject(project, position = "end") {
    const existing = await this.getProjects();
    const newOrder = position === "start" ? 0 : existing.length;

    const newProject = {
      ...project,
      order: newOrder,
      featured: project.featured || false,
      tags: Array.isArray(project.tags) 
        ? project.tags 
        : (project.tags || "").split(",").map(t => t.trim()).filter(Boolean),
      createdAt: Date.now()
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, "projects"), newProject);
        const created = {
          id: docRef.id,
          ...newProject
        };

        // If placed at start, bump others and save
        if (position === "start") {
          const reordered = [created, ...existing.filter(p => p.id !== created.id)];
          await this.reorderProjects(reordered);
          return created;
        }

        // Otherwise update local cache
        saveLocalProjects([...existing, created]);
        return created;
      } catch (error) {
        console.error("Firestore add error:", error);
        throw error;
      }
    }

    // Local Storage Fallback
    const local = getLocalProjects();
    const id = Date.now().toString();
    const created = { id, ...newProject };

    let nextLocal;
    if (position === "start") {
      nextLocal = [created, ...local];
    } else {
      nextLocal = [...local, created];
    }
    const saved = saveLocalProjects(nextLocal);
    return saved.find(p => p.id === id) || created;
  },

  // Update an existing project
  async updateProject(id, updatedFields) {
    const updatedData = {
      ...updatedFields,
      tags: Array.isArray(updatedFields.tags) 
        ? updatedFields.tags 
        : (updatedFields.tags || "").split(",").map(t => t.trim()).filter(Boolean),
    };

    if (db) {
      try {
        const docRef = doc(db, "projects", id);
        await setDoc(docRef, updatedData, { merge: true });
        
        // Update local cache
        const local = getLocalProjects();
        const idx = local.findIndex(p => p.id === id);
        if (idx !== -1) {
          local[idx] = { ...local[idx], ...updatedData };
          saveLocalProjects(local);
        }
        return { id, ...updatedData };
      } catch (error) {
        console.error("Firestore update error:", error);
        throw error;
      }
    }

    // Local Storage Fallback
    const local = getLocalProjects();
    const idx = local.findIndex(p => p.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedData };
      saveLocalProjects(local);
      return local[idx];
    }
    throw new Error(`Project with ID ${id} not found in localStorage.`);
  },

  // Delete a project
  async deleteProject(id) {
    if (db) {
      try {
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error("Firestore delete error:", error);
        throw error;
      }
    }

    // Local Storage Fallback
    const local = getLocalProjects();
    const filtered = local.filter(p => p.id !== id);
    saveLocalProjects(filtered);
    return id;
  }
};
