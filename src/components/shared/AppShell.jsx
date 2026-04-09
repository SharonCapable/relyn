import { NavLink, Outlet } from 'react-router-dom'
import { useAuthContext } from '../auth/AuthProvider'
import { 
  LayoutDashboard, 
  Users2, 
  Kanban, 
  Settings, 
  Search, 
  Sparkles,
  ChevronRight,
  LogOut,
  Bell,
  MessageSquare,
  BarChart2,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads',     label: 'Leads',     icon: BarChart2 },
  { to: '/pipeline',  label: 'Pipeline',  icon: Kanban },
  { to: '/team',      label: 'Team',      icon: Users2 },
  { to: '/settings',  label: 'Settings',  icon: Settings },
]

export default function AppShell() {
  const { user, logout } = useAuthContext()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(true)

  return (
    <div className="flex h-screen bg-surface font-sans overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside 
        className={cn(
          "flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col bg-surface-low relative z-30",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center shrink-0">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-display font-bold text-text-primary tracking-tight">Relyn</span>
            )}
          </div>
        </div>

        {/* Search Trigger (Cmd+K feel) */}
        {!isSidebarCollapsed && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-lowest border border-slate-200 rounded-xl text-slate-400 text-sm cursor-pointer hover:border-brand-teal/30 transition-colors">
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <span className="ml-auto text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                  : "text-text-secondary hover:bg-white hover:text-brand-teal"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110")} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {!isSidebarCollapsed && item.label === 'Leads' && (
                <span className="ml-auto bg-brand-orange/10 text-brand-orange text-[10px] px-1.5 py-0.5 rounded-full font-bold">12</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Team Tree (Collapsible/Preview) */}
        {!isSidebarCollapsed && (
          <div className="px-6 py-6 border-t border-slate-200/50">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Team</h4>
             <div className="space-y-3">
                {['Growth', 'Sales APAC', 'Client Success'].map((team) => (
                  <div key={team} className="flex items-center gap-2 text-xs text-text-secondary hover:text-brand-teal cursor-pointer group">
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:rotate-90 transition-transform" />
                    <span>{team}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 bg-white/50 border-t border-slate-200/50 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center overflow-hidden border border-brand-blue/20">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <span className="text-xs font-bold text-brand-blue">{user?.displayName?.[0] || 'U'}</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{user?.displayName}</p>
                <p className="text-[10px] text-text-secondary truncate">{user?.email}</p>
              </div>
            )}
            {!isSidebarCollapsed && (
              <button 
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-surface-low">
        {/* Top Floating Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 relative z-20">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               className="p-2 -ml-2 rounded-xl hover:bg-white transition-colors lg:hidden"
             >
               <LayoutDashboard className="w-5 h-5 text-slate-400" />
             </button>
             <h2 className="text-sm font-display font-medium text-slate-400">
               Pages <span className="mx-2">/</span> <span className="text-text-primary font-bold">Dashboard</span>
             </h2>
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-brand-blue transition-all">
               <Bell className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setAiPanelOpen(!aiPanelOpen)}
               className={cn(
                 "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                 aiPanelOpen 
                  ? "bg-brand-orange text-white ring-4 ring-brand-orange/10" 
                  : "bg-white text-brand-orange hover:bg-brand-orange/5"
               )}
             >
               <Sparkles className="w-4 h-4" />
               <span className="hidden sm:inline">Ask Relyn</span>
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
           {/* Tonal Background Layers */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[100px] -mr-48 -mt-24 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />
           
           <Outlet />
        </main>
      </div>

      {/* ── AI ASSISTANT PANEL (Ask Relyn) ────────────────────────────── */}
      <aside 
        className={cn(
          "bg-white border-l border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex flex-col relative z-40",
          aiPanelOpen ? "w-[380px]" : "w-0"
        )}
      >
        <div className="flex flex-col h-full w-[380px]"> {/* Fixed width inner for smooth sliding */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-surface-low/50">
             <div className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-brand-orange" />
               <h3 className="font-display font-bold text-lg">Ask Relyn</h3>
             </div>
             <button 
               onClick={() => setAiPanelOpen(false)}
               className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
             {/* Quick Prompts */}
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Suggested Insights</p>
               <div className="space-y-3">
                 {[
                   { icon: '🔥', label: 'Hot leads this week', sub: '5 leads scored 80+' },
                   { icon: '⚠️', label: 'Stalled deals', sub: '3 deals over 30 days' },
                   { icon: '📈', label: 'Rep forecast', sub: 'Compare quota vs pipeline' }
                 ].map((prompt, i) => (
                   <button key={i} className="w-full p-4 rounded-2xl bg-surface-low border border-transparent hover:border-brand-orange/30 hover:bg-white hover:shadow-xl transition-all duration-300 text-left group">
                     <div className="flex items-center gap-3 mb-1">
                       <span className="text-xl">{prompt.icon}</span>
                       <span className="font-bold text-sm text-text-primary group-hover:text-brand-orange transition-colors">{prompt.label}</span>
                     </div>
                     <p className="text-xs text-text-secondary ml-8">{prompt.sub}</p>
                   </button>
                 ))}
               </div>
             </div>

             {/* Recent Activity Mini Log */}
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Intel</p>
               <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== 2 && <div className="absolute top-8 bottom-0 left-2.5 w-[1px] bg-slate-100" />}
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-white">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                      </div>
                      <div className="text-xs">
                        <p className="text-text-primary"><span className="font-bold">Alex</span> moved <span className="text-brand-blue font-medium underline">Acme deal</span> to Scoping</p>
                        <p className="text-slate-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          <div className="p-6 bg-surface-low border-t border-slate-100">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Analyze some data..." 
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange transition-all shadow-sm"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-orange text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-orange/20">
                   <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
