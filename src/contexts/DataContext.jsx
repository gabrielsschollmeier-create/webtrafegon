import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'
import * as mock from '../data/mock'
import * as erpMock from '../data/erp-mock'

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
  const [loading,       setLoading]       = useState(true)

  // ── Carregar dados ─────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!supabaseReady) {
      // Fallback: dados mock
      setLeads(mock.leads)
      setStages(mock.stages)
      setPipelines(mock.pipelines)
      setActivities(mock.activities)
      setConversations(mock.conversations)
      setTasks(erpMock.tasks)
      setErpClients(erpMock.erpClients)
      setMeetings(erpMock.meetings)
      setCollaborators(erpMock.collaborators)
      setMilestones(erpMock.milestones)
      setMonthlyStats(mock.monthlyData)
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
        id:          t.id,
        clientId:    t.client_id,
        title:       t.title,
        type:        t.type,
        status:      t.status,
        priority:    t.priority,
        assignee:    t.assignee,
        dueDate:     t.due_date,
        description: t.description,
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

      setLeads(normalizedLeads.length        ? normalizedLeads        : mock.leads)
      setStages(normalizedStages.length      ? normalizedStages       : mock.stages)
      setPipelines((dbPipelines || []).length ? dbPipelines           : mock.pipelines)
      setActivities(normalizedActivities.length ? normalizedActivities : mock.activities)
      setErpClients(mergedClients)
      setTasks(normalizedTasks.length         ? normalizedTasks       : erpMock.tasks)
      setMeetings(normalizedMeetings.length   ? normalizedMeetings    : erpMock.meetings)
      setCollaborators((dbCollaborators || []).length ? dbCollaborators : erpMock.collaborators)
      setMilestones(normalizedMilestones.length ? normalizedMilestones : erpMock.milestones)
      setMonthlyStats(normalizedMonthly.length  ? normalizedMonthly   : mock.monthlyData)
      setConversations(mock.conversations)
    } catch (err) {
      console.warn('Supabase load failed, using mock:', err.message)
      setLeads(mock.leads)
      setStages(mock.stages)
      setPipelines(mock.pipelines)
      setActivities(mock.activities)
      setConversations(mock.conversations)
      setTasks(erpMock.tasks)
      setErpClients(erpMock.erpClients)
      setMeetings(erpMock.meetings)
      setCollaborators(erpMock.collaborators)
      setMilestones(erpMock.milestones)
      setMonthlyStats(mock.monthlyData)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Realtime subscriptions ────────────────────────────────
  useEffect(() => {
    loadAll()

    if (!supabaseReady) return

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        supabase.from('leads').select('*').order('created_at', { ascending: false })
          .then(({ data }) => data && setLeads(data.map(l => ({
            id: l.id, name: l.name, phone: l.phone, source: l.source,
            stage: l.stage_id, pipelineId: l.pipeline_id,
            value: Number(l.value) || 0, assignee: l.assignee,
            createdAt: l.created_at?.split('T')[0],
          }))))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        supabase.from('tasks').select('*').order('created_at', { ascending: false })
          .then(({ data }) => data && setTasks(data.map(t => ({
            id: t.id, clientId: t.client_id, title: t.title, type: t.type,
            status: t.status, priority: t.priority, assignee: t.assignee,
            dueDate: t.due_date, description: t.description,
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

    return () => { supabase.removeChannel(channel) }
  }, [loadAll])

  // ── Mutations — CRM ───────────────────────────────────────

  async function addLead(data) {
    const newLead = {
      id: Date.now(), ...data,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLeads(prev => [newLead, ...prev])
    if (!supabaseReady) return newLead
    const { data: row } = await supabase.from('leads').insert({
      name: data.name, phone: data.phone, source: data.source,
      stage_id: data.stage, pipeline_id: data.pipelineId,
      value: data.value || 0, assignee: data.assignee,
    }).select().single()
    return row
  }

  async function updateLead(id, updates) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    if (!supabaseReady) return
    await supabase.from('leads').update({
      stage_id:    updates.stage,
      pipeline_id: updates.pipelineId,
      value:       updates.value,
      assignee:    updates.assignee,
    }).eq('id', id)
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
    const newTask = {
      id: Date.now(), ...data, status: data.status || 'todo',
      priority: data.priority || 'medium',
    }
    setTasks(prev => [newTask, ...prev])
    if (!supabaseReady) return newTask
    const { data: row } = await supabase.from('tasks').insert({
      client_id: data.clientId, title: data.title, type: data.type,
      status: data.status || 'todo', priority: data.priority || 'medium',
      assignee: data.assignee, due_date: data.dueDate,
      description: data.description,
    }).select().single()
    return row
  }

  async function updateTask(id, updates) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    if (!supabaseReady) return
    const dbUpdates = {}
    if (updates.status)      dbUpdates.status    = updates.status
    if (updates.assignee)    dbUpdates.assignee  = updates.assignee
    if (updates.priority)    dbUpdates.priority  = updates.priority
    if (updates.dueDate)     dbUpdates.due_date  = updates.dueDate
    if (updates.title)       dbUpdates.title     = updates.title
    if (updates.description) dbUpdates.description = updates.description
    await supabase.from('tasks').update(dbUpdates).eq('id', id)
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
    return row
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
    const newMilestone = {
      id: Date.now() + 1,
      clientId, date: today,
      type: milestoneType,
      title, description: fullDescription,
    }
    setMilestones(prev => [...prev, newMilestone].sort((a, b) => a.date.localeCompare(b.date)))
    if (supabaseReady) {
      await supabase.from('milestones').insert({
        client_id: clientId, date: today,
        type: milestoneType, title,
        description: fullDescription,
      })
    }

    return task
  }

  return (
    <DataContext.Provider value={{
      // Dados
      leads, stages, pipelines, activities, conversations,
      tasks, erpClients, meetings, collaborators, milestones,
      monthlyStats, loading,
      // Mutations CRM
      addLead, updateLead, addActivity, toggleActivity,
      // Mutations ERP
      addTask, updateTask, addMeeting, addErpClient,
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
