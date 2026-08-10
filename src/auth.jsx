import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './lib/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext({ user: null, session: null, isLoaded: false });

export const ClerkProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Firebase doesn't use the same session object as Supabase, but we can set session to currentUser for compatibility if needed.
      setSession(currentUser ? { user: currentUser } : null);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const { user, isLoaded } = useContext(AuthContext);
  return {
    user: user ? {
      primaryEmailAddress: { emailAddress: user.email },
      fullName: user.displayName || 'Anonymous User',
      id: user.uid,
      imageUrl: user.photoURL || null
    } : null,
    isSignedIn: !!user,
    isLoaded
  };
};

export const UserButton = () => {
  const { user } = useContext(AuthContext);
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return null;

  return (
    <div 
      onClick={handleLogout}
      className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm"
      title="Click to log out"
    >
      {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
    </div>
  );
};
