import { useState } from 'react'
import { Users2, LayoutGrid } from 'lucide-react'
import WorkspacesPage from './Workspaces'
import ProjetosPage from './Projetos'

const TABS = [
  { id: 'clientes', icon: Users2,      label: 'Clientes'  },
  { id: 'projetos', icon: LayoutGrid,  label: 'Projetos'  },
]

export default function Clientes() {
  const [tab, setTab] = useState('clientes')

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Tab bar ── */}
      <div className="flex gap-1 px-4 lg:px-6 pt-4 lg:pt-5 pb-0 flex-shrink-0">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={tab === id
              ? { background: 'rgba(110,218,44,0.14)', color: '#6eda2c', border: '1px solid rgba(110,218,44,0.25)' }
              : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }
            }
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Conteúdo ── */}
      <div className="flex-1">
        {tab === 'clientes' ? <WorkspacesPage /> : <ProjetosPage />}
      </div>
    </div>
  )
}
