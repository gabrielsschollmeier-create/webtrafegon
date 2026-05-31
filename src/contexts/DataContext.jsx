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

export function DataProvider({ children }) {
  const [leads,         setLeads]         = useState([])
  const [stages,        setStages]        = useState([])
  const [pipelines,     setPipelines]     = useState([])
  const [activities,    setActivities]    = useState([])
  const [conversations, setConversations] = useState([])
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
  const fetchTasksRef = useRef(null)
  const drainQueueRef = useRef(null)

  // ── Carregar dados ─────────────────────────────────────────
  const loadAll = useCallback(async () => {
    let lsPipelines = null, lsStages = null
    try {
      lsPipelines = JSON.parse(localStorage.getItem('trafegon_pipelines_v1'))
      lsStages    = JSON.parse(localStorage.getItem('trafegon_stages_v1'))
    } catch {}

    if (!supabaseReady) {
      // Fallback: localStorage primeiro, depois mock
      const lsTasks      = getTasks()
      const lsMilestones = getMilestones()
      setLeads(mock.leads)
      setStages(lsStages    || mock.stages)
      setPipelines(lsPipelines || mock.pipelines)
      setActivities(mock.activities)
      setConversations(mock.conversations)
      setTasks(lsTasks.length      ? lsTasks      : erpMock.tasks)
      setErpClients(erpMock.erpClients)
      setMeetings(erpMock.meetings)
      setCollaborators(erpMock.collaborators)
      setMilestones(lsMilestones.length ? lsMilestones : erpMock.milestones)
      setMonthlyStats(mock.monthlyData)
      // Fallback knowledge: localStorage ou seeds
      try {
        const stored = JSON.parse(localStorage.getItem('trafegon_knowledge_v1') || '[]')
        setKnowledge(stored.length ? stored : SEED_KNOWLEDGE)
      } catch { setKnowledge(SEED_KNOWLEDGE) }
      setLoading(false)
      return
    }

    try {
      const [
        { data: dbLeads },
        { data: dbStages },
        { data: dbPipelines },
        { data: dbActivities },
        { data: dbTasks },
        { data: dbClients },
        { data: dbMeetings },
        { data: dbCollaborators },
        { data: dbMilestones },
        { data: dbMonthly },
        { data: dbKnowledge },
      ] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('pipeline_stages').select('*').order('order_index'),
        supabase.from('pipelines').select('*'),
        supabase.from('activities').select('*').order('due_date'),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('erp_clients').select('*'),
        supabase.from('meetings').select('*').order('date'),
        supabase.from('collaborators').select('*'),
        supabase.from('milestones').select('*').order('date'),
        supabase.from('monthly_stats').select('*').order('year').order('id'),
        supabase.from('ai_knowledge').select('*').eq('is_active', true).order('use_count', { ascending: false }),
      ])

      // Normalizar leads para o formato esperado pelas páginas
      const normalizedLeads = (dbLeads || []).map(l => ({
        id:         l.id,
        name:       l.name,
        phone:      l.phone,
        source:     l.source,
        stage:      l.stage_id,
        pipelineId: l.pipeline_id,
        value:      Number(l.value) || 0,
        assignee:   l.assignee,
        createdAt:  l.created_at?.split('T')[0] || l.created_at,
        valueType:  l.value_type || 'unico',
        quality:    l.quality,
        tags:       l.tags || [],
        notes:      l.notes || '',
      }))

      // Normalizar estágios
      const normalizedStages = (dbStages || []).map(s => ({
        id:         s.id,
        label:      s.label,
        color:      s.color,
        pipelineId: s.pipeline_id,
      }))

      // Normalizar atividades
      const normalizedActivities = (dbActivities || []).map(a => ({
        id:          a.id,
        leadId:      a.lead_id,
        type:        a.type,
        description: a.description,
        dueDate:     a.due_date,
        time:        a.time,
        done:        a.done,
      }))

      // Normalizar tarefas
      const normalizedTasks = (dbTasks || []).map(t => ({
        id:           t.id,
        clientId:     t.client_id,
        title:        t.title,
        type:         t.type,
        status:       t.status,
        priority:     t.priority,
        assignee:     t.assignee,
        dueDate:      t.due_date,
        createdAt:    t.created_at?.split('T')[0] || '',
        description:  t.description,
        materialLink: t.material_link || null,
        level:        t.level        || 'operacao',
        flag:         t.flag         || null,
      }))

      // Normalizar clientes ERP
      const normalizedClients = (dbClients || []).map(c => ({
        id:           c.id,
        name:         c.name,
        color:        c.color,
        manager:      c.manager_id,
        status:       c.status,
        since:        c.since,
        monthlyValue: Number(c.monthly_value) || 0,
        niche:        c.niche,
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
      const supabaseTaskIds = new Set((normalizedTasks).map(t => String(t.id)))
      const offlineTasks = lsTasks.filter(t => !supabaseTaskIds.has(String(t.id)))
      const mergedTasks  = [...normalizedTasks, ...offlineTasks]
      const supabaseMsIds = new Set((normalizedMilestones).map(m => String(m.id)))
      const offlineMs    = lsMilestones.filter(m => !supabaseMsIds.has(String(m.id)))
      const mockOnlyMs   = erpMock.milestones.filter(m => !supabaseMsIds.has(String(m.id)))
      const mergedMs     = [...normalizedMilestones, ...offlineMs, ...mockOnlyMs].sort((a, b) => a.date.localeCompare(b.date))

      setLeads(normalizedLeads.length ? normalizedLeads : mock.leads)

      /* Estágios e pipelines devem ter IDs compatíveis entre si.
         Se não há stages no Supabase, usamos mock (IDs inteiros).
         Nesse caso, também usamos mock.pipelines para garantir consistência. */
      const hasSupabaseStages    = normalizedStages.length > 0
      const hasSupabasePipelines = (dbPipelines || []).length > 0
      setStages(lsStages || (hasSupabaseStages ? normalizedStages : mock.stages))
      setPipelines(lsPipelines || (hasSupabaseStages && hasSupabasePipelines ? dbPipelines : mock.pipelines))
      setActivities(normalizedActivities.length ? normalizedActivities : mock.activities)
      setErpClients(mergedClients)
      setTasks(mergedTasks.length    ? mergedTasks    : erpMock.tasks)
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
            name:             c.name             || fb.name             || '',
            email:            c.email            || fb.email            || '',
            role:             c.role             || fb.role             || '',
            avatar:           c.avatar           || fb.avatar           || '',
            color:            c.color            || fb.color            || '#8890b5',
            level:            Number(c.level)    || fb.level            || 1,
            rank:             c.rank             || fb.rank             || '',
            xp:               Number(c.xp)       || fb.xp               || 0,
            xpToNext:         Number(c.xp_to_next   ?? c.xpToNext)   || fb.xpToNext   || 1000,
            streak:           Number(c.streak)   || fb.streak           || 0,
            tasksCompleted:   Number(c.tasks_completed  ?? c.tasksCompleted)  || fb.tasksCompleted  || 0,
            tasksThisMonth:   Number(c.tasks_this_month ?? c.tasksThisMonth)  || fb.tasksThisMonth  || 0,
            since:            c.since            || fb.since            || '2025-01-01',
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
      setConversations(mock.conversations)
      // Knowledge base
      if (dbKnowledge?.length) {
        setKnowledge(dbKnowledge)
      } else {
        try {
          const stored = JSON.parse(localStorage.getItem('trafegon_knowledge_v1') || '[]')
          setKnowledge(stored.length ? stored : SEED_KNOWLEDGE)
        } catch { setKnowledge(SEED_KNOWLEDGE) }
      }
    } catch (err) {
      // Supabase falhou (projeto pausado, CORS, etc.)
      // Prioridade: localStorage > mock — nunca perder dados locais
      console.warn('Supabase load failed, falling back to localStorage + mock:', err.message)
      const lsTasksFallback      = getTasks()
      const lsMilestonesFallback = getMilestones()
      setLeads(mock.leads)
      setStages(lsStages || mock.stages)
      setPipelines(lsPipelines || mock.pipelines)
      setActivities(mock.activities)
      setConversations(mock.conversations)
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
    } finally {
      setLoading(false)
    }
  }, [])

  // ── fetchTasks: busca tarefas do Supabase, só atualiza estado se mudou ──────
  const tasksHashRef = useRef('')
  const fetchTasks = useCallback(async () => {
    if (!supabaseReady) return
    try {
      const { data, error } = await supabase
        .from('tasks').select('*').order('created_at', { ascending: false })
      if (error || !data) return
      const normalized = data.map(t => ({
        id:           t.id,
        clientId:     t.client_id,
        title:        t.title,
        type:         t.type,
        status:       t.status,
        priority:     t.priority,
        assignee:     t.assignee,
        dueDate:      t.due_date,
        createdAt:    t.created_at?.split('T')[0] || '',
        description:  t.description,
        materialLink: t.material_link || null,
        flag:         t.flag  || null,
        level:        t.level || 'operacao',
      }))
      // Só atualiza o estado React se os dados realmente mudaram
      const hash = normalized.map(t => `${t.id}:${t.status}:${t.title}:${t.assignee}:${t.priority}`).join('|')
      if (hash === tasksHashRef.current) return
      tasksHashRef.current = hash
      setTasks(normalized)
      saveTasks(normalized)
      setLastSync(new Date())
    } catch {}
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
      } catch { mqBump(op._id) }
    }
    setPendingOps(mqCount())
    if (changed) {
      await fetchTasksRef.current?.()
      syncEngine.publish('tasks_changed')
    }
  }, [])

  useEffect(() => { drainQueueRef.current = drainQueue }, [drainQueue])

  // ── Subscriptions: syncEngine + postgres_changes + poll ──────
  useEffect(() => {
    loadAll()

    if (!supabaseReady) return

    // Derivar userId do localStorage para presence tracking
    let userId = null
    try {
      const stored = JSON.parse(localStorage.getItem('authUser_v2') || '{}')
      userId = stored.id || stored.email || null
    } catch {}

    // Debounce ref — evita múltiplas chamadas simultâneas de fetchTasks
    let fetchDebounceTimer = null
    const debouncedFetchTasks = () => {
      clearTimeout(fetchDebounceTimer)
      fetchDebounceTimer = setTimeout(() => fetchTasksRef.current?.(), 80)
    }

    // Conecta o SyncEngine (broadcast + reconexão automática)
    syncEngine.connect(userId)

    // Ouve eventos do syncEngine via EventTarget (refs estáveis = sem stale closure)
    const onTasksChanged = () => debouncedFetchTasks()
    const onDataChanged  = () => loadAll()
    // reconexão: só rebusca tarefas, não recarrega tudo (evita freeze)
    const onReconnected  = () => {
      debouncedFetchTasks()
      drainQueueRef.current?.()
    }
    syncEngine.addEventListener('tasks_changed', onTasksChanged)
    syncEngine.addEventListener('data_changed',  onDataChanged)
    syncEngine.addEventListener('reconnected',   onReconnected)

    // Um único canal com todas as tabelas — postgres_changes + broadcast
    const realtimeCh = supabase.channel('trafegon-realtime-v4')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        debouncedFetchTasks()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        supabase.from('leads').select('*').order('created_at', { ascending: false })
          .then(({ data }) => data && setLeads(data.map(l => ({
            id: l.id, name: l.name, phone: l.phone, source: l.source,
            stage: l.stage_id, pipelineId: l.pipeline_id,
            value: Number(l.value) || 0, assignee: l.assignee,
            createdAt: l.created_at?.split('T')[0] || l.created_at,
            valueType: l.value_type || 'unico',
            quality: l.quality, tags: l.tags || [], notes: l.notes || '',
          }))))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
        supabase.from('activities').select('*').order('due_date')
          .then(({ data }) => data && setActivities(data.map(a => ({
            id: a.id, leadId: a.lead_id, type: a.type,
            description: a.description, dueDate: a.due_date,
            time: a.time, done: a.done,
          }))))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => {
        supabase.from('meetings').select('*').order('date')
          .then(({ data }) => data && setMeetings(data.map(m => ({
            id: m.id, clientId: m.client_id, title: m.title,
            date: m.date, time: m.time, duration: m.duration,
            attendees: m.attendees || [], type: m.type,
          }))))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'erp_clients' }, () => {
        supabase.from('erp_clients').select('*')
          .then(({ data }) => data && setErpClients(data.map(c => ({
            id: c.id, name: c.name, color: c.color, manager: c.manager_id,
            status: c.status, since: c.since,
            monthlyValue: Number(c.monthly_value) || 0, niche: c.niche,
          }))))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, () => {
        supabase.from('milestones').select('*').order('date')
          .then(({ data }) => data && setMilestones(data.map(m => ({
            id: m.id, clientId: m.client_id, date: m.date,
            type: m.type, title: m.title, description: m.description,
          }))))
      })
      .subscribe()

    // Poll a cada 2s — failsafe para broadcasts perdidos ou postgres_changes não configurado
    const pollInterval = setInterval(() => debouncedFetchTasks(), 2000)

    // Refresh imediato quando o usuário volta para a aba
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') debouncedFetchTasks()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimeout(fetchDebounceTimer)
      syncEngine.removeEventListener('tasks_changed', onTasksChanged)
      syncEngine.removeEventListener('data_changed',  onDataChanged)
      syncEngine.removeEventListener('reconnected',   onReconnected)
      syncEngine.disconnect()
      supabase.removeChannel(realtimeCh)
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [loadAll])

  // ── Mutations — CRM ───────────────────────────────────────

  async function addLead(data) {
    const tempId = Date.now()
    const newLead = {
      id: tempId, ...data,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLeads(prev => [newLead, ...prev])
    if (!supabaseReady) return newLead
    try {
      const { data: row, error } = await supabase.from('leads').insert({
        name:        data.name,
        phone:       data.phone || '',
        source:      data.source,
        stage_id:    data.stage,
        pipeline_id: data.pipelineId,
        value:       data.value || 0,
        assignee:    data.assignee,
      }).select().single()
      if (error) throw error
      const normalized = {
        id:         row.id,
        name:       row.name,
        phone:      row.phone,
        source:     row.source,
        stage:      row.stage_id,
        pipelineId: row.pipeline_id,
        value:      Number(row.value) || 0,
        assignee:   row.assignee,
        createdAt:  row.created_at?.split('T')[0] || row.created_at,
        /* campos locais que podem não existir como colunas no Supabase */
        notes:      data.notes,
        tags:       data.tags,
        quality:    data.quality,
        valueType:  data.valueType || 'unico',
      }
      setLeads(prev => prev.map(l => l.id === tempId ? normalized : l))
      syncEngine.publish('data_changed')
      return normalized
    } catch (err) {
      console.error('addLead insert error:', err.message)
      return newLead
    }
  }

  async function deleteLead(id) {
    setLeads(prev => prev.filter(l => l.id !== id))
    if (!supabaseReady) return
    await supabase.from('leads').delete().eq('id', id)
    syncEngine.publish('data_changed')
  }

  async function deleteLeads(ids) {
    const idSet = new Set(ids)
    setLeads(prev => prev.filter(l => !idSet.has(l.id)))
    if (!supabaseReady) return
    await supabase.from('leads').delete().in('id', [...ids])
    syncEngine.publish('data_changed')
  }

  async function updateLead(id, updates) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    if (!supabaseReady) return
    const dbUpdates = {}
    if (updates.stage      !== undefined) dbUpdates.stage_id    = updates.stage
    if (updates.pipelineId !== undefined) dbUpdates.pipeline_id = updates.pipelineId
    if (updates.value      !== undefined) dbUpdates.value       = updates.value
    if (updates.assignee   !== undefined) dbUpdates.assignee    = updates.assignee
    if (updates.name       !== undefined) dbUpdates.name        = updates.name
    if (updates.phone      !== undefined) dbUpdates.phone       = updates.phone
    if (updates.source     !== undefined) dbUpdates.source      = updates.source
    if (updates.notes      !== undefined) dbUpdates.notes       = updates.notes
    if (updates.tags       !== undefined) dbUpdates.tags        = updates.tags
    if (updates.quality    !== undefined) dbUpdates.quality     = updates.quality
    if (Object.keys(dbUpdates).length) {
      await supabase.from('leads').update(dbUpdates).eq('id', id)
      syncEngine.publish('data_changed')
    }
  }

  async function addActivity(data) {
    const newAct = { id: Date.now(), ...data, done: false }
    setActivities(prev => [...prev, newAct])
    if (!supabaseReady) return newAct
    const { data: row } = await supabase.from('activities').insert({
      lead_id: data.leadId, type: data.type,
      description: data.description, due_date: data.dueDate,
      time: data.time, done: false,
    }).select().single()
    return row
  }

  async function toggleActivity(id) {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
    if (!supabaseReady) return
    const act = activities.find(a => a.id === id)
    await supabase.from('activities').update({ done: !act?.done }).eq('id', id)
  }

  // ── Mutations — ERP ───────────────────────────────────────

  async function addTask(data) {
    const tempId  = Date.now()
    const newTask = {
      id: tempId, ...data,
      status:    data.status   || 'todo',
      priority:  data.priority || 'medium',
      level:     data.level    || 'interno',
      createdAt: new Date().toISOString(),
    }
    // Otimista: aplica localmente de imediato
    setTasks(prev => [newTask, ...prev])
    addTaskLocal(newTask)

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
    if (data.materialLink) dbPayload.material_link = data.materialLink
    if (data.flag)         dbPayload.flag          = data.flag
    if (data.level)        dbPayload.level         = data.level

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
        // Notifica todos os outros clientes conectados
        syncEngine.publish('tasks_changed')
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
    // Otimista: aplica localmente de imediato
    setTasks(prev => prev.map(t => String(t.id) === String(id) ? { ...t, ...updates } : t))
    updateTaskLocal(id, updates)

    if (!supabaseReady) return

    const dbUpdates = {}
    if (updates.status       !== undefined) dbUpdates.status        = updates.status
    if (updates.title        !== undefined) dbUpdates.title         = updates.title
    if (updates.type         !== undefined) dbUpdates.type          = updates.type
    if (updates.clientId     !== undefined) dbUpdates.client_id     = updates.clientId
    if (updates.assignee     !== undefined) dbUpdates.assignee      = updates.assignee
    if (updates.priority     !== undefined) dbUpdates.priority      = updates.priority
    if (updates.dueDate      !== undefined) dbUpdates.due_date      = updates.dueDate
    if (updates.description  !== undefined) dbUpdates.description   = updates.description
    if (updates.materialLink !== undefined) dbUpdates.material_link = updates.materialLink
    if (updates.flag         !== undefined) dbUpdates.flag          = updates.flag
    if (updates.level        !== undefined) dbUpdates.level         = updates.level

    if (!Object.keys(dbUpdates).length) return

    try {
      const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id)
      if (error) {
        mqPush({ _type: 'update_task', _targetId: id, payload: dbUpdates })
        setPendingOps(mqCount())
        console.warn('[updateTask] enfileirado:', error.message)
      } else {
        syncEngine.publish('tasks_changed')
      }
    } catch (err) {
      mqPush({ _type: 'update_task', _targetId: id, payload: dbUpdates })
      setPendingOps(mqCount())
      console.warn('[updateTask] erro, enfileirado:', err.message)
    }
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => String(t.id) !== String(id)))
    deleteTaskLocal(id)
    if (!supabaseReady) return
    supabase.from('tasks').delete().eq('id', id)
      .then(({ error }) => {
        if (error) {
          mqPush({ _type: 'delete_task', _targetId: id, payload: {} })
          setPendingOps(mqCount())
        } else {
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
      date: data.date || new Date().toISOString().split('T')[0],
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
    } catch {}
    return newMs
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

  function savePipelineConfig(newPipelines, newStages) {
    setPipelines(newPipelines)
    setStages(newStages)
    try {
      localStorage.setItem('trafegon_pipelines_v1', JSON.stringify(newPipelines))
      localStorage.setItem('trafegon_stages_v1', JSON.stringify(newStages))
    } catch {}
  }

  async function addErpClient(data) {
    const newClient = { id: data.id || data.name.toLowerCase().replace(/\s+/g, '_'), ...data }
    setErpClients(prev => [...prev, newClient])
    if (!supabaseReady) return newClient
    const { data: row } = await supabase.from('erp_clients').insert({
      id: newClient.id, name: data.name, color: data.color || '#6eda2c',
      manager_id: data.manager, status: data.status || 'active',
      since: data.since || new Date().toISOString().split('T')[0],
      monthly_value: data.monthlyValue || 0, niche: data.niche,
    }).select().single()
    return row
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
    const today = new Date().toISOString().split('T')[0]
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
      leads, stages, pipelines, activities, conversations,
      tasks, erpClients, meetings, collaborators, milestones,
      monthlyStats, knowledge, loading,
      // Sync
      lastSync, syncing, syncTasks, pendingOps,
      // Mutations CRM
      addLead, updateLead, deleteLead, deleteLeads, addActivity, toggleActivity,
      // Mutations ERP
      addTask, updateTask, deleteTask, addMilestone, addMeeting, addErpClient,
      // Pipeline config
      savePipelineConfig,
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
