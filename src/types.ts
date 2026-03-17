export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Certificate {
  id: string;
  title: string;
  image_url: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: 'pending' | 'processing' | 'declined' | 'done';
  contract_url?: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
}
