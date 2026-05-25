/**
 * SyncStatus — indicador de sincronização em tempo real
 *
 * Mostra no topbar:
 *  • Ponto verde pulsando   = conectado e sincronizado
 *  • Spinner âmbar          = conectando / sincronizando
 *  • Ponto vermelho         = sem conexão (offline ou erro)
 *  • Badge laranja          = mutações pendentes na fila offline
 *  • Ícone Users + número   = usuários online no sistema
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, WifiOff, Users } from 'lucide-react'
import { syncEngine } from '../lib/sync-engine'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function SyncStatus({ onSync, syncing, pendingOps = 0 }) {
  const [engineStatus, setEngineStatus] = useState(syncEngine.status)
  const [onlineUsers,  setOnlineUsers]  = useState([])
  const browserOnline = useOnlineStatus()

  useEffect(() => {
    const onStatus  = (e) => setEngineStatus(e.detail)
    const onPresence = (e) => {
      const users = Object.values(e.detail)
        .flat()
        .map(p => p.userId)
        .filter(Boolean)
      setOnlineUsers(users)
    }
    syncEngine.addEventListener('statuschange', onStatus)
    syncEngine.addEventListener('presence',     onPresence)
    return () => {
      syncEngine.removeEventListener('statuschange', onStatus)
      syncEngine.removeEventListener('presence',     onPresence)
    }
  }, [])

  const isConnected    = engineStatus === 'connected' && browserOnline
  const isTransitional = engineStatus === 'connecting' || engineStatus === 'reconnecting' || syncing
  const isOffline      = !browserOnline || (engineStatus !== 'connected' && !isTransitional)

  return (
    <div className="flex items-center gap-1.5">

      {/* Operações pendentes na fila offline */}
      <AnimatePresence>
        {pendingOps > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
            style={{ background: '#ea8a2920', color: '#ea8a29' }}
            title={`${pendingOps} operação(ões) aguardando sincronização`}
          >
            {pendingOps} pend.
          </motion.span>
        )}
      </AnimatePresence>

      {/* Usuários online (mostra só se > 1 usuário — o próprio) */}
      {onlineUsers.length > 1 && (
        <div
          className="flex items-center gap-0.5 text-[10px] text-muted"
          title={`${onlineUsers.length} usuários online`}
        >
          <Users size={10} />
          <span className="font-bold">{onlineUsers.length}</span>
        </div>
      )}

      {/* Botão sync manual */}
      <button
        onClick={onSync}
        disabled={syncing || !browserOnline}
        title={syncing ? 'Sincronizando…' : 'Sincronizar agora'}
        className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
        style={{ color: syncing ? '#6eda2c' : '#8890b5' }}
      >
        <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
      </button>

      {/* Dot de status */}
      <div className="w-4 h-4 flex items-center justify-center">
        {isOffline && !isTransitional && (
          <WifiOff size={11} style={{ color: '#ef4444' }} title="Sem conexão" />
        )}
        {isTransitional && (
          <div
            className="w-2 h-2 rounded-full border-[1.5px] border-t-transparent animate-spin"
            style={{ borderColor: '#ea8a29', borderTopColor: 'transparent' }}
          />
        )}
        {isConnected && !isTransitional && (
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#6eda2c' }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            title="Conectado — sincronização em tempo real ativa"
          />
        )}
      </div>
    </div>
  )
}
