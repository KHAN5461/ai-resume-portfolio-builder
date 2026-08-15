import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useUser } from '../auth.jsx';
import { auth } from '../lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, CreditCard, Link as LinkIcon, Palette, Bell, Shield, LogOut, X, Github, Linkedin } from 'lucide-react';

const PLAN_BADGES = {
  free: { label: 'Free', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  pro: { label: 'Pro', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  enterprise: { label: 'Enterprise', className: 'bg-purple-100 text-purple-700 border-purple-200' },
};

function BillingTabContent() {
  const subscription = useSelector((state) => state.sync?.subscription);
  const plan = subscription?.plan || 'free';
  const badge = PLAN_BADGES[plan] || PLAN_BADGES.free;
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscription?.stripeCustomerId) {
      toast('No active subscription to manage.');
      return;
    }
    setPortalLoading(true);
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeCustomerId: subscription.stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not open billing portal.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to billing portal.');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="p-6 rounded-2xl border border-outline-variant/30 bg-surface">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Current Plan</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.className}`}>
            {badge.label}
          </span>
        </div>
        {plan === 'free' ? (
          <div>
            <p className="text-sm text-on-surface-variant mb-4">
              You are on the <strong>Free</strong> plan. Upgrade to unlock unlimited resumes, AI Co-Pilot, premium templates, and more.
            </p>
            <a href="/#pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-sm">
              <CreditCard className="w-4 h-4" />
              Upgrade Now
            </a>
          </div>
        ) : (
          <div>
            <p className="text-sm text-on-surface-variant mb-4">
              You are on the <strong>{badge.label}</strong> plan. All premium features are unlocked.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-outline-variant/30 transition-colors border border-outline-variant/30 disabled:opacity-50"
              >
                {portalLoading ? 'Opening...' : 'Manage Subscription'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Access Summary */}
      <div className="p-6 rounded-2xl border border-outline-variant/30 bg-surface">
        <h3 className="font-bold text-lg mb-4">Your Feature Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Active Resumes', free: '1', premium: 'Unlimited' },
            { name: 'Active Portfolios', free: '1', premium: 'Unlimited' },
            { name: 'AI Co-Pilot', free: '5/day', premium: 'Unlimited' },
            { name: 'Premium Templates', free: '✗', premium: '✓' },
            { name: 'ATS Score Ring', free: '✗', premium: '✓' },
            { name: 'GitHub Sync', free: '✗', premium: '✓' },
          ].map((feature) => (
            <div key={feature.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container-low">
              <span className="text-sm text-on-surface">{feature.name}</span>
              <span className={`text-xs font-bold ${subscription?.isPremium ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                {subscription?.isPremium ? feature.premium : feature.free}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('system'); // light, dark, system

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out.');
      navigate('/auth/sign-in');
    } catch (error) {
      toast.error('Failed to log out: ' + error.message);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-5xl h-[85vh] bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/30 relative"
        >
            {/* Close Button */}
            <Link to="/dashboard" className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center hover:bg-outline-variant/30 transition-colors z-20">
                <X className="w-4 h-4 text-on-surface-variant" />
            </Link>

            {/* Sidebar (Tabs) */}
            <div className="w-full md:w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col pt-12 pb-6 px-4">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant shadow-sm shrink-0">
                        <img src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdpNE5-WKm5MFn2b-yk7gA_p_Kn0HAZVhocCeU2LroTUEh6spLnuqz718WVyECY57YXlU_ZIFCUP0yGIJO_9U68aiTdsfRod1cixn6cKWCHGCU1TBw7YOsxAxmvaQRU7bQawiaphVcD7NXJGkEw4T17S5ZE5dsiLGnhuWWHpHu7DRWKB488oEZxy_BNFlnaOEAOYVeWHiKKyPLGYaj65KODG0706Jkyi97-2XpynlrGdiFF6kaYbQH"} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                        <p className="font-bold text-[14px] text-on-surface truncate">{user?.fullName || 'User'}</p>
                        <p className="font-label-sm text-[11px] text-on-surface-variant truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible custom-scrollbar pb-2 md:pb-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-label-md text-[14px] transition-colors whitespace-nowrap md:whitespace-normal ${activeTab === tab.id ? 'bg-stitch-primary/10 text-stitch-primary font-bold' : 'text-on-surface hover:bg-surface-variant/50'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-surface-container-lowest p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'account' && (
                        <motion.div key="account" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="max-w-2xl">
                            <h2 className="font-headline-md text-2xl font-bold mb-6">Account Settings</h2>
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl border border-outline-variant/30 bg-surface flex flex-col sm:flex-row items-center gap-6">
                                    <img src={user?.imageUrl} className="w-24 h-24 rounded-full shadow-sm" alt="Profile" />
                                    <div className="flex-1">
                                        <h3 className="font-bold mb-1">Profile Picture</h3>
                                        <p className="text-sm text-on-surface-variant mb-3">Upload a new avatar. Larger image will be resized automatically.</p>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-1.5 bg-stitch-primary text-white rounded-md text-sm font-medium hover:bg-stitch-primary/90">Change</button>
                                            <button className="px-4 py-1.5 bg-surface-variant text-on-surface rounded-md text-sm font-medium hover:bg-outline-variant/30">Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium">First Name</label>
                                        <input type="text" className="px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-low" defaultValue={user?.firstName} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <input type="text" className="px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-low" defaultValue={user?.lastName} />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-outline-variant/20 mt-8">
                                    <h3 className="font-bold text-red-500 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-on-surface-variant mb-4">Permanently delete your account and all of your content.</p>
                                    <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-200 hover:bg-red-100 flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'appearance' && (
                        <motion.div key="appearance" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="max-w-2xl">
                            <h2 className="font-headline-md text-2xl font-bold mb-6">Appearance</h2>
                            <p className="text-on-surface-variant mb-6 text-sm">Customize how Sparkfolio looks on your device.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button onClick={() => setTheme('light')} className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-colors text-left ${theme === 'light' ? 'border-stitch-primary bg-stitch-primary/5' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                                    <div className="w-full h-24 rounded-lg bg-[#F7F7F8] border border-gray-200 p-2 flex flex-col gap-2">
                                        <div className="w-full h-3 rounded-full bg-gray-200"></div>
                                        <div className="w-2/3 h-3 rounded-full bg-gray-200"></div>
                                        <div className="w-full h-8 rounded-md bg-white border border-gray-200 mt-auto"></div>
                                    </div>
                                    <span className="font-medium text-sm">Light Mode</span>
                                </button>
                                <button onClick={() => setTheme('dark')} className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-colors text-left ${theme === 'dark' ? 'border-stitch-primary bg-stitch-primary/5' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                                    <div className="w-full h-24 rounded-lg bg-[#0F1115] border border-gray-800 p-2 flex flex-col gap-2">
                                        <div className="w-full h-3 rounded-full bg-gray-800"></div>
                                        <div className="w-2/3 h-3 rounded-full bg-gray-800"></div>
                                        <div className="w-full h-8 rounded-md bg-[#1C1F26] border border-gray-800 mt-auto"></div>
                                    </div>
                                    <span className="font-medium text-sm">Dark Mode</span>
                                </button>
                                <button onClick={() => setTheme('system')} className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-colors text-left ${theme === 'system' ? 'border-stitch-primary bg-stitch-primary/5' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                                    <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#F7F7F8] to-[#0F1115] border border-outline-variant/30 p-2 flex flex-col gap-2 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>
                                    </div>
                                    <span className="font-medium text-sm">System Default</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'integrations' && (
                        <motion.div key="integrations" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="max-w-2xl">
                            <h2 className="font-headline-md text-2xl font-bold mb-6">OAuth Integrations</h2>
                            <p className="text-on-surface-variant mb-6 text-sm">Connect your external accounts to automatically import data and sync your portfolio widgets.</p>
                            
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl border border-outline-variant/30 bg-surface flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center shrink-0">
                                            <Linkedin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">LinkedIn</h4>
                                            <p className="text-xs text-on-surface-variant">Import your work experience instantly</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-surface-variant text-on-surface rounded-full text-sm font-medium hover:bg-outline-variant/30">Connect</button>
                                </div>
                                <div className="p-5 rounded-2xl border border-outline-variant/30 bg-surface flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#333]/10 text-[#333] flex items-center justify-center shrink-0">
                                            <Github className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">GitHub</h4>
                                            <p className="text-xs text-on-surface-variant">Sync repositories to your portfolio</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-surface-variant text-on-surface rounded-full text-sm font-medium hover:bg-outline-variant/30">Connect</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div key="billing" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="max-w-2xl">
                            <h2 className="font-headline-md text-2xl font-bold mb-6">Billing & Subscription</h2>
                            <p className="text-on-surface-variant mb-6 text-sm">Manage your subscription plan and payment details.</p>
                            
                            <BillingTabContent />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    </div>
  );
}
