import { motion } from 'framer-motion'
import {
  GraduationCap, Users2, Layers, Megaphone, Crown,
  Target, Heart, DollarSign, Repeat,
} from 'lucide-react'

/* ── Conteúdo validado com a equipe (2026-07-29) ────────────────
   Espelhado de _agencia/servicos.md e conducao-equipe.
   Estático e read-only — módulo de referência do time.
*/

const SQUAD = [
  { nome: 'Juliano',   funcao: 'Tráfego (Meta + Google)',                              fase: 'Aquisição' },
  { nome: 'Ana',       funcao: 'Auxiliar de tráfego + vídeos',                         fase: 'Aquisição / Envolvimento' },
  { nome: 'Deivisson', funcao: 'Landing pages',                                        fase: 'Aquisição' },
  { nome: 'Érica',     funcao: 'Artes',                                                fase: 'Envolvimento' },
  { nome: 'Bea',       funcao: 'Vídeos + comunicação nos grupos + tarefas do projeto', fase: 'Envolvimento' },
  { nome: 'Elieser',   funcao: 'Dados e relatórios',                                   fase: 'Retenção/Expansão' },
]

const METODO = [
  { icon: Target,     cor: '#2563eb', nome: 'Aquisição',         desc: 'Desconhecido vira lead — como me encontram.' },
  { icon: Heart,      cor: '#db2777', nome: 'Envolvimento',      desc: 'O lead conhece, confia e lembra da marca.' },
  { icon: DollarSign, cor: '#3f9c14', nome: 'Monetização',       desc: 'Lead vira cliente pagante.' },
  { icon: Repeat,     cor: '#9333ea', nome: 'Retenção/Expansão', desc: 'Cliente fica, volta e compra mais.' },
]

const MOTIVOS = [
  ['Sem handoff', 'O trabalho não atravessa fronteiras — não trava esperando outro setor.'],
  ['Contexto compartilhado', 'Todo mundo conhece o mesmo cliente. A decisão sai rápido.'],
  ['Tamanho certo', 'Grande o bastante pra ser autossuficiente, pequeno pra caber numa conversa.'],
  ['Dono do resultado', 'O squad responde pelo resultado do cliente, não por "quantas artes saíram".'],
]

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-border p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-accent/10">
        <Icon size={16} className="text-accent" />
      </div>
      <h2 className="text-lg font-bold text-text">{children}</h2>
    </div>
  )
}

/* pílula de rótulo colorido (SQUAD / COMUNICAÇÃO / LIDERANÇA) */
function Tag({ icon: Icon, cor, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-lg"
      style={{ background: `${cor}14`, color: cor }}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  )
}

export default function Treinamentos() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent/10">
            <GraduationCap size={22} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text">Treinamentos</h1>
            <p className="text-sm text-muted">Como nos organizamos e a lógica por trás do que entregamos.</p>
          </div>
        </div>
      </motion.div>

      {/* 1 — O que é um squad */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <SectionTitle icon={Users2}>O que é um squad</SectionTitle>
        <Card>
          <p className="text-text-2 leading-relaxed mb-4">
            <strong className="text-text">Squad</strong> é um time pequeno e multifuncional que entrega
            o cliente do começo ao fim — juntos, sem passar a bola de setor em setor.
            A maioria das agências trabalha em <strong className="text-text">silos</strong> (um time de
            tráfego, um de social, um de criação) e o cliente fica sendo jogado de um pro outro, sem dono.
            A gente junta todas as funções numa <strong className="text-text">célula só</strong>, e ela
            responde pela carteira inteira.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {MOTIVOS.map(([t, d]) => (
              <div key={t} className="rounded-xl p-3.5 bg-surface-2 border border-border">
                <p className="text-sm font-bold text-text mb-0.5">{t}</p>
                <p className="text-xs text-muted leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.section>

      {/* 2 — Nossas funções */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SectionTitle icon={Layers}>Nossas funções</SectionTitle>

        {/* Squad Operacional */}
        <Card className="mb-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Tag cor="#2563eb">SQUAD OPERACIONAL</Tag>
            <span className="text-xs text-muted">quem entrega o cliente ponta a ponta</span>
          </div>
          <div className="space-y-1.5">
            {SQUAD.map(p => (
              <div key={p.nome} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-surface-2 border border-border">
                <span className="text-sm font-bold text-text w-24 flex-shrink-0">{p.nome}</span>
                <span className="text-sm text-text-2 flex-1">{p.funcao}</span>
                <span className="text-[10px] font-bold text-muted hidden sm:block">{p.fase}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Comunicação especializada */}
          <Card>
            <div className="mb-3"><Tag icon={Megaphone} cor="#ea8a29">COMUNICAÇÃO ESPECIALIZADA</Tag></div>
            <p className="text-sm font-bold text-text">Mari — comunicação com o público jurídico</p>
            <p className="text-xs text-muted leading-relaxed mt-1.5">
              Fica <strong className="text-text-2">fora</strong> do squad de propósito: construir audiência
              jurídica é um trabalho editorial de ritmo próprio, que seria atropelado pela urgência do
              operacional se ficasse dentro.
            </p>
          </Card>

          {/* Liderança */}
          <Card>
            <div className="mb-3"><Tag icon={Crown} cor="#be29ec">LIDERANÇA</Tag></div>
            <p className="text-sm font-bold text-text">Gabriel <span className="font-medium text-text-2">— reuniões, estratégia, condução do squad</span></p>
            <p className="text-sm font-bold text-text mt-2">Carol <span className="font-medium text-text-2">— administração / sociedade</span></p>
          </Card>
        </div>
      </motion.section>

      {/* 3 — O método */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <SectionTitle icon={Target}>O método — a lógica de tudo</SectionTitle>
        <Card>
          <p className="text-text-2 leading-relaxed mb-4">
            Todo cliente passa por 4 fases. Cada função do time serve uma delas.
            <strong className="text-text"> Não se pula fase:</strong> tráfego sem envolvimento = lead frio;
            venda sem retenção = balde furado.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {METODO.map((f, i) => (
              <div key={f.nome} className="rounded-xl p-4 bg-surface-2 border border-border" style={{ borderTop: `3px solid ${f.cor}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${f.cor}15` }}>
                    <f.icon size={16} style={{ color: f.cor }} />
                  </div>
                  <span className="text-xs font-extrabold text-muted">{i + 1}</span>
                </div>
                <p className="text-sm font-bold text-text">{f.nome}</p>
                <p className="text-xs text-muted leading-relaxed mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.section>
    </div>
  )
}
