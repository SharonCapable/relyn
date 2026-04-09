import { useState } from 'react'
import { useAuthContext } from '../components/auth/AuthProvider'
import { updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  LogOut, 
  Settings, 
  Camera, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import { cn } from '../lib/utils'

export default function SettingsPage() {
  const { user, logout } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') 

  const [displayName, setDisplayName] = useState(user?.displayName || '')

  async function handleSaveProfile() {
    setSaving(true)
    setMessage('')
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName || user?.email,
      })
      setMessageType('success')
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessageType('error')
      setMessage(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const lastSignIn = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between pb-8 border-b border-slate-100">
        <div>
          <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">System Preferences</h1>
          <p className="text-text-secondary mt-2 text-lg font-light">
             Configure your identity and security settings in the <span className="text-brand-teal font-bold underline decoration-brand-teal/30">Relyn Ecosystem</span>.
          </p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-display font-bold text-text-primary">Global Identity</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
               Your identity is verified across all Relyn AI instances. Changes may take a few moments to propagate.
            </p>
         </div>

         <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                  <User className="w-64 h-64" />
               </div>

               <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                  <div className="relative group/avatar">
                     <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 flex items-center justify-center text-brand-teal text-3xl font-display font-black shadow-inner border border-white">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-[32px]" />
                        ) : (
                          user?.displayName?.[0]?.toUpperCase() || '?'
                        )}
                     </div>
                     <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-teal transition-all">
                        <Camera className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                     <h4 className="text-2xl font-display font-bold text-text-primary">{user?.displayName || 'Anonymous Representative'}</h4>
                     <p className="text-slate-400 font-medium mt-1">{user?.email}</p>
                     <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                        <span className="px-3 py-1 rounded-full bg-green-50 text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1.5 border border-green-100">
                           <CheckCircle2 className="w-3 h-3" /> VERIFIED AGENT
                        </span>
                     </div>
                  </div>

                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 rounded-xl bg-surface-low text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all font-display"
                    >
                       MODIFY PROFILE
                    </button>
                  )}
               </div>

               {message && (
                 <div className={cn(
                   "mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                   messageType === 'success' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                 )}>
                    {messageType === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message}
                 </div>
               )}

               {isEditing && (
                 <div className="space-y-6 pt-10 border-t border-slate-50 animate-in fade-in duration-500">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Legal Display Name</label>
                       <input 
                         type="text" 
                         value={displayName}
                         onChange={e => setDisplayName(e.target.value)}
                         className="w-full bg-surface-low border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-teal/5 transition-all"
                         placeholder="Enter full name"
                       />
                    </div>
                    <div className="flex gap-4">
                       <button 
                         onClick={handleSaveProfile}
                         disabled={saving}
                         className="flex-1 py-4 rounded-2xl bg-text-primary text-white text-xs font-bold shadow-xl hover:bg-black transition-all disabled:opacity-50"
                       >
                          {saving ? 'SYNCING...' : 'SAVE CHANGES'}
                       </button>
                       <button 
                         onClick={() => { setIsEditing(false); setDisplayName(user?.displayName || '') }}
                         className="flex-1 py-4 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all"
                       >
                          DISCARD
                       </button>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* Account Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-display font-bold text-text-primary">System Intel</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
               Technical metadata associated with your environment. High-security environments may restrict some edits.
            </p>
         </div>

         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Security Context', value: user?.emailVerified ? 'Verified Pipeline' : 'Standard Pipeline', icon: Shield },
              { label: 'Network Provider', value: user?.providerData?.[0]?.providerId || 'Enterprise', icon: Settings },
              { label: 'Initial Sync', value: new Date(user?.metadata?.creationTime).toLocaleDateString(), icon: Clock },
              { label: 'Last Telemetry', value: lastSignIn, icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100/50 flex flex-col justify-between group hover:shadow-lg transition-all">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-teal/10 group-hover:text-brand-teal transition-all mb-6">
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-sm font-bold text-text-primary">{stat.value}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Strategic Footer */}
      <div className="bg-slate-900 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
         <div className="relative">
            <h4 className="text-2xl font-display font-bold">Relyn AI Core v4.2</h4>
            <p className="text-white/50 text-base font-light mt-2 max-w-md">
               Your session is encrypted with SHA-256 and monitored for strategic continuity.
            </p>
         </div>
         <div className="flex gap-4 relative">
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold border border-white/10">
               Documentation
            </button>
            <button className="px-6 py-3 rounded-xl bg-brand-teal text-white shadow-xl shadow-brand-teal/20 text-sm font-bold hover:scale-105 transition-all">
               System Status
            </button>
         </div>
      </div>
    </div>
  )
}
