import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { ClerkProvider } from './auth.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Code splitting / Lazy Loading for optimization
const RootLayout = lazy(() => import('./components/RootLayout.jsx'))
const Dashboard = lazy(() => import('./dashboard/index.jsx'))
const SignInPage = lazy(() => import('./auth/sign-in/index.jsx'))
const EditResume = lazy(() => import('./dashboard/resume/[resumeId]/edit/index.jsx'))
const ResumeViewPage = lazy(() => import('./my-resume/[resumeId]/view/index.jsx'))
const EditPortfolio = lazy(() => import('./dashboard/portfolio/[portfolioId]/edit/index.jsx'))
const Portfolio = lazy(() => import('./portfolio/index.jsx'))
const ProfilePage = lazy(() => import('./profile/index.jsx'))
const TemplatesPage = lazy(() => import('./pages/TemplateGallery.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const CoverLetters = lazy(() => import('./dashboard/cover-letters/index.jsx'))
const InterviewCoach = lazy(() => import('./interview/index.jsx'))

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-surface-container-lowest">
    <div className="w-12 h-12 border-4 border-stitch-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
)

const PublicPortfolio = () => {
  return <Suspense fallback={<LoadingFallback />}><Portfolio isPublic={true}/></Suspense>
}

const router=createBrowserRouter([
  {
    element:<App/>,
    children:[
      {
        path:'/',
        element: <Suspense fallback={<LoadingFallback />}><RootLayout/></Suspense>
      },
      {
        path:'/dashboard',
        element: <Navigate to="/" replace />
      },
      {
        path:'/dashboard/resume/:resumeId/edit',
        element: <Suspense fallback={<LoadingFallback />}><EditResume/></Suspense>
      },
      {
        path:'/dashboard/portfolio/:portfolioId/edit',
        element: <Suspense fallback={<LoadingFallback />}><EditPortfolio/></Suspense>
      },
      {
        path:'/templates',
        element: <Suspense fallback={<LoadingFallback />}><TemplatesPage/></Suspense>
      },
      {
        path:'/profile',
        element: <Suspense fallback={<LoadingFallback />}><ProfilePage/></Suspense>
      },
      {
        path:'/dashboard/cover-letters',
        element: <Suspense fallback={<LoadingFallback />}><CoverLetters/></Suspense>
      },
      {
        path:'/interview/:resumeId',
        element: <Suspense fallback={<LoadingFallback />}><InterviewCoach/></Suspense>
      }
    ]
  },
  {
    path:'/playground',
    element: <Suspense fallback={<LoadingFallback />}><EditResume/></Suspense>
  },
  {
    path:'/auth/sign-in',
    element: <Suspense fallback={<LoadingFallback />}><SignInPage/></Suspense>
  },
  {
    path:'/my-resume/:resumeId/view',
    element: <Suspense fallback={<LoadingFallback />}><ResumeViewPage/></Suspense>
  },
  {
    path:'/my-portfolio/:portfolioId/view',
    element: <Suspense fallback={<LoadingFallback />}><Portfolio isPublic={false}/></Suspense>
  },
  {
    path:'/p/:portfolioId',
    element: <PublicPortfolio />
  },
  {
    path: '*',
    element: <Suspense fallback={<LoadingFallback />}><NotFound/></Suspense>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Provider store={store}>
      <ClerkProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ClerkProvider>
    </Provider>
  </React.StrictMode>,
)
