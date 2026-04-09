import { useState } from 'react'
import { addLead, updateLead } from '../../lib/db'
import { useAuthContext } from '../auth/AuthProvider'
import { 
  X, 
  Check, 
  Sparkles, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Briefcase
} from 'lucide-react'
import { cn } from '../../lib/utils'

const RESPONSE_STATUSES = ['No Response', 'Responded', 'Scheduled', 'Awaiting Feedback']
const BUSINESS_UNITS = ['Data Annotation', 'AI Solutions', 'Data Acquisition', 'Other']
const SERVICE_LINES = ['Data Annotation', 'AI Solutions / Agentic', 'Data Acquisition', 'Consulting']
const HOW_FOUND = ['Google Ads', 'LinkedIn', 'Referral', 'Cold Outreach', 'Event', 'Website', 'Other']
const STAGES = ['New', 'Contacted', 'Discovery Scheduled', 'Discovery Done', 'Move to Scoping', 'Disqualified']
const MODALITIES = ['Image', 'Video', 'Text', 'Audio', 'LiDAR', 'Multimodal', 'Other']

function Field({ label, icon: Icon, required, children, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label} {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
      </div>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-surface-low border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal/20 transition-all placeholder:text-slate-300"
const selectCls = "w-full bg-surface-low border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal/20 transition-all cursor-pointer appearance-none"

export default function LeadFormDrawer({ lead, onClose, onSaved }) {
  const { user } = useAuthContext()
  const isEdit = Boolean(lead)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({
    firstName: lead?.firstName ?? '',
    lastName: lead?.lastName ?? '',
    phoneNumber: lead?.phoneNumber ?? '',
    email: lead?.email ?? '',
    company: lead?.company ?? '',
    roleTitle: lead?.roleTitle ?? '',
    country: lead?.country ?? '',
    howFoundRelyn: lead?.howFoundRelyn ?? '',
    projectDescription: lead?.projectDescription ?? '',
    assignedTo: lead?.assignedTo ?? '',
    dateFirstContacted: lead?.dateFirstContacted ? (lead.dateFirstContacted.toDate?.()?.toISOString() || lead.dateFirstContacted).split('T')[0] : '',
    responseStatus: lead?.responseStatus ?? '',
    businessUnit: lead?.businessUnit ?? '',
    serviceLine: lead?.serviceLine ?? '',
    partnerOrDirect: lead?.partnerOrDirect ?? 'Direct',
    discoveryCallDate: lead?.discoveryCallDate ? (lead.discoveryCallDate.toDate?.()?.toISOString() || lead.discoveryCallDate).split('T')[0] : '',
    dataModality: lead?.dataModality ?? '',
    estVolume: lead?.estVolume ?? '',
    budgetRange: lead?.budgetRange ?? '',
    timeline: lead?.timeline ?? '',
    decisionMaker: lead?.decisionMaker ?? false,
    industryVertical: lead?.industryVertical ?? '',
    discoveryNotes: lead?.discoveryNotes ?? '',
    discoveryComplete: lead?.discoveryComplete ?? false,
    stage: lead?.stage ?? 'New',
    outcomeIfLost: lead?.outcomeIfLost ?? '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateLead(lead.id, form)
      } else {
        await addLead(form, user.uid)
      }
      onSaved()
    } catch (err) {
      console.error(err)
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Editorial Backdrop */}
      <div 
        className="fixed inset-0 bg-text-primary/10 backdrop-blur-sm z-50 transition-all duration-500 animate-in fade-in" 
        onClick={onClose} 
      />

      {/* Concierge Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-[0_0_80px_rgba(0,0,0,0.1)] z-[60] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-teal/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl font-display font-bold text-text-primary tracking-tight">
              {isEdit ? 'Capture Intelligence' : 'New Strategic Pursuit'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">
              {isEdit ? lead.leadId : 'Awaiting initialization'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl hover:bg-surface-low flex items-center justify-center text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-12 custom-scrollbar">
          
          {/* Identity Section */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                   <User className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">Identity Layer</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" required icon={User}>
                  <input required className={inputCls} value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </Field>
                <Field label="Last Name" required icon={User}>
                  <input required className={inputCls} value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </Field>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Email Context" required icon={Mail}>
                  <input required type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label="Global Phone" icon={Phone}>
                  <input type="tel" className={inputCls} value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} />
                </Field>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Enterprise Name" required icon={Building2}>
                  <input required className={inputCls} value={form.company} onChange={e => set('company', e.target.value)} />
                </Field>
                <Field label="Strategic Role" required icon={ShieldCheck}>
                   <input required className={inputCls} value={form.roleTitle} onChange={e => set('roleTitle', e.target.value)} />
                </Field>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Geographic Context" icon={Globe}>
                   <input className={inputCls} value={form.country} onChange={e => set('country', e.target.value)} placeholder="e.g. USA" />
                </Field>
                <Field label="Lead Source" icon={Sparkles}>
                   <select className={selectCls} value={form.howFoundRelyn} onChange={e => set('howFoundRelyn', e.target.value)}>
                      <option value="">Detection source...</option>
                      {HOW_FOUND.map(h => <option key={h}>{h}</option>)}
                   </select>
                </Field>
             </div>

             <Field label="Project Intent" icon={MessageSquare}>
                <textarea rows={3} className={cn(inputCls, "resize-none")} value={form.projectDescription} onChange={e => set('projectDescription', e.target.value)} placeholder="What are they solving for?" />
             </Field>
          </section>

          {/* Triage Section */}
          <section className="pt-10 border-t border-slate-50 space-y-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                   <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">Triage & Routing</h3>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Executive Assigned" icon={User}>
                   <input className={inputCls} placeholder="e.g. Sarah Chen" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} />
                </Field>
                <Field label="Initial Contact Date" icon={Calendar}>
                   <input type="date" className={inputCls} value={form.dateFirstContacted} onChange={e => set('dateFirstContacted', e.target.value)} />
                </Field>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Engagement Status">
                   <select className={selectCls} value={form.responseStatus} onChange={e => set('responseStatus', e.target.value)}>
                      <option value="">Responded?</option>
                      {RESPONSE_STATUSES.map(s => <option key={s}>{s}</option>)}
                   </select>
                </Field>
                <Field label="Business Unit" icon={Briefcase}>
                   <select className={selectCls} value={form.businessUnit} onChange={e => set('businessUnit', e.target.value)}>
                      <option value="">Internal unit...</option>
                      {BUSINESS_UNITS.map(b => <option key={b}>{b}</option>)}
                   </select>
                </Field>
             </div>
          </section>

          {/* Discovery Section */}
          <section className="pt-10 border-t border-slate-50 space-y-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                   <Check className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">Discovery Metrics</h3>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Discovery Date" icon={Calendar}>
                   <input type="date" className={inputCls} value={form.discoveryCallDate} onChange={e => set('discoveryCallDate', e.target.value)} />
                </Field>
                <Field label="Data Modality">
                   <select className={selectCls} value={form.dataModality} onChange={e => set('dataModality', e.target.value)}>
                      <option value="">Select format...</option>
                      {MODALITIES.map(m => <option key={m}>{m}</option>)}
                   </select>
                </Field>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Field label="Budget Envelope">
                   <input className={inputCls} value={form.budgetRange} onChange={e => set('budgetRange', e.target.value)} placeholder="e.g. $50k+" />
                </Field>
                <Field label="Decision Maker">
                   <div className="flex bg-surface-low p-1 rounded-xl border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => set('decisionMaker', true)}
                        className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", form.decisionMaker ? "bg-white shadow text-brand-teal" : "text-slate-400 hover:text-slate-600")}
                      >
                         YES
                      </button>
                      <button 
                        type="button"
                        onClick={() => set('decisionMaker', false)}
                        className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", !form.decisionMaker ? "bg-white shadow text-slate-600" : "text-slate-400 hover:text-slate-600")}
                      >
                         NO
                      </button>
                   </div>
                </Field>
             </div>

             <Field label="Discovery Summary" icon={MessageSquare}>
                <textarea rows={3} className={cn(inputCls, "resize-none")} value={form.discoveryNotes} onChange={e => set('discoveryNotes', e.target.value)} placeholder="Key takeaways from the session..." />
             </Field>
          </section>

          {/* Logic & Routing */}
          <section className="pt-10 border-t border-slate-50 space-y-6">
             <div className="bg-slate-50 rounded-[32px] p-8 space-y-6">
                <Field label="Current Lifecycle Stage">
                   <div className="grid grid-cols-2 gap-2">
                      {STAGES.map(s => (
                        <button 
                          key={s}
                          type="button"
                          onClick={() => set('stage', s)}
                          className={cn(
                            "py-2.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all text-left flex items-center justify-between group",
                            form.stage === s 
                              ? "bg-text-primary border-text-primary text-white" 
                              : "bg-white border-slate-200 text-slate-400 hover:border-brand-teal/30 hover:text-brand-teal"
                          )}
                        >
                           {s}
                           {form.stage === s && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                   </div>
                </Field>
             </div>
          </section>
        </div>

        {/* Action Bar */}
        <div className="px-10 py-8 bg-surface-low/50 border-t border-slate-100 flex gap-4">
           <button 
             type="button"
             onClick={onClose}
             className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
           >
              DISCARD
           </button>
           <button 
             onClick={handleSubmit}
             disabled={saving}
             className="flex-[2] py-4 px-6 rounded-2xl bg-text-primary text-white text-sm font-bold shadow-2xl hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
              {saving ? 'PROCESSING...' : isEdit ? 'FINALIZE UPDATES' : 'INITIALIZE CAPTURE'}
              {!saving && <ChevronRight className="w-4 h-4 opacity-50" />}
           </button>
        </div>
      </div>
    </>
  )
}
