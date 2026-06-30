import { motion } from 'framer-motion'
import { MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react'

const ACCENT = '#fde047'

const STEPS = [
  { n: 1,  icon: '💬', title: 'Lead chega pelo WhatsApp',                tool: 'WhatsApp' },
  { n: 2,  icon: '📋', title: 'Colocar na tabela de leads',              tool: 'Tabela de leads' },
  { n: 3,  icon: '📄', title: 'Pedir informações: fatura + localização', tool: 'WhatsApp', decision: 'A' },
  { n: 4,  icon: '📇', title: 'Salvar contato e colocar no Trello',      tool: 'Trello' },
  { n: 5,  icon: '🔻', title: 'Cadastrar no funil de vendas',            tool: 'Funil de vendas' },
  { n: 6,  icon: '📁', title: 'Criar pasta de proposta',                 tool: 'Pasta' },
  { n: 7,  icon: '📝', title: 'Salvar informações na pasta + anotações em bloco de texto', tool: 'Pasta + Bloco de texto' },
  { n: 8,  icon: '📐', title: 'Fazer dimensionamento',                   tool: 'Técnico' },
  { n: 9,  icon: '💰', title: 'Montar proposta (ou pedir preço no Trello)', tool: 'Trello' },
  { n: 10, icon: '📨', title: 'Enviar proposta e tentar marcar visita',  tool: 'WhatsApp', decision: 'B' },
  { n: 11, icon: '🔄', title: 'Atualizar funil de vendas e tabela de leads', tool: 'Funil + Tabela' },
  { n: 12, icon: '🗺️', title: 'Organizar rota de visitas',               tool: 'Rota de visitas' },
]

const DECISIONS = {
  A: { label: 'Cliente NÃO envia fatura/localização', action: 'Ligar e decidir: é interessado (segue) ou "sepultar" (descarta).' },
  B: { label: 'Cliente rejeita a visita',             action: 'Ressaltar a importância da visita + ligar. Anotar no funil (não descartar de cara).' },
}

const ROTA_CHECKLIST = [
  'Cidade e data no título',
  'Nome do cliente e horário agendado',
  'Anotações gerais sobre o cliente',
  'Localização',
  'Coordenadas',
  'Telefone',
  'Verificar rota no Maps',
]

export default function LenergyAtendimento({ color = ACCENT }) {
  return (
    <div className="p-4 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Lenergy · Energia Solar</p>
        <h2 className="text-2xl font-extrabold text-text mb-1">Fluxo de Atendimento de Leads</h2>
        <p className="text-sm text-muted">Da chegada do lead até a visita na obra · Atendimento: <b>Israely</b> · Visita de vendas: <b>Elen</b> (às vezes Nathan)</p>
      </div>

      {/* Regra de ouro */}
      <div className="rounded-2xl p-4 mb-6 flex items-start gap-3"
        style={{ background: `${color}14`, border: `1px solid ${color}40` }}>
        <span className="text-xl flex-shrink-0">⭐</span>
        <p className="text-sm text-text leading-relaxed">
          <b>Regra de ouro:</b> toda conversa termina com um <b>próximo passo combinado</b> (data, retorno ou visita). Nunca deixar "no ar".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Fluxo ── */}
        <div className="space-y-2.5">
          {STEPS.map((s, i) => (
            <div key={s.n}>
              <motion.div
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-3.5 flex items-center gap-3.5"
                style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)', borderLeft: `3px solid ${color}` }}>
                <div className="w-9 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-extrabold uppercase" style={{ color }}>Etapa</span>
                  <span className="text-base font-extrabold leading-none text-text">{String(s.n).padStart(2, '0')}</span>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${color}1a` }}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text leading-snug">{s.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{s.tool}</p>
                </div>
              </motion.div>

              {/* Branch de decisão */}
              {s.decision && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 + 0.1 }}
                  className="ml-12 mt-2 mb-1 rounded-xl p-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text">⚠️ {DECISIONS[s.decision].label}</p>
                    <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{DECISIONS[s.decision].action}</p>
                  </div>
                </motion.div>
              )}

              {/* Seta */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <span className="text-muted text-xs">↓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-4">
          {/* Checklist rota de visitas */}
          <div className="rounded-2xl p-4" style={{ background: `${color}0a`, border: `1px solid ${color}30` }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} style={{ color }} />
              <p className="text-sm font-extrabold text-text">Checklist da Rota de Visitas</p>
            </div>
            <div className="space-y-1.5">
              {ROTA_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'white' }}>
                  <CheckCircle2 size={13} style={{ color }} className="flex-shrink-0" />
                  <p className="text-[11px] font-medium text-text">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quem faz o quê */}
          <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>
            <p className="text-sm font-extrabold text-text mb-3">Quem faz o quê</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">👩‍💼</span>
                <p className="text-[12px] text-text"><b>Israely</b> — todo o atendimento (etapas 1 a 12)</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">🚗</span>
                <p className="text-[12px] text-text"><b>Elen</b> — visita de vendas na obra <span className="text-muted">(às vezes Nathan)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
