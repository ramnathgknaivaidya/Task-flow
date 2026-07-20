import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button, Input } from '../../components/ui'
import { CheckSquare, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

type AuthView = 'login' | 'register'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, register, isLoading } = useAuthStore()
  const [view, setView] = useState<AuthView>('login')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [email, setEmail] = useState('admin@taskflow.com')
  const [password, setPassword] = useState('password')
  const [regPassword, setRegPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      await register(regName, regEmail, regPassword)
      toast.success('Account created! Welcome to TaskFlow')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600/20 via-[var(--bg-surface)] to-[var(--bg-base)] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(157,78,221,0.12),transparent_50%)]" />
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center mb-8">
            <CheckSquare size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Welcome to TaskFlow</h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            The enterprise-grade task planner and reminder platform that helps your team stay organized, collaborate effectively, and achieve more.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { stat: '10K+', label: 'Active Teams' },
              { stat: '99.9%', label: 'Uptime' },
              { stat: '150+', label: 'Integrations' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-2xl font-bold text-purple-400">{item.stat}</span>
                <span className="text-sm text-[var(--text-muted)]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <CheckSquare size={20} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-[var(--text-primary)]">TaskFlow</span>
          </div>

          {view === 'login' && (
            <>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Sign in</h2>
              <p className="text-sm text-[var(--text-muted)] mb-8">Enter your credentials to access your account</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="relative">
                  <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-[var(--border-hover)] bg-[var(--bg-surface-hover)] text-purple-600 focus:ring-purple-500/50" />
                    <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</button>
                </div>
                <Button type="submit" className="w-full" loading={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</Button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-[var(--bg-base)] px-3 text-[var(--text-muted)]">Or continue with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]/50 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]/50 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#00A4EF" d="M21.78 4.11v15.78c0 .61-.5 1.11-1.11 1.11H3.33c-.61 0-1.11-.5-1.11-1.11V4.11c0-.61.5-1.11 1.11-1.11h17.34c.61 0 1.11.5 1.11 1.11z"/><path fill="#fff" d="M11.11 12.89H6.67v1.78h4.44v-1.78zm6.22-3.56H6.67v1.78h10.66V9.33zm-6.22 7.11H6.67v1.78h4.44V16.44z"/></svg>
                  Microsoft
                </button>
              </div>
              <p className="text-center text-sm text-[var(--text-muted)] mt-6">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setView('register'); setRegName(''); setRegEmail(''); setRegPassword('') }}
                  className="text-purple-400 hover:text-purple-300 font-medium">Create one</button>
              </p>
            </>
          )}

          {view === 'register' && (
            <>
              <div className="flex items-center gap-3 mb-1">
                <button type="button" onClick={() => setView('login')} className="p-1 -ml-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <ArrowLeft size={18} />
                </button>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create account</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-8">Sign up with your work email</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <Input label="Full Name" placeholder="Alex Morgan" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                <Input label="Email" type="email" placeholder="you@company.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                <div className="relative">
                  <Input label="Password" type={showRegPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-[38px] text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button type="submit" className="w-full" loading={isLoading}>{isLoading ? 'Creating account...' : 'Create account'}</Button>
              </form>
              <p className="text-center text-sm text-[var(--text-muted)] mt-6">
                Already have an account?{' '}
                <button type="button" onClick={() => setView('login')} className="text-purple-400 hover:text-purple-300 font-medium">Sign in</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
