import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase, supabaseReady } from './lib/supabase'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'

/* Eager — autenticação e shell precisam carregar rápido */
import Login        from './pages/Login'
import ClientPortal from './pages/ClientPortal'

/* Lazy — cada página carrega só quando o usuário navega */
const Home          = lazy(() => import('./pages/Home'))
const Playbooks     = lazy(() => import('./pages/Playbooks'))
const Permissoes    = lazy(() => import('./pages/Permissoes'))

const Dashboard     = lazy(() => import('./pages/Dashboard'))
const Pipeline      = lazy(() => import('./pages/Pipeline'))
const Contatos      = lazy(() => import('./pages/Contatos'))
const ContatoDetail = lazy(() => import('./pages/ContatoDetail'))
const Conversas     = lazy(() => import('./pages/Conversas'))
const Calendario    = lazy(() => import('./pages/Calendario'))
const Relatorios    = lazy(() => import('./pages/Relatorios'))
const Integracoes   = lazy(() => import('./pages/Integracoes'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const Assistant     = lazy(() => import('./pages/Assistant'))
const Educacao      = lazy(() => import('./pages/Educacao'))
const Parceiros     = lazy(() => import('./pages/Parceiros'))
const Noticias      = lazy(() => import('./pages/Noticias'))
const LigacaoIA     = lazy(() => import('./pages/LigacaoIA'))

const ErpDashboard    = lazy(() => import('./pages/erp/ErpDashboard'))
const Workspaces      = lazy(() => import('./pages/erp/Workspaces'))
const WorkspaceDetail = lazy(() => import('./pages/erp/WorkspaceDetail'))
const Equipe          = lazy(() => import('./pages/erp/Equipe'))
const Entregas        = lazy(() => import('./pages/erp/Entregas'))
const WhatsApp        = lazy(() => import('./pages/erp/WhatsApp'))
const Projetos        = lazy(() => import('./pages/erp/Projetos'))

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseReady) {
      // Remove sessão antiga (pré-v2) e lê apenas a nova chave
      localStorage.removeItem('authUser')
      try {
        const stored = JSON.parse(localStorage.getItem('authUser_v2'))
        if (stored) setUser(stored)
      } catch {}
      setLoading(false)
      return
    }

    /* Timeout de segurança — se Supabase demorar >3s cai no mock */
    const timeout = setTimeout(() => setLoading(false), 3000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout)
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(profile || { ...session.user, role: 'admin' })
      }
      setLoading(false)
    }).catch(() => { clearTimeout(timeout); setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setUser(profile || { ...session.user, role: 'admin' })
        } else {
          setUser(null)
        }
      }
    )

    return () => { clearTimeout(timeout); subscription.unsubscribe() }
  }, [])

  async function handleLogout() {
    if (supabaseReady) await supabase.auth.signOut()
    localStorage.removeItem('authUser')
    localStorage.removeItem('authUser_v2')
    setUser(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080a12' }}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-white/40 text-sm">Carregando…</span>
      </div>
    </div>
  )

  if (!user) return <Login onLogin={setUser} />

  if (user.role === 'client' || user.role === 'cliente') return (
    <DataProvider>
      <ClientPortal user={user} onLogout={handleLogout} />
    </DataProvider>
  )

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout user={user} onLogout={handleLogout} />}>
            <Route path="/home"            element={<Suspense fallback={<PageLoader />}><Home user={user} /></Suspense>} />
            <Route path="/"                element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="/pipeline"        element={<Suspense fallback={<PageLoader />}><Pipeline /></Suspense>} />
            <Route path="/contatos"        element={<Suspense fallback={<PageLoader />}><Contatos /></Suspense>} />
            <Route path="/contatos/:id"    element={<Suspense fallback={<PageLoader />}><ContatoDetail /></Suspense>} />
            <Route path="/conversas"       element={<Suspense fallback={<PageLoader />}><Conversas /></Suspense>} />
            <Route path="/calendario"      element={<Suspense fallback={<PageLoader />}><Calendario /></Suspense>} />
            <Route path="/relatorios"      element={<Suspense fallback={<PageLoader />}><Relatorios /></Suspense>} />
            <Route path="/integracoes"     element={<Suspense fallback={<PageLoader />}><Integracoes /></Suspense>} />
            <Route path="/configuracoes"   element={<Suspense fallback={<PageLoader />}><Configuracoes /></Suspense>} />
            <Route path="/erp"             element={<Suspense fallback={<PageLoader />}><ErpDashboard /></Suspense>} />
            <Route path="/workspaces"      element={<Suspense fallback={<PageLoader />}><Workspaces /></Suspense>} />
            <Route path="/workspaces/:id"  element={<Suspense fallback={<PageLoader />}><WorkspaceDetail /></Suspense>} />
            <Route path="/equipe"          element={<Suspense fallback={<PageLoader />}><Equipe /></Suspense>} />
            <Route path="/entregas"        element={<Suspense fallback={<PageLoader />}><Entregas /></Suspense>} />
            <Route path="/projetos"        element={<Suspense fallback={<PageLoader />}><Projetos /></Suspense>} />
            <Route path="/playbooks"       element={<Suspense fallback={<PageLoader />}><Playbooks /></Suspense>} />
            <Route path="/whatsapp"        element={<Suspense fallback={<PageLoader />}><WhatsApp /></Suspense>} />
            <Route path="/permissoes"      element={<Suspense fallback={<PageLoader />}><Permissoes /></Suspense>} />
            <Route path="/assistant"       element={<Suspense fallback={<PageLoader />}><Assistant /></Suspense>} />
            <Route path="/educacao"        element={<Suspense fallback={<PageLoader />}><Educacao /></Suspense>} />
            <Route path="/parceiros"       element={<Suspense fallback={<PageLoader />}><Parceiros /></Suspense>} />
            <Route path="/noticias"        element={<Suspense fallback={<PageLoader />}><Noticias /></Suspense>} />
            <Route path="/ligacao-ia"      element={<Suspense fallback={<PageLoader />}><LigacaoIA /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
