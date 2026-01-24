// src/context/AuthContext.tsx

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, db } from "../services/firebase";

type Role = "admin" | "customer" | null;

type AuthContextValue = {
  user: User | null;
  role: Role;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined); //This creates a global store that will hold:user,role,loading,login,register,logout

async function fetchUserRole(uid: string): Promise<Role> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return "customer";
  const data = snap.data() as { role?: string };
  return data.role === "admin" ? "admin" : "customer";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
        //app starts ,user logs in,user logs out
      //Firebase sends the current user (u)

      setUser(u);//If user is NOT logged in

      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const r = await fetchUserRole(u.uid);
        setRole(r);
      } catch {
        setRole("customer");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          email: cred.user.email,
          role: "customer",
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, role, loading, login, register, logout }),
    [user, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
//“AuthContext is used to manage authentication and authorization globally in my application. 
// It listens to Firebase authentication state changes using onAuthStateChanged. 
// When a user logs in or logs out, the context updates the user state and fetches the user’s role from Firestore. 
// Based on this role, the app controls access to admin-only screens. This approach avoids prop drilling, improves code organization, 
// and ensures secure role-based navigation.”