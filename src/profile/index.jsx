import React from 'react';
import { useUser } from '../auth.jsx';
import { auth } from '../lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out.');
      navigate('/auth/sign-in');
    } catch (error) {
      toast.error('Failed to log out: ' + error.message);
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
      `}} />

      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-[#c0c1ff]/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        <Link to="/dashboard" className="text-[#908fa0] hover:text-[#dce1fb] transition-colors self-start mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Dashboard
        </Link>

        <div className="flex justify-center mb-10">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff] text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
            <span className="text-3xl font-bold text-[#c0c1ff] tracking-tighter">Profile Settings</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 md:p-12 w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-[#464554]/30 pb-10">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#191f31] shadow-xl">
              <img 
                alt="User profile photo" 
                className="w-full h-full object-cover" 
                src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdpNE5-WKm5MFn2b-yk7gA_p_Kn0HAZVhocCeU2LroTUEh6spLnuqz718WVyECY57YXlU_ZIFCUP0yGIJO_9U68aiTdsfRod1cixn6cKWCHGCU1TBw7YOsxAxmvaQRU7bQawiaphVcD7NXJGkEw4T17S5ZE5dsiLGnhuWWHpHu7DRWKB488oEZxy_BNFlnaOEAOYVeWHiKKyPLGYaj65KODG0706Jkyi97-2XpynlrGdiFF6kaYbQH"}
              />
            </div>
            
            <div className="flex flex-col text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#dce1fb]">{user?.fullName || 'Anonymous User'}</h2>
              <p className="text-lg text-[#908fa0] mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151b2d] border border-[#2e3447] text-sm text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[16px] text-[#4285F4]">verified_user</span>
                Premium Account
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#c7c4d7]">Account Actions</h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleLogout}
                className="flex-1 bg-[#2e3447] hover:bg-[#33394c] text-[#ffb4ab] border border-[#ffb4ab]/20 font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
