import { motion } from 'framer-motion'
import { Compass, MessageSquare, Megaphone, ShoppingBag, CalendarDays, Users, Target, CheckCircle2, AlertTriangle, CircleDashed } from 'lucide-react'

const VERDE    = '#6eda2c'
const LARANJA  = '#f59e0b'
const VERMELHO = '#ef4444'

const PILARES = [
  { n: '1', titulo: 'Confiança na decisão', itens: ['Procedência garantida', 'Equipe preparada', 'Transparência no serviço'] },
  { n: '2', titulo: 'Presença 24h',         itens: ['Disponibilidade real', 'Sempre aberto quando o cliente precisa', 'Ponto de apoio da estrada'] },
  { n: '3', titulo: 'Simplicidade e agilidade', itens: ['Processo rápido', 'Soluciona a maioria dos hábitos diários', 'Resolve tudo em um lugar'] },
]

const NARRATIVAS = [
  { n: '1', titulo: 'Decisão',  chave: 'A decisão certa no abastecimento evita problema depois.', apoio: ['Escolher combustível com confiança', 'Pensar no longo prazo', 'Evitar prejuízo no veículo'] },
  { n: '2', titulo: 'Segurança', chave: 'Segurança não se improvisa. Se escolhe.', apoio: ['Procedência garantida', 'Processo correto', 'Orientação técnica'] },
  { n: '3', titulo: 'Rotina',    chave: 'Quem faz parte da rotina vira escolha natural.', apoio: ['Presença 24h', 'Ponto de apoio constante', 'Parte da rotina do motorista'] },
  { n: '4', titulo: 'Jornada',   chave: 'Cuidar do carro é continuidade, não decisão isolada.', apoio: ['Abastecimento recorrente', 'Manutenção preventiva', 'Acompanhamento contínuo'] },
  { n: '5', titulo: 'Simples',   chave: 'Resolver suas necessidades diárias é simples no Rizzotto.', apoio: ['Atendimento ágil', 'Processo rápido', 'Conveniência em um só lugar'] },
]

const PUBLICOS = [
  { nome: 'Motorista do Dia a Dia', desc: 'Usa o carro na rotina e busca praticidade e confiança.',
    caracteristicas: ['Abastece com frequência', 'Valoriza agilidade', 'Busca continuidade no combustível', 'Prefere praticidade a preço baixo'],
    status: 'ausente', statusTxt: 'Sem campanha própria em 14 meses' },
  { nome: 'Motorista Profissional', desc: 'Uber, entregadores e quem vive do carro.',
    caracteristicas: ['Alta recorrência', 'Sensível a custo-benefício', 'Busca rendimento e durabilidade', 'Decide com base em economia real'],
    status: 'ativo', statusTxt: 'Camp02 · R$ 1.975 investidos' },
  { nome: 'Cliente de Conveniência / Rotina', desc: 'Usa o posto como ponto de apoio.',
    caracteristicas: ['Consome café da manhã', 'Usa o espaço como parada estratégica', 'Valoriza ambiente e atendimento', 'Frequenta em horários variados'],
    status: 'ativo', statusTxt: 'Camp03 · R$ 4.285 investidos' },
]

const INSTITUCIONAL = [
  { tema: 'Tema 1', titulo: '"Seu dia começa aqui"',
    objetivo: 'Atrair as pessoas no início do seu dia, independente do horário. A tese é que atraindo no início da rotina da pessoa, ela volta.',
    desdobramentos: ['Manhã (café)', 'Tarde (abastecimento rápido)', 'Noite / madrugada (ponto de apoio)'],
    slogans: ['Comece bem. Comece no Rizzotto.', 'Seu primeiro compromisso do dia é no Rizzotto'],
    status: 'parcial', statusTxt: '1 peça no Meta e 1 campanha no YouTube. Os 3 momentos do dia não foram produzidos.' },
  { tema: 'Tema 2', titulo: '"Nasceu aqui. Presente na sua rotina."',
    objetivo: 'Reforçar que o Rizzotto é da cidade e faz parte do dia a dia das pessoas.',
    desdobramentos: ['Mostrar a origem local da marca', 'Pessoas reais da cidade', 'Presença nos bairros e na rotina', 'Manhã, tarde e noite'],
    slogans: ['Quem é daqui, escolhe Rizzotto.', 'Rizzotto. Da nossa terra. Do seu dia a dia.', 'Rizzotto. Feito pra nossa gente.'],
    status: 'parado', statusTxt: 'Rodou como "SOMOS ARARANGUAENSES" em dez/25–jan/26 e foi descontinuado.' },
]

