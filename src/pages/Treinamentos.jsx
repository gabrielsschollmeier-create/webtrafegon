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
  { icon: Target,     cor: '#60a5fa', nome: 'Aquisição',          desc: 'Desconhecido vira lead — como me encontram.' },
  { icon: Heart,      cor: '#f472b6', nome: 'Envolvimento',       desc: 'O lead conhece, confia e lembra da marca.' },
  { icon: DollarSign, cor: '#6eda2c', nome: 'Monetização',        desc: 'Lead vira cliente pagante.' },
  { icon: Repeat,     cor: '#c084fc', nome: 'Retenção/Expansão',  desc: 'Cliente fica, volta e compra mais.' },
]

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ background: '#12141e', border: '1px solid rgba(255,255,255,0.07)' }}>
      {children}
    </div>
  )
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(110,218,44,0.12)' }}>
        <Icon size={16} style={{ color: '#6eda2c' }} />
      </div>
      <h2 className="text-lg font-bold text-white/90">{children}</h2>
    </div>
  )
}

export default function Treinamentos() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(110,218,44,0.12)' }}>
            <GraduationCap size={20} style={{ color: '#6eda2c' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Treinamentos</h1>
            <p className="text-sm text-white/45">Como nos organizamos e a lógica por trás do que entregamos.</p>
          </div>
        </div>
      </motion.div>

      {/* 1 — O que é um squad */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <SectionTitle icon={Users2}>O que é um squad</SectionTitle>
        <Card>
          <p className="text-white/75 leading-relaxed mb-4">
            <strong className="text-white">Squad</strong> é um time pequeno e multifuncional que entrega
            o cliente do começo ao fim — juntos, sem passar a bola de setor em setor.
            A maioria das agências trabalha em <strong className="text-white">silos</strong> (um time de
            tráfego, um de social, um de criação) e o cliente fica sendo jogado de um pro outro, sem dono.
            A gente junta todas as funções numa <strong className="text-white">célula só</strong>, e ela
            responde pela carteira inteira.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['Sem handoff', 'O trabalho não atravessa fronteiras — não trava esperando outro setor.'],
              ['Contexto compartilhado', 'Todo mundo conhece o mesmo cliente. A decisão sai rápido.'],
              ['Tamanho certo', 'Grande o bastante pra ser autossuficiente, pequeno pra caber numa conversa.'],
              ['Dono do resultado', 'O squad responde pelo resultado do cliente, não por "quantas artes saíram".'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-sm font-bold text-accent mb-0.5" style={{ color: '#6eda2c' }}>{t}</p>
                <p className="text-xs text-white/55 leading-relaxed">{d}</p>
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
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-extrabold tracking-wide px-2 py-1 rounded-lg"
              style={{ background: 'rgba(96,165,250,0.14)', color: '#60a5fa' }}>SQUAD OPERACIONAL</span>
            <span className="text-xs text-white/40">quem entrega o cliente ponta a ponta</span>
          </div>
          <div className="space-y-1.5">
            {SQUAD.map(p => (
              <div key={p.nome} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-sm font-bold text-white/90 w-24 flex-shrink-0">{p.nome}</span>
                <span className="text-sm text-white/60 flex-1">{p.funcao}</span>
                <span className="text-[10px] font-bold text-white/40 hidden sm:block">{p.fase}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Comunicação especializada */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={15} style={{ color: '#f59e0b' }} />
              <span className="text-xs font-extrabold tracking-wide" style={{ color: '#f59e0b' }}>COMUNICAÇÃO ESPECIALIZADA</span>
            </div>
            <p className="text-sm font-bold text-white/90">Mari — comunicação com o público jurídico</p>
            <p className="text-xs text-white/55 leading-relaxed mt-1.5">
              Fica <strong className="text-white/75">fora</strong> do squad de propósito: construir audiência
              jurídica é um trabalho editorial de ritmo próprio, que seria atropelado pela urgência do
              operacional se ficasse dentro.
            </p>
          </Card>

          {/* Liderança */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Crown size={15} style={{ color: '#c084fc' }} />
              <span className="text-xs font-extrabold tracking-wide" style={{ color: '#c084fc' }}>LIDERANÇA</span>
            </div>
            <p className="text-sm font-bold text-white/90">Gabriel — reuniões, estratégia, condução do squad</p>
            <p className="text-sm font-bold text-white/90 mt-2">Carol — administração / sociedade</p>
          </Card>
        </div>
      </motion.section>

      {/* 3 — O método (referência das fases) */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <SectionTitle icon={Target}>O método — a lógica de tudo</SectionTitle>
        <Card>
          <p className="text-white/70 leading-relaxed mb-4">
            Todo cliente passa por 4 fases. Cada função do time serve uma delas.
            <strong className="text-white"> Não se pula fase:</strong> tráfego sem envolvimento = lead frio;
            venda sem retenção = balde furado.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {METODO.map((f, i) => (
              <div key={f.nome} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.03)', borderTop: `2px solid ${f.cor}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <f.icon size={15} style={{ color: f.cor }} />
                  <span className="text-[10px] font-bold text-white/30">{i + 1}</span>
                </div>
                <p className="text-sm font-bold text-white/90">{f.nome}</p>
                <p className="text-xs text-white/50 leading-relaxed mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.section>
    </div>
  )
}
