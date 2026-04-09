import { Users2, Shield, UserPlus, Search } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="space-y-12 pb-20">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-display-lg font-display font-bold">Team Management</h1>
          <p className="text-text-secondary mt-2 text-lg font-light">Manage your sales hierarchy and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl btn-gradient text-white text-sm font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Members', value: '18', icon: Users2, color: 'brand-blue' },
          { label: 'Active Supervisors', value: '4', icon: Shield, color: 'brand-teal' },
          { label: 'Available Reps', value: '14', icon: Users2, color: 'brand-orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
             <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color} mb-6`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-4xl font-display font-bold mt-2 text-text-primary">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Directory Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4 bg-surface-low px-4 py-2 rounded-xl w-72">
             <Search className="w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search team..." className="bg-transparent border-none text-sm focus:outline-none w-full" />
           </div>
           <div className="flex gap-2">
              {['All', 'Heads', 'Supervisors', 'Reps'].map((tab) => (
                <button key={tab} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 transition-all uppercase tracking-widest">
                  {tab}
                </button>
              ))}
           </div>
        </div>

        <div className="p-8">
           <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-4">Member</th>
                  <th className="pb-6 px-4">Role</th>
                  <th className="pb-6 px-4">Performance</th>
                  <th className="pb-6 px-4">Status</th>
                  <th className="pb-6 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3, 4].map((_, i) => (
                  <tr key={i} className="group hover:bg-surface-low/50 transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">JD</div>
                        <div>
                          <p className="font-bold text-text-primary">John Doe</p>
                          <p className="text-xs text-text-secondary">john@relyn.ai</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider">Supervisor</span>
                    </td>
                    <td className="py-6 px-4">
                       <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-teal rounded-full" style={{ width: '75%' }} />
                       </div>
                    </td>
                    <td className="py-6 px-4">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500" />
                         <span className="text-xs">Active</span>
                       </div>
                    </td>
                    <td className="py-6 px-4 text-right">
                       <button className="text-slate-300 hover:text-brand-teal transition-colors font-bold px-2 py-1">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
