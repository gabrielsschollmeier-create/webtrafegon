import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import ClientPortal from './pages/ClientPortal'
import Permissoes from './pages/Permissoes'
import Home from './pages/Home'
import Playbooks from './pages/Playbooks'

/* CRM */
import Dashboard     from './pages/Dashboard'
import Pipeline      from './pages/Pipeline'
import Contatos      from './pages/Contatos'
import ContatoDetail from './pages/ContatoDetail'
import Conversas     from './pages/Conversas'
import Calendario    from './pages/Calendario'
import Relatorios    from './pages/Relatorios'
import Integracoes   from './pages/Integracoes'
import Configuracoes from './pages/Configuracoes'

/* ERP — Operacional */
import ErpDashboard  from './pages/erp/ErpDashboard'
import Workspaces    from './pages/erp/Workspaces'
import WorkspaceDetail from './pages/erp/WorkspaceDetail'
import Equipe        from './pages/erp/Equipe'
import Entregas      from './pages/erp/Entregas'
import WhatsApp      from './pages/erp/WhatsApp'
import Projetos      from './pages/erp/Projetos'

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('authUser')) } catch { return null }
  })

  function handleLogout() {
    localStorage.removeItem('authUser')
    setUser(null)
  }

  if (!user) return <Login onLogin={setUser} />
  if (user.role === 'client' || user.role === 'cliente') return <ClientPortal user={user} onLogout={handleLogout} />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          {/* ── Home ──────────────────────── */}
          <Route path="/home"            element={<Home user={user} />} />

          {/* ── CRM ───────────────────────── */}
          <Route path="/"                element={<Dashboard />} />
          <Route path="/pipeline"        element={<Pipeline />} />
          <Route path="/contatos"        element={<Contatos />} />
          <Route path="/contatos/:id"    element={<ContatoDetail />} />
          <Route path="/conversas"       element={<Conversas />} />
          <Route path="/calendario"      element={<Calendario />} />
          <Route path="/relatorios"      element={<Relatorios />} />
          <Route path="/integracoes"     element={<Integracoes />} />
          <Route path="/configuracoes"   element={<Configuracoes />} />

          {/* ── ERP — Operacional ─────────── */}
          <Route path="/erp"             element={<ErpDashboard />} />
          <Route path="/workspaces"      element={<Workspaces />} />
          <Route path="/workspaces/:id"  element={<WorkspaceDetail />} />
          <Route path="/equipe"          element={<Equipe />} />
          <Route path="/entregas"        element={<Entregas />} />
          <Route path="/projetos"        element={<Projetos />} />
          <Route path="/playbooks"       element={<Playbooks />} />
          <Route path="/whatsapp"        element={<WhatsApp />} />
          <Route path="/permissoes"      element={<Permissoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
