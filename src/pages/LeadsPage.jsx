import { useState, useEffect } from 'react'
import { getLeads, updateLead, addPipelineDeal } from '../lib/db'
import { useAuthContext } from '../components/auth/AuthProvider'
import LeadFormDrawer from '../components/leads/LeadFormDrawer'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowRight, 
  Plus, 
  Mail, 
  Building2, 
  User,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import { cn } from '../lib/utils'

const GRADE_COLORS = {
  'A': 'bg-green-50 text-green-600 border-green-100',
  'B': 'bg-blue-50 text-blue-600 border-blue-100',
  'C': 'bg-amber-50 text-amber-600 border-amber-100',
  'D': 'bg-red-50 text-red-600 border-red-100',
}

const STAGE_CONFIG = {
  'New':                 { color: 'bg-slate-100 text-slate-500' },
  'Contacted':           { color: 'bg-blue-50 text-blue-600' },
  'Discovery Scheduled': { color: 'bg-indigo-50 text-indigo-600' },
  'Discovery Done':      { color: 'bg-purple-50 text-purple-600' },
  'Move to Scoping':     { color: 'bg-brand-teal/10 text-brand-teal font-bold' },
  'Disqualified':        { color: 'bg-slate-200 text-slate-400 line-through' },
}

function LeadScore({ score }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
      <span className="font-display font-bold text-text-primary">{score}</span>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PTS</span>
    </div>
  )
}

export default function LeadsPage() {
  const { user } = useAuthContext()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    getLeads()
      .then(l => { setLeads(l || []); setLoading(false); setError('') })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleMoveToScoping = async (lead) => {
    // Premium confirmation might be a custom dialog, but keep it simple for now
    if (!confirm(`Relocate ${lead.firstName} to the Sales Pipeline?`)) return
    await updateLead(lead.id, { stage: 'Move to Scoping' })
    await addPipelineDeal(lead, user.uid)
    load()
  }

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    return (
      l.firstName?.toLowerCase().includes(q) ||
      l.lastName?.toLowerCase().includes(q) ||
      l.company?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-4xl font-display font-bold text-text-primary">Inbound Intent</h1>
          <p className="text-text-secondary mt-2 text-lg font-light">
            Global capture of high-intent opportunities ({leads.length} active)
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-teal transition-colors" />
            <input 
              type="text" 
              placeholder="Search intelligence..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border border-transparent shadow-sm rounded-2xl py-3 pl-12 pr-6 text-sm w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal/20 transition-all font-light"
            />
          </div>
          <button 
            onClick={() => { setEditingLead(null); setDrawerOpen(true) }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl btn-gradient text-white text-sm font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Capture
          </button>
        </div>
      </div>

      {/* Stats/Filter Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
         <span className="text-brand-teal font-black">All Leads</span>
         <span className="hover:text-text-primary cursor-pointer transition-colors">Hot (80+)</span>
         <span className="hover:text-text-primary cursor-pointer transition-colors">Untriaged</span>
         <span className="hover:text-text-primary cursor-pointer transition-colors">Partnered</span>
         <div className="ml-auto flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 hover:border-brand-teal/30 cursor-pointer transition-all">
               <Filter className="w-3.5 h-3.5" />
               <span>FILTER</span>
             </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <div className="w-10 h-10 rounded-full border-4 border-brand-teal border-t-transparent animate-spin" />
             <p className="text-slate-400 text-sm font-display font-medium">Indexing leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50/50">
                  <th className="py-8 px-10">Capture Instance</th>
                  <th className="py-8 px-6 text-center">Intent Score</th>
                  <th className="py-8 px-6 text-center">Grade</th>
                  <th className="py-8 px-6">Lifecycle Stage</th>
                  <th className="py-8 px-6">Assigned To</th>
                  <th className="py-8 px-10 text-right">Strategic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center">
                       <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Search className="w-12 h-12 opacity-20" />
                          <p className="text-sm font-medium">No intelligence matches your query.</p>
                       </div>
                    </td>
                  </tr>
                ) : filtered.map(lead => (
                  <tr key={lead.id} className="group hover:bg-surface-low/30 transition-all duration-300">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-surface-low border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all shrink-0">
                           <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-text-primary text-base group-hover:text-brand-teal transition-colors">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-text-secondary">
                             <span className="flex items-center gap-1"><Building2 className="w-3 h-3 opacity-50" /> {lead.company || '—'}</span>
                             <span className="flex items-center gap-1"><Mail className="w-3 h-3 opacity-50" /> {lead.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                       <div className="inline-flex items-center justify-center">
                          <LeadScore score={lead.leadScore || 0} />
                       </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                       <span className={cn(
                         "inline-flex w-8 h-8 items-center justify-center rounded-xl border text-sm font-display font-black",
                         GRADE_COLORS[lead.leadGrade || 'D']
                       )}>
                         {lead.leadGrade || 'D'}
                       </span>
                    </td>
                    <td className="py-6 px-6">
                       <span className={cn(
                         "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider",
                         STAGE_CONFIG[lead.stage]?.color || 'bg-slate-100 text-slate-500'
                       )}>
                         <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", lead.stage === 'Move to Scoping' ? 'bg-brand-teal' : 'bg-current opacity-40')} />
                         {lead.stage}
                       </span>
                    </td>
                    <td className="py-6 px-6 text-sm font-medium text-text-secondary">
                       {lead.assignedTo ? (
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{lead.assignedTo?.[0]}</div>
                            {lead.assignedTo}
                         </div>
                       ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-6 px-10 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingLead(lead); setDrawerOpen(true) }}
                            className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-brand-blue transition-all"
                          >
                             <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {lead.stage !== 'Move to Scoping' && lead.stage !== 'Disqualified' && (
                            <button 
                              onClick={() => handleMoveToScoping(lead)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-[11px] font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-transform"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              SCOPING
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <LeadFormDrawer 
          lead={editingLead}
          onClose={() => setDrawerOpen(false)}
          onSaved={() => { setDrawerOpen(false); load() }}
        />
      )}
    </div>
  )
}