const COMERCIAIS = [
  { grupo: '1. Campanhas de Produto (80/20)', ideias: ['Tanque Cheio, Dia Redondo', 'Cuidar é Economizar', 'Manhã Inteligente'] },
  { grupo: '2. Campanhas de Mix (Combustível + Conveniência)', ideias: ['Abasteça e Aproveite', 'Passou, Resolveu', 'Comece no Rizzotto'] },
  { grupo: '3. Campanhas por Público', ideias: ['Para Quem Roda Todo Dia', 'Motorista Prevenido', 'Quem é Daqui, Escolhe Melhor'] },
]

const DATAS = [
  { data: '15 mar', nome: 'Dia do Consumidor', status: 'parcial', obs: '1 peça · R$ 57,95 · CTR 1,60%' },
  { data: 'Maio',   nome: 'Dia das Mães',      status: 'ausente', obs: 'Nenhuma peça — pior mês da série (CTR 1,10%)' },
  { data: 'Agosto', nome: 'Dia dos Pais',      status: 'ok',      obs: '8 peças em ago/25 · 1 peça em ago/26 (CTR 2,78%)' },
  { data: '15 set', nome: 'Dia do Cliente',    status: 'ausente', obs: 'Nenhuma peça' },
  { data: 'Nov',    nome: 'Black Friday',      status: 'ok',      obs: 'AD52 · nov/25 teve o 2º melhor CTR (2,27%)' },
  { data: 'Dez',    nome: 'Natal',             status: 'ausente', obs: 'Nenhuma peça' },
  { data: '11 jun', nome: 'Copa — "Esquenta jogo 6 no Rizzotto"', status: 'parcial', obs: '6 peças, mas diluídas entre 79 anúncios no mês' },
]

const STATUS_MAP = {
  ok:      { cor: VERDE,    Icon: CheckCircle2, label: 'Executado' },
  ativo:   { cor: VERDE,    Icon: CheckCircle2, label: 'Ativo' },
  parcial: { cor: LARANJA,  Icon: AlertTriangle, label: 'Parcial' },
  parado:  { cor: LARANJA,  Icon: AlertTriangle, label: 'Descontinuado' },
  ausente: { cor: VERMELHO, Icon: CircleDashed, label: 'Não executado' },
}

