import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, ChevronDown, MoreHorizontal, Flag, Clock, ChevronUp, FileText, Save, TrendingUp, MousePointerClick, Eye, DollarSign, Users, Zap, LogOut } from 'lucide-react'
import { taskTypes, statusConfig, milestoneTypes, erpClients as mockClients, tasks as mockTasks, collaborators as mockCollaborators } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import { getClientMetrics } from '../../data/ads-metrics'
import TarefaModal from '../../components/TarefaModal'
import TaskTemplatesDrawer from '../../components/TaskTemplatesDrawer'
import IntimeResultados from './IntimeResultados'
import CasaConstrutorResultados from './CasaConstrutorResultados'
import TrafegonResultados from './TrafegonResultados'
import TrafegonEstrategia from './TrafegonEstrategia'
import KamyEstrategia from './KamyEstrategia'
import KamyResultados from './KamyResultados'
import UserAvatar from '../../components/UserAvatar'
import Logo from '../../components/Logo'
import DestravaDigital from '../DestravaDigital'

const PAUTA_KEY    = 'trafegon_meeting_pautas_v1'
const CUSTOM_MTG_KEY = 'trafegon_custom_meetings_v1'
function loadPautas() { try { return JSON.parse(localStorage.getItem(PAUTA_KEY)) || {} } catch { return {} } }
function savePautas(d) { localStorage.setItem(PAUTA_KEY, JSON.stringify(d)) }
function loadCustomMeetings() { try { return JSON.parse(localStorage.getItem(CUSTOM_MTG_KEY)) || [] } catch { return [] } }
function saveCustomMeetings(d) { localStorage.setItem(CUSTOM_MTG_KEY, JSON.stringify(d)) }

const COLUMNS = ['todo', 'doing', 'review', 'done']

const fmtNum = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
const fmtBrl = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtPct = n => (n * 100).toFixed(2) + '%'

const PERIOD_OPTIONS = [
  { key: 'today', label: 'Hoje' },
  { key: '7d',    label: '7 dias' },
  { key: '14d',   label: '14 dias' },
  { key: 'month', label: 'Mês atual' },
  { key: 'prev',  label: 'Mês anterior' },
]

const PERIOD_LABELS = {
  today: 'Hoje',
  '7d':  'Últimos 7 dias',
  '14d': 'Últimos 14 dias',
  month: 'Mês atual',
  prev:  'Mês anterior',
}

const MATCH_TYPE_LABELS = { PHRASE: 'Frase', EXACT: 'Exata', BROAD: 'Ampla', NEAR_EXACT: '≈ Exata', NEAR_PHRASE: '≈ Frase' }
const MATCH_TYPE_COLORS = { PHRASE: '#4285f4', EXACT: '#6eda2c', BROAD: '#ea8a29', NEAR_EXACT: '#6eda2c', NEAR_PHRASE: '#4285f4' }

function SubTabs({ tabs, active, onChange, color }) {
  return (
    <div className="flex items-center gap-0.5 mb-4 border-b border-gray-100">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className="px-3 py-2 text-xs font-bold transition-all relative"
          style={active === t.key ? { color } : { color: '#8890b5' }}>
          {t.label}
          {active === t.key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: color }} />
          )}
        </button>
      ))}
    </div>
  )
}

