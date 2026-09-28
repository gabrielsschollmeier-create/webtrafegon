// Treinamento comercial jurídico — "Como transformar uma conversa em consulta agendada"
// Réplica fiel do PDF (_agencia/treinamentos/treinamento-comercial-juridico.pdf).
// Palco de 1280×720, mesma paleta e tipografia do arquivo impresso.

const T = {
  bg: '#edf0f7', surface: '#ffffff', surface2: '#eceef8', border: '#e0e3f0',
  dark: '#12141e', green: '#6eda2c', orange: '#ea8a29',
  text: '#111827', text2: '#3d4575', muted: '#7680a8',
  disp: "'Nunito','Varela Round','Trebuchet MS',sans-serif",
  body: "'Inter','Segoe UI',Arial,sans-serif",
}
const CTA_URL = 'https://trafegon.com.br/marketing-juridico'
const CTA_TXT = 'trafegon.com.br/marketing-juridico'

function Logo({ onDark }) {
  return (
    <svg viewBox="0 0 320 100" fill="none" style={{ height: 19, width: 'auto', display: 'block' }}>
      <text x="0" y="72" fontFamily={T.disp} fontSize="68" fontWeight="900"
        fill={onDark ? '#ffffff' : '#1c1f35'} letterSpacing="-3">tráfeg</text>
      <rect x="212" y="8" width="108" height="80" rx="14" fill="#6ED42A" />
      <text x="266" y="72" fontFamily={T.disp} fontSize="62" fontWeight="900"
        fill={onDark ? '#12141e' : '#ffffff'} textAnchor="middle" letterSpacing="-2">on</text>
    </svg>
  )
}

function Ft({ n, onDark }) {
  return (
    <footer style={{
      flex: '0 0 auto', height: 56, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', borderTop: `1px solid ${onDark ? '#2a2e40' : T.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Logo onDark={onDark} />
        <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10.5, color: onDark ? '#7b83a3' : T.muted, textDecoration: 'none', letterSpacing: '.02em' }}>
          {CTA_TXT}
        </a>
      </div>
      <div style={{ fontFamily: T.disp, fontSize: 11.5, fontWeight: 800, color: onDark ? '#7b83a3' : T.muted }}>
        {String(n).padStart(2, '0')} / 21
      </div>
    </footer>
  )
}

function Slide({ n, part, kicker, h2, lead, children, onDark }) {
  return (
    <div style={{
      width: '100%', height: '100%', padding: '52px 84px 0',
      background: onDark ? T.dark : T.bg, display: 'flex', flexDirection: 'column',
      fontFamily: T.body, color: T.text, boxSizing: 'border-box',
    }}>
      {(part || kicker) && (
        <div style={{
          fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase',
          color: onDark ? '#7b83a3' : T.muted, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 9,
        }}>
          {part && <b style={{
            background: onDark ? T.green : T.dark, color: onDark ? T.dark : '#fff',
            fontWeight: 800, padding: '3px 9px', borderRadius: 5, letterSpacing: '.1em',
          }}>{part}</b>}
          {kicker}
        </div>
      )}
      {h2 && <h2 style={{
        fontFamily: T.disp, fontSize: 37, fontWeight: 900, lineHeight: 1.1,
        letterSpacing: '-.9px', color: onDark ? '#fff' : T.dark, maxWidth: 1000, margin: 0,
      }}>{h2}</h2>}
      {lead && <p style={{
        fontSize: 15.5, lineHeight: 1.5, color: onDark ? '#b9c0d8' : T.text2,
        maxWidth: 930, marginTop: 12, margin: '12px 0 0',
      }}>{lead}</p>}
      <div style={{
        flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column',
        gap: 13, padding: '20px 0 30px',
      }}>
        {children}
      </div>
      <Ft n={n} onDark={onDark} />
    </div>
  )
}

const grid = (cols, extra = {}) => ({ display: 'grid', gap: 14, gridTemplateColumns: `repeat(${cols},1fr)`, ...extra })

