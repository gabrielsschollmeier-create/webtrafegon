/**
 * SyncEngine — motor de sincronização em tempo real
 *
 * Responsabilidade: APENAS o canal de broadcast (WebSocket entre clientes).
 * O postgres_changes fica no DataContext para evitar canais duplicados.
 *
 * Reconexão automática com backoff exponencial (2s → 4s → 8s → max 30s)
 * Presence — rastreia quem está online
 */
import { supabase, supabaseReady } from './supabase'

const BROADCAST_CH  = 'trafegon-sync-v4'
const INITIAL_DELAY = 2000
const MAX_DELAY     = 30000

class SyncEngine extends EventTarget {
  constructor() {
    super()
    this.status       = 'idle'
    this.presenceState = {}
    this._bcastCh     = null
    this._reconnectTimer = null
    this._reconnectDelay = INITIAL_DELAY
    this._userId      = null
    this._connected   = false
  }

  /* ── API pública ─────────────────────────────────────────── */

  connect(userId) {
    this._userId = userId || null
    if (!supabaseReady) { this._setStatus('offline'); return }
    this._connectBroadcast()
  }

  disconnect() {
    clearTimeout(this._reconnectTimer)
    if (this._bcastCh) { supabase.removeChannel(this._bcastCh); this._bcastCh = null }
    this._connected = false
    this._setStatus('idle')
  }

  async publish(event, payload = {}) {
    if (!supabaseReady || !this._bcastCh) return false
    try {
      const res = await this._bcastCh.send({
        type: 'broadcast',
        event,
        payload: { ...payload, _from: this._userId, _ts: Date.now() },
      })
      return res === 'ok'
    } catch { return false }
  }

  get onlineUsers() {
    return Object.values(this.presenceState)
      .flat()
      .map(p => p.userId)
      .filter(Boolean)
  }

  /* ── Internos ────────────────────────────────────────────── */

  _setStatus(status) {
    if (this.status === status) return
    this.status = status
    this.dispatchEvent(new CustomEvent('statuschange', { detail: status }))
  }

  _connectBroadcast() {
    if (this._bcastCh) { supabase.removeChannel(this._bcastCh); this._bcastCh = null }
    this._setStatus('connecting')

    this._bcastCh = supabase
      .channel(BROADCAST_CH, {
        config: {
          broadcast: { self: false, ack: false },
          presence:  { key: this._userId || `anon_${Math.random().toString(36).slice(2, 7)}` },
        },
      })
      .on('broadcast', { event: 'tasks_changed' }, () => {
        this.dispatchEvent(new CustomEvent('tasks_changed'))
      })
      .on('broadcast', { event: 'data_changed' }, () => {
        this.dispatchEvent(new CustomEvent('data_changed'))
      })
      .on('presence', { event: 'sync' }, () => {
        this.presenceState = this._bcastCh.presenceState()
        this.dispatchEvent(new CustomEvent('presence', { detail: { ...this.presenceState } }))
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.dispatchEvent(new CustomEvent('presence_join', { detail: { key, newPresences } }))
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.dispatchEvent(new CustomEvent('presence_leave', { detail: { key, leftPresences } }))
      })
      .subscribe((channelStatus) => {
        if (channelStatus === 'SUBSCRIBED') {
          this._connected      = true
          this._reconnectDelay = INITIAL_DELAY
          clearTimeout(this._reconnectTimer)
          this._setStatus('connected')
          if (this._userId) {
            this._bcastCh.track({ userId: this._userId, joinedAt: Date.now() })
          }
          this.dispatchEvent(new CustomEvent('reconnected'))
        } else if (
          channelStatus === 'CHANNEL_ERROR' ||
          channelStatus === 'TIMED_OUT'     ||
          channelStatus === 'CLOSED'
        ) {
          this._connected = false
          this._setStatus('reconnecting')
          this._scheduleReconnect()
        }
      })
  }

  _scheduleReconnect() {
    clearTimeout(this._reconnectTimer)
    const delay = this._reconnectDelay
    this._reconnectDelay = Math.min(this._reconnectDelay * 1.5, MAX_DELAY)
    this._reconnectTimer = setTimeout(() => {
      if (!this._connected) this._connectBroadcast()
    }, delay)
  }
}

export const syncEngine = new SyncEngine()
