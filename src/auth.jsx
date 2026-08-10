import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const AuthContext = createContext({ user: null, session: null, isLoaded: false });

export const ClerkProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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
      fullName: user.user_metadata?.full_name || 'Anonymous User',
      id: user.id
    } : null,
    isSignedIn: !!user,
    isLoaded
  };
};

export const UserButton = () => {
  const { user } = useContext(AuthContext);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) return null;

  return (
    <div 
      onClick={handleLogout}
      className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm"
      title="Click to log out"
    >
      {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
    </div>
  );
};

export const SignIn = () => {
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error: " + error.message + " (Try signing up if you don't have an account)");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target.closest('form');
    const email = form.email.value;
    const password = form.password.value;
    
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Check your email for the login link (if email confirmations are enabled in Supabase) or just log in.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Sign In / Register</h2>
      <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
        <input 
          name="email"
          type="email" 
          placeholder="Email address" 
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-colors"
          required
        />
        <input 
          name="password"
          type="password" 
          placeholder="Password" 
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-colors"
          required
        />
        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">
          Log In
        </button>
        <button type="button" onClick={handleSignUp} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
          Sign Up
        </button>
      </form>
    </div>
  );
};