function Card({ children, flat, style }) {
  return <div style={{
    background: flat ? T.surface2 : T.surface,
    border: `1px solid ${flat ? 'transparent' : T.border}`,
    borderRadius: 13, padding: '17px 19px', ...style,
  }}>{children}</div>
}
const Tag = ({ children, tone }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
    color: tone === 'g' ? '#3f8f18' : tone === 'o' ? T.orange : tone === 'r' ? '#d94a4a' : T.muted,
    marginBottom: 8,
  }}>{children}</div>
)
const Ct = ({ children }) => (
  <div style={{ fontFamily: T.disp, fontSize: 17, fontWeight: 800, color: T.dark, lineHeight: 1.25, marginBottom: 7 }}>{children}</div>
)
const Cx = ({ children, style }) => (
  <div style={{ fontSize: 13, lineHeight: 1.5, color: T.text2, ...style }}>{children}</div>
)
const Li = ({ children, tone }) => (
  <li style={{ fontSize: 12.8, lineHeight: 1.45, color: T.text2, paddingLeft: 15, position: 'relative', marginBottom: 6, listStyle: 'none' }}>
    <span style={{
      position: 'absolute', left: 0, top: 7, width: 6, height: 6, borderRadius: '50%',
      background: tone === 'no' ? '#d94a4a' : T.green,
    }} />
    {children}
  </li>
)
const Q = ({ children, tone, style }) => (
  <div style={{
    fontSize: 13, lineHeight: 1.5, color: tone === 'm' ? T.muted : T.dark, fontStyle: 'italic',
    paddingLeft: 12, borderLeft: `3px solid ${tone === 'g' ? T.green : T.border}`, marginTop: 10, ...style,
  }}>{children}</div>
)
const Note = ({ children }) => (
  <div style={{
    background: T.surface2, borderLeft: `4px solid ${T.green}`, borderRadius: '0 9px 9px 0',
    padding: '12px 16px', fontSize: 12.8, lineHeight: 1.45, color: T.text2,
  }}>{children}</div>
)
const B = ({ children }) => <b style={{ color: T.orange, fontWeight: 700 }}>{children}</b>
const Cta = ({ children }) => (
  <div style={{
    background: T.dark, borderRadius: 11, padding: '13px 18px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
  }}>
    <div style={{ fontSize: 13, lineHeight: 1.4, color: '#e6e9f5', fontWeight: 500 }}>{children}</div>
    <a href={CTA_URL} target="_blank" rel="noopener noreferrer" style={{
      fontFamily: T.disp, fontSize: 13, fontWeight: 800, color: T.dark, background: T.green,
      padding: '8px 15px', borderRadius: 7, whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block',
    }}>{CTA_TXT}</a>
  </div>
)
const W = ({ children }) => <b style={{ color: '#fff', fontWeight: 700 }}>{children}</b>

