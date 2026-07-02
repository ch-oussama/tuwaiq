"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

// أضف أي إيميلات إدارية جديدة هنا داخل هذه القائمة
export const ADMIN_EMAILS = [
  "tuwaiqstudio2026@gmail.com",
  "godiabout57@gmail.com",
  "kalder.gg@gmail.com"
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  useEffect(() => {
    if (!loading) {
      if (isAdmin) {
        document.cookie = 'admin_auth=true; path=/; max-age=86400';
      } else {
        document.cookie = 'admin_auth=; path=/; max-age=0';
      }
    }
  }, [isAdmin, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