function KpiCards({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {items.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="rounded-xl p-3.5" style={{ background: color + '08', border: `1px solid ${color}20` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Icon size={12} style={{ color }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
          </div>
          <p className="text-lg font-extrabold text-text">{value}</p>
        </div>
      ))}
    </div>
  )
}

function MetricsPanel({ clientId, clientColor }) {
  const [activePeriod, setActivePeriod] = useState('month')
  const [googleTab, setGoogleTab]       = useState('geral')
  const [metaTab, setMetaTab]           = useState('geral')
  const metrics = getClientMetrics(clientId)

  // "hoje" não tem dados no Windsor (sem preset real-time); "prev" só aparece se Windsor tiver abril
  const showDetail = activePeriod === 'month' || activePeriod === 'prev'

  // Windsor-synced totals for selected period
  const g = metrics?.periods?.[activePeriod]?.google ?? null
  const m = metrics?.periods?.[activePeriod]?.meta   ?? null

  // Rich detail (campaigns, keywords, ads lists) — shown for month + prev, always from static channels
  const gDetail = showDetail ? (metrics?.channels?.google ?? null) : null
  const mDetail = showDetail ? (metrics?.channels?.meta   ?? null) : null

  if (!metrics) return (
    <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      <Zap size={32} className="mx-auto mb-3 text-muted" style={{ opacity: 0.3 }} />
      <p className="text-sm font-bold text-text mb-1">Métricas não configuradas</p>
      <p className="text-xs text-muted">Este cliente ainda não tem integração com Google Ads ou Meta Ads.</p>
    </div>
  )

  const focusLabel = metrics.focus === 'alcance' ? '📡 Foco: Alcance & Awareness'
    : metrics.focus === 'leads_alcance' ? '🎯 Foco: Leads (Meta) + Alcance (YouTube)'
    : '🎯 Foco: Geração de Leads'

  const googleTabs = [
    { key: 'geral', label: 'Geral' },
    ...(showDetail && gDetail?.keywords?.length    > 0 ? [{ key: 'keywords', label: `Palavras-chave (${gDetail.keywords.length})` }] : []),
    ...(showDetail && gDetail?.searchTerms?.length > 0 ? [{ key: 'terms',    label: `Termos (${gDetail.searchTerms.length})` }]      : []),
    ...(showDetail && gDetail?.youtube?.length     > 0 ? [{ key: 'youtube',  label: `YouTube (${gDetail.youtube.length})` }]          : []),
  ]

  const metaTabs = [
    { key: 'geral', label: 'Geral' },
    ...(showDetail && mDetail?.ads?.length > 0 ? [{ key: 'ads', label: `Criativos (${mDetail.ads.length})` }] : []),
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-text">Performance de Tráfego Pago</p>
          <p className="text-xs text-muted mt-0.5">{PERIOD_LABELS[activePeriod]} · Atualizado em {metrics.updatedAt}</p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
          style={{ background: clientColor + '15', color: clientColor }}>
          {focusLabel}
        </span>
      </div>

      {/* Filtro de período */}
      <div className="flex items-center gap-1 bg-white rounded-xl p-1 w-fit"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
        {PERIOD_OPTIONS.map(opt => (
          <button key={opt.key} onClick={() => { setActivePeriod(opt.key); setGoogleTab('geral'); setMetaTab('geral') }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={activePeriod === opt.key
              ? { background: clientColor + '18', color: clientColor }
              : { color: '#8890b5' }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sem dados — hoje */}
      {activePeriod === 'today' && !g && !m && (
        <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <span className="text-2xl block mb-2">⏰</span>
          <p className="text-sm font-bold text-text mb-1">Dados de hoje ainda não disponíveis</p>
          <p className="text-xs text-muted">A sincronização roda automaticamente às 08h e 12h (BRT).<br />Use "7 dias" ou "Mês atual" para ver dados recentes.</p>
        </div>
      )}

      {/* Sem dados — mês anterior sem histórico */}
      {activePeriod === 'prev' && !g && !m && !gDetail && !mDetail && (
        <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <span className="text-2xl block mb-2">📅</span>
          <p className="text-sm font-bold text-text mb-1">Mês anterior sem dados</p>
          <p className="text-xs text-muted">O Windsor.ai não retornou dados de abril para este cliente.<br />O rastreamento pode ter iniciado em maio.</p>
        </div>
      )}

      {/* Sem dados — outros períodos */}
      {activePeriod !== 'today' && activePeriod !== 'prev' && !g && !m && !(showDetail && (gDetail || mDetail)) && (
        <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <p className="text-sm font-bold text-text mb-1">Sem dados para este período</p>
          <p className="text-xs text-muted">Selecione outro período ou aguarde a próxima sincronização.</p>
        </div>
      )}

      {/* Aviso: totais do período sem sync, mas campanhas disponíveis */}
      {showDetail && !g && !m && (gDetail || mDetail) && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: '#ea8a2912', border: '1px solid #ea8a2930' }}>
          <span className="text-sm">⏳</span>
          <p className="text-xs font-semibold" style={{ color: '#ea8a29' }}>
            {activePeriod === 'prev'
              ? 'Totais do mês anterior não disponíveis no Windsor. Campanhas e criativos exibidos são do mês atual como referência.'
              : 'Totais do mês em sincronização — dispare o workflow no GitHub Actions para atualizar agora. Campanhas e criativos abaixo são do último mês completo.'}
          </p>
        </div>
      )}

      {/* ── Google Ads ── */}
      {(g || (showDetail && gDetail)) && (
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: '#4285f418', color: '#4285f4' }}>G</div>
            <p className="text-sm font-extrabold text-text">Google Ads</p>
            {showDetail && <span className="ml-auto text-[10px] font-mono text-muted opacity-60">{metrics.gadsId}</span>}
          </div>

          {showDetail && googleTabs.length > 1 && (
            <SubTabs tabs={googleTabs} active={googleTab} onChange={t => setGoogleTab(t)} color="#4285f4" />
          )}

          {googleTab === 'geral' && (
            <>
              {g && (
                <KpiCards items={[
                  { icon: DollarSign, label: 'Investimento', value: fmtBrl(g.spend), color: '#4285f4' },
                  { icon: Eye, label: 'Impressões', value: fmtNum(g.impressions), color: clientColor },
                  { icon: MousePointerClick, label: 'Cliques', value: fmtNum(g.clicks), color: '#ea8a29' },
                  (metrics.focus === 'alcance' || metrics.focus === 'leads_alcance')
                    ? { icon: TrendingUp, label: 'CPM', value: g.impressions > 0 ? fmtBrl(g.spend / (g.impressions / 1000)) : '—', color: '#6eda2c' }
                    : { icon: Users, label: 'Conversões', value: String(g.conversions ?? 0), color: '#6eda2c' },
                ]} />
              )}

              {showDetail && gDetail?.campaigns?.length > 0 && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Campanhas ativas</p>
                  <div className="space-y-3">
                    {gDetail.campaigns.map((c, i) => {
                      const maxSpend = Math.max(...gDetail.campaigns.map(x => x.spend))
                      const pct = Math.round((c.spend / maxSpend) * 100)
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-text truncate pr-2">{c.name}</p>
                            <p className="text-xs font-extrabold text-text flex-shrink-0">{fmtBrl(c.spend)}</p>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#4285f415' }}>
                            <motion.div className="h-full rounded-full" style={{ background: '#4285f4' }}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted">
                            <span>{fmtNum(c.impressions)} impr.</span>
                            <span>{fmtNum(c.clicks)} cliques</span>
                            {c.conversions > 0 && <span>{c.conversions} conv.</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {showDetail && gDetail?.historical && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid #edf0f7' }}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Histórico Jan–Abr 2026</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Investido',   value: fmtBrl(gDetail.historical.spend) },
                      { label: 'Impressões',  value: fmtNum(gDetail.historical.impressions) },
                      { label: 'Cliques',     value: fmtNum(gDetail.historical.clicks) },
                      { label: 'Conversões',  value: String(gDetail.historical.conversions) },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: '#f7f8fc' }}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted mb-1">{item.label}</p>
                        <p className="text-sm font-extrabold text-text">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {showDetail && googleTab === 'keywords' && gDetail?.keywords?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #edf0f7' }}>
                    {['Palavra-chave', 'Tipo', 'Grupo', 'Impr.', 'Cliques', 'CTR', 'CPC', 'Conv.', 'Custo'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[10px] font-extrabold uppercase tracking-wider text-muted whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gDetail.keywords.map((kw, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f5f6fa' }}>
                      <td className="py-2.5 pr-4 font-semibold text-text whitespace-nowrap">{kw.text}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: (MATCH_TYPE_COLORS[kw.matchType] || '#8890b5') + '18', color: MATCH_TYPE_COLORS[kw.matchType] || '#8890b5' }}>
                          {MATCH_TYPE_LABELS[kw.matchType] || kw.matchType}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-muted truncate max-w-[120px]">{kw.adGroup}</td>
                      <td className="py-2.5 pr-4 text-text">{fmtNum(kw.impressions)}</td>
                      <td className="py-2.5 pr-4 text-text font-semibold">{kw.clicks}</td>
                      <td className="py-2.5 pr-4 text-text">{kw.ctr ? (kw.ctr * 100).toFixed(1) + '%' : '—'}</td>
                      <td className="py-2.5 pr-4 text-text">{kw.cpc ? fmtBrl(kw.cpc) : '—'}</td>
                      <td className="py-2.5 pr-4 font-bold" style={{ color: kw.conversions > 0 ? '#6eda2c' : '#8890b5' }}>{kw.conversions}</td>
                      <td className="py-2.5 pr-4 font-bold text-text">{kw.cost > 0 ? fmtBrl(kw.cost) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showDetail && googleTab === 'terms' && gDetail?.searchTerms?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #edf0f7' }}>
                    {['Termo pesquisado', 'Correspondência', 'Campanha', 'Impr.', 'Cliques', 'Conv.', 'Custo'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[10px] font-extrabold uppercase tracking-wider text-muted whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gDetail.searchTerms.map((st, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f5f6fa' }}>
                      <td className="py-2.5 pr-4 font-semibold text-text">{st.term}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: (MATCH_TYPE_COLORS[st.matchType] || '#8890b5') + '18', color: MATCH_TYPE_COLORS[st.matchType] || '#8890b5' }}>
                          {MATCH_TYPE_LABELS[st.matchType] || st.matchType}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-muted text-[11px]">{st.campaign}</td>
                      <td className="py-2.5 pr-4 text-text">{st.impressions}</td>
                      <td className="py-2.5 pr-4 font-semibold text-text">{st.clicks}</td>
                      <td className="py-2.5 pr-4 font-bold" style={{ color: st.conversions > 0 ? '#6eda2c' : '#8890b5' }}>{st.conversions}</td>
                      <td className="py-2.5 pr-4 font-bold text-text">{st.cost > 0 ? fmtBrl(st.cost) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showDetail && googleTab === 'youtube' && gDetail?.youtube?.length > 0 && (
            <div className="space-y-3">
              {gDetail.youtube.map((vid, i) => {
                const maxImpr = Math.max(...gDetail.youtube.map(v => v.impressions))
                const pct = Math.round((vid.impressions / maxImpr) * 100)
                const cpm = vid.cost / (vid.impressions / 1000)
                return (
                  <div key={i} className="rounded-xl p-4" style={{ background: '#ff000008', border: '1px solid #ff000018' }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#ff0000', color: 'white', fontSize: 10, fontWeight: 900 }}>▶</div>
                        <p className="text-xs font-semibold text-text">{vid.name}</p>
                      </div>
                      <p className="text-sm font-extrabold text-text flex-shrink-0">{fmtBrl(vid.cost)}</p>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: '#ff000015' }}>
                      <motion.div className="h-full rounded-full" style={{ background: '#ff0000' }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted">
                      <span><strong className="text-text">{fmtNum(vid.impressions)}</strong> impr.</span>
                      <span><strong className="text-text">{vid.clicks}</strong> cliques</span>
                      <span>CPM <strong className="text-text">{fmtBrl(cpm)}</strong></span>
                      <span>CTR <strong className="text-text">{(vid.ctr * 100).toFixed(2)}%</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Meta Ads ── */}
      {(m || (showDetail && mDetail)) && (
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: '#1877f218', color: '#1877f2' }}>f</div>
            <p className="text-sm font-extrabold text-text">Meta Ads</p>
            {showDetail && <span className="ml-auto text-[10px] font-mono text-muted opacity-60">{metrics.metaId}</span>}
          </div>

          {showDetail && metaTabs.length > 1 && (
            <SubTabs tabs={metaTabs} active={metaTab} onChange={t => setMetaTab(t)} color="#1877f2" />
          )}

          {metaTab === 'geral' && (
            <>
              {m && (
                <KpiCards items={[
                  { icon: DollarSign,        label: 'Investimento', value: fmtBrl(m.spend),       color: '#1877f2' },
                  { icon: Users,             label: 'Alcance',      value: fmtNum(m.reach || 0),  color: clientColor },
                  { icon: Eye,               label: 'Impressões',   value: fmtNum(m.impressions), color: '#ea8a29' },
                  { icon: MousePointerClick, label: 'Cliques',      value: fmtNum(m.clicks),      color: '#6eda2c' },
                ]} />
              )}

              {showDetail && m && (m.ctr || m.cpc) && (
                <div className="flex items-center gap-6 mb-5 text-xs">
                  <div><span className="text-muted">CTR </span><strong className="text-text">{m.ctr ? (m.ctr * 100).toFixed(2) + '%' : '—'}</strong></div>
                  <div><span className="text-muted">CPC </span><strong className="text-text">{m.cpc ? fmtBrl(m.cpc) : '—'}</strong></div>
                  {m.reach > 0 && <div><span className="text-muted">CPM </span><strong className="text-text">{fmtBrl(m.spend / (m.impressions / 1000))}</strong></div>}
                </div>
              )}

              {showDetail && mDetail?.campaigns?.length > 0 && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Campanhas ativas</p>
                  <div className="space-y-3">
                    {mDetail.campaigns.map((c, i) => {
                      const maxSpend = Math.max(...mDetail.campaigns.map(x => x.spend))
                      const pct = Math.round((c.spend / maxSpend) * 100)
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-text truncate pr-2">{c.name}</p>
                            <p className="text-xs font-extrabold text-text flex-shrink-0">{fmtBrl(c.spend)}</p>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1877f215' }}>
                            <motion.div className="h-full rounded-full" style={{ background: '#1877f2' }}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted">
                            <span>{fmtNum(c.impressions)} impr.</span>
                            <span>{fmtNum(c.clicks)} cliques</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {showDetail && mDetail?.historical && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid #edf0f7' }}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Histórico Jan–Abr 2026</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Investido',  value: fmtBrl(mDetail.historical.spend) },
                      { label: 'Alcance',    value: fmtNum(mDetail.historical.reach || 0) },
                      { label: 'Impressões', value: fmtNum(mDetail.historical.impressions) },
                      { label: 'Cliques',    value: fmtNum(mDetail.historical.clicks) },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: '#f7f8fc' }}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted mb-1">{item.label}</p>
                        <p className="text-sm font-extrabold text-text">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {showDetail && metaTab === 'ads' && mDetail?.ads?.length > 0 && (
            <div className="space-y-4">
              {mDetail.ads.map((ad, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid #edf0f7' }}>
                  {ad.thumb && (
                    <div style={{ background: '#f0f1f7', maxHeight: 220, overflow: 'hidden' }}>
                      <img src={ad.thumb} alt="" className="w-full object-cover"
                        style={{ maxHeight: 220, display: 'block' }}
                        onError={e => { e.currentTarget.parentElement.style.display = 'none' }} />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-xs font-extrabold text-text">{ad.name}</p>
                        <p className="text-[10px] text-muted mt-0.5">{ad.adset}</p>
                      </div>
                      <p className="text-sm font-extrabold flex-shrink-0" style={{ color: '#1877f2' }}>{fmtBrl(ad.spend)}</p>
                    </div>
                    {ad.body && (
                      <div className="rounded-xl p-3 mt-2 mb-3" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
                        <p className="text-[11px] text-text leading-relaxed whitespace-pre-line">{ad.body}</p>
                        {ad.title && <p className="text-xs font-bold text-text mt-1.5">{ad.title}</p>}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[10px] flex-wrap">
                      <span><strong className="text-text">{fmtNum(ad.impressions)}</strong> <span className="text-muted">impr.</span></span>
                      <span><strong className="text-text">{fmtNum(ad.reach)}</strong> <span className="text-muted">alcance</span></span>
                      <span><strong className="text-text">{ad.clicks}</strong> <span className="text-muted">cliques</span></span>
                      <span className="text-muted">CTR <strong className="text-text">{(ad.ctr * 100).toFixed(2)}%</strong></span>
                      <span className="text-muted">CPC <strong className="text-text">{fmtBrl(ad.cpc)}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showDetail && (g || m) && (
        <p className="text-center text-xs py-1" style={{ color: '#8890b5' }}>
          Campanhas, palavras-chave e criativos disponíveis em <strong>Mês atual</strong>
        </p>
      )}
    </div>
  )
}

const priorityConfig = {
  high:   { label: 'Alta',   color: '#ef4444' },
  medium: { label: 'Média',  color: '#ea8a29' },
  low:    { label: 'Baixa',  color: '#8890b5' },
}

function TaskCard({ task, collabMap, onEdit }) {
  const type = taskTypes[task.type]
  const assignee = collabMap[task.assignee]
  const priority = priorityConfig[task.priority]
  const isOverdue = task.dueDate && new Date(task.dueDate + 'T00:00:00') < new Date() && task.status !== 'done'
  const isDone = task.status === 'done'

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: isDone ? 0.6 : 1, y: 0 }} exit={{ opacity: 0 }}>
      <div
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('taskId', String(task.id))
          e.dataTransfer.effectAllowed = 'move'
        }}
        onClick={() => onEdit && onEdit(task)}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,29,46,0.13)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        className="bg-white rounded-xl p-3.5 select-none"
        style={{
          boxShadow: '0 1px 6px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)',
          cursor: 'grab',
          borderLeft: `3px solid ${type?.color || '#8890b5'}`,
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
      >
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
          style={{ color: type.color, backgroundColor: type.color + '15' }}
        >
          {type.icon} {type.label}
        </span>
        <div className="flex items-center gap-1">
          <Flag size={11} style={{ color: priority?.color || '#8890b5' }} />
          {isOverdue && <span className="text-[9px] font-bold text-danger">Atrasada</span>}
        </div>
      </div>

      <p className={`text-sm font-semibold mb-1 leading-snug ${isDone ? 'line-through text-muted' : 'text-text'}`}>
        {task.title}
      </p>
      {task.description && (
        <p className="text-[11px] text-muted leading-relaxed mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <UserAvatar user={assignee} size={20} />
          <span className="text-[10px] text-muted">{assignee?.name}</span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-semibold ${isOverdue ? 'text-danger' : 'text-muted'}`}>
          <Clock size={10} />
          {task.dueDate
            ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
            : '—'}
        </div>
      </div>
      </div>
    </motion.div>
  )
}

function KanbanColumn({ status, tasks, clientColor, collabMap, onStatusChange, onEdit, onNewTask }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const cfg = statusConfig[status]

  return (
    <div
      className="flex flex-col w-64 flex-shrink-0 rounded-2xl p-2 transition-all duration-150"
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); e.dataTransfer.dropEffect = 'move' }}
      onDragLeave={e => { if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false) }}
      onDrop={e => {
        e.preventDefault()
        setIsDragOver(false)
        const taskId = e.dataTransfer.getData('taskId')
        if (taskId && onStatusChange) onStatusChange(taskId, status)
      }}
      style={{
        background:  isDragOver ? cfg.color + '10' : 'transparent',
        outline:     isDragOver ? `2px dashed ${cfg.color}50` : 'none',
        outlineOffset: 2,
      }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        <span className="text-xs font-bold text-text-2 flex-1">{cfg.label}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ color: cfg.color, backgroundColor: cfg.color + '18' }}
        >
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 min-h-16">
        {isDragOver && tasks.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-xl border-2 border-dashed"
            style={{ borderColor: cfg.color + '50' }}>
            <p className="text-[11px] font-bold" style={{ color: cfg.color }}>Soltar aqui</p>
          </div>
        )}
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} collabMap={collabMap} onEdit={onEdit} />
          ))}
        </AnimatePresence>
      </div>
      <button
        onClick={onNewTask}
        className="mt-2 flex items-center gap-1.5 text-xs text-muted hover:text-accent hover:bg-accent/5 rounded-xl px-2 py-2 transition-all w-full border border-transparent hover:border-accent/20">
        <Plus size={12} /> Adicionar tarefa
      </button>
    </div>
  )
}

const TABS_BASE                    = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', 'Tráfego']
const TABS_CLIENT_INTIME           = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', '🏆 Resultados']
const TABS_INTIME                  = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', 'Tráfego', '🏆 Resultados']
const TABS_CLIENT_CASA_CONSTRUTOR  = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', '🏆 Resultados']
const TABS_CASA_CONSTRUTOR         = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', 'Tráfego', '🏆 Resultados']
const TABS_AGENCIA  = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', '🏆 Resultados', '🧠 Estratégia', '🔓 Destrava']
const TABS_KAMY     = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', 'Tráfego', '🏆 Resultados', '🧠 Estratégia']
const TABS_DESTRAVA = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo', 'Tráfego', '🔓 Destrava']

const DESTRAVA_IDS  = ['dsorrir', 'luciana_vasco', 'plano_ideal', 'girassol_arq']

// ── Destrava Board ────────────────────────────────────────────────────────────

const DESTRAVA_MISSIONS_15 = [
  { id: 'm1', day: 3,  icon: '📱', title: 'Primeira resposta documentada', desc: 'Responder o primeiro lead em até 1h e enviar o print da conversa.' },
  { id: 'm2', day: 5,  icon: '📊', title: 'Leia seus números',             desc: 'Acessar o gerenciador e enviar print com impressões, cliques e leads.' },
  { id: 'm3', day: 8,  icon: '🎯', title: 'Separe o joio do trigo',        desc: 'Informar quais leads eram do perfil ideal e o que tinham em comum.' },
  { id: 'm4', day: 12, icon: '📋', title: 'Monte seu registro',            desc: 'Criar planilha ou lista: nome do lead, data, se virou consulta.' },
  { id: 'm5', day: 14, icon: '🏁', title: 'Balanço final',                 desc: 'Enviar total de leads, consultas e fechamentos antes da call.' },
]

const DESTRAVA_MISSIONS_30 = [
  { id: 'm1', day: 3,  icon: '📱', title: 'Primeira resposta documentada', desc: 'Responder o primeiro lead em até 1h e enviar o print da conversa.' },
  { id: 'm2', day: 5,  icon: '📊', title: 'Leia seus números (2 canais)',  desc: 'Print dos dois gerenciadores com impressões, cliques e leads.' },
  { id: 'm3', day: 7,  icon: '🎯', title: 'Perfil do lead ideal',          desc: 'Descrever em 3 linhas quem é o cliente perfeito.' },
  { id: 'm4', day: 10, icon: '🌡️', title: 'Primeira triagem',              desc: 'Separar os leads em Quente / Morno / Frio e enviar a lista.' },
  { id: 'm5', day: 14, icon: '📈', title: 'Relatório da quinzena',         desc: 'Responder 3 perguntas do relatório enviado: melhor anúncio, canal, o que mudaria.' },
  { id: 'm6', day: 18, icon: '💬', title: 'Processo de atendimento',       desc: 'Descrever como está atendendo: primeira mensagem, proposta, tempo médio.' },
  { id: 'm7', day: 22, icon: '🏆', title: 'Padrão dos que fecharam',       desc: 'O que os clientes que fecharam tinham em comum: origem, perfil, problema.' },
  { id: 'm8', day: 28, icon: '🏁', title: 'Balanço do mês',               desc: 'Total de leads, consultas, fechamentos e 1 aprendizado antes da call.' },
]

const DESTRAVA_ADJUSTMENTS = [
  { code: 'A', color: '#6eda2c', situation: 'CPL acima da meta definida',           action: 'Reduz orçamento 20% + revisa títulos (ambos os canais)' },
  { code: 'B', color: '#60a5fa', situation: 'Muitos cliques, poucos leads',         action: 'Problema na landing page ou WhatsApp — o anúncio está funcionando' },
  { code: 'C', color: '#1877f2', situation: 'Leads chegam mas não fecham',          action: 'Não é tráfego — revisar atendimento e script de primeiro contato' },
  { code: 'D', color: '#ef4444', situation: 'Keyword com 2x CPL meta e zero leads', action: 'Pausa e avalia virar negativo — não por valor fixo' },
  { code: 'E', color: '#f59e0b', situation: 'Criativo com 2x CPL meta por 5–7 dias', action: 'Pausa e coloca próximo na fila — não por valor fixo' },
  { code: 'F', color: '#ea8a29', situation: 'Frequência Meta acima de 3–4',         action: 'Troca criativo ou expande público — sinal de saturação' },
  { code: 'G', color: '#be29ec', situation: 'Pmax sem resultado',                   action: 'Aguarda 14–21 dias — é o tempo de aprendizado do algoritmo' },
  { code: 'H', color: '#60a5fa', situation: 'Um canal com CPL muito menor',         action: 'Realoca 30% do orçamento do canal fraco para o forte' },
  { code: 'I', color: '#ef4444', situation: 'Lead não responde no WhatsApp',        action: 'Troca 1ª mensagem para pergunta curta e direta' },
  { code: 'J', color: '#6eda2c', situation: 'CPL ok, quer mais volume',             action: 'Aumenta orçamento máx 20% a cada 3–4 dias — nunca de uma vez' },
]

const DESTRAVA_KEY = id => `destrava_${id}_v1`
function loadDestravaState(id)  { try { return JSON.parse(localStorage.getItem(DESTRAVA_KEY(id))) || {} } catch { return {} } }
function saveDestravaState(id, d) { localStorage.setItem(DESTRAVA_KEY(id), JSON.stringify(d)) }

function DestravaBoard({ clientId, clientColor }) {
  const [state, setState] = useState(() => loadDestravaState(clientId))
  const plan = state.plan || '30'
  const missions = plan === '15' ? DESTRAVA_MISSIONS_15 : DESTRAVA_MISSIONS_30
  const done = missions.filter(m => state.checks?.[m.id]).length
  const [activeTab, setActiveTab] = useState('missoes')
  const GREEN = '#6eda2c'

  function setPlan(p) {
    const next = { ...state, plan: p, checks: {} }
    setState(next); saveDestravaState(clientId, next)
  }
  function toggleMission(id) {
    const checks = { ...state.checks, [id]: !state.checks?.[id] }
    const next = { ...state, checks }
    setState(next); saveDestravaState(clientId, next)
  }
  function logAdjustment(code) {
    const log = [...(state.adjustmentLog || []), { code, date: new Date().toLocaleDateString('pt-BR'), note: '' }]
    const next = { ...state, adjustmentLog: log }
    setState(next); saveDestravaState(clientId, next)
  }

  const accentColor = clientColor || GREEN

  return (
    <div className="p-4 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-lg font-extrabold text-text">🔓 Destrava Digital</p>
          <p className="text-xs text-muted mt-0.5">Acompanhamento operacional — {plan === '15' ? '15 dias' : '30 dias'}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-surface rounded-xl p-1">
          {['15', '30'].map(p => (
            <button key={p} onClick={() => setPlan(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={plan === p ? { background: accentColor + '20', color: accentColor } : { color: '#8890b5' }}>
              {p} dias
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-extrabold text-text">Progresso das missões</p>
          <p className="text-xs font-extrabold" style={{ color: accentColor }}>{done}/{missions.length}</p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: accentColor + '18' }}>
          <motion.div className="h-full rounded-full" style={{ background: accentColor }}
            animate={{ width: `${missions.length > 0 ? (done / missions.length) * 100 : 0}%` }}
            transition={{ duration: 0.6 }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-100">
        {[['missoes', '📋 Missões'], ['ajustes', '⚙️ Ajustes'], ['log', '📝 Log']].map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            className="px-3 py-2 text-xs font-bold transition-all relative"
            style={activeTab === k ? { color: accentColor } : { color: '#8890b5' }}>
            {l}
            {activeTab === k && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: accentColor }} />}
          </button>
        ))}
      </div>

      {/* Missões */}
      {activeTab === 'missoes' && (
        <div className="space-y-2">
          {missions.map(m => {
            const checked = !!state.checks?.[m.id]
            return (
              <motion.div key={m.id} layout
                className="bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all"
                style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)', opacity: checked ? 0.65 : 1, borderLeft: `3px solid ${checked ? accentColor : 'transparent'}` }}
                onClick={() => toggleMission(m.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: accentColor + '12' }}>{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                      style={{ background: accentColor + '18', color: accentColor }}>Dia {m.day}</span>
                    {checked && <span className="text-[10px] font-bold text-green-600">✅ Concluída</span>}
                  </div>
                  <p className={`text-sm font-bold ${checked ? 'line-through text-muted' : 'text-text'}`}>{m.title}</p>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{m.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: checked ? accentColor : 'transparent', border: `2px solid ${checked ? accentColor : '#c8cde0'}` }}>
                  {checked && <span className="text-white text-[10px] font-extrabold">✓</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Ajustes */}
      {activeTab === 'ajustes' && (
        <div className="space-y-2">
          {DESTRAVA_ADJUSTMENTS.map(adj => (
            <div key={adj.code} className="bg-white rounded-xl p-3.5 flex items-start gap-3"
              style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                style={{ background: adj.color + '18', color: adj.color }}>{adj.code}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text">{adj.situation}</p>
                <p className="text-[11px] text-muted mt-0.5">{adj.action}</p>
              </div>
              <button onClick={() => logAdjustment(adj.code)}
                className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all flex-shrink-0"
                style={{ background: adj.color + '12', color: adj.color, border: `1px solid ${adj.color}30` }}>
                + Aplicar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {activeTab === 'log' && (
        <div className="space-y-2">
          {(!state.adjustmentLog || state.adjustmentLog.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm font-bold text-text mb-1">Nenhum ajuste registrado</p>
              <p className="text-xs text-muted">Aplique ajustes na aba "Ajustes" para registrar aqui.</p>
            </div>
          ) : [...state.adjustmentLog].reverse().map((entry, i) => {
            const adj = DESTRAVA_ADJUSTMENTS.find(a => a.code === entry.code)
            return (
              <div key={i} className="bg-white rounded-xl p-3.5 flex items-center gap-3"
                style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                  style={{ background: (adj?.color || '#8890b5') + '18', color: adj?.color || '#8890b5' }}>{entry.code}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text">{adj?.situation || entry.code}</p>
                  <p className="text-[10px] text-muted mt-0.5">{entry.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ClientTimeline({ clientId, clientColor, clientTasks: tasksProp = [] }) {
  const { milestones } = useData()
  const [filter,   setFilter]   = useState('all')
  const [expanded, setExpanded] = useState({})
  const today = new Date().toISOString().slice(0, 10)

  /* ── Eventos ─────────────────────────────────── */
  const msEvents = milestones
    .filter(m => m.clientId === clientId)
    .map(m => ({
      id: 'ms_' + m.id, date: m.date, title: m.title,
      description: m.description, type: m.type, kind: 'marco', level: 'marco',
    }))

  const tkEvents = tasksProp
    .filter(t => t.dueDate || t.createdAt)
    .map(t => ({
      id:    'tk_' + t.id,
      date:  t.dueDate || t.createdAt?.split('T')[0],
      title: t.title, description: t.description,
      type:  t.type,  status: t.status,
      level: t.level || 'operacao',
      kind:  'task',  priority: t.priority,
    }))

  const allEvents = [...msEvents, ...tkEvents]
    .sort((a, b) => b.date.localeCompare(a.date))

  const filtered = useMemo(() => {
    if (filter === 'marco')    return allEvents.filter(e => e.level === 'marco')
    if (filter === 'operacao') return allEvents.filter(e => e.level === 'operacao')
    if (filter === 'interno')  return allEvents.filter(e => e.level === 'interno')
    return allEvents
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, allEvents.length])

  /* ── Stats ────────────────────────────────────── */
  const doneTasks       = tasksProp.filter(t => t.status === 'done').length
  const totalXP         = tasksProp.filter(t => t.status === 'done')
    .reduce((s, t) => s + (taskTypes[t.type]?.xp ?? 50), 0)
  const completion      = tasksProp.length > 0 ? Math.round((doneTasks / tasksProp.length) * 100) : 0
  const doneMilestones  = msEvents.filter(m => m.date <= today)
  const futureMilestones = msEvents.filter(m => m.date > today)
  const nextMilestone   = [...futureMilestones].sort((a, b) => a.date.localeCompare(b.date))[0]
  const CIRC            = 2 * Math.PI * 42

  /* ── Agrupar por mês ─────────────────────────── */
  const grouped = useMemo(() => {
    const grp = {}
    filtered.forEach(ev => {
      const d   = new Date(ev.date + 'T00:00:00')
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const lbl = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      if (!grp[key]) grp[key] = { label: lbl, events: [] }
      grp[key].events.push(ev)
    })
    return Object.entries(grp).sort((a, b) => b[0].localeCompare(a[0]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, filter])

  function toggle(id) { setExpanded(p => ({ ...p, [id]: !p[id] })) }

  /* ── Achievement Card (marco) ─────────────────── */
  function AchievementCard({ ev }) {
    const cfg    = milestoneTypes[ev.type] || { label: 'Marco', icon: '🏁', color: '#f59e0b' }
    const open   = expanded[ev.id]
    const isPast = ev.date <= today
    const isMeta = ev.type === 'meta'

    return (
      <motion.div layout whileHover={{ scale: 1.005 }} onClick={() => toggle(ev.id)}
        className="cursor-pointer rounded-2xl p-4 flex gap-4 transition-all"
        style={{
          background:  isMeta && isPast ? 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)' : isPast ? 'white' : '#f8f9fc',
          border:      `1px solid ${isPast ? cfg.color + '30' : '#e8eaf2'}`,
          boxShadow:   isPast ? `0 4px 20px ${cfg.color}15, 0 0 0 1px ${cfg.color}10` : 'none',
          opacity:     isPast ? 1 : 0.52,
          filter:      isPast ? 'none' : 'grayscale(70%)',
        }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: isPast ? cfg.color + '20' : '#f0f1f7', boxShadow: isPast ? `0 2px 8px ${cfg.color}28` : 'none' }}>
          {isPast ? cfg.icon : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: isPast ? cfg.color + '20' : '#f0f1f7', color: isPast ? cfg.color : '#9399b8' }}>
              {cfg.label}
            </span>
            {isMeta && isPast && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.18)', color: '#f59e0b' }}>🏆 Meta Atingida</span>
            )}
            {isPast && !isMeta && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-50 text-green-600">✅ Concluído</span>
            )}
            {!isPast && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface text-muted">🔒 Próximo</span>
            )}
          </div>
          <p className="text-sm font-extrabold" style={{ color: isMeta && isPast ? 'white' : '#1a1d2e' }}>{ev.title}</p>
          <p className="text-[11px] mt-0.5" style={{ color: isMeta && isPast ? 'rgba(255,255,255,0.42)' : '#9399b8' }}>
            {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })}
          </p>
          <AnimatePresence>
            {open && ev.description && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs mt-2 p-3 rounded-xl overflow-hidden"
                style={{ background: isMeta && isPast ? 'rgba(255,255,255,0.07)' : cfg.color + '0c', color: isMeta && isPast ? 'rgba(255,255,255,0.7)' : '#4a5068' }}>
                {ev.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {ev.description && (
          <div className="flex-shrink-0 self-start mt-1" style={{ color: isPast ? cfg.color : '#c0c4d8' }}>
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        )}
      </motion.div>
    )
  }

  /* ── Task Card (operação/interno) ─────────────── */
  function TaskCard({ ev }) {
    const open   = expanded[ev.id]
    const tp     = taskTypes[ev.type] || { label: ev.type, icon: '📌', color: '#8890b5', xp: 50 }
    const st     = statusConfig[ev.status] || { label: ev.status, color: '#8890b5' }
    const isDone = ev.status === 'done'
    const isInt  = ev.level === 'interno'

    return (
      <motion.div layout whileHover={{ scale: 1.003 }} onClick={() => toggle(ev.id)}
        className={`cursor-pointer rounded-xl border p-3 flex gap-3 bg-white transition-shadow hover:shadow-md ${isInt ? 'opacity-50' : ''}`}
        style={{ borderColor: tp.color + '28' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: tp.color + '14' }}>
          {tp.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: tp.color + '18', color: tp.color }}>{tp.label}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: st.color + '18', color: st.color }}>{st.label}</span>
            {isInt  && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-border text-muted">🔒 Interno</span>}
            {isDone && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-accent/10 text-accent">⚡ +{tp.xp} ons</span>}
          </div>
          <p className={`text-[12px] font-bold leading-tight ${isDone ? 'line-through text-muted' : 'text-text'}`}>
            {ev.title}
          </p>
          <p className="text-[10px] text-muted mt-0.5">
            {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
          </p>
          <AnimatePresence>
            {open && ev.description && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs text-text-2 mt-2 p-2 rounded-lg overflow-hidden"
                style={{ background: '#f7f8fc' }}>
                {ev.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {ev.description && (
          <div className="flex-shrink-0 self-start text-muted">{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">

      {/* ── HERO PROGRESS ─────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${clientColor}22 0%, transparent 60%)` }} />
        <div className="relative z-10 flex flex-wrap gap-6 items-center">
          {/* Anel de progresso animado */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <motion.circle cx="50" cy="50" r="42" fill="none"
                stroke={clientColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={String(CIRC)}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: CIRC * (1 - completion / 100) }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white leading-none">{completion}%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>tarefas</span>
            </div>
          </div>
          {/* Stats rápidos */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Progresso do Projeto
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>Marcos</p>
                <p className="text-2xl font-black text-white">
                  {doneMilestones.length}<span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>/{msEvents.length}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>Ons Gerados</p>
                <p className="text-2xl font-black" style={{ color: '#be29ec' }}>
                  {totalXP}<span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}> ons</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.42)' }}>Entregas</p>
                <p className="text-2xl font-black text-white">{allEvents.length}</p>
              </div>
            </div>
            {nextMilestone && (
              <div className="mt-3 rounded-xl px-3 py-2 w-fit"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Próximo marco</p>
                <p className="text-[12px] font-extrabold" style={{ color: 'rgba(255,255,255,0.82)' }}>{nextMilestone.title}</p>
                <p className="text-[10px]" style={{ color: clientColor + 'bb' }}>
                  {new Date(nextMilestone.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── TRILHA DA JORNADA ─────────────────────── */}
      {msEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">🗺️ Jornada do Projeto</p>
            <span className="text-[10px] font-bold text-muted">{doneMilestones.length}/{msEvents.length} concluídos</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-0 min-w-max">
              {[...msEvents].sort((a, b) => a.date.localeCompare(b.date)).map((m, i, arr) => {
                const cfg    = milestoneTypes[m.type] || { label: 'Marco', icon: '🏁', color: '#f59e0b' }
                const isPast = m.date <= today
                const isNext = !isPast && (i === 0 || arr[i - 1]?.date <= today)
                const isLast = i === arr.length - 1
                return (
                  <div key={m.id} className="flex items-center">
                    <div className="flex flex-col items-center" style={{ width: 96 }}>
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: isPast ? 1 : isNext ? 0.92 : 0.78, opacity: isPast ? 1 : isNext ? 0.72 : 0.38 }}
                        transition={{ delay: i * 0.04 }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{
                          background: isPast ? cfg.color + '20' : '#f0f1f7',
                          border:     isPast ? `2px solid ${cfg.color}` : isNext ? `2px dashed ${cfg.color}55` : '2px solid #e0e3f0',
                          boxShadow:  isPast ? `0 0 14px ${cfg.color}3a` : 'none',
                        }}>
                        {isPast ? cfg.icon : isNext ? cfg.icon : '🔒'}
                      </motion.div>
                      <p className="text-[9px] font-extrabold text-center mt-2 leading-tight px-1"
                        style={{ color: isPast ? cfg.color : '#c0c4d8', maxWidth: 90 }}>
                        {m.title.length > 18 ? m.title.slice(0, 17) + '…' : m.title}
                      </p>
                    </div>
                    {!isLast && (
                      <div className="h-0.5 flex-shrink-0" style={{
                        width: 20,
                        background: isPast && arr[i + 1]?.date <= today
                          ? clientColor
                          : isPast
                            ? `linear-gradient(90deg, ${clientColor}, #e0e3f0)`
                            : '#e0e3f0',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CONQUISTAS ────────────────────────────── */}
      {msEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">🏆 Conquistas</p>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#f59e0b18', color: '#f59e0b' }}>
              {doneMilestones.length}/{msEvents.length} desbloqueadas
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...msEvents].sort((a, b) => a.date.localeCompare(b.date)).map((m, i) => {
              const cfg    = milestoneTypes[m.type] || { label: 'Marco', icon: '🏁', color: '#f59e0b' }
              const isPast = m.date <= today
              const isMeta = m.type === 'meta'
              return (
                <motion.div key={m.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: isPast ? 1 : 0.3, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={isPast ? { scale: 1.04, y: -2 } : {}}
                  className="rounded-xl p-3 flex flex-col items-center text-center"
                  style={{
                    background: isMeta && isPast
                      ? 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)'
                      : isPast ? cfg.color + '0d' : '#f7f8fc',
                    border:  `1px solid ${isPast ? cfg.color + '30' : '#e2e5f0'}`,
                    filter:  isPast ? 'none' : 'grayscale(100%)',
                    boxShadow: isPast && isMeta ? '0 4px 20px rgba(10,10,30,0.2)' : 'none',
                  }}>
                  <div className="text-2xl mb-2">{isPast ? cfg.icon : '🔒'}</div>
                  <p className="text-[10px] font-extrabold leading-tight"
                    style={{ color: isMeta && isPast ? 'white' : isPast ? '#1a1d2e' : '#9399b8' }}>
                    {m.title}
                  </p>
                  {!isPast && <p className="text-[8px] font-bold mt-1.5" style={{ color: cfg.color }}>Em breve</p>}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── FILTROS ───────────────────────────────── */}
      <div className="bg-white rounded-2xl p-1.5 flex gap-1 flex-wrap w-fit"
        style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.07)' }}>
        {[
          { key: 'all',      icon: '📋', label: 'Todos',    count: allEvents.length },
          { key: 'marco',    icon: '🏆', label: 'Marcos',   count: msEvents.length },
          { key: 'operacao', icon: '⚙️', label: 'Operação', count: tkEvents.filter(t => t.level !== 'interno').length },
          { key: 'interno',  icon: '🔒', label: 'Interno',  count: tkEvents.filter(t => t.level === 'interno').length },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === f.key ? { background: clientColor + '20', color: clientColor } : { color: '#8890b5' }}>
            {f.icon} {f.label}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold"
              style={filter === f.key ? { background: clientColor + '30' } : { background: '#f1f3f9', color: '#8890b5' }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── FEED AGRUPADO POR MÊS ─────────────────── */}
      {grouped.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.07)' }}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm font-bold text-text">Nenhuma atividade registrada</p>
          <p className="text-xs text-muted mt-1">Adicione tarefas e marcos para visualizar aqui</p>
        </div>
      ) : grouped.map(([key, { label, events }]) => (
        <div key={key}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: clientColor }} />
            <p className="text-[11px] font-extrabold text-muted uppercase tracking-wider capitalize">{label}</p>
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted font-semibold">
              {events.length} {events.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: clientColor + '35' }}>
            {events.map(ev => (
              ev.level === 'marco'
                ? <AchievementCard key={ev.id} ev={ev} />
                : <TaskCard key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function NewMeetingModal({ clientId, onClose, onSave }) {
  const { collaborators } = useData()
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    title: '', date: today, time: '10:00', duration: 60, pauta: '',
    attendees: [],
  })

  const collabList = collaborators

  function toggleAttendee(id) {
    setForm(f => ({
      ...f,
      attendees: f.attendees.includes(id) ? f.attendees.filter(a => a !== id) : [...f.attendees, id],
    }))
  }

  function handleSave() {
    if (!form.title.trim()) return
    const meeting = {
      id: 'custom_' + Date.now(),
      clientId,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      duration: parseInt(form.duration) || 60,
      attendees: form.attendees,
      custom: true,
    }
    onSave(meeting, form.pauta)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.7)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid #edf0f7' }}>
          <h2 className="text-base font-extrabold text-text">Nova Reunião</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors"><Plus size={15} className="rotate-45" /></button>
        </div>

        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Título</label>
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Reunião mensal de performance"
              autoFocus
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
              style={{ background: '#f8f9fc' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Data</label>
              <input
                type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Horário</label>
              <input
                type="time" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Duração (min)</label>
              <input
                type="number" min={15} max={240} value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Participantes</label>
            <div className="flex flex-wrap gap-2">
              {collabList.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleAttendee(c.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all"
                  style={form.attendees.includes(c.id)
                    ? { background: c.color + '18', borderColor: c.color + '60', color: c.color }
                    : { background: '#f8f9fc', borderColor: '#e2e5f0', color: '#8890b5' }}
                >
                  <UserAvatar user={c} size={16} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Pauta (opcional)</label>
            <textarea
              value={form.pauta} onChange={e => setForm(f => ({ ...f, pauta: e.target.value }))}
              rows={3} placeholder="Tópicos da reunião, objetivos, pontos de discussão…"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text resize-none outline-none focus:border-accent/60 transition-colors"
              style={{ background: '#f8f9fc' }}
            />
          </div>
        </div>

        <div className="flex gap-3 px-7 py-5" style={{ borderTop: '1px solid #edf0f7' }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white disabled:opacity-50 transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}
          >
            Criar Reunião
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function MeetingCard({ m, pautas, expanded, editingId, draft, setDraft, setExpanded, startEdit, savePauta, onDelete, collabMap }) {
  const attendees = (m.attendees || []).map(a => collabMap[a]).filter(Boolean)
  const isOpen = expanded === m.id
  const pauta = pautas[m.id]

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: m.custom ? 'rgba(110,218,44,0.1)' : '#8890b518' }}>
          {m.custom ? '🗓️' : '📅'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text">{m.title}</p>
            {m.custom && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(110,218,44,0.1)', color: '#6eda2c' }}>Nova</span>}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · {m.time} · {m.duration}min
          </p>
          {pauta && !isOpen && (
            <p className="text-[11px] text-muted mt-1 line-clamp-1 italic">"{pauta.slice(0, 80)}{pauta.length > 80 ? '…' : ''}"</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex -space-x-1.5">
            {attendees.map(a => (
              <UserAvatar key={a.id} user={a} size={24} style={{ border: '2px solid white' }} />
            ))}
          </div>
          {m.custom && onDelete && (
            <button onClick={() => onDelete(m.id)} className="text-danger/40 hover:text-danger transition-colors ml-1">
              <Plus size={13} className="rotate-45" />
            </button>
          )}
          <button onClick={() => setExpanded(isOpen ? null : m.id)} className="text-muted hover:text-text transition-colors ml-1">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5" style={{ borderTop: '1px solid #edf0f7' }}>
              <div className="flex items-center justify-between mb-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted">
                  <FileText size={12} /> Pauta / Resumo
                </div>
                {editingId !== m.id && (
                  <button onClick={() => startEdit(m.id)} className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">
                    {pauta ? 'Editar' : '+ Adicionar pauta'}
                  </button>
                )}
              </div>
              {editingId === m.id ? (
                <div>
                  <textarea
                    value={draft} onChange={e => setDraft(e.target.value)}
                    rows={5} placeholder="Escreva a pauta, tópicos abordados, decisões e próximos passos…" autoFocus
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text resize-none outline-none focus:border-accent/60 transition-colors"
                    style={{ background: '#f8f9fc' }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => startEdit(null)} className="px-3 py-1.5 text-xs font-bold text-muted border border-border rounded-lg hover:bg-surface transition-colors">Cancelar</button>
                    <button onClick={() => savePauta(m.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg" style={{ background: '#6eda2c' }}>
                      <Save size={12} /> Salvar
                    </button>
                  </div>
                </div>
              ) : pauta ? (
                <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{pauta}</p>
              ) : (
                <p className="text-xs text-muted italic">Nenhuma pauta registrada. Clique em "+ Adicionar pauta".</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MeetingsPanel({ clientMeetings, clientId, collabMap }) {
  const [pautas,      setPautas]      = useState(loadPautas)
  const [customMtgs,  setCustomMtgs]  = useState(() => loadCustomMeetings().filter(m => m.clientId === clientId))
  const [expanded,    setExpanded]    = useState(null)
  const [editingId,   setEditingId]   = useState(null)
  const [draft,       setDraft]       = useState('')
  const [showModal,   setShowModal]   = useState(false)

  const allMeetings = [...clientMeetings, ...customMtgs]
    .sort((a, b) => a.date.localeCompare(b.date))

  function startEdit(id) {
    if (id === null) { setEditingId(null); return }
    setEditingId(id)
    setDraft(pautas[id] || '')
    setExpanded(id)
  }

  function savePauta(id) {
    const updated = { ...pautas, [id]: draft }
    setPautas(updated)
    savePautas(updated)
    setEditingId(null)
  }

  function handleNewMeeting(meeting, pauta) {
    const allCustom = [...loadCustomMeetings(), meeting]
    saveCustomMeetings(allCustom)
    setCustomMtgs(prev => [...prev, meeting])
    if (pauta?.trim()) {
      const updated = { ...pautas, [meeting.id]: pauta }
      setPautas(updated)
      savePautas(updated)
    }
    setShowModal(false)
  }

  function handleDelete(id) {
    const allCustom = loadCustomMeetings().filter(m => m.id !== id)
    saveCustomMeetings(allCustom)
    setCustomMtgs(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-extrabold text-text">{allMeetings.length} reuniões</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: '#6eda2c', boxShadow: '0 4px 12px rgba(110,218,44,0.3)' }}
        >
          <Plus size={13} /> Nova Reunião
        </button>
      </div>

      <div className="space-y-3">
        {allMeetings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <span className="text-4xl block mb-3">📅</span>
            <p className="text-sm font-bold text-text mb-1">Nenhuma reunião agendada</p>
            <p className="text-xs text-muted mb-4">Clique em "Nova Reunião" para agendar.</p>
          </div>
        )}
        {allMeetings.map(m => (
          <MeetingCard
            key={m.id} m={m} pautas={pautas}
            expanded={expanded} editingId={editingId} draft={draft}
            setDraft={setDraft} setExpanded={setExpanded}
            startEdit={startEdit} savePauta={savePauta}
            onDelete={m.custom ? handleDelete : null}
            collabMap={collabMap}
          />
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <NewMeetingModal
            clientId={clientId}
            onClose={() => setShowModal(false)}
            onSave={handleNewMeeting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function WorkspaceDetail({ clientUser, onLogout }) {
  const { erpClients: dbClients, tasks: dbTasks, collaborators: dbCollaborators, meetings, milestones, addTask, addMilestone, updateTask } = useData()
  const erpClients    = dbClients.length       ? dbClients      : mockClients
  const allTasks      = dbTasks.length         ? dbTasks        : mockTasks
  const collaborators = dbCollaborators.length ? dbCollaborators : mockCollaborators
  const collabMap     = Object.fromEntries(collaborators.map(c => [c.id, c]))
  const { id: paramId } = useParams()
  const isClientMode  = !!clientUser
  const id            = isClientMode ? clientUser.clientId : paramId
  const navigate      = useNavigate()
  const [tab, setTab] = useState('Visão Geral')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showTarefaModal, setShowTarefaModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [clientTasks, setClientTasks] = useState([])

  const client    = erpClients.find(c => c.id === id)
  const isAgencia  = !isClientMode && (client?.type === 'agencia' || client?.niche === 'Agência' || id === 'agencia')
  const isKamy     = !isClientMode && id === 'kamy'
  const isDestrava = !isClientMode && DESTRAVA_IDS.includes(id)
  const TABS       = (isClientMode && id === 'intime')           ? TABS_CLIENT_INTIME
    : (isClientMode && id === 'casa_construtor')                ? TABS_CLIENT_CASA_CONSTRUTOR
    : isClientMode                                              ? TABS_BASE
    : id === 'intime'                                           ? TABS_INTIME
    : id === 'casa_construtor'                                  ? TABS_CASA_CONSTRUTOR
    : isAgencia        ? TABS_AGENCIA
    : isKamy           ? TABS_KAMY
    : isDestrava       ? TABS_DESTRAVA
    : TABS_BASE

  useEffect(() => {
    const tasks = allTasks.filter(t => t.clientId === id)
    setClientTasks(isClientMode ? tasks.filter(t => t.level !== 'interno') : tasks)
  }, [allTasks, id, isClientMode])

  if (!client) return (
    <div className="p-8 text-muted">{erpClients.length === 0 ? 'Carregando...' : 'Cliente não encontrado.'}</div>
  )

  const clientMeetings = meetings.filter(m => m.clientId === id)
  const manager = collabMap[client.manager]
  const done = clientTasks.filter(t => t.status === 'done').length
  const pct = clientTasks.length > 0 ? Math.round((done / clientTasks.length) * 100) : 0

  const filteredTasks = typeFilter === 'all' ? clientTasks : clientTasks.filter(t => t.type === typeFilter)

  async function handleSaveTarefa(taskData) {
    if (taskData.id) {
      await updateTask(taskData.id, {
        title:       taskData.title,
        type:        taskData.type,
        assignee:    taskData.assignee,
        dueDate:     taskData.dueDate,
        priority:    taskData.priority,
        description: taskData.description,
      })
    } else {
      await addTask({ ...taskData })
      if (taskData.level === 'marco' && taskData.dueDate) {
        await addMilestone({
          clientId:    id,
          date:        taskData.dueDate,
          title:       taskData.title,
          type:        'entrega',
          description: taskData.description || '',
        })
      }
    }
    setShowTarefaModal(false)
    setEditingTask(null)
  }

  async function handleStatusChange(taskId, newStatus) {
    await updateTask(taskId, { status: newStatus })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 lg:px-8 py-4 lg:py-5 bg-white border-b border-border flex-shrink-0"
        style={{ boxShadow: '0 1px 0 #e0e3f0' }}>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {isClientMode ? (
            <div className="flex items-center flex-shrink-0">
              <Logo size="sm" />
            </div>
          ) : (
            <button
              onClick={() => navigate('/workspaces')}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-text-2 font-medium transition-colors"
            >
              <ArrowLeft size={14} /> Workspaces
            </button>
          )}
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}99)` }}
            >
              {client.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-text">{client.name}</h1>
              <p className="text-[11px] text-muted">{client.niche} · desde {new Date(client.since + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-extrabold" style={{ color: client.color }}>{pct}%</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Concluído</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-text">{clientTasks.length}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Tarefas</p>
            </div>
            {!isClientMode && (
              <div className="text-center">
                <p className="text-lg font-extrabold text-text">R$ {(client.monthlyValue / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Mensalidade</p>
              </div>
            )}
            {!isClientMode && (
              <div className="flex items-center gap-2 bg-surface-2 rounded-xl px-3 py-2">
                <UserAvatar user={manager} size={20} />
                <span className="text-xs font-semibold text-text-2">{manager?.name}</span>
              </div>
            )}
            {isClientMode && (
              <button onClick={onLogout}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors font-medium">
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2 hover:bg-surface-2'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {tab === 'Visão Geral' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Progresso por tipo */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-sm font-extrabold text-text mb-5">Entregáveis por tipo</p>
                  <div className="space-y-4">
                    {Object.entries(taskTypes).map(([key, cfg]) => {
                      const typeTasks = clientTasks.filter(t => t.type === key)
                      if (typeTasks.length === 0) return null
                      const typeDone = typeTasks.filter(t => t.status === 'done').length
                      const typePct = Math.round((typeDone / typeTasks.length) * 100)
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{cfg.icon}</span>
                              <span className="text-sm font-semibold text-text-2">{cfg.label}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-muted">{typeDone}/{typeTasks.length}</span>
                              <span className="font-extrabold" style={{ color: cfg.color }}>{typePct}%</span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: cfg.color + '18' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: cfg.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${typePct}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Próximas reuniões */}
                <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-sm font-extrabold text-text mb-4">Próximas reuniões</p>
                  {clientMeetings.length > 0 ? (
                    <div className="space-y-3">
                      {clientMeetings.map(m => (
                        <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: '#8890b518' }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8890b528' }}>
                            <Calendar size={14} className="text-muted" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-text truncate">{m.title}</p>
                            <p className="text-[10px] text-muted mt-0.5">
                              {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às {m.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted text-center py-6">Nenhuma reunião agendada.</p>
                  )}
                  <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-accent transition-colors py-2 rounded-xl hover:bg-accent/5 font-semibold">
                    <Plus size={12} /> Agendar reunião
                  </button>
                </div>

                {/* Tarefas urgentes */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-sm font-extrabold text-text mb-4">Tarefas em destaque</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {clientTasks.filter(t => t.priority === 'high' && t.status !== 'done').slice(0, 3).map(task => {
                      const type = taskTypes[task.type]
                      const assignee = collabMap[task.assignee]
                      return (
                        <div key={task.id} className="rounded-xl p-3.5 border" style={{ borderColor: type.color + '30', backgroundColor: type.color + '08' }}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm">{type.icon}</span>
                            <span className="text-[10px] font-bold" style={{ color: type.color }}>{type.label}</span>
                            <span className="ml-auto text-[9px] text-danger font-bold">Alta prioridade</span>
                          </div>
                          <p className="text-sm font-bold text-text mb-2">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <UserAvatar user={assignee} size={16} />
                              <span className="text-[10px] text-muted">{assignee?.name}</span>
                            </div>
                            <span className="text-[10px] text-muted">
                              {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'Tarefas' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              {/* Filter by type */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <button onClick={() => setTypeFilter('all')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${typeFilter === 'all' ? 'bg-text text-white' : 'bg-white text-muted hover:text-text-2 border border-border'}`}
                >
                  Todos
                </button>
                {Object.entries(taskTypes).map(([key, cfg]) => (
                  <button key={key} onClick={() => setTypeFilter(key)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all border"
                    style={{
                      backgroundColor: typeFilter === key ? cfg.color : 'white',
                      color: typeFilter === key ? '#0f1117' : cfg.color,
                      borderColor: typeFilter === key ? cfg.color : cfg.color + '40',
                    }}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
                {!isClientMode && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-border text-muted hover:text-text-2 hover:border-accent/40 transition-all"
                    >
                      <Zap size={12} /> Modelos
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setShowTarefaModal(true); setEditingTask(null) }}
                      className="flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-xl text-[#0f1117]"
                      style={{ background: client.color }}
                    >
                      <Plus size={13} /> Nova Tarefa
                    </motion.button>
                  </div>
                )}
              </div>

              {!isClientMode && (
                <p className="text-[10px] text-muted mb-3 flex items-center gap-1.5">
                  <span className="opacity-60">✦</span> Arraste os cards entre colunas · Clique para editar
                </p>
              )}

              {/* Kanban */}
              <div className="flex gap-4 pb-6 overflow-x-auto">
                {COLUMNS.map(status => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={filteredTasks.filter(t => t.status === status)}
                    clientColor={client.color}
                    collabMap={collabMap}
                    onStatusChange={isClientMode ? null : handleStatusChange}
                    onEdit={isClientMode ? null : (task => setEditingTask(task))}
                    onNewTask={() => { setShowTarefaModal(true); setEditingTask(null) }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'Linha do Tempo' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <ClientTimeline clientId={id} clientColor={client.color} clientTasks={clientTasks} />
            </motion.div>
          )}

          {tab === 'Reuniões' && (
            <motion.div key="meetings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8"
            >
              <MeetingsPanel clientMeetings={clientMeetings} clientId={id} collabMap={collabMap} />
            </motion.div>
          )}

          {tab === 'Tráfego' && (
            <motion.div key="traffic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <MetricsPanel clientId={id} clientColor={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && id === 'casa_construtor' && (
            <motion.div key="casa-construtor-resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <CasaConstrutorResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && id === 'intime' && (
            <motion.div key="resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <IntimeResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && isAgencia && (
            <motion.div key="trafegon-resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <TrafegonResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🏆 Resultados' && isKamy && (
            <motion.div key="kamy-resultados" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <KamyResultados color={client.color} />
            </motion.div>
          )}

          {tab === '🧠 Estratégia' && isKamy && (
            <motion.div key="kamy-estrategia" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <KamyEstrategia color={client.color} />
            </motion.div>
          )}

          {tab === '🧠 Estratégia' && isAgencia && (
            <motion.div key="trafegon-estrategia" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 lg:p-8"
            >
              <TrafegonEstrategia color={client.color} />
            </motion.div>
          )}

          {tab === '🔓 Destrava' && isAgencia && (
            <motion.div key="destrava-digital" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DestravaDigital />
            </motion.div>
          )}

          {tab === '🔓 Destrava' && isDestrava && (
            <motion.div key="destrava-board" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DestravaBoard clientId={id} clientColor={client.color} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(showTarefaModal || editingTask) && (
          <TarefaModal
            clientId={editingTask ? undefined : id}
            clientName={editingTask ? undefined : client.name}
            task={editingTask}
            onSave={handleSaveTarefa}
            onClose={() => { setShowTarefaModal(false); setEditingTask(null) }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTemplates && (
          <TaskTemplatesDrawer
            clientId={id}
            clientName={client.name}
            assignee={collaborators[0]?.id}
            onApply={async (taskData) => { await handleSaveTarefa(taskData); setShowTemplates(false) }}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}