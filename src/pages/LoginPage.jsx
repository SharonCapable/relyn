import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../components/auth/AuthProvider'
import { BarChart3, Sparkles, Users, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { user, signInWithGoogle, error, isDev, loading } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) return null

  return (
    <div className="min-h-screen w-full flex bg-surface font-sans overflow-hidden">
      {/* ── LEFT COLUMN: BRANDING & INSIGHTS ────────────────────────────── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-16 text-white overflow-hidden">
        {/* Editorial Gradient Background */}
        <div className="absolute inset-0 bg-[#004D46]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#006A61] via-[#00524B] to-[#003833]" />
        
        {/* Soft Ambient Light Effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal-fixed/10 rounded-full blur-[120px] -mr-64 -mt-32" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <Sparkles className="w-6 h-6 text-brand-teal-fixed" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Relyn</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-6xl font-display font-bold leading-[1.1] tracking-tight">
              The Digital <span className="text-brand-teal-fixed">Concierge</span>
            </h1>
            <p className="text-xl text-brand-teal-fixed/80 leading-relaxed font-light">
              Transforming raw sales data into intelligent, actionable insights. 
              Elevate your team with AI-powered sales intelligence.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-8">
          {[
            { icon: BarChart3, label: 'Real-time Metrics', desc: 'Instant pipeline visibility' },
            { icon: Sparkles, label: 'AI AI Insights', desc: 'Predictive lead scoring' },
            { icon: Users, label: 'Team Analytics', desc: 'Performance-driven coaching' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-teal-fixed group-hover:bg-white/10 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">{item.label}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between text-sm text-white/40">
          <p>© 2026 Relyn — Centralized CRM</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: LOGIN PORTAL ─────────────────────────────────── */}
      <div className="flex-1 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-surface-low">
        {/* Vibrant Background Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[140px] animate-pulse" />
        
        <div className="w-full max-w-[480px] relative z-20">
          <div className="mb-10 text-center lg:hidden">
             <span className="text-3xl font-display font-bold text-brand-teal">Relyn</span>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[32px] p-8 sm:p-12 transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.15)]">
            <div className="mb-10">
              <h2 className="text-4xl font-display font-bold text-text-primary tracking-tight">
                Welcome to <span className="text-brand-blue">Relyn</span>
              </h2>
              <p className="text-text-secondary mt-3 text-lg font-light">
                Sign in to access your intelligence dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-4 rounded-2xl bg-white border border-slate-200 py-4 px-6 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {isDev && (
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-brand-orange text-white py-4 px-6 text-base font-semibold hover:bg-brand-orange-container active:scale-[0.98] transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5" />
                  Sign in as Developer
                </button>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
               <div className="flex items-center justify-between text-xs text-slate-400 font-medium tracking-wide uppercase">
                 <span>Privacy Secured</span>
                 <span>Enterprise Ready</span>
                 <span>AI Core</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
