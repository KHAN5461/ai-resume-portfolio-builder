import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './lib/firebaseConfig';
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { store } from './store/store';
import { setSubscription, setDriveToken } from './store/syncSlice';
import { disconnectDrive } from './service/DriveService';

const AuthContext = createContext({ user: null, session: null, isLoaded: false });

export const ClerkProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if there is a local mock user first (Local Bypass Mode)
    const mockUserStr = localStorage.getItem('mock_user');
    if (mockUserStr) {
      try {
        const mockUser = JSON.parse(mockUserStr);
        setUser(mockUser);
        setSession({ user: mockUser });
        setIsLoaded(true);
        
        // Dispatch subscription details for mock user
        store.dispatch(setSubscription({
          plan: 'premium',
          isPremium: true,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        }));
        return; // Bypass Firebase loading entirely
      } catch (e) {
        console.warn('Could not parse mock user:', e);
      }
    }

    // Process redirect result if arriving from signInWithRedirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          try {
            await setDoc(doc(db, 'users', result.user.uid), {
              username: result.user.displayName,
              email: result.user.email,
              lastLogin: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.warn('Could not sync redirect user:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('Redirect sign-in error:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setSession(currentUser ? { user: currentUser } : null);
      setIsLoaded(true);

      // Fetch subscription status from Firestore
      if (currentUser && typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            store.dispatch(setSubscription({
              plan: data.plan || 'free',
              isPremium: data.isPremium || false,
              stripeCustomerId: data.stripeCustomerId || null,
              stripeSubscriptionId: data.stripeSubscriptionId || null,
            }));
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (err?.code !== 'unavailable' && !errMsg.includes('offline')) {
            console.warn('Could not fetch subscription status:', err);
          }
        }
      } else {
        // Reset subscription on logout
        store.dispatch(setSubscription({
          plan: 'free',
          isPremium: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        }));
      }
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
  
  const mappedUser = React.useMemo(() => {
    return user ? {
      primaryEmailAddress: { emailAddress: user.email },
      fullName: user.displayName || 'Anonymous User',
      id: user.uid,
      imageUrl: user.photoURL || null
    } : null;
  }, [user]);

  return {
    user: mappedUser,
    isSignedIn: !!user,
    isLoaded
  };
};

export const UserButton = () => {
  const { user } = useContext(AuthContext);
  
  const handleLogout = async () => {
    const currentToken = store.getState().sync.driveToken;
    if (currentToken) {
      await disconnectDrive(currentToken);
      store.dispatch(setDriveToken(null));
    }
    localStorage.removeItem('mock_user');
    await signOut(auth);
    window.location.reload(); // Force full reload to reset mock bypass state cleanly
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
