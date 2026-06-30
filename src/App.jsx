import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, supabaseReady } from './lib/supabase'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'
import { EMAIL_MODULE_OVERRIDES, getAllUsers } from './data/users-store'

/* Eager — carregam junto com o shell */
import Login        from './pages/Login'
import ClientPortal from './pages/ClientPortal'

/* Lazy — cada página carrega só quando o usuário navega */
const Home          = lazy(() => import('./pages/Home'))
const Playbooks     = lazy(() => import('./pages/Playbooks'))
const Permissoes    = lazy(() => import('./pages/Permissoes'))

const Integracoes   = lazy(() => import('./pages/Integracoes'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))

const ErpDashboard    = lazy(() => import('./pages/erp/ErpDashboard'))
const Clientes        = lazy(() => import('./pages/erp/Clientes'))
const Workspaces      = lazy(() => import('./pages/erp/Workspaces'))
const WorkspaceDetail = lazy(() => import('./pages/erp/WorkspaceDetail'))
const Equipe          = lazy(() => import('./pages/erp/Equipe'))
const Entregas        = lazy(() => import('./pages/erp/Entregas'))
const WhatsApp        = lazy(() => import('./pages/erp/WhatsApp'))
const Arena           = lazy(() => import('./pages/Arena'))
const AgendaInterna   = lazy(() => import('./pages/AgendaInterna'))
const BaseConhecimento = lazy(() => import('./pages/BaseConhecimento'))
const Partnership      = lazy(() => import('./pages/Partnership'))

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function buildProfile(supaUser, profileRow) {
  const meta = supaUser.user_metadata || {}
  const row  = profileRow || {}
  const moduleOverrides = EMAIL_MODULE_OVERRIDES?.[supaUser.email] || undefined
  const localUser = getAllUsers().find(u => u.email === supaUser.email)
  return {
    id:              supaUser.id,
    email:           supaUser.email,
    name:            localUser?.name || row.name   || meta.name   || supaUser.email.split('@')[0],
    role:            row.role   || meta.role   || localUser?.role || 'colaborador',
    avatar:          localUser?.avatar || row.avatar || meta.avatar || (supaUser.email[0] || 'U').toUpperCase(),
    color:           localUser?.color  || row.color  || meta.color  || '#6eda2c',
    clientId:        row.client_slug || meta.clientId,
    portalModules:   row.portal_modules || meta.portalModules,
    moduleOverrides,
  }
}

function getLocalUser() {
  try {
    const cached = JSON.parse(localStorage.getItem('authUser_v2'))
    if (!cached) return null
    // Enrich with local store to ensure clientId/role fields are always present
    const localDef = getAllUsers().find(u => u.email === cached.email)
    // localDef.name/avatar/color sempre ganham — são a fonte canônica do INITIAL_TEAM
    const user = localDef
      ? { ...localDef, ...cached, name: localDef.name || cached.name, avatar: localDef.avatar || cached.avatar, color: localDef.color || cached.color }
      : cached
    const fresh = EMAIL_MODULE_OVERRIDES[cached.email]
    return fresh ? { ...user, moduleOverrides: fresh } : user
  } catch { return null }
}

function isClientRole(role) {
  return role === 'cliente' || role === 'client'
}