const th = { fontSize: 10, fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase', color: T.muted, textAlign: 'left', padding: '0 12px 7px', borderBottom: `1px solid ${T.border}` }
const td = { fontSize: 12.6, lineHeight: 1.4, color: T.text2, padding: '8px 12px', borderBottom: `1px solid ${T.border}`, verticalAlign: 'top' }
const tdK = { ...td, color: T.dark, fontWeight: 600, whiteSpace: 'nowrap' }
const tdI = { ...td, color: T.muted, fontStyle: 'italic', whiteSpace: 'nowrap' }

// ─────────────────────────────────────────────────────────── slides

function S01() {
  return (
    <div style={{ width: '100%', height: '100%', padding: '52px 84px 0', background: T.dark, display: 'flex', flexDirection: 'column', fontFamily: T.body, boxSizing: 'border-box' }}>
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <h1 style={{ fontFamily: T.disp, fontSize: 62, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-2px', color: '#fff', maxWidth: 940, margin: 0 }}>
          Como transformar uma conversa em consulta agendada
        </h1>
        <p style={{ fontSize: 17, color: '#b9c0d8', marginTop: 20, maxWidth: 720, lineHeight: 1.5 }}>
          Treinamento de atendimento comercial para escritórios de Direito de Família.
        </p>
        <div style={{ display: 'flex', gap: 28, marginTop: 34, flexWrap: 'wrap' }}>
          {[['Duração', '90 minutos'], ['Para', 'quem atende e quem coordena'], ['Método', 'SPIN Selling']].map(([k, v]) => (
            <div key={k} style={{ fontSize: 12.5, color: '#8f98b8' }}>
              <b style={{ color: T.green, fontWeight: 700 }}>{k}</b> · {v}
            </div>
          ))}
        </div>
      </div>
      <Ft n={1} onDark />
    </div>
  )
}

function S02() {
  const cols = [
    ['Parte 1', 'Entender o jogo', 'Por que vender serviço jurídico é diferente de vender qualquer outra coisa.',
      ['03 · O cliente não sabe avaliar um advogado', '04 · São duas vendas, não uma']],
    ['Parte 2', 'A conversa', 'Como conduzir do primeiro “oi” até a consulta marcada.',
      ['05 · As quatro perguntas', '06 · De onde vem o método', '07 · O que já está pronto no roteiro', '08 · A pergunta que falta', '09 · Frases prontas, por tipo de caso', '10 · A última pergunta antes do preço', '11 · Marcar a consulta', '12 · As mensagens que já temos', '13 · O texto da consulta']],
    ['Parte 3', 'O processo', 'O que precisa estar definido para o método funcionar sempre.',
      ['14 · Tempo de resposta e cobertura', '15 · Régua de preço e alçada', '16 · As etapas do funil', '17 · A segunda venda: pós-consulta', '18 · O registro mínimo no CRM', '19 · O que a OAB permite', '20 · O que levar daqui']],
  ]
  return (
    <Slide n={2} part="SUMÁRIO" kicker="O que vamos ver" h2="Três partes.">
      <div style={{ ...grid(3), flex: 1, minHeight: 0 }}>
        {cols.map(([tag, tit, sub, its]) => (
          <Card key={tag}>
            <Tag tone="g">{tag}</Tag>
            <Ct>{tit}</Ct>
            <Cx style={{ marginBottom: 12 }}>{sub}</Cx>
            <ul style={{ margin: 0, padding: 0 }}>{its.map(i => <Li key={i}>{i}</Li>)}</ul>
          </Card>
        ))}
      </div>
    </Slide>
  )
}

function S03() {
  const cs = [
    ['Ele decide pela confiança', <>Sem saber avaliar a técnica, ele avalia o atendimento. A conversa não vem antes da venda — a conversa <b>é</b> a venda.</>],
    ['O preço sozinho parece caro', 'Se ele não entende o que está em jogo, compara o valor com zero. Parece caro porque não há nada do outro lado da balança.'],
    ['Responder tudo encerra a venda', 'Quando a dúvida é totalmente respondida no WhatsApp, ele já conseguiu o que queria. A consulta perde o motivo de existir.'],
  ]
  return (
    <Slide n={3} part="PARTE 1" kicker="Entender o jogo"
      h2="O cliente não sabe avaliar um advogado."
      lead="Ele não tem como julgar se a petição é boa, se o acordo poderia ser melhor ou se a estratégia é a certa. Nem antes de contratar, nem depois.">
      <div style={{ ...grid(3), flex: 1, minHeight: 0 }}>
        {cs.map(([t, x]) => (
          <Card key={t}><Tag tone="o">Então</Tag><Ct>{t}</Ct><Cx>{x}</Cx></Card>
        ))}
      </div>
    </Slide>
  )
}

function S04() {
  const fbox = (n, d) => (
    <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 11, padding: '13px 15px', textAlign: 'center' }}>
      <div style={{ fontFamily: T.disp, fontSize: 19, fontWeight: 900, color: T.dark }}>{n}</div>
      <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3 }}>{d}</div>
    </div>
  )
  const arrow = l => (
    <div style={{ flex: '0 0 auto', textAlign: 'center', fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', color: T.orange, textTransform: 'uppercase' }}>
      {l}<span style={{ display: 'block', fontSize: 17, color: T.border, lineHeight: 1 }}>›</span>
    </div>
  )
  return (
    <Slide n={4} part="PARTE 1" kicker="Entender o jogo"
      h2="São duas vendas, não uma."
      lead="Entre o primeiro “oi” e o contrato existe uma etapa no meio: a consulta. Ela é o produto que se vende no WhatsApp.">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        {fbox('Lead', 'alguém mandou mensagem')}
        {arrow('1ª venda')}
        {fbox('Consulta', 'paga e agendada')}
        {arrow('2ª venda')}
        {fbox('Contrato', 'honorários assinados')}
      </div>
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card>
          <Tag tone="g">1ª venda · no WhatsApp</Tag><Ct>Vender a consulta</Ct>
          <Cx>Quem conduz é quem atende. O objetivo é um só: uma data marcada e o Pix confirmado. Nada além disso.</Cx>
        </Card>
        <Card>
          <Tag tone="g">2ª venda · na consulta e nos dias seguintes</Tag><Ct>Vender o contrato</Ct>
          <Cx>Quem conduz é a advogada, com os documentos na mesa. É aí que se fala de honorários, estratégia e prazo.</Cx>
        </Card>
      </div>
      <Note>Isso tira um peso de quem atende: você não precisa convencer ninguém a contratar o escritório. Precisa só <B>levar a pessoa até a consulta</B>.</Note>
      <Cta><W>Antes da primeira venda existe o primeiro contato.</W> Captação no Google para quem já está procurando advogado de família na sua cidade.</Cta>
    </Slide>
  )
}

function S05() {
  const rows = [
    ['S', 'Situação', 'Entender os fatos.', '“Vocês eram casados no papel ou moravam juntos?”', false],
    ['P', 'Problema', 'Entender onde dói.', '“Existe algum problema na convivência com as crianças?”', false],
    ['I', 'Implicação', 'Mostrar o que acontece se ficar como está.', '“Enquanto não há partilha, a dívida segue no nome dos dois.”', true],
    ['N', 'Necessidade', 'Fazer o cliente dizer o que mais importa.', '“Nisso tudo, o que é mais importante você garantir?”', true],
  ]
  return (
    <Slide n={5} part="PARTE 2" kicker="A conversa" h2="Quatro perguntas, nessa ordem.">
      <div style={{ flex: 1, minHeight: 0 }}>
        {rows.map(([l, w1, w2, w3, on]) => (
          <div key={l} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', padding: '15px 0' }}>
            <div style={{
              flex: '0 0 auto', width: 34, height: 34, borderRadius: 9,
              background: on ? T.green : T.dark, color: on ? T.dark : T.green,
              fontFamily: T.disp, fontSize: 18, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{l}</div>
            <div>
              <div style={{ fontFamily: T.disp, fontSize: 15.5, fontWeight: 800, color: T.dark }}>{w1}</div>
              <div style={{ fontSize: 12.8, color: T.text2, marginTop: 2 }}>{w2}</div>
              <div style={{ fontSize: 12.8, color: T.dark, fontStyle: 'italic', marginTop: 4 }}>{w3}</div>
            </div>
          </div>
        ))}
      </div>
      <Note>As duas primeiras a gente já faz bem. <B>As duas últimas são o assunto deste treinamento.</B></Note>
    </Slide>
  )
}

function S06() {
  const stats = [['35 mil', 'conversas de venda acompanhadas ao vivo'], ['23', 'países, em setores muito diferentes'], ['12', 'anos de pesquisa, com Xerox, IBM e Motorola']]
  return (
    <Slide n={6} part="PARTE 2" kicker="A conversa · De onde vem"
      h2="Não é opinião. É pesquisa."
      lead="O método foi criado por Neil Rackham, psicólogo inglês, depois de acompanhar vendedores em campo por doze anos e anotar, uma a uma, as falas de cada conversa.">
      <div style={grid(3)}>
        {stats.map(([v, l]) => (
          <Card key={v} flat style={{ textAlign: 'center', padding: '4px 0' }}>
            <div style={{ fontFamily: T.disp, fontSize: 42, fontWeight: 900, color: T.dark, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 7, lineHeight: 1.35 }}>{l}</div>
          </Card>
        ))}
      </div>
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card><Tag tone="o">Descoberta 1</Tag><Cx>Quanto mais técnica de pressão o vendedor usava para fechar, <b>pior</b> era o resultado em vendas de valor alto.</Cx></Card>
        <Card><Tag tone="o">Descoberta 2</Tag><Cx>Os melhores não respondiam melhor às objeções. Eles <b>recebiam menos objeções</b> — porque construíam valor antes.</Cx></Card>
      </div>
    </Slide>
  )
}

function S07() {
  const cols = [
    ['Divórcio', ['Casados no papel ou união estável?', 'Qual o regime de bens?', 'Que bens foram comprados juntos?', 'Algum bem está só no nome de um?', 'Existem dívidas?']],
    ['Guarda', ['Quantos filhos e que idade?', 'Com quem a criança mora hoje?', 'O outro pai participa da rotina?', 'Já existe acordo ou decisão?', 'Há impedimento de visitas?']],
    ['Pensão', ['É paga pensão hoje?', 'Foi na justiça ou no acordo verbal?', 'Está sendo paga direito?', 'Quem paga tem renda fixa?', 'Mudou algo na situação financeira?']],
  ]
  return (
    <Slide n={7} part="PARTE 2" kicker="A conversa · Situação e Problema"
      h2="O que já está pronto no nosso roteiro."
      lead="Os roteiros de divórcio, guarda e pensão já cobrem as duas primeiras perguntas. Isso continua igual.">
      <div style={{ ...grid(3), flex: 1, minHeight: 0 }}>
        {cols.map(([t, its]) => (
          <Card key={t}><Tag tone="g">{t}</Tag><ul style={{ margin: 0, padding: 0 }}>{its.map(i => <Li key={i}>{i}</Li>)}</ul></Card>
        ))}
      </div>
      <Note>E as três que valem para todo caso: <B>já existe processo?</B> · <B>tem algum prazo correndo?</B> · <B>você tem documentos?</B></Note>
    </Slide>
  )
}

function S08() {
  return (
    <Slide n={8} part="PARTE 2" kicker="A conversa · Implicação"
      h2="Depois de entender o caso, a gente vai direto para o preço."
      lead="Falta um passo no meio: mostrar ao cliente o que acontece se ele não fizer nada. É esse passo que faz a consulta valer a pena.">
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card>
          <Tag>Como falamos hoje</Tag>
          <Q tone="m" style={{ marginTop: 0 }}>“Alguns direitos podem se perder com o tempo.”</Q>
          <Q tone="m">“Quanto mais demora, mais complicado fica.”</Q>
          <Cx style={{ marginTop: 12 }}>Está certo. Mas é vago demais — o cliente não consegue medir o que está em jogo.</Cx>
        </Card>
        <Card>
          <Tag tone="g">Como funciona melhor</Tag>
          <Q tone="g" style={{ marginTop: 0 }}>“Enquanto a partilha não sai, o financiamento continua no nome dos dois. Se ele atrasar, o seu nome também suja.”</Q>
          <Cx style={{ marginTop: 12 }}><b>Prazo, valor ou consequência concreta.</b> Sempre uma dessas três coisas.</Cx>
        </Card>
      </div>
    </Slide>
  )
}

function S09() {
  const cols = [
    ['Divórcio e partilha', ['“Enquanto a partilha não sai, o financiamento segue no nome dos dois. Se ele atrasar, o seu nome também é afetado.”', '“Sem o divórcio averbado, o regime de bens continua valendo. O que você comprar de hoje em diante pode entrar na partilha.”', '“Se ele passar um bem para outra pessoa antes da partilha, recuperar depois vira um processo à parte.”']],
    ['Guarda e convivência', ['“A rotina que se forma agora costuma pesar na decisão do juiz. Há quanto tempo está desse jeito?”', '“Se hoje ela impede a visita e isso não fica registrado em lugar nenhum, provar depois fica bem mais difícil.”']],
    ['Pensão alimentícia', ['“Acordo de boca não vale como título. Se ele parar de pagar, não tem o que cobrar — precisa entrar com ação do zero.”', '“A pensão só conta a partir do processo. Cada mês parado é um mês que não volta.”']],
  ]
  return (
    <Slide n={9} part="PARTE 2" kicker="A conversa · Implicação na prática" h2="Frases prontas, por tipo de caso.">
      <div style={{ ...grid(3), flex: 1, minHeight: 0 }}>
        {cols.map(([t, qs]) => (
          <Card key={t}><Tag tone="g">{t}</Tag>
            {qs.map((q, i) => <Q key={q} tone="g" style={i === 0 ? { marginTop: 0 } : undefined}>{q}</Q>)}
          </Card>
        ))}
      </div>
      <Note>Só uma regra: <B>tem que ser verdade e não pode prometer resultado.</B> Nunca diga o que o cliente vai receber.</Note>
    </Slide>
  )
}

function S10() {
  const steps = ['Entender o caso', 'Achar onde dói', 'Mostrar o que acontece se não fizer nada', 'Deixar ele dizer o que mais importa', 'Só agora falar o valor']
  return (
    <Slide n={10} part="PARTE 2" kicker="A conversa · Necessidade"
      h2="Deixe o cliente dizer que ele quer resolver."
      lead="Enquanto nós dizemos que a consulta é importante, é argumento de vendedor. Quando ele diz que precisa resolver, virou decisão dele.">
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card>
          <Tag tone="g">Duas perguntas · servem para qualquer caso</Tag>
          <Q tone="g" style={{ marginTop: 0 }}>“Nisso tudo, o que é mais importante você garantir?”</Q>
          <Q tone="g">“O que te preocupa mais hoje: o valor, ou continuar do jeito que está?”
            <div style={{ fontStyle: 'normal', color: T.muted, fontSize: 12 }}>— só depois que ele perguntar o preço</div>
          </Q>
        </Card>
        <Card>
          <Tag>A ordem certa</Tag>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '7px 0' }}>
              <div style={{ flex: '0 0 auto', width: 21, height: 21, borderRadius: 6, background: T.dark, color: '#fff', fontFamily: T.disp, fontSize: 11.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.dark, lineHeight: 1.35 }}>{s}</span>
            </div>
          ))}
        </Card>
      </div>
      <Note>Falar o preço <B>antes do passo 3</B> gera objeção. Falar <B>depois do passo 4</B> gera agendamento.</Note>
    </Slide>
  )
}

