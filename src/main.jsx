import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ClerkProvider } from './auth.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import TemplateGallery from './pages/TemplateGallery.jsx'

// Code splitting / Lazy Loading for optimization
const Home = lazy(() => import('./home/index.jsx'))
const Dashboard = lazy(() => import('./dashboard/index.jsx'))
const SignInPage = lazy(() => import('./auth/sign-in/index.jsx'))
const EditResume = lazy(() => import('./dashboard/resume/[resumeId]/edit/index.jsx'))
const ViewResume = lazy(() => import('./my-resume/[resumeId]/view/index.jsx'))
const EditPortfolio = lazy(() => import('./dashboard/portfolio/[portfolioId]/edit/index.jsx'))
const Portfolio = lazy(() => import('./portfolio/index.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-medium">Loading Application...</p>
    </div>
  </div>
)

const router=createBrowserRouter([
  {
    path:'/',
    element: <Suspense fallback={<LoadingFallback />}><Home/></Suspense>
  },
  {
    element:<App/>,
    children:[
      {
        path:'/dashboard',
        element: <Suspense fallback={<LoadingFallback />}><Dashboard/></Suspense>
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
        element:<TemplateGallery/>
      }
    ]
  },
  {
    path:'/auth/sign-in',
    element: <Suspense fallback={<LoadingFallback />}><SignInPage/></Suspense>
  },
  {
    path:'/my-resume/:resumeId/view',
    element: <Suspense fallback={<LoadingFallback />}><ViewResume/></Suspense>
  },
  {
    path:'/my-portfolio/:portfolioId/view',
    element: <Suspense fallback={<LoadingFallback />}><Portfolio/></Suspense>
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
