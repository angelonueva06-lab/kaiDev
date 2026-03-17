import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, getDocs, doc, getDocFromServer } from 'firebase/firestore';
import { Project, Service, Certificate, Message } from './types';

interface Settings {
  hero_name: string;
  hero_title: string;
  hero_bio: string;
  hero_image: string;
  about_title: string;
  about_bio: string;
  about_skills: string;
  about_stack: string;
  resume_url: string;
}

interface FirebaseContextType {
  user: FirebaseUser | null;
  isAuthReady: boolean;
  projects: Project[];
  services: Service[];
  certificates: Certificate[];
  messages: Message[];
  settings: Settings | null;
  chatMessages: any[];
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isAuthReady: false,
  projects: [],
  services: [],
  certificates: [],
  messages: [],
  settings: null,
  chatMessages: [],
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const unsubs: (() => void)[] = [];

    // Public data
    unsubs.push(onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }));

    unsubs.push(onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }));

    unsubs.push(onSnapshot(collection(db, 'certificates'), (snapshot) => {
      setCertificates(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }));

    unsubs.push(onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      } else {
        // Default settings if not found
        setSettings({
          hero_name: "Angelo Nueva",
          hero_title: "Full Stack Developer",
          hero_bio: "I build exceptional and accessible digital experiences for the web.",
          hero_image: "",
          about_title: "About Me",
          about_bio: "I'm a passionate developer with a keen eye for design and a drive for building scalable applications.",
          about_skills: "React, Node.js, TypeScript, Tailwind CSS",
          about_stack: "Frontend, Backend, Database, Cloud",
          resume_url: ""
        });
      }
    }));

    // Admin data
    if (user) {
      unsubs.push(onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snapshot) => {
        setMessages(snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          created_at: d.data().createdAt?.toDate().toISOString() || new Date().toISOString()
        } as any)));
      }));

      unsubs.push(onSnapshot(query(collection(db, 'chat_messages'), orderBy('createdAt', 'desc')), (snapshot) => {
        setChatMessages(snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          created_at: d.data().createdAt?.toDate().toISOString() || new Date().toISOString()
        } as any)));
      }));
    }

    return () => unsubs.forEach(u => u());
  }, [user, isAuthReady]);

  return (
    <FirebaseContext.Provider value={{ user, isAuthReady, projects, services, certificates, messages, settings, chatMessages }}>
      {children}
    </FirebaseContext.Provider>
  );
};