export default function App() {
  // Inicializa IMEDIATAMENTE do localStorage — zero spinner se já logado
  const [user, setUser]       = useState(getLocalUser)
  // Clientes usam auth local — não precisam validar com Supabase
  const [loading, setLoading] = useState(() => {
    const u = getLocalUser()
    return supabaseReady && !isClientRole(u?.role)
  })

  useEffect(() => {
    if (!supabaseReady) return
    // Clientes do portal usam auth local — Supabase não é necessário para eles
    if (isClientRole(getLocalUser()?.role)) return

    // Timeout de segurança — libera o loading após 6s em qualquer caso
    const hardTimer = setTimeout(() => setLoading(false), 6000)

    async function loadUserFromSession(session) {
      if (!session?.user) { setLoading(false); return }
      let profileRow = null
      try {
        const { data } = await Promise.race([
          supabase.from('profiles').select('*').eq('id', session.user.id).single(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
        ])
        profileRow = data
      } catch {}
      const builtProfile = buildProfile(session.user, profileRow)
      localStorage.setItem('authUser_v2', JSON.stringify(builtProfile))
      // Renova timestamp de atividade para evitar logout automático por inatividade
      try { localStorage.setItem('trafegon_last_activity', String(Date.now())) } catch {}
      setUser(builtProfile)
      clearTimeout(hardTimer)
      setLoading(false)
    }

    // Fonte única de verdade: onAuthStateChange
    // INITIAL_SESSION dispara na montagem com a sessão atual (ou null)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          // Se há sessão Supabase de usuário interno mas o cache local é um cliente,
          // o cliente tem prioridade — Supabase não deve sobrescrever auth local
          const cachedUser = getLocalUser()
          if (isClientRole(cachedUser?.role)) {
            clearTimeout(hardTimer)
            setUser(cachedUser)
            setLoading(false)
            return
          }
          if (session?.user) {
            await loadUserFromSession(session)
          } else {
            clearTimeout(hardTimer)
            // Usuários com senha no users-store usam auth local — sem sessão Supabase é normal
            const localDef = cachedUser ? getAllUsers().find(u => u.email === cachedUser.email) : null
            if (cachedUser && localDef?.password) {
              // Auth local: manter sessão sem Supabase
              setUser(cachedUser)
              setLoading(false)
            } else {
              // Supabase auth com sessão expirada — exigir novo login
              if (cachedUser) {
                localStorage.removeItem('authUser_v2')
                localStorage.removeItem('trafegon_auth')
              }
              setUser(null)
              setLoading(false)
            }
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          // Não sobrescrever cliente com sessão Supabase de usuário interno
          if (isClientRole(getLocalUser()?.role)) return
          const currentUser = getLocalUser()
          const currentLocalDef = currentUser ? getAllUsers().find(u => u.email === currentUser.email) : null
          // Usuários com senha local usam auth local — Supabase nunca deve sobrescrever
          if (currentLocalDef?.password) return
          await loadUserFromSession(session)
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // Clientes usam auth local — SIGNED_OUT do Supabase não os afeta
          if (isClientRole(getLocalUser()?.role)) { setLoading(false); return }
          // Usuários com senha local não devem ser deslogados por eventos do Supabase
          const localUserNow = getLocalUser()
          const localDefNow = localUserNow ? getAllUsers().find(u => u.email === localUserNow.email) : null
          if (localDefNow?.password) { setLoading(false); return }
          // Verificação extra: se há sessão Supabase ativa, este SIGNED_OUT é stale (sessão antiga sendo limpa)
          try {
            const { data: { session: activeSess } } = await supabase.auth.getSession()
            if (activeSess) { setLoading(false); return }
          } catch {}
          localStorage.removeItem('authUser_v2')
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => { subscription.unsubscribe(); clearTimeout(hardTimer) }
  }, [])

  async function handleLogout() {
    setUser(null)
    localStorage.removeItem('authUser_v2')
    if (supabaseReady) {
      try { await supabase.auth.signOut() } catch {}
    }
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
      <BrowserRouter>
        <Routes>
          <Route path="/workspaces/:id" element={
            <Suspense fallback={<PageLoader />}>
              <WorkspaceDetail clientUser={user} onLogout={handleLogout} />
            </Suspense>
          } />
          <Route path="*" element={<Navigate to={`/workspaces/${user.clientId}`} replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout user={user} onLogout={handleLogout} />}>
            <Route path="/home"            element={<Suspense fallback={<PageLoader />}><Home user={user} /></Suspense>} />
            <Route path="/"                element={<Navigate to="/home" replace />} />
            <Route path="/integracoes"     element={<Suspense fallback={<PageLoader />}><Integracoes /></Suspense>} />
            <Route path="/configuracoes"   element={<Suspense fallback={<PageLoader />}><Configuracoes user={user} /></Suspense>} />
            <Route path="/erp"             element={<Suspense fallback={<PageLoader />}><ErpDashboard /></Suspense>} />
            <Route path="/clientes"        element={<Suspense fallback={<PageLoader />}><Clientes /></Suspense>} />
            <Route path="/workspaces/:id"  element={<Suspense fallback={<PageLoader />}><WorkspaceDetail /></Suspense>} />
            <Route path="/workspaces"      element={<Navigate to="/clientes" replace />} />
            <Route path="/projetos"        element={<Navigate to="/clientes" replace />} />
            <Route path="/equipe"          element={<Suspense fallback={<PageLoader />}><Equipe /></Suspense>} />
            <Route path="/entregas"        element={<Suspense fallback={<PageLoader />}><Entregas /></Suspense>} />
            <Route path="/playbooks"       element={<Suspense fallback={<PageLoader />}><Playbooks /></Suspense>} />
            <Route path="/whatsapp"        element={<Suspense fallback={<PageLoader />}><WhatsApp /></Suspense>} />
            <Route path="/permissoes"      element={<Suspense fallback={<PageLoader />}><Permissoes /></Suspense>} />
            <Route path="/noticias"        element={<Navigate to="/home" replace />} />
            <Route path="/arena"           element={<Suspense fallback={<PageLoader />}><Arena /></Suspense>} />
            <Route path="/agenda"          element={<Suspense fallback={<PageLoader />}><AgendaInterna /></Suspense>} />
            <Route path="/conhecimento"    element={<Suspense fallback={<PageLoader />}><BaseConhecimento /></Suspense>} />
            <Route path="/partnership"    element={<Suspense fallback={<PageLoader />}><Partnership user={user} /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
