import { motion } from 'framer-motion'

// Material bônus do aulão da Camila Masera — réplica do PDF
// "trafegon-google-ads-para-advogadas.pdf" (7 passos · edição 2026).
// Deck independente da Palestra CAF. Não compartilha nada com ela.

const G     = '#6eda2c'
const DARK  = '#1a1d2e'
const NAVY  = '#0f2044'
const BLUE  = '#3b82f6'
const RED   = '#f87171'
const GOLD  = '#f59e0b'
const CYAN  = '#22d3ee'
const PUR   = '#a855f7'

const WHATS = {
  numero:   '5548996834253',
  mensagem: 'Oii, sou advogada e vim do material da Camila Masera',
}
const WHATS_URL = `https://wa.me/${WHATS.numero}?text=${encodeURIComponent(WHATS.mensagem)}`

// ── ÁTOMOS ─────────────────────────────────────────────────────────────────────
function Rodape({ pagina }) {
  return (
    <div className="absolute inset-x-0 flex items-center justify-between px-10 z-10"
      style={{ bottom: 14 }}>
      <span className="font-black text-[13px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
        TráfegOn · Google Ads para advogadas
      </span>
      {pagina && (
        <span className="font-black text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{pagina}</span>
      )}
    </div>
  )
}

function Passo({ n, titulo, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 flex items-center gap-5">
      <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ width: 74, height: 74, background: G, boxShadow: `0 8px 26px ${G}45` }}>
        <span className="font-black" style={{ color: DARK, fontSize: '2.6rem', lineHeight: 1 }}>{n}</span>
      </div>
      <div>
        <div className="font-black text-[13px] tracking-widest uppercase mb-1" style={{ color: G }}>
          Passo {String(n).padStart(2, '0')}
        </div>
        <h2 className="font-black text-white leading-none" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
          {titulo}
        </h2>
        {sub && <p className="text-white/60 text-[19px] mt-2 leading-snug">{sub}</p>}
      </div>
    </motion.div>
  )
}

function BotaoWhats({ pergunta, resposta }) {
  return (
    <motion.a href={WHATS_URL} target="_blank" rel="noreferrer"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
      className="flex-shrink-0 rounded-2xl px-7 py-3.5 flex items-center gap-5 no-underline"
      style={{ background: G, boxShadow: `0 10px 30px ${G}35` }}>
      <span className="text-3xl flex-shrink-0">💬</span>
      <span className="flex-1 flex flex-col leading-tight">
        <span className="font-black text-[19px]" style={{ color: DARK }}>{pergunta}</span>
        <span className="font-semibold text-[16px]" style={{ color: DARK, opacity: 0.7 }}>{resposta}</span>
      </span>
      <span className="font-black text-[15px] tracking-widest uppercase px-4 py-2 rounded-xl flex-shrink-0"
        style={{ background: DARK, color: G }}>Falar conosco ›</span>
    </motion.a>
  )
}

function Tela({ children, bg }) {
  return (
    <div className="h-full flex flex-col px-10 pt-7 pb-12 gap-4 relative overflow-hidden"
      style={{ background: bg || DARK }}>
      {children}
    </div>
  )
}

