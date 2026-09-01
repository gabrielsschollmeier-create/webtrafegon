import { motion } from 'framer-motion'
import { Compass, MessageSquare, Megaphone, ShoppingBag, CalendarDays, Users, Target } from 'lucide-react'

const PILARES = [
  { n: '1', titulo: 'Confiança na decisão', itens: ['Procedência garantida', 'Equipe preparada', 'Transparência no serviço'] },
  { n: '2', titulo: 'Presença 24h',         itens: ['Disponibilidade real', 'Sempre quando o cliente precisa', 'Ponto de apoio do motorista'] },
  { n: '3', titulo: 'Simplicidade e agilidade', itens: ['Processo rápido', 'Soluciona a maioria dos hábitos diários', 'Resolve tudo em um lugar'] },
]

const NARRATIVAS = [
  { n: '1', titulo: 'Decisão',   chave: 'A decisão certa no abastecimento evita problema depois.', apoio: ['Escolher combustível com confiança', 'Pensar no longo prazo', 'Evitar prejuízo no veículo'] },
  { n: '2', titulo: 'Segurança', chave: 'Segurança não se improvisa. Se escolhe.',                 apoio: ['Procedência garantida', 'Processo correto', 'Orientação técnica'] },
  { n: '3', titulo: 'Rotina',    chave: 'Quem faz parte da rotina vira escolha natural.',          apoio: ['Presença 24h', 'Ponto de apoio constante', 'Parte da rotina do motorista'] },
  { n: '4', titulo: 'Jornada',   chave: 'Cuidar do carro é continuidade, não decisão isolada.',    apoio: ['Abastecimento recorrente', 'Manutenção preventiva', 'Acompanhamento contínuo'] },
  { n: '5', titulo: 'Simples',   chave: 'Resolver suas necessidades diárias é simples no Rizzotto.', apoio: ['Atendimento ágil', 'Processo rápido', 'Conveniência em um só lugar'] },
]

const PUBLICOS = [
  { nome: 'Motorista do Dia a Dia', desc: 'Pessoas que usam o carro na rotina e buscam praticidade e confiança.',
    caracteristicas: ['Abastece com frequência', 'Valoriza agilidade', 'Busca continuidade no combustível', 'Prefere praticidade a preço baixo'] },
  { nome: 'Motorista Profissional', desc: 'Uber, entregadores e quem vive do carro.',
    caracteristicas: ['Alta recorrência', 'Sensível a custo-benefício', 'Busca rendimento e durabilidade', 'Decide com base em economia real'] },
  { nome: 'Cliente de Conveniência / Rotina', desc: 'Pessoas que usam o posto como ponto de apoio.',
    caracteristicas: ['Consome café da manhã', 'Usa o espaço como parada estratégica', 'Valoriza ambiente e atendimento', 'Pode não abastecer sempre', 'Frequenta em horários variados'] },
]

const INSTITUCIONAL = [
  { tema: 'Tema 1', titulo: '"Seu dia começa aqui"',
    objetivo: 'Atrair as pessoas no início do seu dia, independente do horário. A tese é que, atraindo no início da rotina da pessoa, ela volta.',
    desdobramentos: ['Manhã (café)', 'Tarde (abastecimento rápido)', 'Noite e madrugada (ponto de apoio)'],
    slogans: ['Comece bem. Comece no Rizzotto.', 'Seu primeiro compromisso do dia é no Rizzotto.'] },
  { tema: 'Tema 2', titulo: '"Nasceu aqui. Presente na sua rotina."',
    objetivo: 'Reforçar que o Rizzotto é da cidade e faz parte do dia a dia das pessoas.',
    desdobramentos: ['Mostrar a origem local da marca', 'Pessoas reais da cidade', 'Presença nos bairros e na rotina', 'Manhã, tarde e noite'],
    slogans: ['Quem é daqui, escolhe Rizzotto.', 'Rizzotto. Da nossa terra. Do seu dia a dia.', 'Rizzotto. Feito pra nossa gente.'] },
]

const COMERCIAIS = [
  { grupo: 'Campanhas de Produto (80/20)', ideias: ['Tanque Cheio, Dia Redondo', 'Cuidar é Economizar', 'Manhã Inteligente'] },
  { grupo: 'Campanhas de Mix (Combustível + Conveniência)', ideias: ['Abasteça e Aproveite', 'Passou, Resolveu', 'Comece no Rizzotto'] },
  { grupo: 'Campanhas por Público', ideias: ['Para Quem Roda Todo Dia', 'Motorista Prevenido', 'Quem é Daqui, Escolhe Melhor'] },
]

const DATAS = [
  { data: '15 mar', nome: 'Dia do Consumidor' },
  { data: 'Maio',   nome: 'Dia das Mães' },
  { data: 'Agosto', nome: 'Dia dos Pais' },
  { data: '15 set', nome: 'Dia do Cliente' },
  { data: 'Nov',    nome: 'Black Friday' },
  { data: 'Dez',    nome: 'Natal' },
]

function Secao({ icon: Icon, titulo, desc, cor, children }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Icon size={16} style={{ color: cor }} /> {titulo}
        </h3>
        {desc && <p className="text-[12.5px] text-muted mt-1 leading-relaxed max-w-3xl">{desc}</p>}
      </div>
      {children}
    </section>
  )
}

