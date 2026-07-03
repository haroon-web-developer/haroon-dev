import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc
} from "firebase/firestore";
import { projects as defaultProjects } from "../components/projectsData";

const LOCAL_STORAGE_KEY = "haroon_portfolio_projects";

// Helper to seed localStorage if empty
const getLocalProjects = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing local projects, resetting to defaults", e);
    }
  }
  // If empty or corrupted, seed and store
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProjects));
  return defaultProjects;
};

const saveLocalProjects = (projects) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
};

export const projectsService = {
  // Get all projects, with automated seeding for Firestore
  async getProjects() {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (list.length === 0) {
          console.log("Firestore projects collection is empty. Auto-seeding with premium defaults...");
          // Seed the database with default projects
          const seedPromises = defaultProjects.map(async (p) => {
            const { id, ...dataWithoutId } = p;
            // Use setDoc with a stringified/original ID, or addDoc
            await setDoc(doc(db, "projects", id), dataWithoutId);
            return { id, ...dataWithoutId };
          });
          const seeded = await Promise.all(seedPromises);
          return seeded;
        }

        return list;
      } catch (error) {
        console.error("Firestore fetch error, falling back to localStorage:", error);
        return getLocalProjects();
      }
    } else {
      return getLocalProjects();
    }
  },

  // Add new project
  async addProject(project) {
    const newProject = {
      ...project,
      featured: project.featured || false,
      tags: Array.isArray(project.tags) ? project.tags : project.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, "projects"), newProject);
        return {
          id: docRef.id,
          ...newProject
        };
      } catch (error) {
        console.error("Firestore add error:", error);
        throw error;
      }
    }

    // Local Storage Fallback
    const local = getLocalProjects();
    const id = Date.now().toString();
    const created = { id, ...newProject };
    local.push(created);
    saveLocalProjects(local);
    return created;
  },

  // Update an existing project
  async updateProject(id, updatedFields) {
    const updatedData = {
      ...updatedFields,
      tags: Array.isArray(updatedFields.tags) 
        ? updatedFields.tags 
        : updatedFields.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (db) {
      try {
        const docRef = doc(db, "projects", id);
        await updateDoc(docRef, updatedData);
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
        return id;
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