// ── 01 · CAPA ──────────────────────────────────────────────────────────────────
function Capa() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 55%, ${BLUE} 100%)` }}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: 200 + i * 120, height: 200 + i * 120,
            border: '1.5px solid rgba(255,255,255,0.09)',
            top: '50%', left: '50%', translateX: '-50%', translateY: '-50%',
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 22 + i * 6, repeat: Infinity, ease: 'linear' }} />
      ))}

      <motion.div className="relative z-10 text-center px-14"
        initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="inline-block px-5 py-1.5 rounded-full text-[14px] font-black tracking-widest mb-6"
          style={{ background: G, color: NAVY }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          MATERIAL BÔNUS · AULÃO CAMILA MASERA
        </motion.div>

        <motion.h1 className="font-black text-white leading-[0.92]"
          style={{ fontSize: '4.6rem', letterSpacing: '-3px', textShadow: '0 8px 40px rgba(0,0,0,0.35)' }}
          initial={{ y: 34, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          Google Ads<br />
          <span style={{ color: G }}>para advogadas</span><br />
          que querem clientes.
        </motion.h1>

        <motion.p className="text-white/75 text-[21px] leading-snug mt-6 mx-auto" style={{ maxWidth: 830 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          O passo a passo real, técnico e sem enrolação para colocar seu escritório
          na primeira linha do Google — dentro das regras da OAB.
        </motion.p>

        <motion.div className="font-black text-[15px] tracking-widest uppercase mt-7"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          7 passos · guia prático · edição 2026
        </motion.div>
      </motion.div>
    </div>
  )
}

// ── 02 · ANTES DE COMEÇAR ──────────────────────────────────────────────────────
function Antes() {
  const indice = [
    { n: '01', t: 'Onde você vai aparecer',  d: 'Pesquisa, Display, YouTube, PMax — e as regras da OAB' },
    { n: '02', t: 'A estrutura da conta',    d: 'Campanha, grupo de anúncios e o esqueleto que sustenta tudo' },
    { n: '03', t: 'Palavras-chave',          d: 'Correspondências, cauda longa e a lista de negativas' },
    { n: '04', t: 'Anúncios que convertem',  d: '15 títulos, extensões e o que a ética permite escrever' },
    { n: '05', t: 'Página de destino',       d: 'Índice de Qualidade, mobile e o CTA único' },
    { n: '06', t: 'Conversões e métricas',   d: 'GA4, Tag Manager, CPL e o que realmente importa' },
    { n: '07', t: 'Rotina de otimização',    d: 'O que fazer toda semana para o custo cair' },
  ]
  return (
    <Tela>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
        <div className="font-black text-[13px] tracking-widest uppercase mb-1.5" style={{ color: G }}>
          Antes de começar
        </div>
        <h2 className="font-black text-white leading-none" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
          Oi! Que bom que você pegou esse mimo.
        </h2>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex-shrink-0 grid grid-cols-3 gap-3">
        {[
          'Esse material nasceu da conversa do Gabriel com vocês no aulão da Camila Masera. A ideia é te entregar o mapa completo de como anunciar no Google Ads — o mesmo caminho que usamos em contas reais de escritórios de advocacia.',
          'Ele é didático, mas não é raso. Você vai encontrar termos técnicos, tabelas e checklists de verdade. Se em algum momento parecer complexo, ótimo: significa que estamos falando da parte que dá resultado.',
          'Como usar: leia na ordem. Cada passo depende do anterior. Ao final de cada um você encontra um botão verde — ele te leva direto pro nosso WhatsApp, sem robô, sem formulário.',
        ].map((p, i) => (
          <div key={i} className="rounded-xl px-5 py-4 text-white/75 text-[16px] leading-snug"
            style={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.07)' }}>
            {p}
          </div>
        ))}
      </motion.div>

      <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 min-h-0 content-center">
        {indice.map((x, i) => (
          <motion.div key={x.n}
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="rounded-xl px-4 py-2.5 flex items-center gap-4"
            style={{ background: G + '0d', border: `1px solid ${G}22` }}>
            <span className="font-black flex-shrink-0" style={{ color: G, fontSize: '1.7rem', lineHeight: 1 }}>{x.n}</span>
            <span className="flex flex-col leading-tight">
              <span className="font-black text-white text-[19px]">{x.t}</span>
              <span className="text-white/55 text-[15px] mt-0.5">{x.d}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <Rodape pagina="02" />
    </Tela>
  )
}

// ── 03 · PASSO 1 · ONDE VOCÊ VAI APARECER ──────────────────────────────────────
function P1() {
  const redes = [
    { n: 'Rede de Pesquisa',  d: 'Aparece quando alguém digita algo. É intenção pura: "advogado trabalhista em Florianópolis".', tag: 'Comece por aqui',   cor: G,    icon: '🔍' },
    { n: 'Rede de Display',   d: 'Banners em sites e blogs. Ótimo para lembrança de marca, péssimo para começar do zero.',       tag: 'Depois',           cor: CYAN, icon: '🖼️' },
    { n: 'YouTube (vídeo)',   d: 'Autoridade e alcance. Exige roteiro e edição.',                                                tag: 'Fase 2',           cor: GOLD, icon: '▶️' },
    { n: 'Performance Max',   d: 'Automático demais para conta nova. Sem histórico, o Google chuta.',                            tag: 'Evite no início',  cor: RED,  icon: '🎲' },
  ]
  return (
    <Tela>
      <Passo n={1} titulo="Entenda onde você vai aparecer"
        sub="Antes de gastar um centavo, entenda o campo de jogo. O Google Ads não é “um anúncio”: são redes diferentes, com lógicas diferentes." />

      <div className="flex-1 grid grid-cols-4 gap-3 min-h-0">
        {redes.map((r, i) => (
          <motion.div key={r.n}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.09, type: 'spring', stiffness: 150 }}
            className="rounded-2xl p-5 flex flex-col gap-2.5 justify-center"
            style={{ background: r.cor + '10', border: `1px solid ${r.cor}38` }}>
            <div className="text-4xl">{r.icon}</div>
            <div className="font-black text-[22px] leading-tight" style={{ color: r.cor }}>{r.n}</div>
            <div className="text-white/75 text-[16px] leading-snug flex-1">{r.d}</div>
            <div className="font-black text-[14px] tracking-widest uppercase px-3 py-1.5 rounded-lg self-start"
              style={{ background: r.cor, color: DARK }}>{r.tag}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex-shrink-0 grid grid-cols-2 gap-3">
        <div className="rounded-xl px-5 py-3 flex items-start gap-3"
          style={{ background: RED + '0d', border: `1px solid ${RED}35` }}>
          <span className="text-xl flex-shrink-0">⚠️</span>
          <span className="text-white/85 text-[16px] leading-snug">
            <b style={{ color: RED }}>Atenção OAB:</b> publicidade da advocacia tem regras (Provimento 205/2021).
            Nada de mercantilização, promessa de resultado, valores ou “captação”. O anúncio deve ser informativo.
            Errar aqui não é só perder dinheiro — é risco ético.
          </span>
        </div>
        <div className="rounded-xl px-5 py-3 flex items-start gap-3"
          style={{ background: GOLD + '0d', border: `1px solid ${GOLD}35` }}>
          <span className="text-xl flex-shrink-0">📝</span>
          <span className="text-white/85 text-[16px] leading-snug">
            <b style={{ color: GOLD }}>Tarefa de casa:</b> escreva 5 formas diferentes que um cliente leigo usaria
            para te procurar no Google. Nenhuma delas pode conter jargão jurídico.
          </span>
        </div>
      </motion.div>

      <BotaoWhats pergunta="Achou essa parte complicada demais?"
        resposta="A gente monta isso pra você — do zero, sem enrolação." />
      <Rodape pagina="03" />
    </Tela>
  )
}

// ── 04 · PASSO 2 · A ESTRUTURA DA CONTA ────────────────────────────────────────
function P2() {
  const niveis = [
    { n: 'CONTA',              d: '',                                                   cor: 'rgba(255,255,255,0.45)' },
    { n: 'CAMPANHA',           d: 'orçamento + localização + objetivo',                 cor: CYAN },
    { n: 'GRUPO DE ANÚNCIOS',  d: 'um tema só — ex.: “Divórcio Consensual”',            cor: BLUE },
    { n: 'PALAVRAS-CHAVE + ANÚNCIOS + PÁGINA DE DESTINO', d: '',                        cor: G },
  ]
  const check = [
    'Objetivo: Leads · Tipo: Pesquisa',
    'Desmarque “incluir Rede de Display” e “parceiros de pesquisa”',
    'Localização: Presença — pessoas que estão no local (não “interessadas em”)',
    'Idioma: Português · Orçamento diário realista (comece com R$ 30–50/dia)',
    'Lances: Maximizar cliques com limite de CPC nas 2 primeiras semanas',
  ]
  return (
    <Tela>
      <Passo n={2} titulo="Monte a estrutura da conta"
        sub="90% das contas quebram aqui. A hierarquia é simples — e inegociável." />

      <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
        <div className="flex flex-col justify-center gap-1.5">
          {niveis.map((v, i) => (
            <motion.div key={v.n}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}>
              <div className="rounded-xl px-5 py-3 text-center"
                style={{
                  background: i === 3 ? G + '18' : 'rgba(255,255,255,0.04)',
                  border: `${i === 3 ? 1.5 : 1}px solid ${i === 3 ? G + '55' : 'rgba(255,255,255,0.1)'}`,
                  marginLeft: i * 14, marginRight: i * 14,
                }}>
                <div className="font-black tracking-wide leading-tight"
                  style={{ color: v.cor, fontSize: i === 3 ? '1.05rem' : '1.35rem' }}>{v.n}</div>
                {v.d && <div className="text-white/50 text-[15px] mt-0.5">{v.d}</div>}
              </div>
              {i < 3 && <div className="text-center text-white/25 text-lg leading-none mt-1">↓</div>}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-3">
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl px-5 py-3.5" style={{ background: GOLD + '0d', border: `1px solid ${GOLD}38` }}>
            <span className="text-white/90 text-[17px] leading-snug">
              <b style={{ color: GOLD }}>Regra de ouro:</b> um grupo de anúncios = um único assunto.
              Se dentro do mesmo grupo tem “pensão alimentícia” e “inventário”, o Google não sabe o que mostrar,
              e você paga mais caro por isso.
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl px-6 py-4 flex flex-col gap-2"
            style={{ background: G + '0d', border: `1px solid ${G}35` }}>
            <div className="font-black text-[15px] tracking-widest uppercase" style={{ color: G }}>
              Checklist de configuração
            </div>
            {check.map(c => (
              <div key={c} className="flex items-start gap-3">
                <span className="font-black text-lg flex-shrink-0" style={{ color: G }}>✓</span>
                <span className="text-white/85 text-[16px] leading-snug">{c}</span>
              </div>
            ))}
            <div className="text-white/45 text-[15px] mt-1 italic">
              Uma configuração errada aqui queima seu orçamento em 3 dias.
            </div>
          </motion.div>
        </div>
      </div>

      <BotaoWhats pergunta="Travou na configuração da campanha?"
        resposta="A gente configura a conta inteira com você." />
      <Rodape pagina="04" />
    </Tela>
  )
}

// ── 05 · PASSO 3 · PALAVRAS-CHAVE ──────────────────────────────────────────────
function P3() {
  const tipos = [
    { t: 'Ampla',  e: 'advogado divorcio',   r: 'Mostra pra quase tudo. Queima dinheiro.', cor: RED },
    { t: 'Frase',  e: '"advogado divorcio"', r: 'Contém a frase. Equilíbrio bom.',         cor: GOLD },
    { t: 'Exata',  e: '[advogado divorcio]', r: 'Só o termo (e variações). Mais controle.', cor: G },
  ]
  const negativas = ['grátis', 'gratuito', 'curso', 'concurso', 'salário', 'vagas', 'OAB', 'modelo de petição', 'defensoria', 'como fazer sozinho']
  return (
    <Tela>
      <Passo n={3} titulo="Palavras-chave: o coração de tudo"
        sub="Palavra-chave não é o que você fala. É o que o cliente desesperado às 23h digita no celular." />

      <div className="flex-shrink-0 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="grid px-5 py-2" style={{ gridTemplateColumns: '150px 320px 1fr', background: 'rgba(255,255,255,0.05)' }}>
          {['Tipo', 'Como escrever', 'O que acontece'].map(h => (
            <span key={h} className="font-black text-[14px] tracking-widest uppercase text-white/45">{h}</span>
          ))}
        </div>
        {tipos.map((x, i) => (
          <motion.div key={x.t}
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            className="grid px-5 py-2.5 items-center"
            style={{ gridTemplateColumns: '150px 320px 1fr', background: '#0f1018', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-black text-[19px]" style={{ color: x.cor }}>{x.t}</span>
            <span className="font-mono text-[17px] text-white/85">{x.e}</span>
            <span className="text-white/70 text-[17px]">{x.r}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl px-6 py-4 flex flex-col justify-center gap-2"
          style={{ background: CYAN + '0d', border: `1px solid ${CYAN}35` }}>
          <div className="font-black text-[15px] tracking-widest uppercase" style={{ color: CYAN }}>Cauda longa</div>
          <div className="text-white/85 text-[17px] leading-snug">
            <span className="font-mono" style={{ color: CYAN }}>“quanto tempo demora um divórcio litigioso”</span> converte
            menos volume, mas com muito mais intenção e CPC menor.
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
          className="rounded-2xl px-6 py-4 flex flex-col justify-center gap-2"
          style={{ background: RED + '0d', border: `1px solid ${RED}35` }}>
          <div className="font-black text-[15px] tracking-widest uppercase" style={{ color: RED }}>
            Palavras negativas · sua lista salva-vidas
          </div>
          <div className="flex flex-wrap gap-1.5">
            {negativas.map(n => (
              <span key={n} className="px-2.5 py-1 rounded-lg text-[15px] font-semibold"
                style={{ background: RED + '1e', color: '#fca5a5' }}>{n}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="flex-shrink-0 rounded-xl px-5 py-3" style={{ background: GOLD + '0d', border: `1px solid ${GOLD}35` }}>
        <span className="text-white/85 text-[17px] leading-snug">
          <b style={{ color: GOLD }}>A parte que ninguém te conta:</b> a lista de negativas nunca está pronta.
          Ela é revisada toda semana no relatório de <b>termos de pesquisa</b> (não confunda com “palavras-chave”).
          É aí que mora o vazamento de verba.
        </span>
      </motion.div>

      <BotaoWhats pergunta="Ficou perdida entre correspondências e negativas?"
        resposta="Fazemos a pesquisa de palavras completa do seu nicho." />
      <Rodape pagina="05" />
    </Tela>
  )
}

// ── 06 · PASSO 4 · ANÚNCIOS ────────────────────────────────────────────────────
function P4() {
  const formula = [
    'com a palavra-chave exata do grupo',
    'com diferencial: atendimento online, 15 anos de atuação, resposta no mesmo dia',
    'com localização: Advocacia em Florianópolis',
    'com a dor/dúvida do cliente',
    'com chamada ética: Fale com nossa equipe',
  ]
  return (
    <Tela>
      <Passo n={4} titulo="Escreva anúncios que param o polegar"
        sub="No Anúncio Responsivo de Pesquisa você entrega até 15 títulos (30 caracteres) e 4 descrições (90 caracteres). O Google testa as combinações." />

      <div className="flex-1 grid gap-4 min-h-0" style={{ gridTemplateColumns: '1.15fr 1fr' }}>
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl px-6 py-4 flex flex-col justify-center gap-2"
          style={{ background: G + '0d', border: `1px solid ${G}35` }}>
          <div className="font-black text-[15px] tracking-widest uppercase" style={{ color: G }}>
            Fórmula dos títulos — use os 15!
          </div>
          {formula.map(f => (
            <div key={f} className="flex items-start gap-3">
              <span className="font-black flex-shrink-0 rounded-lg px-2 py-0.5 text-[15px]"
                style={{ background: G, color: DARK }}>3</span>
              <span className="text-white/85 text-[17px] leading-snug">{f}</span>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col gap-3 justify-center">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl px-5 py-3.5" style={{ background: G + '0d', border: `1px solid ${G}45` }}>
            <div className="font-black text-[15px] tracking-widest uppercase mb-1.5" style={{ color: G }}>✓ Pode</div>
            <div className="text-white/90 text-[17px] leading-snug italic">
              “Advogada Trabalhista em Floripa — Atendimento online. Tire suas dúvidas com nossa equipe.”
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl px-5 py-3.5" style={{ background: RED + '0d', border: `1px solid ${RED}45` }}>
            <div className="font-black text-[15px] tracking-widest uppercase mb-1.5" style={{ color: RED }}>✕ Não pode</div>
            <div className="text-white/90 text-[17px] leading-snug italic">
              “Ganhe sua causa! Melhor advogada da cidade. Consulta por R$ 99.”
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex-shrink-0 rounded-xl px-5 py-3 flex items-center gap-4"
        style={{ background: CYAN + '0d', border: `1px solid ${CYAN}35` }}>
        <span className="font-black text-[15px] tracking-widest uppercase flex-shrink-0" style={{ color: CYAN }}>
          Extensões obrigatórias
        </span>
        <span className="flex flex-wrap gap-1.5">
          {['sitelinks', 'frases de destaque', 'snippets estruturados', 'local'].map(e => (
            <span key={e} className="px-2.5 py-1 rounded-lg text-[15px] font-bold"
              style={{ background: CYAN + '1e', color: '#a5f3fc' }}>{e}</span>
          ))}
        </span>
        <span className="text-white/65 text-[16px]">
          Aumentam o espaço que você ocupa na tela — de graça.
        </span>
      </motion.div>

      <BotaoWhats pergunta="Escrever 15 títulos sem cair em infração ética é difícil?"
        resposta="A gente escreve os criativos e revisa contra o Provimento 205." />
      <Rodape pagina="06" />
    </Tela>
  )
}

// ── 07 · PASSO 5 · PÁGINA DE DESTINO ───────────────────────────────────────────
function P5() {
  const pontos = [
    { n: 1, t: 'Mesma promessa do anúncio', d: 'Se o anúncio diz “divórcio consensual”, o título da página diz a mesma coisa. Isso melhora o Índice de Qualidade e barateia seu clique.' },
    { n: 2, t: 'Abaixo de 3s e mobile-first', d: 'Mais de 70% do tráfego vem do celular.' },
    { n: 3, t: 'Um único CTA visível sem rolar', d: 'WhatsApp ou formulário curto: nome, telefone, resumo do caso.' },
    { n: 4, t: 'Prova ética', d: 'Foto real, OAB, artigos, conteúdo educativo. Sem depoimento de cliente, sem “case de sucesso”.' },
  ]
  return (
    <Tela>
      <Passo n={5} titulo="A página de destino"
        sub="Mandar o clique para a home do site é o erro mais caro do tráfego pago. Cada grupo de anúncios merece uma página que continua a conversa." />

      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        {pontos.map((p, i) => (
          <motion.div key={p.n}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.09, type: 'spring', stiffness: 150 }}
            className="rounded-2xl px-6 py-4 flex items-start gap-4"
            style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="font-black flex-shrink-0 rounded-xl flex items-center justify-center"
              style={{ width: 42, height: 42, background: G, color: DARK, fontSize: '1.5rem' }}>{p.n}</span>
            <span className="flex-1 flex flex-col leading-tight">
              <span className="font-black text-white text-[21px]">{p.t}</span>
              <span className="text-white/85 text-[16px] leading-snug mt-1">{p.d}</span>
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex-shrink-0 rounded-xl px-5 py-3" style={{ background: GOLD + '14', border: `1px solid ${GOLD}45` }}>
        <span className="text-white text-[17px] leading-snug">
          <b style={{ color: GOLD }}>Índice de Qualidade (1 a 10):</b> é a nota do Google para relevância + CTR esperado
          + experiência na página. <b className="text-white">Nota alta = mesma posição pagando menos. Nota baixa = você subsidia o concorrente.</b>
        </span>
      </motion.div>

      <BotaoWhats pergunta="Sem página de destino ou com um site que não converte?"
        resposta="Criamos a landing page inteira, integrada ao WhatsApp." />
      <Rodape pagina="07" />
    </Tela>
  )
}

// ── 08 · PASSO 6 · CONVERSÕES ──────────────────────────────────────────────────
function P6() {
  const instalar = [
    'Google Tag (antigo gtag) em todas as páginas',
    'Google Analytics 4 vinculado ao Ads',
    'Conversão de clique no botão do WhatsApp',
    'Conversão de envio de formulário',
    'Google Tag Manager para gerenciar tudo sem mexer no código',
  ]
  const metricas = [
    { m: 'CTR (pesquisa)',                 r: 'acima de 5%' },
    { m: 'Taxa de conversão da página',    r: '5% a 15%' },
    { m: 'Índice de qualidade médio',      r: '7+' },
  ]
  return (
    <Tela>
      <Passo n={6} titulo="Conversões: sem medir, é aposta"
        sub="Se você não marca o que é um “lead”, o Google otimiza para cliques — e clique não paga honorário." />

      <div className="flex-1 grid gap-4 min-h-0" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl px-6 py-4 flex flex-col justify-center gap-2"
          style={{ background: G + '0d', border: `1px solid ${G}35` }}>
          <div className="font-black text-[15px] tracking-widest uppercase" style={{ color: G }}>
            O que precisa estar instalado
          </div>
          {instalar.map(x => (
            <div key={x} className="flex items-start gap-3">
              <span className="font-black text-lg flex-shrink-0" style={{ color: G }}>✓</span>
              <span className="text-white/85 text-[17px] leading-snug">{x}</span>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col gap-3 justify-center">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CYAN}35` }}>
            <div className="grid px-4 py-2" style={{ gridTemplateColumns: '1fr auto', background: CYAN + '14' }}>
              <span className="font-black text-[14px] tracking-widest uppercase" style={{ color: CYAN }}>Métrica</span>
              <span className="font-black text-[14px] tracking-widest uppercase" style={{ color: CYAN }}>Referência saudável</span>
            </div>
            {metricas.map(x => (
              <div key={x.m} className="grid px-4 py-2.5 items-center"
                style={{ gridTemplateColumns: '1fr auto', background: '#0f1018', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-white/85 text-[17px]">{x.m}</span>
                <span className="font-black text-[19px]" style={{ color: CYAN }}>{x.r}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}
            className="rounded-xl px-5 py-3" style={{ background: PUR + '12', border: `1px solid ${PUR}40` }}>
            <span className="text-white/88 text-[17px] leading-snug">
              Acompanhe só o que importa: <b>CPL</b>, taxa de conversão, CTR e — o número que decide tudo —
              <b style={{ color: '#d8b4fe' }}> quantos leads viraram contrato</b>.
            </span>
          </motion.div>
        </div>
      </div>

      <BotaoWhats pergunta="GTM, GA4, tag de conversão… virou grego?"
        resposta="Essa é a parte mais técnica de todas. Deixa com a gente." />
      <Rodape pagina="08" />
    </Tela>
  )
}

// ── 09 · PASSO 7 · OTIMIZAR ────────────────────────────────────────────────────
function P7() {
  return (
    <Tela>
      <Passo n={7} titulo="Otimizar: a rotina que separa amadora de profissional"
        sub="Campanha não é forno: você não liga e vai embora. É fogão — precisa de mão o tempo todo." />

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {[
          { t: 'Toda semana', cor: G, itens: ['Termos de pesquisa → negativar lixo', 'Pausar palavras sem conversão', 'Ajustar lances por dispositivo e horário'] },
          { t: 'Todo mês',    cor: CYAN, itens: ['Testar 2 novos títulos', 'Revisar CPL por grupo', 'Realocar orçamento para o que converte', 'Analisar concorrência (Leilão)'] },
        ].map((b, i) => (
          <motion.div key={b.t}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.1 }}
            className="rounded-2xl px-6 py-4 flex flex-col justify-center gap-2.5"
            style={{ background: b.cor + '0d', border: `1px solid ${b.cor}38` }}>
            <div className="font-black text-[16px] tracking-widest uppercase" style={{ color: b.cor }}>{b.t}</div>
            {b.itens.map(x => (
              <div key={x} className="flex items-start gap-3">
                <span className="font-black text-lg flex-shrink-0" style={{ color: b.cor }}>›</span>
                <span className="text-white/85 text-[18px] leading-snug">{x}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex-shrink-0 grid grid-cols-2 gap-3">
        <div className="rounded-xl px-5 py-3 flex items-start gap-3"
          style={{ background: GOLD + '0d', border: `1px solid ${GOLD}38` }}>
          <span className="text-xl flex-shrink-0">⏳</span>
          <span className="text-white/85 text-[16px] leading-snug">
            <b style={{ color: GOLD }}>Paciência técnica:</b> não mexa em nada nos primeiros 14 dias.
            O algoritmo está aprendendo. Alterar lance todo dia é como abrir o forno a cada 2 minutos:
            o bolo não cresce.
          </span>
        </div>
        <div className="rounded-xl px-5 py-3 flex items-start gap-3"
          style={{ background: RED + '0d', border: `1px solid ${RED}38` }}>
          <span className="text-xl flex-shrink-0">🚫</span>
          <span className="text-white/85 text-[16px] leading-snug">
            <b style={{ color: RED }}>O erro clássico:</b> pausar a campanha porque “não deu resultado em 5 dias”.
            O ciclo de decisão de um cliente jurídico costuma levar de 7 a 30 dias.
          </span>
        </div>
      </motion.div>

      <BotaoWhats pergunta="Não tem tempo de fazer essa rotina toda semana?"
        resposta="É exatamente isso que fazemos: gestão contínua com relatório claro." />
      <Rodape pagina="09" />
    </Tela>
  )
}

// ── 10 · O ATALHO ──────────────────────────────────────────────────────────────
function Atalho() {
  return (
    <div className="h-full flex flex-col justify-center relative overflow-hidden px-14 pt-7 pb-12 gap-5"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 60%, ${BLUE} 100%)` }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
        <div className="font-black text-[13px] tracking-widest uppercase mb-2" style={{ color: G }}>O atalho</div>
        <h2 className="font-black text-white leading-[0.95]" style={{ fontSize: '3.6rem', letterSpacing: '-2px' }}>
          Você pode fazer tudo isso sozinha.<br />
          <span style={{ color: G }}>Ou pode fazer o que só você sabe fazer.</span>
        </h2>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-white/80 text-[21px] leading-snug flex-shrink-0" style={{ maxWidth: 940 }}>
        <b className="text-white">Advogar.</b> Enquanto a TráfegOn cuida da estrutura, das palavras-chave,
        dos anúncios, das conversões e da otimização semanal — com relatório claro e conformidade
        com o Provimento 205.
      </motion.p>

      <motion.a href={WHATS_URL} target="_blank" rel="noreferrer"
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
        className="flex-shrink-0 self-start rounded-2xl px-9 py-4 flex items-center gap-4 no-underline"
        style={{ background: G, boxShadow: `0 12px 36px ${G}45` }}>
        <span className="text-3xl">💬</span>
        <span className="flex flex-col leading-none">
          <span className="font-black text-[24px]" style={{ color: DARK }}>Clique aqui para falar conosco</span>
          <span className="font-bold text-[16px] mt-1.5" style={{ color: DARK, opacity: 0.65 }}>
            wa.me/5548996834253 · sem robô, sem formulário
          </span>
        </span>
      </motion.a>

      <div className="absolute inset-x-0 flex items-center justify-between px-14 z-10" style={{ bottom: 14 }}>
        <span className="font-black text-[15px]" style={{ color: G, opacity: 0.85 }}>@trafegonjuridico</span>
        <span className="font-black text-[13px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
          TráfegOn · Google Ads para advogadas
        </span>
      </div>
    </div>
  )
}

export const BONUS_GADS_SLIDES = [
  { id: 'bg01', label: 'Capa',                    C: Capa },
  { id: 'bg02', label: 'Antes de começar',        C: Antes },
  { id: 'bg03', label: '1 · Onde aparecer',       C: P1 },
  { id: 'bg04', label: '2 · Estrutura da conta',  C: P2 },
  { id: 'bg05', label: '3 · Palavras-chave',      C: P3 },
  { id: 'bg06', label: '4 · Anúncios',            C: P4 },
  { id: 'bg07', label: '5 · Página de destino',   C: P5 },
  { id: 'bg08', label: '6 · Conversões',          C: P6 },
  { id: 'bg09', label: '7 · Otimizar',            C: P7 },
  { id: 'bg10', label: 'O atalho',                C: Atalho },
]
