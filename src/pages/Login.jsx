import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, Zap, Target, Star, Check, Mail } from 'lucide-react'
import { getAllUsers, ROLE_CONFIG, getInviteByToken, acceptInvite, makeAvatar } from '../data/users-store'
import { supabase, supabaseReady } from '../lib/supabase'

const VALORES = [
  'Somos inconformados e ambiciosos',
  'Alto grau de alinhamento e autonomia',
  'Verdade nua e crua, doa a quem doer',
  'Obsessivos pelo sucesso do cliente',
  'Corremos riscos',
  'Acreditamos no mérito',
  'Fazemos mais que o combinado',
  'Somos adultos — nem tudo será divertido',
]

function InviteScreen({ invite, onLogin }) {
  const [name,    setName]    = useState('')
  const [password, setPw]     = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function handleAccept(e) {
    e.preventDefault()
    if (!name.trim() || password.length < 6) {
      setError('Nome e senha (mín. 6 caracteres) são obrigatórios.')
      return
    }
    setLoading(true)
    const params = new URLSearchParams(window.location.search)
    const user = acceptInvite(params.get('invite'), name.trim(), password)
    if (!user) { setError('Convite inválido ou já utilizado.'); setLoading(false); return }
    localStorage.setItem('authUser_v2', JSON.stringify(user))
    window.history.replaceState({}, '', '/')
    onLogin(user)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#080a12' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6eda2c, #be29ec)' }} />
          <div className="p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #6eda2c, #4ab81e)' }}>
              <Zap size={22} className="text-white" fill="white" />
            </div>
            <h2 className="text-xl font-extrabold text-text mb-1">Você foi convidado!</h2>
            <p className="text-sm text-muted mb-5">
              Entre para o TráfegOn Suite como <strong>{ROLE_CONFIG[invite.role]?.label ?? invite.role}</strong>.
              Configure sua senha para acessar.
            </p>
            <form onSubmit={handleAccept} className="space-y-4">
              <div>
                <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">Seu nome completo</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="João Silva" required autoFocus
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                  style={{ background: '#f8f9fc' }} />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">E-mail</label>
                <input value={invite.email} disabled
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-muted bg-border/30" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">Criar senha</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPw(e.target.value)}
                    placeholder="Mín. 6 caracteres" required
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all pr-11"
                    style={{ background: '#f8f9fc' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-2 p-1">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs font-semibold text-danger bg-danger/8 px-3 py-2 rounded-xl border border-danger/15">
                  {error}
                </motion.div>
              )}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all"
                style={{ background: loading ? '#a8e87a' : '#6eda2c', boxShadow: loading ? 'none' : '0 4px 20px rgba(110,218,44,0.35)' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={15} /> Criar conta e entrar</>}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ForgotPassword({ onBack }) {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      if (supabaseReady) {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + '/?reset=1',
        })
        if (err) throw err
      }
      setSent(true)
    } catch {
      setError('Não foi possível enviar. Verifique o e-mail e tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#080a12' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6eda2c, #be29ec)' }} />
          <div className="p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#6eda2c18' }}>
              <Mail size={22} style={{ color: '#6eda2c' }} />
            </div>
            {sent ? (
              <>
                <h2 className="text-xl font-extrabold text-text mb-2">E-mail enviado!</h2>
                <p className="text-sm text-muted mb-5">Verifique sua caixa de entrada e clique no link para criar uma nova senha.</p>
                <button onClick={onBack} className="w-full py-3 rounded-xl text-sm font-bold text-muted border border-border hover:bg-surface transition-colors">
                  Voltar ao login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-extrabold text-text mb-1">Esqueci minha senha</h2>
                <p className="text-sm text-muted mb-5">Digite seu e-mail e enviaremos um link para criar uma nova senha.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">E-mail</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com" required autoFocus
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                      style={{ background: '#f8f9fc' }} />
                  </div>
                  {error && <p className="text-xs font-semibold text-danger bg-danger/8 px-3 py-2 rounded-xl border border-danger/15">{error}</p>}
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all"
                    style={{ background: loading ? '#a8e87a' : '#6eda2c', boxShadow: loading ? 'none' : '0 4px 20px rgba(110,218,44,0.35)' }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Enviar link de redefinição'}
                  </motion.button>
                  <button type="button" onClick={onBack} className="w-full py-2 text-xs font-bold text-muted hover:text-text transition-colors">
                    Voltar ao login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ResetPassword({ onLogin }) {
  const [password, setPw]      = useState('')
  const [showPw,   setShowPw]  = useState(false)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) { setError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        const meta = data.user.user_metadata || {}
        const localUser = getAllUsers().find(u => u.email === data.user.email)
        const profile = {
          id: data.user.id,
          email: data.user.email,
          name:   meta.name   || localUser?.name   || data.user.email.split('@')[0],
          role:   meta.role   || localUser?.role   || 'admin',
          avatar: meta.avatar || localUser?.avatar || makeAvatar(meta.name || data.user.email.split('@')[0]),
          color:  meta.color  || localUser?.color  || '#6eda2c',
        }
        localStorage.setItem('authUser_v2', JSON.stringify(profile))
        onLogin(profile)
      }
      window.history.replaceState({}, '', '/')
    } catch {
      setError('Não foi possível redefinir. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#080a12' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6eda2c, #be29ec)' }} />
          <div className="p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#6eda2c18' }}>
              <Zap size={22} style={{ color: '#6eda2c' }} />
            </div>
            <h2 className="text-xl font-extrabold text-text mb-1">Nova senha</h2>
            <p className="text-sm text-muted mb-5">Escolha uma senha segura para sua conta.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">Nova senha</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPw(e.target.value)}
                    placeholder="Mín. 6 caracteres" required autoFocus
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all pr-11"
                    style={{ background: '#f8f9fc' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-2 p-1">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs font-semibold text-danger bg-danger/8 px-3 py-2 rounded-xl border border-danger/15">{error}</p>}
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all"
                style={{ background: loading ? '#a8e87a' : '#6eda2c', boxShadow: loading ? 'none' : '0 4px 20px rgba(110,218,44,0.35)' }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={15} /> Salvar nova senha</>}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [invite,   setInvite]   = useState(null)
  const [view,     setView]     = useState('login')

  useEffect(() => {
    // Convite por token (localStorage - legado)
    const token = new URLSearchParams(window.location.search).get('invite')
    if (token) {
      const inv = getInviteByToken(token)
      if (inv) { setInvite(inv); return }
    }
    // Redefinição de senha via link Supabase
    const hash = window.location.hash
    if (hash.includes('type=recovery') || new URLSearchParams(window.location.search).get('reset')) {
      if (supabaseReady) setView('reset')
    }
  }, [])

  if (invite) return <InviteScreen invite={invite} onLogin={onLogin} />
  if (view === 'forgot') return <ForgotPassword onBack={() => setView('login')} />
  if (view === 'reset')  return <ResetPassword  onLogin={onLogin} />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Tenta Supabase auth primeiro; se falhar, usa lista local de usuários
    if (supabaseReady) {
      try {
        const timeout  = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
        const authCall = supabase.auth.signInWithPassword({ email: email.trim(), password })
        const { data, error: authError } = await Promise.race([authCall, timeout])

        if (!authError && data?.user) {
          const meta = data.user.user_metadata || {}
          const localUser = getAllUsers().find(u => u.email === data.user.email)
          const profile = {
            id:     data.user.id,
            email:  data.user.email,
            name:   meta.name   || localUser?.name   || data.user.email.split('@')[0],
            role:   meta.role   || localUser?.role   || 'colaborador',
            avatar: meta.avatar || localUser?.avatar || makeAvatar(meta.name || data.user.email.split('@')[0]),
            color:  meta.color  || localUser?.color  || '#6eda2c',
          }
          localStorage.setItem('authUser_v2', JSON.stringify(profile))
          onLogin(profile)
          setLoading(false)
          return
        }
        // authError → cai no fallback local abaixo
      } catch {
        // timeout ou falha de rede → cai no fallback local abaixo
      }
    }

    // Fallback: autenticação local (lista de usuários em INITIAL_TEAM)
    const localUser = getAllUsers().find(u => u.email === email.trim() && u.password === password)
    if (localUser) {
      localStorage.setItem('authUser_v2', JSON.stringify(localUser))
      onLogin(localUser)
    } else {
      setError('E-mail ou senha inválidos.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080a12' }}>

      {/* ── Left panel ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[54%] relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(110,218,44,0.12) 0%, transparent 65%)' }} />
          <div className="absolute bottom-[-8%] right-[-5%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(190,41,236,0.09) 0%, transparent 65%)' }} />
          <div className="absolute top-[45%] right-[12%] w-[200px] h-[200px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 65%)' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6eda2c, #4ab81e)' }}>
                <Zap size={17} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">TráfegOn</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                style={{ background: 'rgba(110,218,44,0.15)', color: '#6eda2c', border: '1px solid rgba(110,218,44,0.25)' }}>
                Suite v1
              </span>
            </div>
          </motion.div>

          {/* Propósito */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} style={{ color: '#6eda2c' }} />
              <p className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: 'rgba(110,218,44,0.7)' }}>
                Propósito
              </p>
            </div>
            <h1 className="text-4xl font-black text-white leading-[1.1] mb-2 tracking-tight">
              Acelerar negócios &
            </h1>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight"
              style={{ background: 'linear-gradient(90deg, #6eda2c 0%, #a3e635 40%, #be29ec 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              impulsionar o empreendedorismo.
            </h1>
          </motion.div>

          {/* Visão */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-8 rounded-2xl p-4"
            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target size={12} style={{ color: '#60a5fa' }} />
              <p className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: '#60a5fa' }}>Visão</p>
            </div>
            <p className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Nos tornar um grande sistema de marketing, oportuno, complexo e que gere valor a todos.
            </p>
          </motion.div>

          {/* Valores */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="mt-6 flex-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star size={12} style={{ color: '#ea8a29' }} />
              <p className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: 'rgba(234,138,41,0.8)' }}>Valores</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VALORES.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.04 }}
                  className="flex items-start gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-[9px] font-extrabold mt-0.5 flex-shrink-0" style={{ color: '#6eda2c' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[11px] leading-snug font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{v}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-8 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.18)' }}>
            TráfegOn · CRM + ERP para agências de performance
          </motion.p>
        </div>
      </div>

      {/* ── Right panel — Form ─────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[380px]"
        >
          <div className="rounded-3xl overflow-hidden bg-white"
            style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #6eda2c, #be29ec)' }} />

            <div className="p-7">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-text">Entrar</h2>
                <p className="text-sm text-muted mt-1">Acesse sua conta TráfegOn Suite</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">E-mail</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com" required autoFocus
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                    style={{ background: '#f8f9fc' }}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-muted uppercase tracking-widest block mb-1.5">Senha</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all pr-11"
                      style={{ background: '#f8f9fc' }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-2 p-1">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end -mt-1">
                  <button type="button" onClick={() => setView('forgot')}
                    className="text-[11px] font-semibold text-muted hover:text-accent transition-colors">
                    Esqueci minha senha
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-danger bg-danger/8 px-3 py-2 rounded-xl border border-danger/15">
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit" disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all mt-1"
                  style={{ background: loading ? '#a8e87a' : '#6eda2c', boxShadow: loading ? 'none' : '0 4px 20px rgba(110,218,44,0.35)' }}
                >
                  {loading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <><span>Entrar</span><ArrowRight size={15} /></>
                  }
                </motion.button>
              </form>
            </div>

          </div>

          {/* Tagline abaixo do card */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center text-[11px] mt-5 font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Acelerar negócios & impulsionar o empreendedorismo
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
