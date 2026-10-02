import React, { useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  db, 
  isFirebaseConfigured, 
  currentFirebaseProjectId, 
  currentFirebaseAuthDomain 
} from '../../lib/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '../../auth.jsx';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';

function SignInPage() {
  const { isSignedIn } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
    setIsMobileDevice(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isSignedIn, navigate, redirectUrl]);

  useEffect(() => {
    const resolveRedirect = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await setDoc(doc(db, 'users', result.user.uid), {
            username: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email,
            lastLogin: new Date().toISOString()
          }, { merge: true });
          toast.success("Successfully logged in with Google!");
          navigate(redirectUrl, { replace: true });
        }
      } catch (error) {
        console.error("Redirect resolution error:", error);
        setAuthError({
          code: error.code || 'auth/unknown',
          message: error.message
        });
        if (error.code === 'auth/unauthorized-domain') {
          toast.error("Redirect error: This domain is not yet authorized in Firebase Console.");
        } else {
          toast.error("Login verification failed: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (isMobileDevice && !isSignedIn) {
      resolveRedirect();
    }
  }, [isMobileDevice, isSignedIn, navigate, redirectUrl]);

  const currentDomain = window.location.hostname;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(true);
    toast.success("Domain copied to clipboard");
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = isSignUp ? e.target.username?.value : null;

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (username) {
          await updateProfile(userCredential.user, { displayName: username });
        }
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: username || email.split('@')[0],
          email: email,
          createdAt: new Date().toISOString()
        });
        
        toast.success("Account created successfully");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back");
      }
      setLoading(false);
    } catch (error) {
      console.error("Email auth error:", error);
      setAuthError({
        code: error.code || 'auth/unknown',
        message: error.message
      });
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignInPopup = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      await setDoc(doc(db, 'users', result.user.uid), {
        username: result.user.displayName,
        email: result.user.email,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      toast.success("Signed in with Google");
      setLoading(false);
    } catch (error) {
      console.error("Google popup error:", error);
      setAuthError({
        code: error.code || 'auth/unknown',
        message: error.message
      });
      setLoading(false);

      if (error.code === 'auth/unauthorized-domain') {
        toast.error("This domain is not yet authorized in Firebase Console.");
      } else if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast.warning("Google popup was interrupted. Open in full window or try redirect mode.");
      } else if (error.code === 'auth/invalid-api-key') {
        toast.error("Firebase API key is invalid or unset.");
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleGoogleSignInRedirect = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Google redirect error:", error);
      setAuthError({
        code: error.code || 'auth/unknown',
        message: error.message
      });
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isInIframe) {
      toast.info("Opening app in a full window for secure sign-in...");
      openInNewTab();
      return;
    }
    
    if (isMobileDevice) {
      await handleGoogleSignInRedirect();
    } else {
      await handleGoogleSignInPopup();
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const result = await signInAnonymously(auth);
      await updateProfile(result.user, { displayName: "Demo Professional" });
      await setDoc(doc(db, 'users', result.user.uid), {
        username: "Demo Professional",
        email: "demo@resume.ai",
        isDemo: true,
        lastLogin: new Date().toISOString()
      }, { merge: true });
      toast.success("Signed in as Demo User");
      setLoading(false);
    } catch (error) {
      console.error("Demo login error:", error);
      toast.info("Anonymous sign-in is disabled in Firebase. Use email or Google sign-in.");
      setLoading(false);
    }
  };

  const handleLocalBypassLogin = () => {
    const mockUser = {
      uid: "mock-developer-user-id",
      id: "mock-developer-user-id",
      displayName: "Khan Hassan",
      email: "khanhassan5451@gmail.com",
      photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5bIktZuZF3YmZVL-zf0HlzheENE6MOGaEeQNWUF3By2N0Z9w9GSARNuUBX2g1Wf7-gD5Nj7XVU4CmfGTbAWJhu-tx-hWwwSFUzew4Y8AktbsJP3w4HeK77qit9nhwgOhuZeAltabaJwuk5SS2CFWicgSEQUVLdz2wBk_Cls3Cv6t7SgpUfyThYqBtZVMLXSA2ks0yhx88A2U3AXk1VpWEEsUq6tHo0xikfW3VCyKm5ID94BSMJP4"
    };
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    toast.success("Welcome back, Khan! Signed in via Local Bypass.");
    // Wait brief moment for toast, then reload to let auth.jsx pick it up
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-950 font-sans relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="absolute w-12 h-12 border-4 border-indigo-600/20 rounded-full"></span>
            <span className="absolute w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Connecting securely</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 px-6">Verifying credentials and setting up workspace...</p>
          </div>
        </div>
      )}
      {/* Editorial Top Navigation */}
      <header className="px-6 md:px-12 py-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src="/logo.svg" alt="Resume.ai Logo" className="h-7 w-auto object-contain" />
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
            Resume<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
          </span>
        </Link>
      </header>

      {/* Main Form Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          {/* Header Typography */}
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
              Account Access
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {isSignUp ? "Create your workspace" : "Sign in to Resume.ai"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isSignUp 
                ? "Start building recruiter-tested resumes and web portfolios." 
                : "Manage your resumes, track views, and export to PDF."}
            </p>
          </div>
          {isInIframe && (
            <div className="mb-6 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-950 dark:text-indigo-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-[11px]">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 animate-pulse" />
                <span>Preview Sandbox Window Detected</span>
              </div>
              <p className="leading-relaxed text-[11px] opacity-90">
                Google Authentication requires a top-level browser window to safely complete authorization and prevent browser popup restrictions.
              </p>
              <button
                type="button"
                onClick={openInNewTab}
                className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition-all text-center flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.01] cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Full Window</span>
              </button>
            </div>
          )}

          {/* Google Auth Button - Primary Identity Provider */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Error & Diagnostic Feedback */}
            {authError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 space-y-2">
                <div className="font-medium text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Auth Notice: {authError.code}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {authError.code === 'auth/unauthorized-domain' ? (
                    <>
                      Domain needs authorization. Add <code className="bg-red-100 dark:bg-red-900/60 px-1 py-0.5 rounded font-mono">{currentDomain}</code> in Firebase Console (Authentication &gt; Settings &gt; Authorized domains).
                    </>
                  ) : authError.code === 'auth/popup-blocked' || authError.code === 'auth/popup-closed-by-user' ? (
                    <>Popup was closed or restricted. Try the redirect method below or open in a full window.</>
                  ) : (
                    authError.message
                  )}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleSignInRedirect}
                    className="px-2 py-1 rounded bg-red-100 dark:bg-red-900/60 hover:bg-red-200 dark:hover:bg-red-800 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Try Redirect Flow
                  </button>
                  <button
                    type="button"
                    onClick={openInNewTab}
                    className="px-2 py-1 rounded border border-red-300 dark:border-red-800 hover:bg-red-100/50 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Open New Window
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              <span className="bg-slate-50 dark:bg-slate-950 px-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest absolute">
                or
              </span>
            </div>

            {/* Clean Editorial Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300" htmlFor="username">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@domain.com"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? "Authenticating..." : isSignUp ? "Create Workspace Account" : "Sign In with Email"}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              {isSignUp ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setAuthError(null); }}
                    className="font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setAuthError(null); }}
                    className="font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </span>
              )}
            </div>

            {/* Guest / Demo Option */}
            <div className="text-center pt-2 space-y-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer block mx-auto"
              >
                Or evaluate in Guest Mode
              </button>
              
              <button
                type="button"
                onClick={handleLocalBypassLogin}
                className="text-[10px] text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors font-medium cursor-pointer border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Bypass Auth & Access Dashboard Instantly</span>
              </button>
            </div>
          </div>

          {/* Minimalist Diagnostics Accordion */}
          <div className="mt-10 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3 h-3" />
                Firebase & Domain Info
              </span>
              <span>{showDiagnostics ? "Hide" : "Show"}</span>
            </button>

            {showDiagnostics && (
              <div className="mt-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] space-y-2 text-slate-500">
                <div className="space-y-1">
                  <div className="text-slate-600 dark:text-slate-400 font-medium">Authorized Hostname:</div>
                  <div className="flex items-center justify-between font-mono bg-slate-50 dark:bg-slate-950 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[10px] text-slate-800 dark:text-slate-200">
                    <span className="truncate mr-2">{currentDomain}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentDomain)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded shrink-0 cursor-pointer"
                      title="Copy"
                    >
                      {copiedDomain ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-1">
                  <span>Project ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{currentFirebaseProjectId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Config State:</span>
                  <span className={isFirebaseConfigured ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-amber-500"}>
                    {isFirebaseConfigured ? "Live Credentials Active" : "Fallback Mode"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="px-6 md:px-12 py-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>© {new Date().getFullYear()} Resume.ai</span>
        <span>Secure ATS Resume & Portfolio Hub</span>
      </footer>
    </div>
  );
}

export default SignInPage;