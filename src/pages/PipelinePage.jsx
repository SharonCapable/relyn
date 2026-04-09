import { useState, useEffect } from 'react'
import { getPipelineDeals, updatePipelineDeal } from '../lib/db'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronRight, 
  Building2, 
  User, 
  Target, 
  TrendingUp,
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react'
import { cn } from '../lib/utils'

const STAGES = ['Scoping', 'PoC', 'Negotiation', 'Closed Won', 'Closed Lost']

const STAGE_COLORS = {
  'Scoping':     'text-blue-600 bg-blue-50',
  'PoC':         'text-indigo-600 bg-indigo-50',
  'Negotiation': 'text-brand-orange bg-brand-orange/10',
  'Closed Won':  'text-brand-teal bg-brand-teal/10',
  'Closed Lost': 'text-slate-400 bg-slate-100',
}

function fmt(n) {
  if (!n) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function PipelinePage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = () => {
    getPipelineDeals()
      .then(d => { setDeals(d || []); setLoading(false); setError('') })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleStageChange = async (deal, newStage) => {
    await updatePipelineDeal(deal.id, { ...deal, pipelineStage: newStage })
    load()
  }

  const filteredDeals = deals.filter(d => {
    const q = search.toLowerCase()
    return (
      d.accountName?.toLowerCase().includes(q) ||
      d.company?.toLowerCase().includes(q) ||
      d.leadId?.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
         <div className="w-10 h-10 rounded-full border-4 border-brand-teal border-t-transparent animate-spin" />
         <p className="text-slate-400 text-sm font-display font-medium">Navigating pipeline...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1700px] mx-auto space-y-8 pb-20 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-4xl font-display font-bold text-text-primary">Sales Pipeline</h1>
          <p className="text-text-secondary mt-2 text-lg font-light">
             Strategic deal management across <span className="text-brand-teal font-bold">{deals.length} active pursuits</span>
          </p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-teal transition-colors" />
              <input 
                type="text" 
                placeholder="Search deals..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-white border border-transparent shadow-sm rounded-2xl py-3 pl-12 pr-6 text-sm w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal/20 transition-all"
              />
           </div>
           <button className="flex items-center gap-2 px-6 py-3 rounded-2xl btn-gradient text-white text-sm font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all">
             <Plus className="w-4 h-4" />
             Add Pursuit
           </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start">
         {STAGES.map(stage => {
           const stageDeals = filteredDeals.filter(d => d.pipelineStage === stage)
           const stageValue = stageDeals.reduce((sum, d) => sum + (d.estDealValue || 0), 0)
           
           return (
             <div key={stage} className="flex-shrink-0 w-80 flex flex-col h-full bg-surface-low/50 rounded-[40px] p-2 border border-slate-50/50">
                {/* Column Header */}
                <div className="p-6 flex items-center justify-between">
                   <div className="space-y-1">
                      <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", STAGE_COLORS[stage])}>
                         <div className="w-1 h-1 rounded-full bg-current" />
                         {stage}
                      </div>
                      <p className="text-xs text-slate-400 font-bold mt-2 ml-1">{stageDeals.length} pursue{stageDeals.length !== 1 ? 's' : ''}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-display font-bold text-text-primary">{fmt(stageValue)}</p>
                      <p className="text-[10px] text-slate-400 font-bold">TOTAL VALUE</p>
                   </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto space-y-4 px-3 pb-6 custom-scrollbar">
                   {stageDeals.length === 0 ? (
                     <div className="h-32 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2 m-2">
                        <TrendingUp className="w-6 h-6 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Active Deals</span>
                     </div>
                   ) : stageDeals.map(deal => (
                     <div key={deal.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                        {/* Probability Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-50">
                           <div 
                             className={cn("h-full transition-all duration-1000", deal.winProbability > 70 ? 'bg-brand-teal' : deal.winProbability > 30 ? 'bg-brand-blue' : 'bg-brand-orange')} 
                             style={{ width: `${deal.winProbability || 0}%` }} 
                           />
                        </div>

                        <div className="flex justify-between items-start mb-4 pt-1">
                           <span className="text-[10px] font-mono text-slate-400 group-hover:text-brand-teal transition-colors font-bold uppercase">{deal.leadId}</span>
                           <button className="p-1 rounded-lg hover:bg-slate-50 text-slate-300 hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all">
                              <MoreHorizontal className="w-4 h-4" />
                           </button>
                        </div>

                        <h4 className="text-base font-display font-bold text-text-primary leading-tight group-hover:text-brand-teal transition-colors truncate">
                           {deal.accountName || deal.company || '(Unnamed Deal)'}
                        </h4>
                        
                        <div className="mt-4 flex items-center gap-3">
                           <div className="flex-1">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">EST. VALUE</p>
                              <p className="text-base font-display font-bold text-text-primary mt-1">{fmt(deal.estDealValue)}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">PROBABILITY</p>
                              <p className="text-base font-display font-bold text-brand-teal mt-1">{deal.winProbability || 0}%</p>
                           </div>
                        </div>

                        {/* Metadata Tags */}
                        <div className="mt-6 flex flex-wrap gap-2">
                           <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-low text-[10px] font-bold text-slate-500">
                              <Building2 className="w-3 h-3 opacity-50" />
                              <span className="truncate max-w-[80px]">{deal.company}</span>
                           </div>
                           {deal.blockers && (
                             <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-[10px] font-bold text-red-500">
                                <AlertCircle className="w-3 h-3" />
                                BLOCKED
                             </div>
                           )}
                        </div>

                        {/* Footer / Move Trigger */}
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">{deal.owner?.[0] || 'U'}</div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[60px]">{deal.owner || 'Unassigned'}</span>
                           </div>
                           <div className="relative group/menu">
                              <button className="flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:text-brand-blue/80 transition-colors uppercase tracking-widest">
                                 MOVE <ChevronRight className="w-3 h-3" />
                              </button>
                              {/* Simple move dropdown */}
                              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 hidden group-hover/menu:block z-50 animate-in slide-in-from-bottom-2">
                                 {STAGES.filter(s => s !== stage).map(s => (
                                   <button 
                                     key={s}
                                     onClick={(e) => { e.stopPropagation(); handleStageChange(deal, s) }}
                                     className="w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-surface-low transition-colors"
                                   >
                                      To {s}
                                   </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )
         })}
      </div>
    </div>
  )
}