function Tag({ status }) {
  const s = STATUS_MAP[status]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: `${s.cor}1a`, color: s.cor }}>
      <s.Icon size={11} /> {s.label}
    </span>
  )
}

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
      {/* Cabeçalho */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
        <div className="text-[11px] uppercase tracking-widest text-muted">Posto Rizzotto</div>
        <h2 className="text-2xl font-semibold mt-1">Planejamento 2026</h2>
        <p className="text-[13px] text-muted mt-2 max-w-3xl leading-relaxed">
          A comunicação do Posto não nasce do combustível apenas. Nasce da responsabilidade da escolha diária,
          que envolve <strong>rotina, confiança, segurança, economia e conveniência</strong>.
          Toda peça deve reforçar pelo menos um dos pilares abaixo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag status="ok" /><span className="text-[11.5px] text-muted self-center">executado</span>
          <Tag status="parcial" /><span className="text-[11.5px] text-muted self-center">parcial</span>
          <Tag status="ausente" /><span className="text-[11.5px] text-muted self-center">pendente</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

        {/* Pilares */}
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
                    <li key={i} className="text-[12.5px] text-muted flex gap-2">
                      <span style={{ color }}>·</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Secao>

        {/* Narrativas */}
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

        {/* Público-alvo */}
        <Secao icon={Users} titulo="Público-alvo" cor={color}
          desc="Três perfis definidos no planejamento — e como cada um está sendo atendido hoje na mídia.">
          <div className="grid gap-3 lg:grid-cols-3">
            {PUBLICOS.map(p => (
              <div key={p.nome} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13.5px] font-medium leading-tight">{p.nome}</span>
                  <Tag status={p.status} />
                </div>
                <p className="text-[12.5px] text-muted leading-snug">{p.desc}</p>
                <ul className="space-y-1 mt-1">
                  {p.caracteristicas.map(c => <li key={c} className="text-[11.5px] text-muted">· {c}</li>)}
                </ul>
                <div className="mt-auto pt-2 text-[11.5px]" style={{ color: STATUS_MAP[p.status].cor }}>{p.statusTxt}</div>
              </div>
            ))}
          </div>
        </Secao>

        {/* Institucional */}
        <Secao icon={Megaphone} titulo="Campanhas institucionais" cor={color}
          desc="Os dois temas de marca do ano.">
          <div className="grid gap-3 lg:grid-cols-2">
            {INSTITUCIONAL.map(i => (
              <div key={i.tema} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-muted">{i.tema}</div>
                    <div className="text-[15px] font-semibold mt-0.5">{i.titulo}</div>
                  </div>
                  <Tag status={i.status} />
                </div>
                <p className="text-[12.5px] text-muted leading-relaxed">{i.objetivo}</p>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted mb-1.5">Desdobramentos previstos</div>
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
                <div className="rounded-xl p-2.5 text-[12px] leading-snug"
                  style={{ background: `${STATUS_MAP[i.status].cor}12`, color: STATUS_MAP[i.status].cor }}>
                  {i.statusTxt}
                </div>
              </div>
            ))}
          </div>
        </Secao>

        {/* Comerciais */}
        <Secao icon={ShoppingBag} titulo="Campanhas comerciais" cor={color}
          desc="Ideias que conectam oferta a estratégia. Nenhuma delas foi ao ar até agosto/26.">
          <div className="grid gap-3 lg:grid-cols-3">
            {COMERCIAIS.map(c => (
              <div key={c.grupo} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-medium leading-tight">{c.grupo}</span>
                  <Tag status="ausente" />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {c.ideias.map(i => (
                    <li key={i} className="text-[12.5px] text-muted flex gap-2"><span style={{ color }}>·</span>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Secao>

        {/* Datas */}
        <Secao icon={CalendarDays} titulo="Datas comerciais" cor={color}
          desc="Calendário do ano e o que foi efetivamente produzido em cada data.">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {DATAS.map((d, n) => (
              <div key={d.nome}
                className={`flex flex-wrap items-center gap-3 p-3.5 ${n > 0 ? 'border-t border-white/[0.06]' : ''}`}>
                <span className="w-16 shrink-0 text-[12px] font-medium tabular-nums" style={{ color }}>{d.data}</span>
                <span className="flex-1 min-w-[160px] text-[13px]">{d.nome}</span>
                <span className="text-[11.5px] text-muted flex-1 min-w-[200px]">{d.obs}</span>
                <Tag status={d.status} />
              </div>
            ))}
          </div>
        </Secao>

        {/* Metas */}
        <Secao icon={Target} titulo="Metas do ano" cor={color} desc="Onde estamos e quanto falta.">
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted">Seguidores no Instagram</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold" style={{ color }}>8.000</span>
                <span className="text-[13px] text-muted">de 10.000</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '80%', background: color }} />
              </div>
              <p className="text-[11.5px] text-muted mt-2">Faltam 2.000 até dez/26 — cerca de 500 por mês.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted">Frequência de marca</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold" style={{ color: LARANJA }}>1,69x</span>
                <span className="text-[13px] text-muted">ideal: 3 a 4x</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '48%', background: LARANJA }} />
              </div>
              <p className="text-[11.5px] text-muted mt-2">Quantas vezes por mês a mesma pessoa vê a marca no Meta.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted">Execução do planejamento</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold" style={{ color: LARANJA }}>~30%</span>
                <span className="text-[13px] text-muted">até ago/26</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '30%', background: LARANJA }} />
              </div>
              <p className="text-[11.5px] text-muted mt-2">1 público sem campanha, 3 datas vazias, comerciais não iniciadas.</p>
            </div>
          </div>
        </Secao>

        {/* Prioridades */}
        <Secao icon={Compass} titulo="Prioridades de setembro a dezembro" cor={VERDE}
          desc="O que destrava o planejamento nos últimos 4 meses do ano.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Subir a frequência para 3–4x', 'Reduzir a área geográfica em vez de aumentar a verba.'],
              ['Fixar 3 mensagens por 6 meses', 'Procedência, presença 24h e agilidade — parar de trocar de peça.'],
              ['Campanha de seguidores', 'R$ 400/mês para fechar a meta de 10 mil até dezembro.'],
              ['Retomar rosto recorrente', 'A "Vanessa" teve CTR de até 3,60% e foi descontinuada.'],
              ['Cobrir as 3 datas vazias', 'Dia do Cliente (set), Black Friday (nov) e Natal (dez).'],
              ['Refazer o vídeo institucional', 'Retenção de 1,5% indica problema nos primeiros segundos.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: VERDE }} />
                <div>
                  <div className="text-[13px] font-medium">{t}</div>
                  <p className="text-[12.5px] text-muted mt-0.5 leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </Secao>
      </motion.div>
    </div>
  )
}