function S11() {
  return (
    <Slide n={11} part="PARTE 2" kicker="A conversa · Fechamento" h2="Ofereça duas datas. Nunca pergunte “quando é melhor?”.">
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card>
          <Tag>Deixa a conversa em aberto</Tag>
          <Q tone="m" style={{ marginTop: 0 }}>“Me informa quais dias e horários funcionam melhor pra você.”</Q>
          <Cx style={{ marginTop: 11 }}>O cliente precisa olhar a agenda dele, decidir e voltar. Muitas vezes não volta.</Cx>
        </Card>
        <Card>
          <Tag tone="g">Fecha a conversa</Tag>
          <Q tone="g" style={{ marginTop: 0 }}>“Consigo dois horários essa semana: quinta às 14h30 ou sexta às 11h. Qual fica melhor?”</Q>
          <Cx style={{ marginTop: 11 }}>Ele escolhe entre <b>dois sins</b>.</Cx>
        </Card>
        <Card>
          <Tag tone="g">Logo depois, sem pausa</Tag>
          <Q tone="g" style={{ marginTop: 0 }}>“Combinado, vou reservar quinta às 14h30. O horário fica confirmado com o Pix — já te mando a chave.”</Q>
        </Card>
        <Card>
          <Tag tone="g">Se ele pedir o preço logo no começo</Tag>
          <Q tone="g" style={{ marginTop: 0 }}>“Te falo sim. Só preciso de dois minutos entendendo seu caso antes, porque o atendimento muda conforme a situação. Posso te fazer três perguntas?”</Q>
        </Card>
      </div>
      <Note>A regra que vale a partir de amanhã: <B>nenhuma conversa termina em “fico à disposição”.</B></Note>
    </Slide>
  )
}

