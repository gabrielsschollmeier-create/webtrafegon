import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, Zap, Target, Star, Shield } from 'lucide-react'
import { getAllUsers, ROLE_CONFIG, TEAM_ROLES } from '../data/users-store'

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

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [tab,      setTab]      = useState('equipe')

  const allUsers    = getAllUsers()
  const teamUsers   = allUsers.filter(u => TEAM_ROLES.includes(u.role)).slice(0, 4)
  const clientUsers = allUsers.filter(u => u.role === 'cliente').slice(0, 3)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const user = getAllUsers().find(u => u.email === email.trim() && u.password === password)
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user))
        onLogin(user)
      } else {
        setError('E-mail ou senha inválidos.')
      }
      setLoading(false)
    }, 700)
  }

  function quickLogin(user) {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('authUser', JSON.stringify(user))
      onLogin(user)
    }, 350)
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

            {/* Quick access */}
            <div className="px-7 pb-7 pt-0">
              <div className="pt-4 border-t border-border">
                {/* Tab selector */}
                <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: '#f1f3f9' }}>
                  <button
                    onClick={() => setTab('equipe')}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all"
                    style={tab === 'equipe'
                      ? { background: '#fff', color: '#1a1d2e', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                      : { color: '#8890b5' }}
                  >
                    Equipe
                  </button>
                  <button
                    onClick={() => setTab('clientes')}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all"
                    style={tab === 'clientes'
                      ? { background: '#fff', color: '#1a1d2e', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                      : { color: '#8890b5' }}
                  >
                    Clientes
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {tab === 'equipe' && (
                    <motion.div key="equipe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="grid grid-cols-2 gap-1.5">
                      {teamUsers.map(u => {
                        const cfg = ROLE_CONFIG[u.role]
                        return (
                          <button key={u.id} onClick={() => quickLogin(u)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/[0.03] transition-all text-left group">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 ring-2 ring-white"
                              style={{ backgroundColor: u.color }}>
                              {u.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-text truncate leading-tight">{u.name}</p>
                              <p className="text-[9px] font-bold truncate mt-0.5" style={{ color: cfg?.color ?? '#8890b5' }}>
                                {cfg?.icon} {cfg?.short}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                  {tab === 'clientes' && (
                    <motion.div key="clientes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="grid grid-cols-3 gap-1.5">
                      {clientUsers.length > 0 ? clientUsers.map(u => (
                        <button key={u.id} onClick={() => quickLogin(u)}
                          className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl border border-border hover:border-purple/30 hover:bg-purple/[0.03] transition-all">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white ring-2 ring-white"
                            style={{ backgroundColor: u.color }}>
                            {u.avatar}
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-text truncate max-w-[72px]">{u.name}</p>
                            <p className="text-[8px] font-bold mt-0.5" style={{ color: '#be29ec' }}>🏢 Portal</p>
                          </div>
                        </button>
                      )) : (
                        <p className="col-span-3 text-center text-xs text-muted py-4">Nenhum cliente cadastrado.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
