import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Loader2, DollarSign, MousePointerClick, Eye, Users, TrendingUp, Settings, Check, X } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { useAdsMetrics } from '../../hooks/useAdsMetrics'
import { supabase, supabaseReady } from '../../lib/supabase'

const fmtBrl = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n || 0)
const fmtNum = n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(Math.round(n || 0))
const fmtPct = n => n ? (n * 100).toFixed(2) + '%' : '—'

// ── Configurar integração ────────────────────────────────────────────────────

function ConfigPanel({ clientId, client, clientColor, onClose }) {
  const [gads, setGads] = useState(client?.gads_customer_id || '')
  const [meta, setMeta] = useState(client?.meta_account_id  || '')
  const [key,  setKey]  = useState('')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  async function handleSave() {
    if (!supabaseReady) return
    setSaving(true)
    const updates = {}
    if (gads.trim()) updates.gads_customer_id = gads.trim()
    if (meta.trim()) updates.meta_account_id  = meta.trim()
    if (Object.keys(updates).length) {
      await supabase.from('erp_clients').update(updates).eq('id', clientId)
    }
    if (key.trim()) {
      await supabase.from('ad_settings').upsert({ key: 'windsor_api_key', value: key.trim() }, { onConflict: 'key' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose?.() }, 1200)
  }

  const inp = 'w-full text-xs rounded-xl px-3 py-2.5 bg-white border font-mono focus:outline-none focus:ring-2 transition-all'
  const inpStyle = { border: '1px solid rgba(26,29,46,0.12)', color: '#1a1d2e' }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: '#f8f9fe', border: '1px solid rgba(26,29,46,0.07)' }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold text-text">Configurar integração</p>
        <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors"><X size={14} /></button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-extrabold uppercase tracking-wide text-muted block mb-1.5">
            Google Ads — Customer ID
          </label>
          <input className={inp} style={inpStyle} placeholder="ex: 362-014-3733"
            value={gads} onChange={e => setGads(e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-extrabold uppercase tracking-wide text-muted block mb-1.5">
            Meta Ads — Account ID
          </label>
          <input className={inp} style={inpStyle} placeholder="ex: 1431059114895815"
            value={meta} onChange={e => setMeta(e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-extrabold uppercase tracking-wide text-muted block mb-1.5">
            Windsor.ai — API Key <span className="text-muted opacity-60 normal-case font-medium">(global, aplicado a todos)</span>
          </label>
          <input className={inp} style={inpStyle} type="password" placeholder="••••••••••••••••"
            value={key} onChange={e => setKey(e.target.value)} />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving || saved}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all"
        style={{ background: saved ? '#6eda2c' : clientColor, opacity: saving ? 0.7 : 1 }}>
        {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <><Check size={13} /> Salvo!</> : 'Salvar configuração'}
      </button>
    </motion.div>
  )
}

// ── KPI chip ─────────────────────────────────────────────────────────────────

function Kpi({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={11} style={{ color }} className="flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: color + 'aa' }}>{label}</span>
      </div>
      <p className="text-lg font-black leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-[9px] text-white/30">{sub}</p>}
    </div>
  )
}

// ── Platform card (Google / Meta) ────────────────────────────────────────────

function PlatformCard({ platform, data, focus, clientColor }) {
  const isGoogle = platform === 'google'
  const color    = isGoogle ? '#4285f4' : '#1877f2'
  const label    = isGoogle ? 'Google Ads' : 'Meta Ads'
  const letter   = isGoogle ? 'G' : 'f'

  const showLeads  = focus === 'leads' || focus === 'leads_alcance'
  const showAlcance = focus === 'alcance' || focus === 'leads_alcance'
  const cpl = data.conversions > 0 ? data.spend / data.conversions : null

  const maxCamp = data.campaigns?.length
    ? Math.max(...data.campaigns.map(c => c.spend))
    : 0

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 20px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>

      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2.5"
        style={{ borderBottom: '1px solid #f0f2f9', background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
          style={{ background: color + '18', color }}>
          {letter}
        </div>
        <p className="text-sm font-extrabold text-text">{label}</p>
        {data.ctr > 0 && (
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: color + '12', color }}>CTR {fmtPct(data.ctr)}</span>
        )}
      </div>

      {/* KPI row */}
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
        style={{ borderBottom: data.campaigns?.length ? '1px solid #f0f2f9' : undefined }}>
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">Investido</p>
          <p className="text-xl font-black text-text">{fmtBrl(data.spend)}</p>
        </div>
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">Impressões</p>
          <p className="text-xl font-black text-text">{fmtNum(data.impressions)}</p>
        </div>
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">Cliques</p>
          <p className="text-xl font-black text-text">{fmtNum(data.clicks)}</p>
          {data.cpc > 0 && <p className="text-[9px] text-muted mt-0.5">CPC {fmtBrl(data.cpc)}</p>}
        </div>
        <div>
          {showLeads && data.conversions > 0 ? (
            <>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">Leads</p>
              <p className="text-xl font-black" style={{ color: '#6eda2c' }}>{data.conversions}</p>
              {cpl && <p className="text-[9px] text-muted mt-0.5">CPL {fmtBrl(cpl)}</p>}
            </>
          ) : showAlcance && data.reach > 0 ? (
            <>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">Alcance</p>
              <p className="text-xl font-black" style={{ color }}>{fmtNum(data.reach)}</p>
              {data.impressions > 0 && <p className="text-[9px] text-muted mt-0.5">CPM {fmtBrl(data.spend / (data.impressions / 1000))}</p>}
            </>
          ) : (
            <>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">CPM</p>
              <p className="text-xl font-black text-text">{data.impressions > 0 ? fmtBrl(data.spend / (data.impressions / 1000)) : '—'}</p>
            </>
          )}
        </div>
      </div>

      {/* Campaigns */}
      {data.campaigns?.length > 0 && (
        <div className="px-5 py-4 space-y-3">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted">Campanhas</p>
          {data.campaigns.slice(0, 4).map((c, i) => {
            const pct = maxCamp > 0 ? Math.round((c.spend / maxCamp) * 100) : 0
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-semibold text-text truncate pr-3">{c.name}</p>
                  <p className="text-[11px] font-extrabold flex-shrink-0" style={{ color }}>{fmtBrl(c.spend)}</p>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: color + '14' }}>
                  <motion.div className="h-full rounded-full" style={{ background: color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[9px] text-muted">
                  <span>{fmtNum(c.impressions)} impr.</span>
                  <span>{fmtNum(c.clicks)} cliques</span>
                  {c.conversions > 0 && <span style={{ color: '#6eda2c', fontWeight: 700 }}>{c.conversions} leads</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ── Custom tooltip recharts ──────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-lg"
      style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>
          {fmtBrl(p.value)}
        </p>
      ))}
    </div>
  )
}

// ── Filtros ──────────────────────────────────────────────────────────────────

const PERIODS = [
  { key: 'month', label: 'Este mês' },
  { key: '7d',   label: '7 dias'   },
  { key: '14d',  label: '14 dias'  },
  { key: '30d',  label: '30 dias'  },
  { key: 'prev', label: 'Mês ant.' },
]

const PLATFORMS = [
  { key: 'all',    label: 'Todas'  },
  { key: 'google', label: 'Google' },
  { key: 'meta',   label: 'Meta'   },
]

function FilterBar({ period, setPeriod, platform, setPlatform, hasGoogle, hasMeta, clientColor }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Período */}
      <div className="flex items-center gap-0.5 rounded-xl p-1"
        style={{ background: '#f1f3fb', border: '1px solid rgba(26,29,46,0.07)' }}>
        {PERIODS.map(opt => (
          <button key={opt.key} onClick={() => setPeriod(opt.key)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={period === opt.key
              ? { background: '#fff', color: clientColor, boxShadow: '0 1px 4px rgba(26,29,46,0.12)' }
              : { color: '#8890b5' }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Plataforma — só mostra se tem as duas */}
      {hasGoogle && hasMeta && (
        <div className="flex items-center gap-0.5 rounded-xl p-1"
          style={{ background: '#f1f3fb', border: '1px solid rgba(26,29,46,0.07)' }}>
          {PLATFORMS.map(opt => (
            <button key={opt.key} onClick={() => setPlatform(opt.key)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={platform === opt.key
                ? { background: '#fff', color: clientColor, boxShadow: '0 1px 4px rgba(26,29,46,0.12)' }
                : { color: '#8890b5' }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main MetricsPanel ────────────────────────────────────────────────────────

export default function MetricsPanel({ clientId, clientColor, client, isClientMode }) {
  const [period,   setPeriod]   = useState('month')
  const [platform, setPlatform] = useState('all')
  const [showConfig, setShowConfig] = useState(false)

  const { metrics, loading, error, syncedAt, source, refresh } = useAdsMetrics(clientId, client, period)

  const rawG = metrics?.channels?.google ?? metrics?.periods?.month?.google ?? null
  const rawM = metrics?.channels?.meta   ?? metrics?.periods?.month?.meta   ?? null

  // Aplica filtro de plataforma
  const g = platform === 'meta'   ? null : rawG
  const m = platform === 'google' ? null : rawM

  const totalSpend = (g?.spend || 0) + (m?.spend || 0)
  const totalLeads = (g?.conversions || 0) + (m?.conversions || 0)
  const totalImpr  = (g?.impressions || 0) + (m?.impressions || 0)
  const totalClicks = (g?.clicks || 0) + (m?.clicks || 0)
  const cpl   = totalLeads > 0  ? totalSpend / totalLeads : null
  const ctr   = totalImpr  > 0  ? totalClicks / totalImpr : null
  const cpc   = totalClicks > 0 ? totalSpend / totalClicks : null
  const focus = metrics?.focus || 'leads'

  const hasGoogle = !!rawG
  const hasMeta   = !!rawM
  const hasAccounts = client?.gads_customer_id || client?.meta_account_id

  // Gráfico diário combinado
  const chartData = (() => {
    const byDate = {}
    ;[g?.dailySpend, m?.dailySpend].forEach(arr => {
      arr?.forEach(({ date, spend }) => {
        byDate[date] = (byDate[date] || 0) + spend
      })
    })
    return Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, gasto]) => ({
        date: date.slice(5).replace('-', '/'),
        gasto: +gasto.toFixed(2),
      }))
  })()

  const hasLiveChart = chartData.length > 0

  if (!metrics && !loading) return (
    <div className="space-y-4">
      <div className="rounded-2xl p-8 text-center bg-white"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.05)' }}>
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl"
          style={{ background: clientColor + '12' }}>📡</div>
        <p className="text-sm font-extrabold text-text mb-1">Tráfego não configurado</p>
        <p className="text-xs text-muted">Conecte as contas de anúncio para ver os indicadores reais.</p>
        {!isClientMode && (
          <button onClick={() => setShowConfig(true)}
            className="mt-4 flex items-center gap-1.5 mx-auto text-xs font-bold px-4 py-2 rounded-xl transition-all"
            style={{ background: clientColor + '15', color: clientColor }}>
            <Settings size={12} /> Configurar integração
          </button>
        )}
      </div>
      {showConfig && !isClientMode && (
        <ConfigPanel clientId={clientId} client={client} clientColor={clientColor} onClose={() => setShowConfig(false)} />
      )}
    </div>
  )

  return (
    <div className="space-y-4">

      {/* ── Filtros ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar
          period={period} setPeriod={p => { setPeriod(p) }}
          platform={platform} setPlatform={setPlatform}
          hasGoogle={hasGoogle} hasMeta={hasMeta}
          clientColor={clientColor}
        />
        <div className="flex items-center gap-2">
          {!isClientMode && (
            <button onClick={() => setShowConfig(v => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              title="Configurar integração"
              style={{ background: showConfig ? clientColor + '18' : '#f1f3fb', border: '1px solid rgba(26,29,46,0.07)' }}>
              <Settings size={13} style={{ color: showConfig ? clientColor : '#8890b5' }} />
            </button>
          )}
          <button onClick={refresh} disabled={loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            title="Sincronizar agora"
            style={{ background: '#f1f3fb', border: '1px solid rgba(26,29,46,0.07)' }}>
            {loading
              ? <Loader2 size={13} className="animate-spin text-muted" />
              : <RefreshCw size={13} className="text-muted" />}
          </button>
        </div>
      </div>

      {/* ── Hero card dark ── */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 50%, #0d1a2e 100%)' }}>

        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 70% 50%, ${clientColor}55 0%, transparent 70%)` }} />

        <div className="relative p-5">
          {/* Status + data */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: clientColor }}>
              Tráfego Pago
            </span>
            {source === 'live' && (
              <span className="flex items-center gap-1 text-[8px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: '#6eda2c20', color: '#6eda2c', border: '1px solid #6eda2c30' }}>
                <span className="w-1 h-1 rounded-full bg-[#6eda2c] animate-pulse" /> AO VIVO
              </span>
            )}
            {source === 'cached' && (
              <span className="text-[8px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: '#60a5fa15', color: '#60a5fa', border: '1px solid #60a5fa20' }}>
                CACHE
              </span>
            )}
            {source === 'static' && (
              <span className="text-[8px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
                ESTÁTICO
              </span>
            )}
            {syncedAt && (
              <span className="text-[8px] text-white/25 ml-auto">
                sync {syncedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {error && <span className="text-[8px] text-red-400/70 ml-auto">⚠ erro</span>}
          </div>

          {/* Números principais + gráfico */}
          <div className={`flex gap-6 ${hasLiveChart ? 'items-start' : 'items-end'}`}>
            <div className="flex-shrink-0">
              <p className="text-4xl font-black text-white leading-none mb-1">{fmtBrl(totalSpend)}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide font-medium mb-5">Total investido</p>

              <div className="flex items-center gap-5 flex-wrap">
                {totalLeads > 0 && (
                  <div>
                    <p className="text-2xl font-black leading-none" style={{ color: clientColor }}>{totalLeads}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-wide mt-0.5">leads</p>
                  </div>
                )}
                {cpl && (
                  <>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <p className="text-2xl font-black leading-none text-white">{fmtBrl(cpl)}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wide mt-0.5">CPL</p>
                    </div>
                  </>
                )}
                {totalImpr > 0 && (
                  <>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <p className="text-2xl font-black leading-none text-white/70">{fmtNum(totalImpr)}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wide mt-0.5">impressões</p>
                    </div>
                  </>
                )}
                {ctr && (
                  <>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <p className="text-2xl font-black leading-none text-white/70">{fmtPct(ctr)}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wide mt-0.5">CTR</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {hasLiveChart && (
              <div className="flex-1 min-w-0" style={{ height: 90 }}>
                <ResponsiveContainer width="100%" height={90}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={`grad_${clientId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={clientColor} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={clientColor} stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="gasto"
                      stroke={clientColor} strokeWidth={2}
                      fill={`url(#grad_${clientId})`}
                      dot={false} activeDot={{ r: 3, fill: clientColor, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Platform mini indicators + CPC */}
          <div className="flex items-center gap-4 flex-wrap mt-5 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {g && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: '#4285f420', color: '#4285f4' }}>G</div>
                <div>
                  <p className="text-[10px] font-extrabold text-white/80">{fmtBrl(g.spend)}</p>
                  <p className="text-[8px] text-white/30">Google Ads</p>
                </div>
              </div>
            )}
            {g && m && <div className="w-px h-6 bg-white/10" />}
            {m && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: '#1877f220', color: '#1877f2' }}>f</div>
                <div>
                  <p className="text-[10px] font-extrabold text-white/80">{fmtBrl(m.spend)}</p>
                  <p className="text-[8px] text-white/30">Meta Ads</p>
                </div>
              </div>
            )}
            {cpc && (
              <div className="ml-auto text-right">
                <p className="text-[10px] font-extrabold text-white/60">{fmtBrl(cpc)}</p>
                <p className="text-[8px] text-white/25">CPC médio</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Config panel ── */}
      <AnimatePresence>
        {showConfig && !isClientMode && (
          <ConfigPanel clientId={clientId} client={client} clientColor={clientColor}
            onClose={() => setShowConfig(false)} />
        )}
      </AnimatePresence>

      {/* ── Platform cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {g && <PlatformCard platform="google" data={g} focus={focus} clientColor={clientColor} />}
        {m && <PlatformCard platform="meta"   data={m} focus={focus} clientColor={clientColor} />}
      </div>

      {/* ── Aviso dados estáticos ── */}
      {!isClientMode && !hasAccounts && metrics && (
        <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: '#ea8a2910', border: '1px solid #ea8a2928' }}>
          <p className="text-xs font-semibold" style={{ color: '#ea8a29' }}>
            Dados estáticos — conecte as contas para sincronização em tempo real.
          </p>
          <button onClick={() => setShowConfig(true)}
            className="text-xs font-bold flex items-center gap-1 flex-shrink-0"
            style={{ color: '#ea8a29' }}>
            <Settings size={11} /> Configurar
          </button>
        </div>
      )}
    </div>
  )
}
