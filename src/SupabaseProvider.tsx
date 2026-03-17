import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { Session, User } from '@supabase/supabase-js';
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

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  isAuthReady: boolean;
  projects: Project[];
  services: Service[];
  certificates: Certificate[];
  messages: Message[];
  settings: Settings | null;
  chatMessages: any[];
  refreshData: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isAuthReady: false,
  projects: [],
  services: [],
  certificates: [],
  messages: [],
  settings: null,
  chatMessages: [],
  refreshData: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshData = useCallback(async () => {
    console.log('Fetching data...');
    const { data: projectsData } = await supabase.from('projects').select('*');
    setProjects(projectsData || []);

    const { data: servicesData } = await supabase.from('services').select('*');
    setServices(servicesData || []);

    const { data: certificatesData } = await supabase.from('certificates').select('*');
    setCertificates(certificatesData || []);

    const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
    if (settingsData) {
      setSettings(settingsData as Settings);
    } else {
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
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    refreshData();

    // Real-time subscriptions
    const projectsSub = supabase.channel('projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, refreshData).subscribe();
    const servicesSub = supabase.channel('services').on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, refreshData).subscribe();
    const certsSub = supabase.channel('certificates').on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, refreshData).subscribe();
    const settingsSub = supabase.channel('settings').on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, refreshData).subscribe();

    if (user) {
      const messagesSub = supabase.channel('messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, refreshData).subscribe();
      const chatSub = supabase.channel('chat_messages').on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, refreshData).subscribe();
      return () => {
        projectsSub.unsubscribe();
        servicesSub.unsubscribe();
        certsSub.unsubscribe();
        settingsSub.unsubscribe();
        messagesSub.unsubscribe();
        chatSub.unsubscribe();
      };
    }

    return () => {
      projectsSub.unsubscribe();
      servicesSub.unsubscribe();
      certsSub.unsubscribe();
      settingsSub.unsubscribe();
    };
  }, [user, isAuthReady, refreshData]);

  return (
    <SupabaseContext.Provider value={{ user, session, isAuthReady, projects, services, certificates, messages, settings, chatMessages, refreshData }}>
      {children}
    </SupabaseContext.Provider>
  );
};
