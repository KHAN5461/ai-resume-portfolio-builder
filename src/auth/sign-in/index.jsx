import React, { useState } from 'react';
import { auth, googleProvider, db } from '../../lib/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '../../auth.jsx';

function SignInPage() {
  const { isSignedIn } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isSignedIn, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = isSignUp ? e.target.username.value : null;

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        
        // Save user to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: username,
          email: email,
          createdAt: new Date().toISOString()
        });
        
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      // Redirect happens automatically via useEffect above
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Save user to Firestore if they don't exist
      await setDoc(doc(db, 'users', result.user.uid), {
        username: result.user.displayName,
        email: result.user.email,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      toast.success("Signed in with Google!");
      // Redirect happens automatically via useEffect above
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0c1324] min-h-screen flex items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(12, 19, 36, 0.6);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(144, 143, 160, 0.2);
            box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .btn-gradient {
            background: linear-gradient(135deg, #c0c1ff 0%, #8083ff 100%);
            transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-gradient:hover {
            box-shadow: 0 0 20px rgba(128, 131, 255, 0.4);
            transform: translateY(-2px);
        }
        .input-glow:focus-within {
            border-color: #c0c1ff;
            box-shadow: 0 0 0 2px rgba(192, 193, 255, 0.2);
        }
      `}} />

      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-[#c0c1ff]/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-[440px] relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff] text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            <span className="text-2xl font-bold text-[#c0c1ff] tracking-tighter">LuminaAI</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="flex bg-[#191f31] rounded-full p-1 mb-8">
            <button 
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-full font-medium text-sm transition-colors duration-200 ${!isSignUp ? 'bg-[#6f00be] text-[#d6a9ff] shadow-sm' : 'text-[#c7c4d7] hover:text-[#dce1fb]'}`}
              type="button"
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-full font-medium text-sm transition-colors duration-200 ${isSignUp ? 'bg-[#6f00be] text-[#d6a9ff] shadow-sm' : 'text-[#c7c4d7] hover:text-[#dce1fb]'}`}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleEmailAuth}>
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#c7c4d7] block" htmlFor="username">Username</label>
                <div className="relative input-glow rounded-lg border border-[#464554] bg-[#0c1324] transition-all duration-200 flex items-center overflow-hidden">
                  <span className="material-symbols-outlined text-[#908fa0] ml-3 absolute pointer-events-none text-[20px]">person</span>
                  <input required className="w-full bg-transparent border-none text-[#dce1fb] text-base py-3 pl-10 pr-4 focus:ring-0 placeholder:text-[#c7c4d7]" id="username" name="username" placeholder="johndoe" type="text"/>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#c7c4d7] block" htmlFor="email">Email Address</label>
              <div className="relative input-glow rounded-lg border border-[#464554] bg-[#0c1324] transition-all duration-200 flex items-center overflow-hidden">
                <span className="material-symbols-outlined text-[#908fa0] ml-3 absolute pointer-events-none text-[20px]">mail</span>
                <input required className="w-full bg-transparent border-none text-[#dce1fb] text-base py-3 pl-10 pr-4 focus:ring-0 placeholder:text-[#c7c4d7]" id="email" name="email" placeholder="john@example.com" type="email"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#c7c4d7] block" htmlFor="password">Password</label>
              <div className="relative input-glow rounded-lg border border-[#464554] bg-[#0c1324] transition-all duration-200 flex items-center overflow-hidden">
                <span className="material-symbols-outlined text-[#908fa0] ml-3 absolute pointer-events-none text-[20px]">lock</span>
                <input required className="w-full bg-transparent border-none text-[#dce1fb] text-base py-3 pl-10 pr-10 focus:ring-0 placeholder:text-[#c7c4d7]" id="password" name="password" placeholder="••••••••" type="password"/>
              </div>
              {isSignUp && <p className="text-sm text-[#908fa0] mt-1">Must be at least 8 characters.</p>}
            </div>

            <button disabled={loading} className="w-full btn-gradient text-[#1000a9] font-medium text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 mt-2" type="submit">
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-[#464554]/30"></div>
            <span className="mx-4 text-sm text-[#908fa0] uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-[#464554]/30"></div>
          </div>

          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-white text-slate-900 font-medium text-sm py-3.5 rounded-lg flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors duration-200 shadow-sm" type="button">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      </main>
    </div>
  );
}

export default SignInPage;