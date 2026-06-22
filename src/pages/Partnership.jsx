import { motion } from 'framer-motion'
import {
  TrendingUp, Users, Shield, Zap, DollarSign, Calendar,
  CheckCircle2, Lock, Unlock, Crown, Briefcase, Target,
  AlertCircle, ChevronRight, Building2, HandshakeIcon
} from 'lucide-react'

const GREEN  = '#6eda2c'
const DARK   = '#12141e'
const DARKER = '#0d0f18'
const CARD   = '#1a1d2e'

function fade(delay = 0) {
  return { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.4 } }
}

function StatCard({ icon: Icon, label, value, sub, color = GREEN, delay = 0 }) {
  return (
    <motion.div {...fade(delay)}
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ background: CARD, border: `1px solid rgba(255,255,255,0.07)` }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-black text-white leading-tight">{value}</p>
      {sub && <p className="text-xs text-white/35 font-medium">{sub}</p>}
    </motion.div>
  )
}

const TRANCHES = [
  {
    ano: 'Ano 1',
    label: 'Desconto Pró-labore',
    meses: 'Meses 1–12',
    valor: 'R$ 36.000',
    detalhe: 'R$ 3.000/mês em desconto',
    cotas: '3,33%',
    cor: '#6eda2c',
    icon: Calendar,
    milestones: ['6 SOPs documentados', 'Sistema de gestão de projetos', 'Relatórios padronizados', 'Redução 70% dependência do CEO'],
  },
  {
    ano: 'Ano 2',
    label: 'Desconto Pró-labore',
    meses: 'Meses 13–24',
    valor: 'R$ 36.000',
    detalhe: 'R$ 3.000/mês em desconto',
    cotas: '3,33%',
    cor: '#3b82f6',
    icon: Users,
    milestones: ['Gestão de 3+ pessoas', '8 reuniões de cliente sem CEO', '3 onboardings autônomo', 'Relatório COO mensal até dia 5'],
  },
  {
    ano: 'Ano 3',
    label: 'Pagamento em dinheiro',
    meses: 'Até final do mês 36',
    valor: 'R$ 28.000',
    detalhe: 'Transferência bancária',
    cotas: '3,34%',
    cor: '#f59e0b',
    icon: DollarSign,
    milestones: ['Consolidação total do cargo de COO', 'Pagamento integral dos R$ 28.000', 'Milestones de liderança avançada', 'Avaliação final de integralização'],
  },
]

const DECISOES = [
  {
    nivel: 'Operacional',
    icon: Zap,
    cor: '#6eda2c',
    descricao: 'COO decide sozinho',
    exemplos: ['Equipe e rotinas internas', 'Processos e entregas', 'Operação com clientes', 'Criação de SOPs'],
    poder: 'coo',
  },
  {
    nivel: 'Tático',
    icon: Target,
    cor: '#3b82f6',
    descricao: 'COO propõe → CEO decide',
    exemplos: ['Contratações', 'Investimentos até R$ 5k', 'Mudanças de escopo', 'Novos fornecedores'],
    poder: 'conjunto',
  },
  {
    nivel: 'Estratégico',
    icon: Crown,
    cor: '#f59e0b',
    descricao: 'CEO decide (COO consultado pós-Ano 3)',
    exemplos: ['Direção da empresa', 'Parcerias e mercados', 'Posicionamento', 'Venda ou fusão'],
    poder: 'ceo',
  },
]

