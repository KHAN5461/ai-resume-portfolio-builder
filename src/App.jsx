import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Navigate, Outlet, useLocation, useOutlet } from 'react-router-dom'
import { useUser } from './auth.jsx'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Toaster } from './components/ui/sonner'
import OfflineBanner from './components/OfflineBanner'
import { CommandPalette } from './components/CommandPalette'
import { ProductTour } from './components/ProductTour'
import { db } from './lib/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { setResumeData, setPortfolioData } from './store/resumeSlice'
import GlobalLoadingOverlay from './components/custom/GlobalLoadingOverlay'

function App() {
  const [count, setCount] = useState(0)
  const {user,isLoaded,isSignedIn}=useUser();
  const dispatch = useDispatch();
  const location = useLocation();
  const element = useOutlet();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user?.id) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          return;
        }
        try {
          const docRef = doc(db, 'user_data', user.id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.state_data) {
              if (data.state_data.resume) {
                dispatch({ type: 'resume/setResumeData', payload: data.state_data.resume.resumeData });
              }
              if (data.state_data.portfolio) {
                dispatch({ type: 'portfolio/setPortfolioData', payload: data.state_data.portfolio.portfolioData });
              }
            }
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          if (error?.code === 'unavailable' || errMsg.includes('offline') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
            // Normal offline condition: application uses local storage state seamlessly
            console.warn("Firebase is operating in offline mode. Local state will be used.");
          } else {
            console.error("Error fetching user state from Firebase:", error);
          }
        }
      }
    };
    fetchUserData();
  }, [isSignedIn, user?.id, dispatch]);

  if(!isSignedIn && isLoaded && location.pathname !== '/')
  {
    return <Navigate to={`/auth/sign-in?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return (
    <>
      <GlobalLoadingOverlay />
      <OfflineBanner />
      <AnimatePresence mode="wait">
        {element && React.cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
      <Toaster />
      <CommandPalette />
      <ProductTour />
    </>
  )
}

export default App
