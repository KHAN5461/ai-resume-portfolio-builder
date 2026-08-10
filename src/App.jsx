import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './auth.jsx'
import Header from './components/custom/Header'
import { Toaster } from './components/ui/sonner'
import OfflineBanner from './components/OfflineBanner'
import { supabase } from './lib/supabaseClient'
import { useDispatch } from 'react-redux'
import { setResumeData, setPortfolioData } from './store/resumeSlice'

function App() {
  const [count, setCount] = useState(0)
  const {user,isLoaded,isSignedIn}=useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user?.id) {
        const { data, error } = await supabase
          .from('user_data')
          .select('state_data')
          .eq('id', user.id)
          .single();
        
        if (data?.state_data) {
          if (data.state_data.resume) {
            dispatch({ type: 'resume/setResumeData', payload: data.state_data.resume.resumeData });
          }
          if (data.state_data.portfolio) {
            dispatch({ type: 'portfolio/setPortfolioData', payload: data.state_data.portfolio.portfolioData });
          }
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
      <Header/>
      <Outlet/>
      <Toaster />
    </>
  )
}

export default App