function S12() {
  const rows = [
    ['Chegou no horário comercial', '“Seja bem-vindo(a)! Pode me contar com mais detalhes como podemos te ajudar? Se preferir, fique à vontade para enviar um áudio.”'],
    ['Chegou à noite ou no fim de semana', '“Nosso expediente é de segunda a sexta, mas para adiantar já vou deixar algumas perguntas...” — e as perguntas vão junto'],
    ['Vamos demorar a responder', '“Estou entrando em um atendimento e já te retorno. Mas pode ir me mandando mensagem.”'],
    ['Não respondeu no mesmo dia', '“Vi que você entrou em contato, mas não conseguimos dar continuidade. Ainda precisa de ajuda com seu caso?”'],
    ['A conversa esfriou no meio', '“Estávamos conversando sobre sua situação e percebi que não tivemos continuidade. Posso te ajudar de alguma forma?”'],
    ['Terceiro contato', '“Caso ainda queira resolver, recomendo conversarmos o quanto antes, pois alguns direitos podem depender do tempo.”'],
    ['Quarto contato', 'Ligação. Se não atender, mensagem avisando que o atendimento será encerrado'],
    ['Reativação, 30 dias depois', '“Você entrou em contato há um tempo. Estou retomando para saber como ficou sua situação.”'],
  ]
  return (
    <Slide n={12} part="PARTE 2" kicker="A conversa · Nossas mensagens"
      h2="A cadência que já está pronta."
      lead="Oito mensagens padrão, uma para cada momento. Ninguém precisa escrever do zero — precisa saber qual usar e quando.">
      <Card style={{ flex: 1, minHeight: 0, padding: '15px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          <tr><th style={{ ...th, width: 230 }}>Momento</th><th style={th}>A mensagem que já existe</th></tr>
          {rows.map(([k, v]) => <tr key={k}><td style={tdK}>{k}</td><td style={td}>{v}</td></tr>)}
        </tbody></table>
      </Card>
    </Slide>
  )
}

function S13() {
  return (
    <Slide n={13} part="PARTE 2" kicker="A conversa · O texto da consulta" h2="O nosso texto de consulta pula justamente a implicação.">
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card>
          <Tag>Como está hoje · card de Direito de Família</Tag>
          <Cx>“No Direito de Família, cada caso possui particularidades que exigem uma análise cuidadosa do contexto, documentos e histórico envolvido.</Cx>
          <Cx style={{ marginTop: 7 }}>Por isso, para te orientar com segurança, realizamos uma consulta técnica, na qual avaliamos o seu caso e indicamos as melhores medidas a serem adotadas.</Cx>
          <Cx style={{ marginTop: 7 }}>O valor da consulta é de ___ e inclui a análise das informações apresentadas, eventual leitura do processo e orientação jurídica sobre os próximos passos.”</Cx>
        </Card>
        <Card>
          <Tag tone="g">Como fica · a mesma mensagem, com dois acréscimos</Tag>
          <Q tone="g" style={{ marginTop: 0 }}>“Pelo que você me contou, o financiamento ainda está no nome dos dois — e enquanto não houver partilha, qualquer atraso dele afeta o seu nome também.”</Q>
          <Cx style={{ marginTop: 10 }}>“Para te orientar com segurança nisso, fazemos uma consulta técnica: analisamos os documentos e definimos as medidas a adotar. O valor é de R$ ___, abatido do contrato caso você siga com o escritório.</Cx>
          <Q tone="g">“Consigo dois horários essa semana: quinta às 14h30 ou sexta às 11h. Qual fica melhor?”</Q>
        </Card>
      </div>
      <Note>Duas frases a mais. Uma <B>antes do preço</B> — a implicação do caso dele. Outra <B>depois</B> — as duas datas. O texto do meio continua o mesmo.</Note>
    </Slide>
  )
}

function S14() {
  const rows = [
    ['Horário comercial, dias úteis', 'Até 10 minutos — nem que seja “recebi, já te respondo direito”'],
    ['Início da noite, até as 22h', 'Automática em 1 minuto, já com as perguntas adiantadas'],
    ['Madrugada e fim de semana', 'Automática na hora · resposta humana até as 9h do dia útil seguinte'],
  ]
  return (
    <Slide n={14} part="PARTE 3" kicker="O processo · Tempo de resposta"
      h2="Quem procura advogado de família não está falando só com você."
      lead="Ele manda a mesma mensagem para três ou quatro escritórios. Quem responde primeiro conduz a conversa — os outros chegam depois, para alguém que já está sendo atendido.">
      <Card style={{ flex: 1, minHeight: 0, padding: '15px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          <tr><th style={{ ...th, width: 250 }}>Faixa de horário</th><th style={th}>Meta de resposta</th><th style={{ ...th, width: 130 }}>Quem responde</th></tr>
          {rows.map(([k, v]) => <tr key={k}><td style={tdK}>{k}</td><td style={td}>{v}</td><td style={tdI}>a definir</td></tr>)}
        </tbody></table>
      </Card>
      <Cta><W>Essa régua não se sustenta no esforço.</W> Automação de primeira resposta, distribuição e cobrança de SLA a gente configura com você.</Cta>
    </Slide>
  )
}

function S15() {
  const rows = [
    ['Quem atende', 'Aplica a tabela. Pode oferecer parcelamento. Não altera valor.'],
    ['Coordenação', 'Ajusta formato e prazo de pagamento'],
    ['Sócia', 'Entrada reduzida, percentual de êxito, casos de patrimônio alto sem caixa hoje'],
  ]
  return (
    <Slide n={15} part="PARTE 3" kicker="O processo · Preço"
      h2="Uma pergunta decide o valor da consulta."
      lead="Antes de falar qualquer número, responda internamente: existe patrimônio, processo em curso ou conflito entre as partes?">
      <div style={grid(2)}>
        <Card><Tag>Não · consulta simples</Tag><Cx>Divórcio ou dissolução consensual sem bens · dúvida pontual · documento simples · orientação sobre um único ponto</Cx></Card>
        <Card><Tag tone="g">Sim · consulta estratégica</Tag><Cx>Litígio · inventário · patrimônio relevante · guarda disputada · processo já em curso · advogado do outro lado</Cx></Card>
      </div>
      <Card style={{ flex: 1, minHeight: 0, padding: '15px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          <tr><th style={{ ...th, width: 240 }}>Quem pode negociar o quê</th><th style={th} /></tr>
          {rows.map(([k, v]) => <tr key={k}><td style={tdK}>{k}</td><td style={td}>{v}</td></tr>)}
        </tbody></table>
      </Card>
      <Note>Duas regras para todos: <B>desconto só quando o cliente pede</B> — nunca oferecido antes. E o valor da consulta é <B>abatido do contrato</B>, sempre.</Note>
    </Slide>
  )
}

function S16() {
  const rows = [
    ['1', 'Lead', <>Mandou mensagem. <b>Sai quando:</b> respondeu à nossa primeira mensagem</>],
    ['2', 'Em atendimento', <>Está conversando. <b>Sai quando:</b> contou o caso e recebeu o valor</>],
    ['3', 'Consulta agendada', <><b>Sai quando:</b> data definida e Pix confirmado — as duas coisas</>],
    ['4', 'Consulta realizada', <>O atendimento aconteceu. <b>Sai quando:</b> a proposta de honorários foi enviada</>],
    ['5', 'Proposta enviada', <><b>Sai quando:</b> o cliente respondeu — sim ou não</>],
    ['6', 'Contrato', <>Assinado e pago. É aqui que a venda termina</>],
    ['×', 'Perdido', <>Sempre <b>com o motivo escrito</b>: preço, prazo, escolheu outro escritório, resolveu sozinho, sumiu</>],
  ]
  return (
    <Slide n={16} part="PARTE 3" kicker="O processo · Funil" h2="Seis etapas — e o que faz sair de cada uma.">
      <Card style={{ flex: 1, minHeight: 0 }}>
        {rows.map(([n, t, d]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '7px 0' }}>
            <div style={{ flex: '0 0 auto', width: 21, height: 21, borderRadius: 6, background: n === '×' ? '#d94a4a' : T.dark, color: '#fff', fontFamily: T.disp, fontSize: 11.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{n}</div>
            <div style={{ display: 'flex', gap: 9, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.dark, lineHeight: 1.35 }}>{t}</span>
              <span style={{ fontSize: 12.4, color: T.text2, lineHeight: 1.4 }}>{d}</span>
            </div>
          </div>
        ))}
      </Card>
      <Note>Sem critério de passagem, todo mundo fica na etapa 1 e o funil não mede nada. <B>E sem registrar a perda com motivo, não dá para saber o que corrigir no mês seguinte.</B></Note>
    </Slide>
  )
}

function S17() {
  const rows = [
    ['No mesmo dia', 'Mensagem curta agradecendo e avisando quando a proposta chega'],
    ['Em até 24 horas', 'Proposta de honorários enviada. Passou de 48h, o cliente esfria'],
    ['2 dias depois', 'Primeiro retorno — volta ao que ele disse na consulta, não ao preço'],
    ['1 semana depois', 'Segundo retorno, trazendo um ponto novo do caso dele'],
    ['15 dias depois', 'Último retorno, com pergunta direta: seguimos ou deixamos para depois?'],
    ['21 dias depois', 'Encerra com porta aberta e registra o motivo no CRM'],
  ]
  return (
    <Slide n={17} part="PARTE 3" kicker="O processo · A segunda venda"
      h2="A consulta acabou. Agora começa a outra venda."
      lead="É a etapa mais esquecida do processo — e a que decide o faturamento. Precisa de dono, prazo e roteiro, igual à primeira.">
      <Card style={{ flex: 1, minHeight: 0, padding: '15px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          <tr><th style={{ ...th, width: 190 }}>Quando</th><th style={th}>O que acontece</th></tr>
          {rows.map(([k, v]) => <tr key={k}><td style={tdK}>{k}</td><td style={td}>{v}</td></tr>)}
        </tbody></table>
      </Card>
      <Note>Quando o cliente diz “vamos fazer sim, como pago?”, isso não é follow-up — <B>é fechamento</B>. Responder em minutos, com o link de pagamento e o próximo passo. Nunca só com uma frase.</Note>
    </Slide>
  )
}

function S18() {
  const cs = [
    ['01', 'Nome real', 'Não o nome que aparece no WhatsApp. Se ele não disse, pergunte.'],
    ['02', 'Origem', 'Google · Instagram · indicação · site. Sem isso não se sabe o que funciona.'],
    ['03', 'Área do caso', 'Divórcio · guarda e pensão · inventário · união estável · patrimonial'],
    ['04', 'Valor estimado', 'Um chute informado vale muito mais do que deixar em zero.'],
    ['05', 'Etapa certa', 'Conforme os critérios do slide anterior. Não deixar tudo em “Lead”.'],
    ['06', 'Responsável', 'Uma pessoa, com nome. Oportunidade sem dono não anda.'],
  ]
  return (
    <Slide n={18} part="PARTE 3" kicker="O processo · CRM"
      h2="Sete campos, ao fim de cada conversa."
      lead="Leva menos de um minuto. É o que permite saber, no fim do mês, de onde vieram os clientes e por que os outros não fecharam.">
      <div style={grid(3)}>
        {cs.map(([n, t, x]) => <Card key={n}><Tag>{n}</Tag><Ct>{t}</Ct><Cx>{x}</Cx></Card>)}
      </div>
      <Note><B>07 · o mais esquecido —</B> Próxima ação, com data. Sempre. Mesmo que seja “ligar dia 12”. E quando perder, marcar como perdido com o motivo — um funil só com oportunidades abertas não ensina nada.</Note>
      <Cta><W>Esse funil e esses sete campos a gente monta direto no seu CRM</W>, com os relatórios que mostram onde o mês travou.</Cta>
    </Slide>
  )
}

function S19() {
  const pode = ['Informar um prazo processual que realmente corre', 'Explicar a consequência jurídica de não agir', 'Dizer a disponibilidade verdadeira da agenda', 'Informar que a consulta é abatida do contrato', 'Dizer que a orientação depende de ver a documentação']
  const nao = ['“Tem outro cliente interessado nesse horário” — escassez inventada', 'Desconto por tempo limitado ou condição relâmpago', '“Você vai receber metade” — promessa de resultado', 'Estimar valor a receber sem ver os documentos', 'Falar mal de outro escritório ou advogado']
  return (
    <Slide n={19} part="PARTE 3" kicker="O processo · Limites"
      h2="O que a OAB permite — e o que não permite."
      lead="O Provimento 205/2021 veda mercantilização, captação de clientela, promessa de resultado e uso de pressão. E a própria pesquisa do método mostra que pressão funciona pior em vendas de valor alto.">
      <div style={{ ...grid(2), flex: 1, minHeight: 0 }}>
        <Card><Tag tone="g">Pode</Tag><ul style={{ margin: 0, padding: 0 }}>{pode.map(i => <Li key={i}>{i}</Li>)}</ul></Card>
        <Card><Tag tone="r">Não pode</Tag><ul style={{ margin: 0, padding: 0 }}>{nao.map(i => <Li key={i} tone="no">{i}</Li>)}</ul></Card>
      </div>
      <Note>A diferença é simples: <B>informar um prazo que existe é legítimo. Inventar pressão não é</B> — e ainda vende menos.</Note>
    </Slide>
  )
}

function S20() {
  const cs = [
    ['01', 'Não entregue a resposta inteira', 'Mostre que entendeu o caso a fundo, mas deixe claro que a orientação depende de ver os documentos.'],
    ['02', 'Diga o que acontece se ele não agir', 'Sempre com prazo, valor ou consequência concreta. E sempre antes de falar o preço.'],
    ['03', 'Termine com duas datas', 'Toda conversa acaba com um horário proposto ou com um retorno marcado no CRM.'],
    ['04', 'O pós-consulta tem dono e prazo', 'Proposta em 24h, três retornos, encerramento em 21 dias. É uma venda separada, não um lembrete.'],
    ['05', 'Registre — inclusive quando perde', 'Sete campos por conversa. E o motivo da perda, sempre. É o que permite melhorar no mês seguinte.'],
  ]
  return (
    <Slide n={20} part="FECHO" kicker="O que levar daqui" h2="Cinco coisas.">
      <div style={{ ...grid(3), flex: 1, minHeight: 0 }}>
        {cs.map(([n, t, x]) => <Card key={n}><Tag tone="g">{n}</Tag><Ct>{t}</Ct><Cx>{x}</Cx></Card>)}
      </div>
    </Slide>
  )
}

function S21() {
  return (
    <div style={{ width: '100%', height: '100%', padding: '52px 84px 0', background: T.dark, display: 'flex', flexDirection: 'column', fontFamily: T.body, boxSizing: 'border-box' }}>
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7b83a3', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 9 }}>
          <b style={{ background: T.green, color: T.dark, fontWeight: 800, padding: '3px 9px', borderRadius: 5, letterSpacing: '.1em' }}>PRÓXIMO PASSO</b>
          Do treinamento para o processo
        </div>
        <h2 style={{ fontFamily: T.disp, fontSize: 46, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-.9px', color: '#fff', maxWidth: 900, margin: 0 }}>
          Treinar a equipe é metade do trabalho.
        </h2>
        <p style={{ fontSize: 16.5, lineHeight: 1.5, color: '#b9c0d8', maxWidth: 780, margin: '12px 0 0' }}>
          A outra metade é ter lead chegando, régua de resposta rodando e funil medindo. Sem isso, o roteiro se perde na correria da semana.
        </p>
        <div style={{ marginTop: 30, background: '#1c2030', border: '1px solid #2f3448', borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28 }}>
          <div>
            <div style={{ fontFamily: T.disp, fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>Marketing jurídico com processo comercial junto</div>
            <div style={{ fontSize: 13.5, color: '#a6aecb', marginTop: 7, lineHeight: 1.5 }}>
              Captação no Google, automação de primeira resposta, funil montado no CRM e o acompanhamento mês a mês do que fechou — e do que não fechou.
            </div>
          </div>
          <a href={CTA_URL} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: T.disp, fontSize: 16, fontWeight: 900, color: T.dark, background: T.green,
            padding: '14px 24px', borderRadius: 9, whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block',
          }}>{CTA_TXT}</a>
        </div>
      </div>
      <Ft n={21} onDark />
    </div>
  )
}

export const TREINAMENTO_JURIDICO_SLIDES = [
  { id: 'tj01', label: 'Capa',                        C: S01 },
  { id: 'tj02', label: 'Sumário',                     C: S02 },
  { id: 'tj03', label: 'Não sabe avaliar',            C: S03 },
  { id: 'tj04', label: 'São duas vendas',             C: S04 },
  { id: 'tj05', label: 'As quatro perguntas',         C: S05 },
  { id: 'tj06', label: 'De onde vem o método',        C: S06 },
  { id: 'tj07', label: 'O que já está pronto',        C: S07 },
  { id: 'tj08', label: 'A pergunta que falta',        C: S08 },
  { id: 'tj09', label: 'Frases prontas',              C: S09 },
  { id: 'tj10', label: 'A última pergunta',           C: S10 },
  { id: 'tj11', label: 'Marcar a consulta',           C: S11 },
  { id: 'tj12', label: 'As mensagens',                C: S12 },
  { id: 'tj13', label: 'O texto da consulta',         C: S13 },
  { id: 'tj14', label: 'Tempo de resposta',           C: S14 },
  { id: 'tj15', label: 'Régua de preço',              C: S15 },
  { id: 'tj16', label: 'As etapas do funil',          C: S16 },
  { id: 'tj17', label: 'A segunda venda',             C: S17 },
  { id: 'tj18', label: 'O registro no CRM',           C: S18 },
  { id: 'tj19', label: 'O que a OAB permite',         C: S19 },
  { id: 'tj20', label: 'O que levar daqui',           C: S20 },
  { id: 'tj21', label: 'Próximo passo',               C: S21 },
]
