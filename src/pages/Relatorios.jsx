import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Users, DollarSign, Target, Download, Calendar, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import { sourceData, weeklyActivity } from '../data/mock'
import { useData } from '../contexts/DataContext'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
const fmtK = (v) => v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v}`

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2.5 shadow-xl text-xs">
      <p className="text-muted font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-2">{p.name}:</span>
          <span className="text-text font-bold">{currency ? fmtK(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, change, positive, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2 }}
      className="bg-white border border-border rounded-xl p-5 card-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent + '20' }}>
          <Icon size={17} style={{ color: accent }} />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${positive ? 'text-accent' : 'text-danger'}`}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-text">{value}</p>
      <p className="text-xs text-muted uppercase tracking-wider font-semibold mt-1">{label}</p>
    </motion.div>
  )
}

function SectionTitle({ children, delay = 0 }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="text-sm font-bold text-text mb-4 flex items-center gap-2"
    >
      <div className="w-1 h-4 rounded-full bg-accent" />
      {children}
    </motion.h2>
  )
}

const PERIODS = ['7 dias', '30 dias', '3 meses', '6 meses']

export default function Relatorios() {
  const { leads, stages, monthlyStats: monthlyData } = useData()
  const [period, setPeriod] = useState('30 dias')
  const totalLeads = leads.length
  const closedLeads = leads.filter(l => l.stage === 'fechado').length
  const totalRevenue = leads.reduce((s, l) => s + l.value, 0)
  const convRate = Math.round((closedLeads / totalLeads) * 100)

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
        <div>
          <h1 className="text-xl font-bold text-text">Relatórios</h1>
          <p className="text-sm text-muted mt-0.5">Análise de performance da operação</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  period === p ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-sm bg-surface border border-border px-3 py-2 rounded-lg text-text-2 hover:border-accent/30 transition-all font-semibold"
          >
            <Download size={14} /> Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Users}      label="Total de leads"    value={totalLeads}     change="+27%" positive accent="#6eda2c" delay={0.05} />
        <KpiCard icon={DollarSign} label="Receita gerada"    value={fmt(totalRevenue)} change="+34%" positive accent="#be29ec" delay={0.10} />
        <KpiCard icon={TrendingUp} label="Taxa de conversão" value={`${convRate}%`} change="+5%" positive accent="#ea8a29" delay={0.15} />
        <KpiCard icon={Target}     label="Ticket médio"      value={closedLeads > 0 ? fmt(totalRevenue / closedLeads) : 'R$0'} change="+12%" positive accent="#6eda2c" delay={0.20} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Receita x Leads */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-surface border border-border rounded-xl p-5"
        >
          <SectionTitle delay={0.25}>Leads & Receita — Últimos 6 meses</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6eda2c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6eda2c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#be29ec" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#be29ec" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf2" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#8890b5', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8890b5', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#6eda2c" strokeWidth={2} fill="url(#gradLeads)" dot={{ fill: '#6eda2c', r: 3 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="fechados" name="Fechados" stroke="#be29ec" strokeWidth={2} fill="url(#gradRec)" dot={{ fill: '#be29ec', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Origem dos leads */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white border border-border rounded-xl p-5 card-shadow"
        >
          <SectionTitle delay={0.3}>Origem dos leads</SectionTitle>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0}>
                {sourceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#ffffff', border: '1px solid #e8eaf2', borderRadius: 10, fontSize: 11, color: '#1a1d2e' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {sourceData.slice(0, 4).map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-text-2 flex-1 truncate">{s.name}</span>
                <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Receita mensal */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface border border-border rounded-xl p-5"
        >
          <SectionTitle delay={0.35}>Receita mensal (R$)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf2" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#8890b5', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fill: '#8890b5', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<CustomTooltip currency />} />
              <Bar dataKey="receita" name="Receita" radius={[6, 6, 0, 0]}>
                {monthlyData.map((_, i) => (
                  <Cell key={i} fill={i === monthlyData.length - 1 ? '#6eda2c' : '#6eda2c50'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Funil de conversão */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white border border-border rounded-xl p-5 card-shadow"
        >
          <SectionTitle delay={0.4}>Funil de conversão</SectionTitle>
          <div className="space-y-2">
            {stages.filter(s => s.pipelineId === 1).map((stage, i, arr) => {
              const count = leads.filter(l => l.stage === stage.id).length
              const total = leads.filter(l => l.pipelineId === 1).length
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              const prev = i > 0 ? leads.filter(l => l.stage === arr[i-1].id).length : count
              const conv = prev > 0 ? Math.round((count / prev) * 100) : 100
              return (
                <div key={stage.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-2 font-medium">{stage.label}</span>
                    <div className="flex items-center gap-2">
                      {i > 0 && <span className="text-muted">{conv}%</span>}
                      <span className="font-bold" style={{ color: stage.color }}>{count}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: stage.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.7 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Atividades da semana */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-surface border border-border rounded-xl p-5 mb-6"
      >
        <SectionTitle delay={0.45}>Atividades por dia da semana</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyActivity} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barSize={14} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf2" vertical={false} />
            <XAxis dataKey="dia" tick={{ fill: '#8890b5', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8890b5', fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ligacoes"  name="Ligações"   radius={[4,4,0,0]} fill="#6eda2c" />
            <Bar dataKey="followups" name="Follow-ups" radius={[4,4,0,0]} fill="#ea8a29" />
            <Bar dataKey="reunioes"  name="Reuniões"   radius={[4,4,0,0]} fill="#be29ec" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 justify-end">
          {[['Ligações','#6eda2c'],['Follow-ups','#ea8a29'],['Reuniões','#be29ec']].map(([l,c]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-muted">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
              {l}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Missão */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-accent/10 to-purple/10 border border-accent/20 rounded-xl p-5 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Zap size={18} className="text-accent" fill="currentColor" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-text">Acelerar negócios & impulsionar o empreendedorismo</p>
          <p className="text-xs text-muted mt-0.5">
            Nos últimos 6 meses: {monthlyData.reduce((s,m)=>s+m.fechados,0)} negócios fechados,{' '}
            {fmt(monthlyData.reduce((s,m)=>s+m.receita,0))} em receita gerada para seus clientes
          </p>
        </div>
      </motion.div>
    </div>
  )
}
