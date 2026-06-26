import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'
import { syncEngine } from '../lib/sync-engine'
import { mqPush, mqRemove, mqBump, mqGetAll, mqCount } from '../lib/mutation-queue'
import * as mock from '../data/mock'
import * as erpMock from '../data/erp-mock'
import {
  getTasks, saveTasks, addTaskLocal, updateTaskLocal, deleteTaskLocal,
  getMilestones, saveMilestones, addMilestoneLocal,
} from '../data/tasks-store'
import { SEED_KNOWLEDGE } from '../data/knowledge-seeds'

const DataContext = createContext(null)

// ── Cache local para stale-while-revalidate ───────────────────
const META_CACHE_KEY = 'trafegon_meta_cache_v1'
const CACHE_TTL = 12 * 60 * 60 * 1000 // 12h

function saveMeta(data) {
  try { localStorage.setItem(META_CACHE_KEY, JSON.stringify({ ...data, _ts: Date.now() })) } catch {}
}
function loadMeta() {
  try {
    const raw = localStorage.getItem(META_CACHE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (Date.now() - (p._ts || 0) > CACHE_TTL) return null
    return p
  } catch { return null }
}

export function DataProvider({ children }) {
  const [tasks,         setTasks]         = useState([])
  const [erpClients,    setErpClients]    = useState([])
  const [meetings,      setMeetings]      = useState([])
  const [collaborators, setCollaborators] = useState([])
  const [milestones,    setMilestones]    = useState([])
  const [monthlyStats,  setMonthlyStats]  = useState([])
  const [knowledge,     setKnowledge]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [lastSync,      setLastSync]      = useState(null)
  const [syncing,       setSyncing]       = useState(false)
  const [pendingOps,    setPendingOps]    = useState(() => mqCount())
  // Refs estáveis — evitam closures antigas nos event listeners do syncEngine
  const fetchTasksRef    = useRef(null)
  const drainQueueRef    = useRef(null)
  const nativeBcRef      = useRef(null) // BroadcastChannel nativo entre abas
  const pendingWrites    = useRef(new Map()) // id → updates pendentes (ainda não confirmados pelo Supabase)
  const fetchSchedulerRef = useRef(null) // debounce: coaliza múltiplos eventos num único fetchTasks

  // ── Carregar dados ─────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!supabaseReady) {
      // Fallback: localStorage primeiro, depois mock
      const lsTasks      = getTasks()
      const lsMilestones = getMilestones()
      const lsIds   = new Set(lsTasks.map(t => String(t.id)))
      const merged  = [...lsTasks, ...erpMock.tasks.filter(t => !lsIds.has(String(t.id)))]
      setTasks(merged)
      setErpClients(erpMock.erpClients)
      setMeetings(erpMock.meetings)
      setCollaborators(erpMock.collaborators)
      const lsMsIds  = new Set(lsMilestones.map(m => String(m.id)))
      const mergedMs = [...lsMilestones, ...erpMock.milestones.filter(m => !lsMsIds.has(String(m.id)))]
      setMilestones(mergedMs)
      setMonthlyStats(mock.monthlyData)
      try {
        const stored = JSON.parse(localStorage.getItem('trafegon_knowledge_v1') || '[]')
        setKnowledge(stored.length ? stored : SEED_KNOWLEDGE)
      } catch { setKnowledge(SEED_KNOWLEDGE) }
      setLoading(false)
      return
    }

    // Stale-while-revalidate: mostra dados do cache imediatamente, sem spinner
    const cache    = loadMeta()
    const lsTasks  = getTasks()
    if (lsTasks.length || cache) {
      if (lsTasks.length) {
        const lsIds     = new Set(lsTasks.map(t => String(t.id)))
        const withMock  = [...lsTasks, ...erpMock.tasks.filter(t => !lsIds.has(String(t.id)))]
        setTasks(withMock)
      }
      if (cache?.erpClients?.length)    setErpClients(cache.erpClients)
      if (cache?.meetings?.length)      setMeetings(cache.meetings)
      if (cache?.collaborators?.length) setCollaborators(cache.collaborators)
      if (cache?.milestones?.length)    setMilestones(cache.milestones)
      if (cache?.monthlyStats?.length)  setMonthlyStats(cache.monthlyStats)
      if (cache?.knowledge?.length)     setKnowledge(cache.knowledge)
      setLoading(false) // UI aparece imediatamente com dados do cache
    }

    try {
      const [
        { data: dbTasks },
        { data: dbClients },
        { data: dbMeetings },
        { data: dbCollaborators },
        { data: dbMilestones },
        { data: dbMonthly },
        { data: dbKnowledge },
      ] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('erp_clients').select('*'),
        supabase.from('meetings').select('*').order('date'),
        supabase.from('collaborators').select('*'),
        supabase.from('milestones').select('*').order('date'),
        supabase.from('monthly_stats').select('*').order('year').order('id'),
        supabase.from('ai_knowledge').select('*').eq('is_active', true).order('use_count', { ascending: false }),
      ])

      // Normalizar tarefas
      const normalizedTasks = (dbTasks || []).map(t => {
        const allC = (() => {
          if (!t.comments) return []
          if (Array.isArray(t.comments)) return t.comments
          try { return JSON.parse(t.comments) } catch { return [] }
        })()
        return {
          id:              t.id,
          clientId:        t.client_id,
          title:           t.title,
          type:            t.type,
          status:          t.status,
          priority:        t.priority,
          assignee:        t.assignee,
          dueDate:         t.due_date,
          createdAt:       t.created_at?.split('T')[0] || '',
          description:     t.description,
          materialLink:    t.material_link   || null,
          level:           t.level           || 'operacao',
          flag:            t.flag            || null,
          comments:        allC,
          coResponsaveis:  t.co_responsaveis || null,
          steps:           allC.filter(c => c?._type === 'step').map(c => c.step).filter(Boolean),
          taskHistory:     allC.filter(c => c?._type === 'history'),
          recurring:       allC.find(c => c?._type === 'meta')?.recurring || null,
          createdBy:       allC.find(c => c?._type === 'meta')?.createdBy || null,
        }
      })

      // Normalizar clientes ERP
      const CLIENT_SUBTYPE_OVERRIDES = {
        agencia:       'recorrente',
        dsorrir:       'destrava_digital',
        luciana_vasco: 'destrava_digital',
        plano_ideal:   'destrava_digital',
        girassol_arq:    'destrava_digital',
        maria_elisabeth: 'destrava_digital',
        patricia_ramos:  'destrava_digital',
      }
      const cachedClientsMap = Object.fromEntries((cache?.erpClients || []).map(c => [c.id, c]))
      const normalizedClients = (dbClients || []).map(c => ({
        id:           c.id,
        name:         c.name,
        color:        c.color,
        manager:      c.manager_id,
        status:       c.status,
        since:        c.since,
        monthlyValue: Number(c.monthly_value) || 0,
        niche:        c.niche,
        clientType:   CLIENT_SUBTYPE_OVERRIDES[c.id] || c.client_type || 'recorrente',
        driveUrl:     c.drive_url || cachedClientsMap[c.id]?.driveUrl || '',
      }))

      // Normalizar reuniões
      const normalizedMeetings = (dbMeetings || []).map(m => ({
        id:        m.id,
        clientId:  m.client_id,
        title:     m.title,
        date:      m.date,
        time:      m.time,
        duration:  m.duration,
        attendees: m.attendees || [],
        type:      m.type,
      }))

      // Normalizar marcos
      const normalizedMilestones = (dbMilestones || []).map(m => ({
        id:          m.id,
        clientId:    m.client_id,
        date:        m.date,
        type:        m.type,
        title:       m.title,
        description: m.description,
      }))

      // Normalizar stats mensais
      const normalizedMonthly = (dbMonthly || []).map(m => ({
        mes:     m.mes,
        leads:   m.leads,
        fechados: m.fechados,
        receita: Number(m.receita) || 0,
      }))

      // Merge erp_clients: Supabase + quaisquer IDs que só existem no mock
      const supabaseClientIds = new Set(normalizedClients.map(c => c.id))
      const mockOnlyClients   = erpMock.erpClients.filter(c => !supabaseClientIds.has(c.id))
      const mergedClients     = normalizedClients.length
        ? [...normalizedClients, ...mockOnlyClients]
        : erpMock.erpClients

      // Merge tasks: Supabase + localStorage (criados offline)
      const lsTasks      = getTasks()
      const lsMilestones = getMilestones()
      const supabaseTaskIds     = new Set((normalizedTasks).map(t => String(t.id)))
      const supabaseClientIds   = new Set(normalizedTasks.map(t => t.clientId).filter(Boolean))
      // Offline tasks = tarefas no localStorage que NÃO estão no Supabase
      // Descarta tasks cujo cliente já tem dados reais no Supabase (são tasks deletadas que
      // sobreviveram no cache local e não devem ressurgir como "offline")
      const offlineTasks = lsTasks.filter(t =>
        !supabaseTaskIds.has(String(t.id)) && !supabaseClientIds.has(t.clientId)
      )
      const mergedTasks  = [...normalizedTasks, ...offlineTasks]
      const supabaseMsIds      = new Set((normalizedMilestones).map(m => String(m.id)))
      const clientsWithRealMs  = new Set(normalizedMilestones.map(m => m.clientId).filter(Boolean))
      const supabaseMsClientIds = new Set(normalizedMilestones.map(m => m.clientId).filter(Boolean))
      const offlineMs    = lsMilestones.filter(m =>
        !supabaseMsIds.has(String(m.id)) && !supabaseMsClientIds.has(m.clientId)
      )
      const mockOnlyMs   = erpMock.milestones.filter(m =>
        !supabaseMsIds.has(String(m.id)) && !clientsWithRealMs.has(m.clientId)
      )
      const mergedMs     = [...normalizedMilestones, ...offlineMs, ...mockOnlyMs].sort((a, b) => a.date.localeCompare(b.date))

      setErpClients(mergedClients)
      // Inclui tasks do mock apenas para clientes que NÃO têm tasks reais no Supabase
      // (evita misturar dados demo com tasks reais que têm statuses diferentes)
      const allTaskIds          = new Set(mergedTasks.map(t => String(t.id)))
      const clientsWithRealData = new Set(mergedTasks.map(t => t.clientId).filter(Boolean))
      const mockOnlyTasks = erpMock.tasks.filter(t =>
        !allTaskIds.has(String(t.id)) && !clientsWithRealData.has(t.clientId)
      )
      const finalTasks = [...mergedTasks, ...mockOnlyTasks]
      setTasks(finalTasks)
      // Persiste apenas tasks do Supabase no localStorage (elimina cache stale de tasks deletadas)
      saveTasks(normalizedTasks)
      setMeetings(normalizedMeetings.length   ? normalizedMeetings    : erpMock.meetings)
      // Normalizar colaboradores — Supabase usa snake_case, componentes esperam camelCase
      // Só aceita IDs do Supabase que existam no mock (filtra fantasmas como jc/am/rf removidos)
      const mockCollabMap  = Object.fromEntries(erpMock.collaborators.map(c => [c.id, c]))
      const validMockIds   = new Set(erpMock.collaborators.map(c => c.id))
      const supabaseCollabIds = new Set((dbCollaborators || []).map(c => c.id))
      const normalizedCollaborators = (dbCollaborators || [])
        .filter(c => validMockIds.has(c.id))   // descarta jc/am/rf e outros IDs removidos
        .map(c => {
          const fb = mockCollabMap[c.id] || {}
          return {
            ...fb,
            id:               c.id,
            name:             fb.name            || c.name             || '',
            email:            c.email            || fb.email            || '',
            role:             fb.role            || c.role             || '',
            avatar:           fb.avatar          || c.avatar           || '',
            color:            fb.color           || c.color            || '#8890b5',
            level:            Number(c.level)    || fb.level            || 1,
            rank:             c.rank             || fb.rank             || '',
            streak:           Number(c.streak)   || fb.streak           || 0,
            tasksCompleted:   Number(c.tasks_completed  ?? c.tasksCompleted)  || fb.tasksCompleted  || 0,
            tasksThisMonth:   Number(c.tasks_this_month ?? c.tasksThisMonth)  || fb.tasksThisMonth  || 0,
            since:            fb.since           || c.since             || '2025-01-01',
            deliveriesByType: c.deliveries_by_type ?? c.deliveriesByType ?? fb.deliveriesByType ?? { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
            badges:           c.badges           ?? fb.badges           ?? [],
          }
        })
      // Merge: adiciona do mock qualquer membro que não esteja no Supabase ainda
      const mockOnlyCollabs = erpMock.collaborators.filter(c => !supabaseCollabIds.has(c.id))
      const mergedCollaborators = normalizedCollaborators.length
        ? [...normalizedCollaborators, ...mockOnlyCollabs]
        : erpMock.collaborators
      setCollaborators(mergedCollaborators)
      setMilestones(mergedMs)
      setMonthlyStats(normalizedMonthly.length  ? normalizedMonthly   : mock.monthlyData)
      // Knowledge base
      let resolvedKnowledge = SEED_KNOWLEDGE
      if (dbKnowledge?.length) {
        setKnowledge(dbKnowledge)
        resolvedKnowledge = dbKnowledge
      } else {
        try {
          const stored = JSON.parse(localStorage.getItem('trafegon_knowledge_v1') || '[]')
          const k = stored.length ? stored : SEED_KNOWLEDGE
          setKnowledge(k)
          resolvedKnowledge = k
        } catch { setKnowledge(SEED_KNOWLEDGE) }
      }

      // Salva cache para próxima visita (stale-while-revalidate)
      saveMeta({
        erpClients:    mergedClients,
        meetings:      normalizedMeetings.length ? normalizedMeetings : erpMock.meetings,
        collaborators: mergedCollaborators,
        milestones:    mergedMs,
        monthlyStats:  normalizedMonthly.length  ? normalizedMonthly  : mock.monthlyData,
        knowledge:     resolvedKnowledge,
      })
    } catch (err) {
      // Supabase falhou — se cache foi mostrado, apenas loga; senão fallback para mock
      console.warn('Supabase load failed, falling back to localStorage + mock:', err.message)
      if (!loadMeta() && !getTasks().length) {
        const lsTasksFallback      = getTasks()
        const lsMilestonesFallback = getMilestones()
        setTasks(lsTasksFallback.length           ? lsTasksFallback      : erpMock.tasks)
        setErpClients(erpMock.erpClients)
        setMeetings(erpMock.meetings)
        setCollaborators(erpMock.collaborators)
        setMilestones(lsMilestonesFallback.length ? lsMilestonesFallback : erpMock.milestones)
        setMonthlyStats(mock.monthlyData)
        try {
          const stored = JSON.parse(localStorage.getItem('trafegon_knowledge_v1') || '[]')
          setKnowledge(stored.length ? stored : SEED_KNOWLEDGE)
        } catch { setKnowledge(SEED_KNOWLEDGE) }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── fetchTasks: busca tarefas do Supabase e atualiza estado ─
  const fetchTasks = useCallback(async () => {
    if (!supabaseReady) return
    try {
      const { data, error } = await supabase
        .from('tasks').select('*').order('created_at', { ascending: false })
      if (error || !data) return
      const normalized = data.map(t => {
        const allC = (() => {
          if (!t.comments) return []
          if (Array.isArray(t.comments)) return t.comments
          try { return JSON.parse(t.comments) } catch { return [] }
        })()
        return {
          id:             t.id,
          clientId:       t.client_id,
          title:          t.title,
          type:           t.type,
          status:         t.status,
          priority:       t.priority,
          assignee:       t.assignee,
          dueDate:        t.due_date,
          createdAt:      t.created_at?.split('T')[0] || '',
          description:    t.description,
          materialLink:   t.material_link   || null,
          flag:           t.flag            || null,
          level:          t.level           || 'operacao',
          comments:       allC,
          coResponsaveis: t.co_responsaveis || null,
          steps:          allC.filter(c => c?._type === 'step').map(c => c.step).filter(Boolean),
          taskHistory:    allC.filter(c => c?._type === 'history'),
          recurring:      allC.find(c => c?._type === 'meta')?.recurring || null,
          createdBy:      allC.find(c => c?._type === 'meta')?.createdBy || null,
        }
      })
      // Preserva completedAt salvo localmente (campo não existe no Supabase)
      const lsMap = Object.fromEntries(getTasks().map(t => [String(t.id), t]))
      // Preserva escritas otimistas que ainda não foram confirmadas pelo Supabase
      const pending = pendingWrites.current
      const merged = normalized.map(t => {
        const key = String(t.id)
        const opt = pending.get(key)
        const completedAt = opt?.completedAt ?? lsMap[key]?.completedAt ?? null
        return { ...(opt ? { ...t, ...opt } : t), ...(completedAt ? { completedAt } : {}) }
      })
      setTasks(merged)
      saveTasks(merged)
      setLastSync(new Date())
    } catch (err) {
      console.warn('[fetchTasks] falhou:', err?.message)
    }
  }, [])

  // Mantém ref estável para uso nos listeners do syncEngine
  useEffect(() => { fetchTasksRef.current = fetchTasks }, [fetchTasks])

  // ── drainQueue: reprocessa operações offline pendentes ──────
  const drainQueue = useCallback(async () => {
    if (!supabaseReady) return
    const ops = mqGetAll()
    if (ops.length === 0) return
    let changed = false
    for (const op of ops) {
      try {
        if (op._type === 'insert_task') {
          const { error } = await supabase.from('tasks').insert(op.payload)
          if (!error) { mqRemove(op._id); changed = true }
          else mqBump(op._id)
        } else if (op._type === 'update_task') {
          const { error } = await supabase.from('tasks').update(op.payload).eq('id', op._targetId)
          if (!error) { mqRemove(op._id); changed = true }
          else mqBump(op._id)
        } else if (op._type === 'delete_task') {
          const { error } = await supabase.from('tasks').delete().eq('id', op._targetId)
          if (!error) { mqRemove(op._id); changed = true }
          else mqBump(op._id)
        }
      } catch (err) { console.warn('[drainQueue] op falhou:', op._type, err?.message); mqBump(op._id) }
    }
    setPendingOps(mqCount())
    if (changed) {
      await fetchTasksRef.current?.()
      syncEngine.publish('tasks_changed')
    }
  }, [])

  useEffect(() => { drainQueueRef.current = drainQueue }, [drainQueue])

  // ── Subscriptions ─────────────────────────────────────────────
  useEffect(() => {
    loadAll()
    if (!supabaseReady) return

    // Debounce: BroadcastChannel + syncEngine + postgres_changes disparam quase ao mesmo tempo.
    // scheduleFetch coaliza todos num único fetchTasks por janela de 200ms.
    function scheduleFetch() {
      clearTimeout(fetchSchedulerRef.current)
      fetchSchedulerRef.current = setTimeout(() => fetchTasksRef.current?.(), 200)
    }

    // BroadcastChannel nativo (mesmo browser, abas diferentes)
    let nativeBc = null
    try {
      nativeBc = new BroadcastChannel('trafegon-tasks-v1')
      nativeBc.onmessage = () => scheduleFetch()
      nativeBcRef.current = nativeBc
    } catch (err) {
      console.warn('[sync] BroadcastChannel indisponível:', err?.message)
    }

    // Supabase broadcast (cross-device)
    let userId = null
    try {
      const s = JSON.parse(localStorage.getItem('authUser_v2') || '{}')
      userId = s.id || s.email || null
    } catch {}
    syncEngine.connect(userId)

    const onTasksChanged = () => scheduleFetch()
    const onReconnected  = () => { scheduleFetch(); drainQueueRef.current?.() }
    syncEngine.addEventListener('tasks_changed', onTasksChanged)
    syncEngine.addEventListener('reconnected',   onReconnected)

    // postgres_changes (cross-device, backup)
    const realtimeCh = supabase.channel('trafegon-rt-v5')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        scheduleFetch()
      })
      .subscribe()

    // Poll inteligente: 30s quando aba ativa, pausado quando em background (Visibility API).
    // Antes: setInterval 1.5s = ~19.200 req/dia. Agora: max ~960 req/dia, 0 quando em background.
    let pollTimer = null
    function schedulePoll() {
      clearTimeout(pollTimer)
      if (document.visibilityState === 'hidden') return
      pollTimer = setTimeout(() => {
        fetchTasksRef.current?.()
        schedulePoll()
      }, 30_000)
    }
    schedulePoll()

    // Ao voltar para a aba: busca imediata + retoma polling
    const onFocus = () => { scheduleFetch(); schedulePoll() }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { scheduleFetch(); schedulePoll() }
      else clearTimeout(pollTimer)
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      nativeBc?.close()
      clearTimeout(fetchSchedulerRef.current)
      clearTimeout(pollTimer)
      syncEngine.removeEventListener('tasks_changed', onTasksChanged)
      syncEngine.removeEventListener('reconnected',   onReconnected)
      syncEngine.disconnect()
      supabase.removeChannel(realtimeCh)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [loadAll])

  // ── Helpers de notificacao ────────────────────────────────

  function getActorId() {
    try {
      const auth = JSON.parse(localStorage.getItem('authUser_v2') || '{}')
      const collab = collaborators.find(c => c.email === auth.email)
      const id = collab?.id || null
      if (!id) console.warn('[notif] getActorId: colaborador nao encontrado para', auth.email)
      return id
    } catch { return null }
  }

  async function writeNotifications(rows) {
    if (!supabaseReady || !rows.length) return
    try {
      const { error } = await supabase.from('notifications').insert(rows)
      if (error) console.warn('[notif] insert falhou:', error.message, rows)
    } catch (err) {
      console.warn('[notif] exceção:', err?.message)
    }
  }

  const STATUS_LABELS = { todo: 'A Fazer', doing: 'Em Andamento', review: 'Em Revisão', aprovado: 'Aprovado', done: 'Concluído' }

  // ── Mutations — ERP ───────────────────────────────────────

  async function addTask(data) {
    const tempId  = Date.now()
    // Captura criador do localStorage (sem await, sem risco)
    const creatorName = (() => { try { const u = JSON.parse(localStorage.getItem('authUser_v2') || '{}'); return u.name || u.email || null } catch { return null } })()
    // Monta comentários iniciais com meta (criador) + etapas iniciais
    const stepEntries   = (data.steps || []).map(s => ({ _type: 'step', step: s }))
    const metaEntry     = { _type: 'meta', createdBy: creatorName, createdAt: new Date().toISOString(), recurring: data.recurring || null }
    const initialComments = [...(Array.isArray(data.comments) ? data.comments.filter(c => !c._type) : []), ...stepEntries, metaEntry]

    const newTask = {
      id: tempId, ...data,
      status:    data.status   || 'todo',
      priority:  data.priority || 'medium',
      level:     data.level    || 'interno',
      createdAt: new Date().toISOString(),
      comments:  initialComments,
      steps:     data.steps    || [],
      recurring: data.recurring || null,
      createdBy: creatorName,
    }
    // Otimista: aplica localmente e limpa mock tasks do mesmo cliente
    setTasks(prev => {
      const cid = data.clientId || null
      const mockIds = cid
        ? new Set(erpMock.tasks.filter(m => m.clientId === cid).map(m => String(m.id)))
        : new Set()
      const base = mockIds.size > 0 ? prev.filter(t => !mockIds.has(String(t.id))) : prev
      return [newTask, ...base]
    })
    addTaskLocal(newTask)

    // Broadcast imediato
    syncEngine.publish('tasks_changed')
    try { nativeBcRef.current?.postMessage('tasks_changed') } catch {}

    if (!supabaseReady) return newTask

    // Campos obrigatórios sempre presentes
    const dbPayload = {
      client_id:   data.clientId || null,
      title:       data.title,
      type:        data.type     || 'criativo',
      status:      newTask.status,
      priority:    newTask.priority,
      assignee:    data.assignee || null,
      due_date:    data.dueDate  || null,
      description: data.description || null,
    }
    // Campos opcionais: só inclui se tiverem valor para não quebrar se a coluna não existir
    if (data.materialLink)   dbPayload.material_link    = data.materialLink
    if (data.flag)           dbPayload.flag             = data.flag
    if (data.level)          dbPayload.level            = data.level
    if (data.coResponsaveis) dbPayload.co_responsaveis  = data.coResponsaveis
    dbPayload.comments = initialComments

    try {
      const { data: row, error } = await supabase.from('tasks').insert(dbPayload).select().single()
      if (error) {
        // Falha: enfileira para retry quando reconectar
        mqPush({ _type: 'insert_task', payload: dbPayload })
        setPendingOps(mqCount())
        console.warn('[addTask] enfileirado para retry:', error.message)
        return newTask
      }
      if (row) {
        const normalized = { ...newTask, id: row.id }
        setTasks(prev => prev.map(t => t.id === tempId ? normalized : t))
        updateTaskLocal(tempId, { id: row.id })

        // Notificacoes de atribuicao na criacao da tarefa
        const actorId = getActorId()
        const notifRows = []
        if (data.assignee && String(data.assignee) !== String(actorId)) {
          notifRows.push({
            target_collab_id: String(data.assignee), actor_collab_id: actorId,
            event_type: 'task_assigned', task_id: String(row.id), task_title: data.title,
            message: `Você foi atribuído à nova tarefa "${data.title}"`,
          })
        }
        for (const cId of (data.coResponsaveis || [])) {
          if (String(cId) !== String(actorId) && String(cId) !== String(data.assignee)) {
            notifRows.push({
              target_collab_id: String(cId), actor_collab_id: actorId,
              event_type: 'co_added', task_id: String(row.id), task_title: data.title,
              message: `Você foi adicionado como co-responsável em "${data.title}"`,
            })
          }
        }
        writeNotifications(notifRows)

        syncEngine.publish('tasks_changed')
        try { nativeBcRef.current?.postMessage('tasks_changed') } catch {}
        return normalized
      }
    } catch (err) {
      mqPush({ _type: 'insert_task', payload: dbPayload })
      setPendingOps(mqCount())
      console.warn('[addTask] erro, enfileirado:', err.message)
    }
    return newTask
  }

  async function updateTask(id, updates) {
    const key = String(id)
    const prevTask = tasks.find(t => String(t.id) === key)

    // Captura data de conclusão real ao marcar done
    if (updates.status === 'done' && prevTask?.status !== 'done') {
      updates = { ...updates, completedAt: new Date().toLocaleDateString('en-CA') }
    }

    // Otimista: aplica localmente de imediato e registra como pendente
    setTasks(prev => prev.map(t => String(t.id) === key ? { ...t, ...updates } : t))
    updateTaskLocal(id, updates)
    pendingWrites.current.set(key, { ...(pendingWrites.current.get(key) || {}), ...updates })

    // Auto-recorrência: dispara imediatamente ao marcar done, independente do Supabase
    if (updates.status === 'done' && prevTask?.recurring && prevTask?.status !== 'done') {
      const rec = prevTask.recurring
      const baseDate = prevTask.dueDate ? new Date(prevTask.dueDate) : new Date()
      let nextDate = new Date(baseDate)
      if (rec.type === 'daily')   nextDate.setDate(nextDate.getDate() + (rec.interval || 1))
      if (rec.type === 'weekly')  nextDate.setDate(nextDate.getDate() + 7 * (rec.interval || 1))
      if (rec.type === 'monthly') nextDate.setMonth(nextDate.getMonth() + (rec.interval || 1))
      const nextDueDateStr = nextDate.toISOString().split('T')[0]
      const nextMeta = { _type: 'meta', createdBy: prevTask.createdBy || null, createdAt: new Date().toISOString(), recurring: rec }
      const stepEntries = (prevTask.steps || []).map(s => ({ _type: 'step', step: s }))
      addTask({
        clientId: prevTask.clientId, title: prevTask.title, type: prevTask.type,
        status: 'todo', priority: prevTask.priority, assignee: prevTask.assignee,
        dueDate: nextDueDateStr, description: prevTask.description,
        materialLink: prevTask.materialLink, flag: prevTask.flag, level: prevTask.level,
        coResponsaveis: prevTask.coResponsaveis,
        comments: [...stepEntries, nextMeta],
        recurring: rec, steps: prevTask.steps || [],
      })
    }

    if (!supabaseReady) return

    const dbUpdates = {}
    if (updates.status          !== undefined) dbUpdates.status           = updates.status
    if (updates.title           !== undefined) dbUpdates.title            = updates.title
    if (updates.type            !== undefined) dbUpdates.type             = updates.type
    if (updates.clientId        !== undefined) dbUpdates.client_id        = updates.clientId
    if (updates.assignee        !== undefined) dbUpdates.assignee         = updates.assignee
    if (updates.priority        !== undefined) dbUpdates.priority         = updates.priority
    if (updates.dueDate         !== undefined) dbUpdates.due_date         = updates.dueDate
    if (updates.flag            !== undefined) dbUpdates.flag             = updates.flag
    if (updates.level           !== undefined) dbUpdates.level            = updates.level
    if (updates.comments        != null)       dbUpdates.comments         = updates.comments
    if (updates.coResponsaveis  !== undefined) dbUpdates.co_responsaveis  = updates.coResponsaveis

    if (!Object.keys(dbUpdates).length) { pendingWrites.current.delete(key); return }

    try {
      const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id)
      if (error) {
        mqPush({ _type: 'update_task', _targetId: id, payload: dbUpdates })
        setPendingOps(mqCount())
        console.warn('[updateTask] enfileirado:', error.message)
      } else {
        pendingWrites.current.delete(key)

        // Histórico de mudança de status (fire-and-forget)
        if (updates.status !== undefined && prevTask?.status !== updates.status) {
          const actor = (() => { try { const u = JSON.parse(localStorage.getItem('authUser_v2') || '{}'); return u.name || u.email || 'Usuário' } catch { return 'Usuário' } })()
          const histEntry = { _type: 'history', field: 'status', from: STATUS_LABELS[prevTask?.status] || prevTask?.status, to: STATUS_LABELS[updates.status] || updates.status, by: actor, at: new Date().toISOString() }
          const prevComments = Array.isArray(prevTask?.comments) ? prevTask.comments : []
          const newComments = [...prevComments, histEntry]
          supabase.from('tasks').update({ comments: newComments }).eq('id', id).catch(() => {})
          setTasks(prev => prev.map(t => String(t.id) === key ? { ...t, comments: newComments, taskHistory: [...(t.taskHistory || []), histEntry] } : t))

        }

        // Notificacoes de evento
        if (prevTask) {
          const actorId   = getActorId()
          const notifRows = []

          // Mudanca de responsavel
          if (updates.assignee !== undefined && String(updates.assignee) !== String(prevTask.assignee)) {
            if (updates.assignee && String(updates.assignee) !== String(actorId)) {
              notifRows.push({
                target_collab_id: String(updates.assignee), actor_collab_id: actorId,
                event_type: 'task_assigned', task_id: String(id), task_title: prevTask.title,
                message: `Você foi atribuído à tarefa "${prevTask.title}"`,
              })
            }
            if (prevTask.assignee && String(prevTask.assignee) !== String(updates.assignee) && String(prevTask.assignee) !== String(actorId)) {
              notifRows.push({
                target_collab_id: String(prevTask.assignee), actor_collab_id: actorId,
                event_type: 'task_unassigned', task_id: String(id), task_title: prevTask.title,
                message: `Você foi removido da tarefa "${prevTask.title}"`,
              })
            }
          }

          // Mudanca de co-responsaveis
          if (updates.coResponsaveis !== undefined) {
            const prev = new Set((prevTask.coResponsaveis || []).map(String))
            const next = new Set((updates.coResponsaveis || []).map(String))
            for (const cId of next) {
              if (!prev.has(cId) && cId !== String(actorId)) {
                notifRows.push({
                  target_collab_id: cId, actor_collab_id: actorId,
                  event_type: 'co_added', task_id: String(id), task_title: prevTask.title,
                  message: `Você foi adicionado como co-responsável em "${prevTask.title}"`,
                })
              }
            }
            for (const cId of prev) {
              if (!next.has(cId) && cId !== String(actorId)) {
                notifRows.push({
                  target_collab_id: cId, actor_collab_id: actorId,
                  event_type: 'co_removed', task_id: String(id), task_title: prevTask.title,
                  message: `Você foi removido de co-responsável em "${prevTask.title}"`,
                })
              }
            }
          }

          // Mudanca de status (card movido)
          if (updates.status !== undefined && updates.status !== prevTask.status) {
            const assignee = updates.assignee !== undefined ? updates.assignee : prevTask.assignee
            if (assignee && String(assignee) !== String(actorId)) {
              notifRows.push({
                target_collab_id: String(assignee), actor_collab_id: actorId,
                event_type: 'task_moved', task_id: String(id), task_title: prevTask.title,
                message: `"${prevTask.title}" foi movida para ${STATUS_LABELS[updates.status] || updates.status}`,
              })
            }
          }

          if (notifRows.length) writeNotifications(notifRows)
        }

        syncEngine.publish('tasks_changed')
        try { nativeBcRef.current?.postMessage('tasks_changed') } catch {}
      }
    } catch (err) {
      mqPush({ _type: 'update_task', _targetId: id, payload: dbUpdates })
      setPendingOps(mqCount())
      console.warn('[updateTask] erro, enfileirado:', err.message)
    }
  }

  function deleteTask(id) {
    const task = tasks.find(t => String(t.id) === String(id))
    setTasks(prev => prev.filter(t => String(t.id) !== String(id)))
    deleteTaskLocal(id)
    if (!supabaseReady) return
    supabase.from('tasks').delete().eq('id', id)
      .then(async ({ error }) => {
        if (error) {
          mqPush({ _type: 'delete_task', _targetId: id, payload: {} })
          setPendingOps(mqCount())
        } else {
          if (task) {
            const actorId = getActorId()
            const targets = new Set([
              task.assignee,
              ...(task.coResponsaveis || []),
            ].filter(cId => cId && String(cId) !== String(actorId)).map(String))
            if (targets.size) {
              writeNotifications([...targets].map(cId => ({
                target_collab_id: cId, actor_collab_id: actorId,
                event_type: 'task_deleted', task_id: String(id), task_title: task.title,
                message: `A tarefa "${task.title}" foi excluída`,
              })))
            }
          }
          syncEngine.publish('tasks_changed')
        }
      })
      .catch(() => {
        mqPush({ _type: 'delete_task', _targetId: id, payload: {} })
        setPendingOps(mqCount())
      })
  }

  async function addMilestone(data) {
    const newMs = {
      id: Date.now(),
      ...data,
      date: data.date || new Date().toLocaleDateString('en-CA'),
    }
    setMilestones(prev => [...prev, newMs].sort((a, b) => a.date.localeCompare(b.date)))
    addMilestoneLocal(newMs)
    if (!supabaseReady) return newMs
    try {
      await supabase.from('milestones').insert({
        client_id: data.clientId, date: newMs.date,
        type: data.type || 'revisao', title: data.title,
        description: data.description || '',
      })
      syncEngine.publish('data_changed')
    } catch (err) {
      console.warn('[addMilestone] falhou:', err?.message)
    }
    return newMs
  }

  async function updateMilestone(id, updates) {
    setMilestones(prev =>
      prev.map(m => String(m.id) === String(id) ? { ...m, ...updates } : m)
        .sort((a, b) => a.date.localeCompare(b.date))
    )
    if (!supabaseReady) return
    try {
      const dbUpdates = {}
      if (updates.date        !== undefined) dbUpdates.date        = updates.date
      if (updates.title       !== undefined) dbUpdates.title       = updates.title
      if (updates.type        !== undefined) dbUpdates.type        = updates.type
      if (updates.description !== undefined) dbUpdates.description = updates.description
      await supabase.from('milestones').update(dbUpdates).eq('id', id)
      syncEngine.publish('data_changed')
    } catch (err) {
      console.warn('[updateMilestone] falhou:', err?.message)
    }
  }

  async function addMeeting(data) {
    const newMtg = { id: Date.now(), ...data }
    setMeetings(prev => [...prev, newMtg].sort((a, b) => a.date.localeCompare(b.date)))
    if (!supabaseReady) return newMtg
    const { data: row } = await supabase.from('meetings').insert({
      client_id: data.clientId, title: data.title, date: data.date,
      time: data.time, duration: data.duration || 60,
      attendees: data.attendees || [], type: data.type || 'general',
    }).select().single()
    syncEngine.publish('data_changed')
    return row
  }

  async function addErpClient(data) {
    const newClient = { id: data.id || data.name.toLowerCase().replace(/\s+/g, '_'), ...data }
    setErpClients(prev => [...prev, newClient])
    if (!supabaseReady) return newClient
    const insert = {
      id: newClient.id, name: data.name, color: data.color || '#6eda2c',
      manager_id: data.manager, status: data.status || 'active',
      since: data.since || new Date().toLocaleDateString('en-CA'),
      monthly_value: data.monthlyValue || 0, niche: data.niche,
      client_type: ['destrava_digital', 'sites'].includes(data.clientType) ? 'avulso' : (data.clientType || 'recorrente'),
    }
    if (data.driveUrl) insert.drive_url = data.driveUrl
    const { data: row } = await supabase.from('erp_clients').insert(insert).select().single()
    return row
  }

  async function updateErpClient(clientId, updates) {
    setErpClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c))
    if (!supabaseReady) return
    const dbUpdates = {}
    if (updates.driveUrl  !== undefined) dbUpdates.drive_url  = updates.driveUrl || null
    if (updates.status    !== undefined) dbUpdates.status     = updates.status
    if (updates.manager   !== undefined) dbUpdates.manager_id = updates.manager
    if (updates.color     !== undefined) dbUpdates.color      = updates.color
    if (!Object.keys(dbUpdates).length) return
    try { await supabase.from('erp_clients').update(dbUpdates).eq('id', clientId) } catch {}
  }

  async function deleteErpClient(clientId) {
    setErpClients(prev => prev.filter(c => c.id !== clientId))
    if (!supabaseReady) return
    await supabase.from('erp_clients').delete().eq('id', clientId)
  }

  // ── Sync manual ───────────────────────────────────────────────
  async function syncTasks() {
    if (!supabaseReady || syncing) return
    setSyncing(true)
    await drainQueueRef.current?.()   // tenta reprocessar fila offline primeiro
    await fetchTasks()                 // busca estado atual do Supabase
    setSyncing(false)
  }

  // ── registerDelivery — o coração da integração ────────────
  // Chamado automaticamente após qualquer ação do Claude
  // (Figma, Canva, Google Ads, Meta Ads, LP, copy, etc.)
  async function registerDelivery({
    clientId,
    type,         // 'lp' | 'criativo' | 'campanha' | 'copy' | 'video' | 'reuniao'
    title,
    description,
    assignee = 'GS',
    fileUrl,      // link para Figma, Canva, URL publicada, etc.
    status = 'done',
    priority = 'medium',
    tool,         // 'figma' | 'canva' | 'google_ads' | 'meta_ads' | 'netlify' etc.
  }) {
    const today = new Date().toLocaleDateString('en-CA')
    const fullDescription = [
      description,
      tool    ? `Ferramenta: ${tool}`    : null,
      fileUrl ? `Link: ${fileUrl}`       : null,
    ].filter(Boolean).join(' | ')

    const taskData = {
      clientId, type, title, assignee, status,
      priority, dueDate: today,
      description: fullDescription,
    }
    const task = await addTask(taskData)

    // Registrar também como marco na linha do tempo
    const milestoneType = { lp: 'lp', campanha: 'campanha', reuniao: 'revisao' }[type] || 'revisao'
    await addMilestone({
      clientId, date: today,
      type: milestoneType,
      title, description: fullDescription,
    })

    return task
  }

  return (
    <DataContext.Provider value={{
      // Dados
      tasks, erpClients, meetings, collaborators, milestones,
      monthlyStats, knowledge, loading,
      // Sync
      lastSync, syncing, syncTasks, pendingOps,
      // Mutations ERP
      addTask, updateTask, deleteTask, addMilestone, updateMilestone, addMeeting, addErpClient, updateErpClient, deleteErpClient,
      // Integração Claude → sistema
      registerDelivery,
      // Refresh manual
      refresh: loadAll,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider')
  return ctx
}
