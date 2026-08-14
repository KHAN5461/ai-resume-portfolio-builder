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

function App() {
  const [count, setCount] = useState(0)
  const {user,isLoaded,isSignedIn}=useUser();
  const dispatch = useDispatch();
  const location = useLocation();
  const element = useOutlet();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user?.id) {
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
          console.error("Error fetching user state from Firebase:", error);
        }
      }
    };
    fetchUserData();
  }, [isSignedIn, user?.id, dispatch]);

  if(!isSignedIn&&isLoaded)
  {
    return <Navigate to={'/auth/sign-in'} />
  }

  return (
    <>
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