export default function RizzottoPlanejamento({ color = '#60a5fa' }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
        <div className="text-[11px] uppercase tracking-widest text-muted">Posto Rizzotto</div>
        <h2 className="text-2xl font-semibold mt-1">Planejamento 2026</h2>
        <p className="text-[13px] text-muted mt-2 max-w-3xl leading-relaxed">
          A comunicação do Posto não nasce do combustível apenas. Nasce da responsabilidade da escolha diária,
          que envolve <strong>rotina, confiança, segurança, economia e conveniência</strong>.
          Toda peça deve reforçar pelo menos um dos pilares abaixo.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-9">

        <Secao icon={Compass} titulo="Princípio geral de comunicação" cor={color}
          desc="Os três pilares que sustentam toda a comunicação da marca.">
          <div className="grid gap-3 lg:grid-cols-3">
            {PILARES.map(p => (
              <div key={p.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg text-[12px] font-semibold"
                    style={{ background: `${color}22`, color }}>{p.n}</span>
                  <span className="text-[13.5px] font-medium">{p.titulo}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {p.itens.map(i => (
                    <li key={i} className="text-[12.5px] text-muted flex gap-2"><span style={{ color }}>·</span>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Secao>

        <Secao icon={MessageSquare} titulo="Narrativas" cor={color}
          desc="Cinco linhas narrativas. Cada uma tem uma ideia-chave que deve aparecer na peça.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NARRATIVAS.map(n => (
              <div key={n.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-md text-[11px] font-semibold"
                    style={{ background: `${color}22`, color }}>{n.n}</span>
                  <span className="text-[13px] font-medium">{n.titulo}</span>
                </div>
                <p className="text-[12.5px] italic leading-snug" style={{ color }}>"{n.chave}"</p>
                <ul className="space-y-1 mt-auto pt-1">
                  {n.apoio.map(a => <li key={a} className="text-[11.5px] text-muted">· {a}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Secao>

        <Secao icon={Users} titulo="Público-alvo" cor={color} desc="Três perfis que orientam a comunicação.">
          <div className="grid gap-3 lg:grid-cols-3">
            {PUBLICOS.map(p => (
              <div key={p.nome} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
                <span className="text-[13.5px] font-medium leading-tight">{p.nome}</span>
                <p className="text-[12.5px] text-muted leading-snug">{p.desc}</p>
                <ul className="space-y-1 mt-1">
                  {p.caracteristicas.map(c => <li key={c} className="text-[11.5px] text-muted">· {c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Secao>

        <Secao icon={Megaphone} titulo="Campanhas institucionais" cor={color} desc="Os dois temas de marca do ano.">
          <div className="grid gap-3 lg:grid-cols-2">
            {INSTITUCIONAL.map(i => (
              <div key={i.tema} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted">{i.tema}</div>
                  <div className="text-[15px] font-semibold mt-0.5">{i.titulo}</div>
                </div>
                <p className="text-[12.5px] text-muted leading-relaxed">{i.objetivo}</p>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted mb-1.5">Como desdobrar</div>
                  <div className="flex flex-wrap gap-1.5">
                    {i.desdobramentos.map(d => (
                      <span key={d} className="rounded-lg border border-white/10 px-2 py-1 text-[11.5px] text-muted">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted mb-1.5">Slogans</div>
                  <ul className="space-y-1">
                    {i.slogans.map(s => <li key={s} className="text-[12.5px]" style={{ color }}>· {s}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Secao>

        <Secao icon={ShoppingBag} titulo="Campanhas comerciais" cor={color} desc="Ideias que conectam oferta e estratégia.">
          <div className="grid gap-3 lg:grid-cols-3">
            {COMERCIAIS.map(c => (
              <div key={c.grupo} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-[13px] font-medium leading-tight">{c.grupo}</span>
                <ul className="mt-3 space-y-1.5">
                  {c.ideias.map(i => (
                    <li key={i} className="text-[12.5px] text-muted flex gap-2"><span style={{ color }}>·</span>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Secao>

        <Secao icon={CalendarDays} titulo="Datas comerciais" cor={color} desc="Calendário do ano.">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {DATAS.map((d, n) => (
              <div key={d.nome} className={`flex items-center gap-4 p-3.5 ${n > 0 ? 'border-t border-white/[0.06]' : ''}`}>
                <span className="w-16 shrink-0 text-[12px] font-medium tabular-nums" style={{ color }}>{d.data}</span>
                <span className="text-[13px]">{d.nome}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted leading-relaxed">
            Podemos pensar em alguma ação referente à Copa também, que começa em 11 de junho de 2026 —
            algo como "Esquenta jogo 6 no Posto Rizzotto".
          </p>
        </Secao>

        <Secao icon={Target} titulo="Meta do ano" cor={color} desc="Objetivo definido para o Instagram.">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 max-w-md">
            <div className="text-[11px] uppercase tracking-wide text-muted">Seguidores no Instagram</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-semibold" style={{ color }}>8.000</span>
              <span className="text-[13px] text-muted">de 10.000 até o fim do ano</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '80%', background: color }} />
            </div>
            <p className="text-[12px] text-muted mt-2">Faltam 2.000 seguidores.</p>
          </div>
        </Secao>
      </motion.div>
    </div>
  )
}
