
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;   
  details?: string;  
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'learning';
  level: number; // 0-100
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