export default function Partnership() {
  const totalPago   = 100000
  const valuation   = 1000000
  const participacao = 10

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8" style={{ background: DARKER }}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <motion.div {...fade(0)} className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30` }}>
            <Building2 size={22} style={{ color: GREEN }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Partnership</h1>
            <p className="text-sm text-white/40 mt-0.5">Arquitetura de sociedade — TráfegOn Agência</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}25` }}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ background: GREEN }} />
            <span className="text-xs font-bold" style={{ color: GREEN }}>Em estruturação</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Building2} label="Valuation" value="R$ 1M"    sub="5× lucro líquido anual" delay={0.05} />
          <StatCard icon={TrendingUp} label="Participação" value="10%"  sub="do capital social" delay={0.1} color="#3b82f6" />
          <StatCard icon={DollarSign} label="Total" value="R$ 100k"     sub="em 36 meses" delay={0.15} color="#f59e0b" />
          <StatCard icon={Calendar}   label="Prazo" value="36 meses"    sub="3 anos · 3 tranches" delay={0.2} color="#a855f7" />
        </div>

        {/* Timeline */}
        <motion.div {...fade(0.25)}>
          <p className="text-[10px] font-extrabold tracking-widest text-white/30 uppercase mb-3">Cronograma de cotas</p>

          {/* Progress bar */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/40">Progressão de equity</span>
              <span className="text-xs font-black text-white">10% ao final do Ano 3</span>
            </div>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-l-full transition-all" style={{ width: '33.33%', background: `${GREEN}cc` }} />
              <div className="h-full transition-all" style={{ width: '33.33%', background: '#3b82f6cc' }} />
              <div className="h-full rounded-r-full transition-all" style={{ width: '33.34%', background: '#f59e0bcc' }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px]" style={{ color: GREEN }}>3,33% — Ano 1</span>
              <span className="text-[10px] text-center" style={{ color: '#3b82f6' }}>3,33% — Ano 2</span>
              <span className="text-[10px] text-right" style={{ color: '#f59e0b' }}>3,34% — Ano 3</span>
            </div>
          </div>

          {/* Tranche cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRANCHES.map((t, i) => (
              <motion.div key={t.ano} {...fade(0.3 + i * 0.08)}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: CARD, border: `1px solid ${t.cor}25` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                      style={{ background: `${t.cor}18` }}>
                      <t.icon size={13} style={{ color: t.cor }} />
                    </div>
                    <span className="text-xs font-black text-white">{t.ano}</span>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full"
                    style={{ color: t.cor, background: `${t.cor}15` }}>{t.cotas}</span>
                </div>

                <div>
                  <p className="text-lg font-black text-white">{t.valor}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{t.detalhe}</p>
                  <p className="text-[10px] font-semibold mt-1" style={{ color: t.cor }}>{t.meses}</p>
                </div>

                <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] font-extrabold tracking-widest text-white/25 uppercase mb-2">Milestones</p>
                  <div className="space-y-1.5">
                    {t.milestones.map(m => (
                      <div key={m} className="flex items-start gap-2">
                        <CheckCircle2 size={10} className="mt-0.5 flex-shrink-0" style={{ color: t.cor }} />
                        <span className="text-[10px] text-white/50 leading-tight">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decision Matrix */}
        <motion.div {...fade(0.5)}>
          <p className="text-[10px] font-extrabold tracking-widest text-white/30 uppercase mb-3">Matriz de decisão</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DECISOES.map((d, i) => (
              <motion.div key={d.nivel} {...fade(0.55 + i * 0.06)}
                className="rounded-2xl p-5"
                style={{ background: CARD, border: `1px solid ${d.cor}25` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${d.cor}18` }}>
                    <d.icon size={15} style={{ color: d.cor }} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{d.nivel}</p>
                    <p className="text-[10px] font-semibold" style={{ color: d.cor }}>{d.descricao}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {d.exemplos.map(e => (
                    <div key={e} className="flex items-center gap-2">
                      <ChevronRight size={10} style={{ color: d.cor }} className="flex-shrink-0" />
                      <span className="text-[11px] text-white/50">{e}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 flex items-center gap-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {d.poder === 'coo' && (
                    <>
                      <Briefcase size={11} style={{ color: d.cor }} />
                      <span className="text-[10px] font-bold" style={{ color: d.cor }}>COO tem autonomia total</span>
                    </>
                  )}
                  {d.poder === 'conjunto' && (
                    <>
                      <Users size={11} style={{ color: d.cor }} />
                      <span className="text-[10px] font-bold" style={{ color: d.cor }}>Proposta + aprovação</span>
                    </>
                  )}
                  {d.poder === 'ceo' && (
                    <>
                      <Crown size={11} style={{ color: d.cor }} />
                      <span className="text-[10px] font-bold" style={{ color: d.cor }}>CEO tem decisão final</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rights Separation */}
        <motion.div {...fade(0.65)}>
          <p className="text-[10px] font-extrabold tracking-widest text-white/30 uppercase mb-3">Direitos: econômicos vs. políticos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Econômicos */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${GREEN}25` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${GREEN}18` }}>
                  <Unlock size={15} style={{ color: GREEN }} />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Direitos Econômicos</p>
                  <p className="text-[10px] font-bold" style={{ color: GREEN }}>Iniciam com cada tranche</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Participação proporcional nos lucros distribuídos', quando: 'Imediato com cada cota' },
                  { label: 'Parte proporcional na venda ou liquidação', quando: 'Imediato com cada cota' },
                  { label: 'Acesso às informações financeiras mensais (DRE)', quando: 'Imediato com cada cota' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${GREEN}20` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/70 leading-tight">{item.label}</p>
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: GREEN }}>{item.quando}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Políticos */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: '1px solid rgba(245,158,11,0.25)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.12)' }}>
                  <Lock size={15} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Direitos Políticos</p>
                  <p className="text-[10px] font-bold" style={{ color: '#f59e0b' }}>Bloqueados até integralização dos 10%</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Decisões estratégicas sobre direção da empresa', liberado: 'Pós-Ano 3' },
                  { label: 'Veto ou bloqueio de qualquer decisão', liberado: 'Pós-Ano 3' },
                  { label: 'Poder de assinar contratos de alto valor', liberado: 'Pós-Ano 3' },
                  { label: 'Participação em parcerias e novos mercados', liberado: 'Pós-Ano 3' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(245,158,11,0.15)' }}>
                      <Lock size={8} style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/70 leading-tight">{item.label}</p>
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: '#f59e0b' }}>{item.liberado}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Protection clause */}
        <motion.div {...fade(0.75)}>
          <div className="rounded-2xl p-5 flex gap-4"
            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            <div>
              <p className="text-xs font-black text-white mb-1">Cláusula de proteção — caducidade automática</p>
              <p className="text-[11px] text-white/45 leading-relaxed">
                O descumprimento de qualquer condição (pagamento, milestones, permanência, NDA) resulta em caducidade automática
                da opção para as tranches ainda não liberadas. Valores já pagos são retidos como indenização.
                Não-concorrência ativa por 24 meses após saída em qualquer hipótese.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div {...fade(0.82)}
          className="text-center pb-4">
          <p className="text-[10px] text-white/20">
            Documento de referência interna · Revisão jurídica necessária antes da assinatura · TráfegOn Agência 2026
          </p>
        </motion.div>

      </div>
    </div>
  )
}
