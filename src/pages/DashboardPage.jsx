import { useState, useEffect } from 'react'
import { getLeads, getPipelineDeals } from '../lib/db'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { 
  Users2, 
  Target, 
  TrendingUp, 
  BadgeDollarSign, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { cn } from '../lib/utils'

function KPICard({ label, value, trend, trendValue, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300", colorClass)}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-4xl font-display font-bold text-text-primary group-hover:text-brand-teal transition-colors duration-300">{value}</h3>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [leads, setLeads] = useState([])
  const [pipeline, setPipeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getLeads(), getPipelineDeals()])
      .then(([l, p]) => {
        setLeads(l || [])
        setPipeline(p || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Calculations
  const totalLeads = leads.length
  const conversionRate = totalLeads > 0 ? ((leads.filter(l => l.stage === 'Move to Scoping').length / totalLeads) * 100).toFixed(1) : '0.0'
  const weightedPipeline = pipeline.reduce((sum, d) => sum + (d.weightedValue || 0), 0)
  const winRate = pipeline.length > 0 ? ((pipeline.filter(d => d.pipelineStage === 'Closed Won').length / pipeline.length) * 100).toFixed(0) : '0'

  const leadStageData = [
    { name: 'New', count: leads.filter(l => l.stage === 'New').length },
    { name: 'Contacted', count: leads.filter(l => l.stage === 'Contacted').length },
    { name: 'Discovery', count: leads.filter(l => l.stage === 'Discovery Scheduled' || l.stage === 'Discovery Done').length },
    { name: 'Scoping', count: leads.filter(l => l.stage === 'Move to Scoping').length },
  ]

  const fmtCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-teal border-t-transparent animate-spin" />
          <p className="text-slate-400 font-display font-semibold">Gathering intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-5xl font-display font-bold text-text-primary">Executive Overview</h1>
            <p className="text-text-secondary mt-3 text-lg font-light leading-relaxed">
              Real-time intelligence hub for your global sales ecosystem.
            </p>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-brand-teal/30 transition-all shadow-sm">
              Export PDF
            </button>
            <button className="px-6 py-3 rounded-2xl btn-gradient text-white text-sm font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all">
              Add New Lead
            </button>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Inbound" 
          value={totalLeads} 
          trend="up" 
          trendValue="12%" 
          icon={Users2} 
          colorClass="bg-brand-blue/10 text-brand-blue" 
        />
        <KPICard 
          label="Conversion Rate" 
          value={`${conversionRate}%`} 
          trend="up" 
          trendValue="4.2%" 
          icon={TrendingUp} 
          colorClass="bg-brand-teal/10 text-brand-teal" 
        />
        <KPICard 
          label="Weighted Pipeline" 
          value={fmtCurrency(weightedPipeline)} 
          trend="down" 
          trendValue="2%" 
          icon={BadgeDollarSign} 
          colorClass="bg-brand-orange/10 text-brand-orange" 
        />
        <KPICard 
          label="Win Strategy" 
          value={`${winRate}%`} 
          icon={Target} 
          colorClass="bg-slate-100 text-slate-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Lead Dynamics Chart */}
        <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100/50">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-display font-bold text-text-primary">Lead Dynamics</h3>
                <p className="text-slate-400 text-sm mt-1">Volume by capture stage</p>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-low text-[10px] font-bold text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-brand-teal" /> CURRENT PERIOD
                 </div>
              </div>
           </div>

           <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadStageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} 
                    dy={16}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#cbd5e1' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={50}>
                    {leadStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#006A61' : '#316BF3'} fillOpacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Team Intelligence Mini-Grid */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100/50 flex flex-col">
           <h3 className="text-2xl font-display font-bold text-text-primary mb-8">Team Performance</h3>
           
           <div className="flex-1 space-y-6">
              {[
                { name: 'Alex Rivers', tag: 'Top Closer', score: '98%', img: 'AR' },
                { name: 'Sarah Chen', tag: 'High Lead Vol', score: '92%', img: 'SC' },
                { name: 'Michael K.', tag: 'On Quota', score: '85%', img: 'MK' },
                { name: 'Elena Rossi', tag: 'Growth', score: '74%', img: 'ER' },
              ].map((rep, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-surface-low transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-white group-hover:shadow-md transition-all">
                    {rep.img}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-primary group-hover:text-brand-teal transition-colors">{rep.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rep.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-display font-bold text-text-primary">{rep.score}</p>
                  </div>
                </div>
              ))}
           </div>

           <button className="w-full mt-8 py-4 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400 hover:text-brand-teal hover:border-brand-teal/30 transition-all uppercase tracking-widest">
              View Full Team Directory
           </button>
        </div>
      </div>

      {/* AI Insight Highlight */}
      <div className="relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
         <div className="relative bg-white rounded-[40px] p-10 border border-slate-100/50 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <Sparkles className="w-64 h-64 text-brand-orange" />
            </div>
            
            <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 flex items-center justify-center shrink-0">
               <Sparkles className="w-10 h-10 text-brand-orange" />
            </div>
            
            <div className="flex-1 space-y-2">
               <h4 className="text-2xl font-display font-bold text-text-primary">Stalled deals detected in your territory</h4>
               <p className="text-text-secondary text-lg font-light">
                 Relyn AI identifies 3 high-value deals stuck in the "Negotiation" phase for over 45 days. 
                 Recommended action: Re-engage with "Value Reinforcement" session.
               </p>
            </div>
            
            <button className="px-8 py-4 rounded-2xl bg-text-primary text-white text-sm font-bold shadow-xl hover:bg-black transition-all shrink-0">
               Take AI Action
            </button>
         </div>
      </div>
    </div>
  )
}
