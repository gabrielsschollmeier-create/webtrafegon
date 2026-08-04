import { motion } from 'framer-motion'

// ── PALETTE ────────────────────────────────────────────────────────────────────
const G      = '#6eda2c'
const DARK   = '#1a1d2e'
const PUR    = '#7c3aed'
const ORANGE = '#f97316'
const RED    = '#f87171'
const GOLD   = '#f59e0b'
const NAVY   = '#0f2044'
const BLUE   = '#3b82f6'

// ── PRINTS REAIS ───────────────────────────────────────────────────────────────
// Coloque os arquivos em /public/palestra-caf/ e preencha o caminho aqui.
// Enquanto for null, o slide mostra a versão ilustrativa.
const PRINTS = {
  crmCurva:  null,  // ex: '/palestra-caf/curva-fechamentos-carol.png'
  crmFunil:  null,  // ex: '/palestra-caf/funil-carol.png'
  landing:   null,  // ex: '/palestra-caf/lp-carol.png'
  termos:    null,  // ex: '/palestra-caf/termos-pesquisa.png'
}

// ══════════════════════════════════════════════════════════════════════════════
//   ROTEIRO DO PALESTRANTE
// ══════════════════════════════════════════════════════════════════════════════

const ROTEIRO = {
  s1: {
    min: '3–5', tag: 'Bloco I · Por que você ainda não começou',
    falas: [
      '"No Brasil existem 1.609.507 advogadas e advogados inscritos. Quantos você conhece que anunciam?"',
      'Pausa. Não responda. Passe o slide.',
      '✍️ AUTORAL — uma frase, sem currículo: "eu toco a TráfegOn, a gente roda tráfego para escritórios de advocacia. E a minha sócia, a Carol, é advogada e tem escritório próprio. Tudo o que eu vou mostrar hoje passa pela nossa mão todo dia."',
      '⚠️ Não conte a história da Carol inteira agora. Só planta. A prova vem no minuto 31, com a tela aberta.',
    ],
    exec: [
      'Antes disso: enquete nativa do Meet — "já investiu em anúncio pago?" (nunca / tentei e parei / anuncio sem saber o resultado / sei quanto me custa uma cliente). As 4 opções são os degraus.',
      'Frase de 10s sobre OAB, sem slide: "não vou explicar OAB pra advogada. Só deixo a régua: não pode vender resultado, pode explicar direito."',
      '⚠️ Citar a fonte do número em voz alta ou no rodapé — plateia de advogadas pergunta.',
    ],
  },
  s2: {
    min: '5–9', tag: 'Fio condutor · volta 4 ou 5 vezes',
    falas: [
      '"Tráfego pago não é deu certo ou não deu. São oito checagens em sequência. Onde você parou é exatamente o seu problema."',
      '"O que conta como vitória muda a cada degrau. Quem só comemora contrato desiste antes de chegar no contrato."',
      '"Cada degrau é a resposta que você precisa pra tomar a próxima decisão. O degrau 7 é uma divisão — sem os números dos degraus 2, 3 e 4, não tem o que dividir."',
      'A exceção: "alguma de vocês vai fechar contrato na primeira semana. É sorte, não método — e sorte não te diz o que repetir. O maior estrago que eu já vi não foi de quem não fechou nada: foi de quem fechou um por acaso e triplicou a verba no mês seguinte."',
      '✍️ AUTORAL: "essa escada não saiu de livro nenhum. É a ordem em que eu vejo as coisas acontecerem em toda conta que a gente sobe — inclusive a do nosso próprio escritório."',
    ],
    exec: [
      'Só trabalhe no degrau seguinte ao seu.',
      'Um ajuste por vez.',
      'Só aumente a verba quando a mesma conta se repetir dois meses seguidos.',
      '💬 "Escreve no chat em que degrau você está. Vou responder por número."',
    ],
  },
  s3: {
    min: '9–13', tag: 'Coração emocional',
    falas: [
      'Inimigo 1: "a indicação é ótima. O problema é depender dela — ela decide sozinha quando vem. Quantos clientes você vai ter em setembro? Ninguém sabe."',
      'Inimigo 2: "a ideia de que cliente na internet só chega pra quem dança e grava story. Isso trava mais advogada do que a OAB. E tem gente que simplesmente não quer — não por preguiça, por não combinar com o jeito que exerce a profissão. É legítimo, e não devia custar o seu crescimento."',
      'A raiz: "nos dois casos você está esperando: ou a boa vontade de quem indica, ou o algoritmo gostar do seu vídeo."',
      'A saída: "no Google não tem dancinha, não tem edição, não tem constância de post. E a pessoa chega até você já querendo."',
      '✍️ AUTORAL: "eu falo isso com alguma propriedade porque a minha sócia é advogada. Eu vejo de perto o que trava uma advogada na hora de aparecer — e não é falta de vontade."',
    ],
    exec: [
      '⚠️ Alinhe essa fala com a Carol antes. Só diga o que ela autorizar sobre a experiência dela.',
    ],
  },
  s4: {
    min: '13–16', tag: 'Bloco II · Como começar · 🖥️ busca ao vivo',
    falas: [
      '"Tráfego pago é pagar para aparecer na frente de quem tem o problema que você resolve. É escolher estar em frente ao fórum — só que na internet."',
      '"Na rede social você interrompe alguém que estava vendo outra coisa. No Google ela já está procurando. É a diferença entre bater na porta e atender a campainha."',
      '"Não é milagre. O tráfego não fecha contrato por você — ele abre a porta."',
    ],
    exec: [
      '🖥️ DEMO 1 — busca ao vivo. Peça a área no chat e digite na hora: "esses primeiros, com patrocinado escrito. É isso."',
      'Sensação de atraso, dita como fato e sem pressão: "essas aqui não subiram hoje. Tem escritório rodando isso há meses." + 3 segundos de silêncio. Não comente.',
      'Passe o mouse devagar sobre cada anúncio enquanto fala. O olho acompanha e a conta se faz sozinha.',
      'Ter 2–3 áreas já pesquisadas como backup se o chat travar.',
    ],
  },
  s5: {
    min: '16–21', tag: 'Degrau 1 · LEI 3',
    falas: [
      '"Segmentada na área. Genérica na palavra. O que não tem busca não tem conserto."',
      '"Anuncie no nome da área, não na sua tese."',
      '"Seis decisões. Nenhuma delas é técnica — são escolhas de negócio. O que trava não é o Google. É achar que precisa entender o Google antes de começar."',
      'Frição: "subir é a parte fácil. O que separa quem fica é ler os termos toda semana e negativar."',
      '✍️ AUTORAL: "essa lista de negativas não veio de curso. Veio de dinheiro que a gente já queimou clicando errado — no nosso escritório e nos dos clientes."',
    ],
    exec: [
      '14 dias sem mexer.',
      'Recuse as recomendações automáticas do Google nos primeiros 30 dias.',
      '📸 Print dos termos de pesquisa da Carol, com o lixo em vermelho.',
    ],
  },
  s6: {
    min: '21–26', tag: 'Degraus 2–3 · LEI 3 · 🖥️ teste dos 5 segundos',
    falas: [
      '"Uma página por área, não uma por tese. Se o anúncio diz advogada trabalhista e a página fala de uma tese específica, você perde quem chegou. Quem filtra é a sua conversa, não a página."',
      'Frição: "essa estrutura é a que eu vejo funcionar em todas as páginas que passam pela minha mão."',
    ],
    exec: [
      '🖥️ DEMO 2 — teste dos 5 segundos: página ruim, 5s, tira. "O que esse escritório faz e pra quem?" no chat. Depois a boa.',
      'A boa é a da Carol, aberta ao vivo. Role a página inteira devagar, do topo ao FAQ, apontando as 6 caixas na tela real.',
      'Sensação de atraso: "essa página não é nova. Ela já recebeu tráfego, já foi ajustada, já errou e já corrigiu. É por isso que ela converte."',
      'Abra também no celular ao lado — a plateia vê que funciona onde a cliente de verdade acessa.',
      'Um botão só, sem menu. Foto real. Abrir no celular antes de anunciar.',
    ],
  },
  s7: {
    min: '26–31', tag: 'Degraus 4–7',
    falas: [
      '"O objetivo da conversa é agendar, não resolver."',
      'Plante aqui: "guarda isso — daqui a pouco eu volto nesse ponto e ele explica por que a maioria desiste."',
      'Frição: "a conta é uma divisão. O difícil é ter dado limpo pra dividir."',
      '✍️ AUTORAL: "essa planilha é a versão enxuta do que a gente usa. Começou assim, numa aba só — e ainda hoje é ela que manda no que a gente decide."',
    ],
    exec: [
      'Confirmar na véspera — é onde mais gente some.',
      'Sexta, 15 minutos: investimento ÷ contratos.',
      'Data da conversa × data do contrato = o tempo de decisão da sua cliente.',
      '🖥️ DEMO 3 — o CRM na tela. Abra o funil real, role as linhas e faça a divisão ao vivo, na calculadora mesmo.',
      'Sensação de atraso: "essa base não apareceu do nada. É o acúmulo de meses anotando uma linha por conversa."',
      'Mostre uma linha com "perdeu" preenchido e leia o motivo em voz alta. É o detalhe que prova que a rotina existe de verdade.',
      '📸 Nomes, telefones e valores individuais borrados.',
    ],
  },
  s7b: {
    min: '31–35', tag: '🖥️ Demonstração ao vivo · a prova de que a gente vive isso',
    falas: [
      'A REVELAÇÃO — diga só agora, nunca no começo: "essa página, esse anúncio e esse CRM são do escritório da Carol. A Carol é advogada, tem escritório próprio e é minha sócia aqui na agência."',
      '"Ou seja: o que vocês estão vendo não é case de cliente. É a nossa própria operação. A gente vende o que vive na pele todo dia."',
      'Percorra os quatro na tela, na ordem, seguindo UMA cliente real: "olha o anúncio que ela viu... a página em que ela caiu... a mensagem que ela mandou... e a linha dela no CRM, do dia 3 até o contrato."',
      'No fim, sem dramatizar: "isso está rodando agora, enquanto a gente conversa."',
    ],
    exec: [
      'Prepare as 4 abas ANTES e passe na ordem: busca no Google → landing page → conversa no WhatsApp → linha no CRM.',
      'Escolha uma cliente real e siga só ela — é a jornada de uma pessoa que gera desejo, não o painel cheio de números.',
      'Borre nome, telefone e valor. Autorização da Carol por escrito.',
      'Deixe o silêncio trabalhar depois do CRM. Não comente, não venda, passe o slide.',
      '🔗 CTA do material aqui: "a planilha, o checklist dos 7 dias e a escada estão liberados hoje no @trafegonjuridico. Tem um post de hoje — segue e comenta DEGRAU que eu mando na sua DM."',
      '⚠️ Peça para fazerem em outra aba e voltarem. Não deixe a sala migrar para o Instagram no meio da palestra.',
    ],
  },
  s8: {
    min: '35–39', tag: 'Bloco III · Como não desistir · LEI 2 · 📷 foto',
    falas: [
      'ABRA PREVENDO — ponto mais alto de autoridade: "vou dizer o que vai acontecer nos seus primeiros 30 dias. Lá pelo dia 12 você vai abrir a conta e achar caro. Lá pelo dia 15 você vai responder mais devagar. E o mês vai fechar ruim — não porque a campanha caiu, mas porque você desanimou antes dela."',
      'Só então a curva: "isso é um escritório real, num mês real. Repara nos vinte primeiros dias." — pausa — "quem desligou no dia 15 nunca viu essa parte."',
      'Callback: "lembra do roteiro de atendimento? Ele não é do dia 1. É dos 30."',
      'Amarre com a demonstração: "essa curva é do mesmo escritório que vocês acabaram de ver por dentro. Mesma página, mesmo CRM, mesma rotina."',
      '"Um mês é montanha-russa. Três sobrepostos viram uma linha."',
      '✍️ AUTORAL: "eu faço essa conta toda sexta. Não é conceito de aula — é a rotina que me diz se o mês está de pé ou não."',
    ],
    exec: [
      'A rotina diária que não muda, 15 min: responder as novas · confirmar as de amanhã · dar os follow-ups vencidos · anotar.',
      'Ativação da base: "quem não fechou em março pode fechar em agosto. Uma vez por mês volte em quem não respondeu — é o contato mais barato que existe: você já pagou por ele."',
      '📸 SUBSTITUIR PELO PRINT REAL: exporte a curva de fechamentos por dia do CRM da Carol, salve em /public/palestra-caf/ e me avise — o slide troca sozinho. Enquanto isso o gráfico é ilustrativo.',
      'Ao mostrar, diga de onde vem: "isso é o CRM do escritório dela, mês fechado."',
    ],
  },
  s9: {
    min: '39–42', tag: 'LEI 1 · 📷 momento da foto',
    falas: [
      '"Vocês acabaram de calcular quanto custa uma cliente. Esse número está errado — e pra pior. Porque você não está comprando uma causa. Está comprando uma cliente."',
      '"Quem tem um problema jurídico hoje vai ter outro daqui a três anos. E ela não vai pesquisar no Google de novo — vai chamar você."',
      '"Eu comecei falando mal da indicação. Não era bem isso. A indicação é o melhor cliente que existe — o problema é depender dela sem controlar a entrada."',
      '"O tráfego pago não substitui a indicação. Ele abastece a indicação." → PAUSA DE 5 SEGUNDOS',
      '✍️ AUTORAL: "eu vejo isso no escritório da minha sócia. A cliente que entrou por anúncio hoje é a que traz duas por indicação depois. É essa parte de baixo que paga a conta."',
      'A BOLA DE NEVE — acompanhe as bolinhas crescendo na tela enquanto fala: "repara que cada degrau de baixo devolve mais gente do que o anterior. Uma cliente vira dois casos, que viram cinco conversas, que viram oito contratos. E aí volta pro topo."',
      '"O topo você paga. O de baixo é de graça — mas só existe se o topo estiver rodando."',
    ],
    exec: [
      'O exercício: "pega seus últimos 10 clientes: quantos voltaram? Quantos indicaram alguém? Esse é o seu multiplicador — não o meu, não o do Instagram."',
      '"Quem calcula olhando só o primeiro contrato sempre acha caro. E desiste de uma campanha que estava dando certo."',
      'Coluna "indicada por quem" na planilha · peça a indicação quando o resultado sai · uma mensagem a cada 6 meses · quem não fechou também indica.',
      '⚠️ "Conteúdo funciona — mas não pode ser pré-requisito pra começar."',
    ],
  },
  s10: {
    min: '42–46', tag: 'Fechamento · 5 batidas · 📲 CTA Instagram',
    falas: [
      '1. Os 7 dias: "nenhum passo leva mais de uma hora. Isso é o degrau 1."',
      '2. As 3 leis, em 20 segundos.',
      '3. As 4 perguntas: "daqui a 30 dias: quantas conversas chegaram? Quantas eram da sua área? Quanto custou cada contrato? Qual cliente te trouxe outra cliente?" — pausa — "se você não souber responder, o problema não foi a campanha."',
      '4. "Ninguém aqui vai fechar contrato essa semana. Vocês vão subir um degrau. E quem sobe um degrau por semana chega antes de quem passou o ano estudando a escada."',
      '5. O pedido, agora tudo num canal só: "busca a sua área na sua cidade hoje e me manda o print na DM do @trafegonjuridico. Eu te respondo com o que dá pra fazer com o que você já tem. E daqui a 30 dias me conta como foi."',
    ],
    exec: [
      '📲 DEIXE ESTE SLIDE NA TELA DURANTE TODO O Q&A. É aqui que a conversão acontece — celular na mão, @ e a palavra DEGRAU visíveis.',
      'Repita o convite uma vez no meio das perguntas, sem insistir.',
      'Perguntas: escada na tela, ler os nomes em voz alta, encerrar em pergunta boa.',
      'Zero oferta no palco. A necessidade vem das frases de frição, das 4 perguntas e do convite de retorno.',
    ],
  },
}

function Roteiro({ id }) {
  const r = ROTEIRO[id]
  return (
    <div className="h-full flex flex-col p-8 gap-4 overflow-auto" style={{ background: '#0f1018' }}>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="px-3 py-1 rounded-lg text-sm font-black tabular-nums" style={{ background: G, color: DARK }}>{r.min} min</span>
        <span className="text-white/60 text-sm font-semibold">{r.tag}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>O que falar</div>
        {r.falas.map((f, i) => (
          <div key={i} className="rounded-xl px-5 py-3 text-white/90 text-[15px] leading-relaxed"
            style={{ background: '#1e2035', borderLeft: `3px solid ${G}` }}>{f}</div>
        ))}
      </div>

      {r.exec.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Execução e marcações</div>
          {r.exec.map((e, i) => (
            <div key={i} className="flex gap-3 text-white/75 text-sm leading-relaxed">
              <span style={{ color: GOLD }}>▸</span><span>{e}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Wrap({ mode, id, children }) {
  return mode === 'roteiro' ? <Roteiro id={id} /> : children
}

// ── átomos visuais ─────────────────────────────────────────────────────────────

function Lei({ n }) {
  return (
    <div className="absolute top-6 right-7 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest z-10"
      style={{ background: PUR + '22', color: '#c4b5fd', border: `1px solid ${PUR}55` }}>
      LEI {n}
    </div>
  )
}

function Degrau({ n }) {
  return (
    <div className="absolute bottom-5 right-7 text-[11px] font-black tracking-widest text-white/25 z-10">
      DEGRAU {n}
    </div>
  )
}

function AoVivo({ texto = 'AO VIVO' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full align-middle"
      style={{ background: RED + '1e', border: `1px solid ${RED}50` }}>
      <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: RED }}
        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <span className="text-[10px] font-black tracking-widest" style={{ color: '#fca5a5' }}>{texto}</span>
    </span>
  )
}

function NaPele() {
  return (
    <div className="absolute top-6 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest z-10"
      style={{ right: 128, background: G + '16', color: G, border: `1px solid ${G}45` }}>
      ESCRITÓRIO DA SÓCIA
    </div>
  )
}

function Handle() {
  return (
    <div className="absolute bottom-5 left-8 flex items-center gap-2 z-10 pointer-events-none">
      <span className="text-[13px]">📲</span>
      <span className="text-[12px] font-black tracking-wide" style={{ color: G, opacity: 0.75 }}>
        @trafegonjuridico
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//   SLIDES
// ══════════════════════════════════════════════════════════════════════════════

function S01({ mode }) {
  return (
    <Wrap mode={mode} id="s1">
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 55%, ${BLUE} 100%)` }}>
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: 180 + i * 100, height: 180 + i * 100, border: '1.5px solid rgba(255,255,255,0.1)', top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 6, repeat: Infinity, ease: 'linear' }} />
        ))}
        <motion.div className="relative z-10 text-center px-10"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest mb-6"
            style={{ background: G, color: NAVY }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            DO ZERO AO PRIMEIRO CONTRATO
          </motion.div>
          <motion.div className="font-black text-white leading-none"
            style={{ fontSize: '7rem', letterSpacing: '-5px', textShadow: '0 8px 40px rgba(0,0,0,0.35)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            1.609.507
          </motion.div>
          <motion.div className="text-white/70 text-lg font-semibold mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            advogadas e advogados inscritos na OAB
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}
            className="inline-block px-10 py-4 rounded-full font-black text-white text-2xl shadow-2xl"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)' }}>
            Quantos você conhece que anunciam?
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            className="mt-7 text-white/60 text-sm">
            TráfegOn · agência de tráfego para escritórios de advocacia
            <span className="text-white/85 font-bold"> — com uma sócia advogada que vive isso do outro lado do balcão.</span>
          </motion.div>
        </motion.div>
        <Handle />
      </div>
    </Wrap>
  )
}

const DEGRAUS = [
  { n: 1, fato: 'Campanha no ar',                     prova: 'Que você começou',            ajuste: 'Nada. 14 dias sem tocar' },
  { n: 2, fato: 'Apareceram cliques',                 prova: 'O anúncio alcança gente',     ajuste: 'Ler termos e negativar' },
  { n: 3, fato: 'Alguém te chamou',                   prova: 'A página funciona',           ajuste: 'Repetir na página as palavras que trouxeram' },
  { n: 4, fato: 'Chamou alguém da sua área',          prova: 'Você atrai quem devia',       ajuste: 'Negativar o resto, investir no que acertou' },
  { n: 5, fato: 'Marcou consulta',                    prova: 'Seu atendimento funciona',    ajuste: 'Padronizar roteiro e tempo de resposta' },
  { n: 6, fato: 'Apareceu na consulta',               prova: 'A confirmação funciona',      ajuste: 'Lembrete na véspera' },
  { n: 7, fato: 'Assinou contrato',                   prova: 'A corrente inteira funciona', ajuste: 'investimento ÷ contratos' },
  { n: 8, fato: 'Assinou de novo, mesma palavra',     prova: 'Não foi sorte',               ajuste: 'Escalar' },
]

function S02({ mode }) {
  const cor = n => (n <= 3 ? G : n <= 7 ? GOLD : PUR)
  return (
    <Wrap mode={mode} id="s2">
      <div className="h-full flex flex-col px-10 py-7 gap-4 relative" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">Onde você parou é o seu problema</h2>
          <p className="text-white/60 text-sm mt-2">
            Não é "deu certo ou não deu". São oito checagens em sequência — e cada uma destrava <span className="font-black" style={{ color: G }}>um</span> ajuste.
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {DEGRAUS.map((d, i) => (
            <motion.div key={d.n}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.055, type: 'spring', stiffness: 180 }}
              className="grid items-center gap-3 rounded-lg px-3 py-2"
              style={{ gridTemplateColumns: '34px 1.1fr 1fr 1.2fr', background: '#0f1018', marginLeft: i * 14 }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: cor(d.n) + '22', color: cor(d.n) }}>{d.n}</div>
              <div className="text-white font-bold text-sm">{d.fato}</div>
              <div className="text-white/55 text-xs italic">{d.prova}</div>
              <div className="text-xs font-semibold" style={{ color: cor(d.n) }}>→ {d.ajuste}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 text-[11px] font-black flex-shrink-0">
          <span className="px-3 py-1.5 rounded-full" style={{ background: G + '18', color: G }}>1–3 · EXISTIR</span>
          <span className="px-3 py-1.5 rounded-full" style={{ background: GOLD + '18', color: GOLD }}>4–7 · MEDIR</span>
          <span className="px-3 py-1.5 rounded-full" style={{ background: PUR + '22', color: '#c4b5fd' }}>8 · ESCALAR</span>
          <span className="px-3 py-1.5 rounded-full ml-auto" style={{ background: '#1e2035', color: '#a8b0cc' }}>Um ajuste por vez. Nunca dois.</span>
        </div>
      </div>
    </Wrap>
  )
}

function S03({ mode }) {
  const inimigos = [
    { icon: '📞', color: RED,    t: 'Depender de indicação',
      d: 'A indicação é ótima. O problema é depender dela — ela decide sozinha quando vem.',
      p: '"Quantos clientes você vai ter em setembro? Ninguém sabe."' },
    { icon: '💃', color: ORANGE, t: 'Ter que fazer dancinha e gravar vídeo',
      d: 'A ideia de que cliente na internet só chega pra quem dança e grava story.',
      p: '"Trava mais advogada do que a OAB."' },
  ]
  return (
    <Wrap mode={mode} id="s3">
      <div className="h-full flex flex-col px-10 py-9 gap-6 justify-center relative" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.h2 className="text-4xl font-black text-white text-center"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          Os dois inimigos
        </motion.h2>

        <div className="grid grid-cols-2 gap-5">
          {inimigos.map((x, i) => (
            <motion.div key={x.t}
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.12, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-7 flex flex-col gap-3"
              style={{ background: x.color + '0d', border: `1px solid ${x.color}30` }}>
              <div className="text-4xl">{x.icon}</div>
              <div className="font-black text-2xl leading-tight" style={{ color: x.color }}>{x.t}</div>
              <div className="text-white/80 text-sm leading-relaxed">{x.d}</div>
              <div className="text-white/55 text-sm italic mt-auto">{x.p}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="rounded-xl px-7 py-4 text-center" style={{ background: '#1e2035' }}>
          <p className="text-white/85 text-base">
            Nos dois casos você está <span className="font-black text-white">esperando</span>: ou a boa vontade de quem indica, ou o algoritmo gostar do seu vídeo.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-2xl px-8 py-5 text-center" style={{ background: G + '14', border: `1.5px solid ${G}55` }}>
          <p className="text-white font-black text-xl">
            No Google não tem dancinha, não tem edição, não tem constância de post.
          </p>
          <p className="text-white/75 text-base mt-1">E a pessoa chega até você <span className="font-black" style={{ color: G }}>já querendo</span>.</p>
        </motion.div>
      </div>
    </Wrap>
  )
}

function S04({ mode }) {
  const regras = [
    { icon: '👆', t: 'Você não paga para aparecer', d: 'Paga só quando alguém clica.' },
    { icon: '🔒', t: 'Você define o teto do dia',   d: 'Não existe surpresa no cartão.' },
    { icon: '⚖️', t: 'Não é quem paga mais',        d: 'Anúncio e página melhores pagam menos pelo mesmo lugar.' },
  ]
  return (
    <Wrap mode={mode} id="s4">
      <div className="h-full flex flex-col px-10 py-8 gap-5 justify-center relative" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-4xl font-black text-white">Como o anúncio aparece — e como o dinheiro funciona</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <AoVivo texto="BUSCA AO VIVO NO GOOGLE" />
            <span className="text-white/40 text-xs">a área de alguém da sala, agora</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl px-8 py-5 text-center" style={{ background: BLUE + '14', border: `1px solid ${BLUE}35` }}>
          <p className="text-white text-xl font-bold">
            Pagar para aparecer na frente de quem tem o problema que você resolve.
          </p>
          <p className="text-white/65 text-sm mt-1">É escolher estar em frente ao fórum — só que na internet.</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {regras.map((r, i) => (
            <motion.div key={r.t} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 160 }}
              className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: '#0f1018' }}>
              <div className="text-2xl">{r.icon}</div>
              <div className="font-black text-white text-base leading-tight">{r.t}</div>
              <div className="text-white/60 text-xs leading-relaxed">{r.d}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="grid grid-cols-2 gap-4">
          <div className="rounded-xl px-6 py-4" style={{ background: '#1e2035' }}>
            <div className="text-[11px] font-black uppercase tracking-widest text-white/45 mb-1">Rede social</div>
            <div className="text-white/85 text-sm">Você <span className="font-black">interrompe</span> alguém que estava vendo outra coisa.</div>
          </div>
          <div className="rounded-xl px-6 py-4" style={{ background: G + '12', border: `1px solid ${G}40` }}>
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: G }}>Google</div>
            <div className="text-white/90 text-sm">Ela <span className="font-black">já está procurando</span>. Bater na porta × atender a campainha.</div>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="text-center text-white/60 text-sm">
          Mas não é milagre. <span className="text-white font-bold">O tráfego não fecha contrato por você — ele abre a porta.</span>
        </motion.p>
      </div>
    </Wrap>
  )
}

function S05({ mode }) {
  const linhas = [
    { n: '1', t: 'Tipo',       d: 'Pesquisa. Não PMax, não Display' },
    { n: '2', t: 'Onde',       d: 'Sua cidade + 20 km' },
    { n: '3', t: 'Palavras',   d: '15–20, no formato área + cidade, em frase' },
    { n: '4', t: 'Negativas',  d: 'grátis · vaga · emprego · estágio · salário · curso · concurso · OAB · modelo · petição · "como fazer"' },
    { n: '5', t: 'Anúncio',    d: 'Área + cidade no título · OAB no texto · sem promessa de resultado' },
    { n: '6', t: 'Orçamento',  d: 'Diário fixo, o que você aguenta rodar 30 dias seguidos' },
  ]
  return (
    <Wrap mode={mode} id="s5">
      <div className="h-full flex flex-col px-10 py-7 gap-4 relative" style={{ background: DARK }}>
        <Lei n={3} />
        <Degrau n={1} />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Qual busca você quer atender</h2>
          <p className="text-sm mt-2 font-bold" style={{ color: '#c4b5fd' }}>
            Segmentada na área. Genérica na palavra. <span className="text-white/55 font-medium">O que não tem busca não tem conserto.</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3">
          <div className="rounded-xl px-5 py-3" style={{ background: G + '10', border: `1px solid ${G}35` }}>
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: G }}>Funciona</div>
            <div className="text-white/85 text-sm">Família · consumidor · trabalhista · previdenciário — problema comum, muita busca</div>
          </div>
          <div className="rounded-xl px-5 py-3" style={{ background: RED + '0d', border: `1px solid ${RED}30` }}>
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: RED }}>Não funciona</div>
            <div className="text-white/85 text-sm">Societário · M&A · grandes contratos — público pequeno, decisão por relacionamento</div>
          </div>
        </motion.div>

        <div className="text-[11px] font-black uppercase tracking-widest text-white/40 mt-1">A campanha em 6 linhas</div>
        <div className="flex-1 flex flex-col gap-1.5">
          {linhas.map((l, i) => (
            <motion.div key={l.n} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-3 rounded-lg px-4 py-2" style={{ background: '#0f1018' }}>
              <span className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs flex-shrink-0"
                style={{ background: G + '20', color: G }}>{l.n}</span>
              <span className="font-black text-white text-sm w-24 flex-shrink-0">{l.t}</span>
              <span className="text-white/70 text-sm">{l.d}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <div className="flex-1 rounded-xl px-5 py-2.5 text-center" style={{ background: GOLD + '14', border: `1px solid ${GOLD}35` }}>
            <span className="font-black text-sm" style={{ color: GOLD }}>14 dias sem mexer.</span>
            <span className="text-white/70 text-sm"> Anote e espere.</span>
          </div>
          <div className="flex-1 rounded-xl px-5 py-2.5 text-center" style={{ background: RED + '10', border: `1px solid ${RED}30` }}>
            <span className="font-black text-sm" style={{ color: RED }}>Recuse as recomendações automáticas</span>
            <span className="text-white/70 text-sm"> do Google</span>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

function S06({ mode }) {
  const caixas = [
    { n: 1, t: 'Título',        d: '[Área] em [Cidade]' },
    { n: 2, t: 'Subtítulo',     d: 'Atendimento por [nome], OAB/[UF] [nº]' },
    { n: 3, t: 'Botão',         d: 'Falar com a advogada — WhatsApp', destaque: true },
    { n: 4, t: 'A dor',         d: '3 linhas, nas palavras da cliente' },
    { n: 5, t: 'Como funciona', d: '3 passos numerados' },
    { n: 6, t: 'FAQ + botão',   d: 'custo · prazo · presencial?' },
  ]
  return (
    <Wrap mode={mode} id="s6">
      <div className="h-full flex flex-col px-10 py-7 gap-4 relative" style={{ background: '#0f1018' }}>
        <Lei n={3} />
        <Degrau n="2–3" />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white leading-none">A página em 6 caixas</h2>
            <AoVivo texto="TESTE DOS 5 SEGUNDOS" />
          </div>
          <p className="text-white/55 text-sm mt-2">Uma página por área — não uma por tese. Quem filtra é a sua conversa, não a página.</p>
        </motion.div>

        <div className="flex-1 grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="flex flex-col gap-1.5 justify-center">
            {caixas.map((c, i) => (
              <motion.div key={c.n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="rounded-lg px-4 py-2.5 flex items-center gap-3"
                style={c.destaque
                  ? { background: G + '18', border: `1.5px solid ${G}` }
                  : { background: '#1e2035', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs font-black w-4" style={{ color: c.destaque ? G : '#5b6289' }}>{c.n}</span>
                <span className="font-black text-white text-sm w-28">{c.t}</span>
                <span className="text-white/60 text-xs">{c.d}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5" style={{ background: BLUE + '12', border: `1px solid ${BLUE}35` }}>
              <div className="font-black text-white text-base mb-1">O teste dos 5 segundos</div>
              <div className="text-white/75 text-sm leading-relaxed">
                Mostre a página por 5 segundos e pergunte: <span className="italic">"o que esse escritório faz e pra quem?"</span> Se ninguém responder, a página está morta.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl p-5" style={{ background: G + '10', border: `1px solid ${G}35` }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: G }}>Não negociável</div>
              {['Um botão só, sem menu', 'Foto real sua', 'Abre em 3s no celular'].map(x => (
                <div key={x} className="text-white/85 text-sm flex gap-2"><span style={{ color: G }}>✓</span>{x}</div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="rounded-2xl p-5" style={{ background: RED + '0d', border: `1px solid ${RED}28` }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: RED }}>Os 4 assassinos</div>
              <div className="text-white/80 text-sm">Menu com 8 links · formulário longo · "fundado em 1998" no topo · foto de martelo e balança</div>
            </motion.div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

function S07({ mode }) {
  const passos = [
    'Responder rápido',
    '3 perguntas: o que houve · desde quando · já procurou alguém',
    'Oferecer dois horários',
    'Confirmar na véspera',
    'Follow-up em 24h e 72h',
  ]
  const status = ['nova', 'respondi', 'agendou', 'compareceu', 'contratou', 'perdeu (por quê)']
  return (
    <Wrap mode={mode} id="s7">
      <div className="h-full flex flex-col px-10 py-7 gap-4 relative" style={{ background: DARK }}>
        <Degrau n="4–7" />
        <Handle />
        <motion.div className="flex items-center gap-3"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Agendar, não resolver — e anotar tudo</h2>
          <AoVivo texto="CRM NA TELA" />
        </motion.div>

        <div className="flex-1 grid grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: '#0f1018' }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>O WhatsApp</div>
            {passos.map((p, i) => (
              <div key={p} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs flex-shrink-0"
                  style={{ background: G + '20', color: G }}>{i + 1}</span>
                <span className="text-white/85 text-sm leading-snug">{p}</span>
              </div>
            ))}
            <div className="mt-auto rounded-xl px-4 py-3" style={{ background: RED + '10', border: `1px solid ${RED}28` }}>
              <span className="text-white/85 text-sm">Nunca consultar de graça no WhatsApp. </span>
              <span className="font-black text-sm" style={{ color: RED }}>O objetivo é agendar.</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: '#0f1018' }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: GOLD }}>A planilha</div>
            <div className="rounded-lg px-4 py-3 font-mono text-[13px] text-white/85" style={{ background: '#1e2035' }}>
              Data | De onde veio | Área | Status | Valor | Data do contrato | Indicada por quem
            </div>
            <div className="flex flex-wrap gap-1.5">
              {status.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: '#1e2035', color: '#a8b0cc' }}>{s}</span>
              ))}
            </div>
            <div className="mt-auto rounded-xl px-5 py-4 text-center" style={{ background: GOLD + '14', border: `1px solid ${GOLD}40` }}>
              <div className="font-black text-xl text-white">investimento ÷ contratos</div>
              <div className="text-white/65 text-xs mt-1">Toda sexta, 15 minutos. É a única conta que decide alguma coisa.</div>
            </div>
          </motion.div>
        </div>

        <div className="rounded-xl px-6 py-2.5 text-center flex-shrink-0" style={{ background: '#1e2035' }}>
          <span className="text-white/75 text-sm">A diferença entre a <span className="text-white font-bold">data da conversa</span> e a <span className="text-white font-bold">data do contrato</span> é o tempo de decisão da sua cliente.</span>
        </div>
      </div>
    </Wrap>
  )
}

function S7B({ mode }) {
  const ativos = [
    { n: '01', icon: '🔎', t: 'O anúncio',  d: 'O que ela digitou no Google e o que apareceu',        cor: BLUE },
    { n: '02', icon: '📄', t: 'A página',   d: 'O que ela viu depois de clicar — e o botão que usou', cor: G },
    { n: '03', icon: '💬', t: 'O WhatsApp',  d: 'A mensagem que ela mandou e como foi respondida',      cor: GOLD },
    { n: '04', icon: '📊', t: 'O CRM',       d: 'A linha dela, de "nova" até "contratou"',              cor: PUR },
  ]
  return (
    <Wrap mode={mode} id="s7b">
      <div className="h-full flex flex-col px-10 py-7 gap-4 relative" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white leading-none">A máquina rodando</h2>
            <AoVivo texto="AS 4 TELAS, NA ORDEM" />
          </div>
          <p className="text-white/65 text-sm mt-2">Uma cliente real, do clique ao contrato — no escritório da minha sócia.</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-3 flex-1">
          {ativos.map((a, i) => (
            <motion.div key={a.n}
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.11, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-5 flex flex-col gap-2"
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${a.cor}45` }}>
              <div className="text-[11px] font-black tracking-widest" style={{ color: a.cor }}>{a.n}</div>
              <div className="text-3xl">{a.icon}</div>
              <div className="font-black text-white text-lg leading-tight">{a.t}</div>
              <div className="text-white/65 text-xs leading-relaxed">{a.d}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="rounded-2xl px-7 py-3.5 flex items-center gap-5"
          style={{ background: G + '14', border: `1.5px solid ${G}50` }}>
          <div className="text-4xl">⚖️</div>
          <div>
            <p className="text-white font-black text-lg leading-snug">
              A Carol é advogada, tem escritório e é minha sócia na agência.
            </p>
            <p className="text-white/75 text-sm mt-0.5">
              Não é case de cliente. É a nossa própria operação — a gente vende o que vive na pele todo dia.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="rounded-2xl px-7 py-3.5 flex items-center gap-5"
          style={{ background: 'rgba(0,0,0,0.34)', border: `1.5px dashed ${G}70` }}>
          <div className="text-4xl">📲</div>
          <div className="flex-1">
            <p className="text-white/70 text-[13px]">
              Essa planilha, o checklist dos 7 dias e a escada em PDF são seus:
            </p>
            <p className="text-white font-black text-xl leading-tight mt-0.5">
              @trafegonjuridico <span className="text-white/60 font-bold text-base">— segue e comenta</span>
              <span style={{ color: G }}> DEGRAU</span>
              <span className="text-white/60 font-bold text-base"> no post de hoje</span>
            </p>
          </div>
        </motion.div>
      </div>
    </Wrap>
  )
}

function S08({ mode }) {
  const dias = [2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 2, 1, 3, 2, 6, 9, 14, 11, 17, 22, 15, 26, 19, 24]
  const max = Math.max(...dias)
  return (
    <Wrap mode={mode} id="s8">
      <div className="h-full flex flex-col px-10 py-7 gap-4 relative" style={{ background: '#0f1018' }}>
        <Lei n={2} />
        <NaPele />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">O mês não é reto</h2>
          <p className="text-white/55 text-sm mt-2">Do dia 1 ao dia 30 nada muda: nem a verba, nem o atendimento.</p>
        </motion.div>

        <div className="rounded-2xl px-6 pt-4 pb-3" style={{ background: '#151725' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">📊</span>
            <span className="text-[11px] font-black tracking-widest" style={{ color: G }}>
              CRM DO ESCRITÓRIO DA CAROL
            </span>
            <span className="text-white/35 text-[11px]">· contratos fechados por dia do mês</span>
          </div>
          {PRINTS.crmCurva ? (
            <img src={PRINTS.crmCurva} alt="Contratos fechados por dia do mês — CRM do escritório da Carol"
              className="w-full rounded-lg" style={{ maxHeight: 150, objectFit: 'contain' }} />
          ) : (
            <>
              <div className="flex items-end gap-[5px] h-28">
                {dias.map((v, i) => (
                  <motion.div key={i} className="flex-1 rounded-t-sm"
                    initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
                    transition={{ delay: 0.15 + i * 0.018, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: i < 20 ? '#2b3050' : G, boxShadow: i >= 20 ? `0 0 10px ${G}55` : 'none' }} />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-white/40 font-mono mt-2">
                <span>dia 1</span><span>dia 15</span><span>dia 30</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: RED + '0d', border: `1px solid ${RED}28` }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: RED }}>A armadilha do dia 15</div>
            <div className="text-white/80 text-[13px] leading-relaxed">
              Nada fechou → desânimo → a resposta esfria, o follow-up para → o mês fecha ruim → <span className="italic">"viu? não funciona"</span>.
            </div>
            <div className="mt-auto text-white font-bold text-sm">
              Não foi a campanha que caiu. Foi a sua resposta que esfriou.
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: G + '10', border: `1px solid ${G}35` }}>
            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: G }}>A rotina que não muda · 15 min/dia</div>
            {['Responder as novas', 'Confirmar as de amanhã', 'Dar os follow-ups vencidos', 'Anotar'].map(x => (
              <div key={x} className="text-white/85 text-[13px] flex gap-2"><span style={{ color: G }}>✓</span>{x}</div>
            ))}
            <div className="mt-auto text-white/70 text-xs">
              + uma vez por mês, ativação da base: volte em quem não respondeu. Você já pagou por esse contato.
            </div>
          </motion.div>
        </div>

        <div className="rounded-xl px-6 py-3 text-center flex-shrink-0" style={{ background: '#1e2035' }}>
          <span className="text-white font-black">Um mês é montanha-russa. Três meses sobrepostos viram uma linha.</span>
          <span className="text-white/60 text-sm"> A estabilidade não vem do mês — vem da soma dos meses.</span>
        </div>
      </div>
    </Wrap>
  )
}

function S09({ mode }) {
  const topo = ['viu', 'clicou', 'chamou', 'agendou', 'apareceu']
  const base = [
    { t: 'entregou bem',          n: 1 },
    { t: 'ela volta',             n: 2 },
    { t: 'novo caso',             n: 3 },
    { t: 'ela indica',            n: 5 },
    { t: 'a indicação contrata',  n: 8 },
  ]
  return (
    <Wrap mode={mode} id="s9">
      <div className="h-full flex flex-col px-10 py-6 gap-3 relative" style={{ background: DARK }}>
        <Lei n={1} />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Você não compra uma causa. Compra uma cliente.</h2>
          <p className="text-white/55 text-sm mt-1.5">O funil não acaba no contrato. Ele vira ampulheta — e a parte de baixo é a que ninguém desenha.</p>
        </motion.div>

        <div className="flex-1 grid gap-5" style={{ gridTemplateColumns: '1.05fr 1fr' }}>
          <div className="flex flex-col items-center justify-center gap-1">
            {topo.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-md py-1.5 text-center text-white/80 text-[13px] font-semibold"
                style={{ width: `${100 - i * 13}%`, background: '#1e2035' }}>{t}</motion.div>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.42 }}
              className="rounded-lg py-2 text-center font-black text-base my-1"
              style={{ width: '34%', background: G, color: DARK }}>CONTRATO</motion.div>
            {base.map((b, i) => (
              <motion.div key={b.t}
                initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.09, type: 'spring', stiffness: 170 }}
                className="rounded-md py-1.5 px-3 flex items-center justify-between gap-2 text-[13px] font-semibold"
                style={{
                  width: `${48 + i * 13}%`,
                  background: `rgba(124,58,237,${0.14 + i * 0.05})`,
                  color: '#c4b5fd',
                  border: `1px solid rgba(167,139,250,${0.12 + i * 0.06})`,
                }}>
                <span>{b.t}</span>
                <span className="flex items-center gap-[3px] flex-shrink-0">
                  {[...Array(b.n)].map((_, k) => (
                    <motion.span key={k} className="rounded-full"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.09 + k * 0.03, type: 'spring', stiffness: 400 }}
                      style={{ width: 5 + i, height: 5 + i, background: '#c4b5fd' }} />
                  ))}
                </span>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              className="mt-1.5 text-[12px] font-black text-center" style={{ color: '#c4b5fd' }}>
              ↺ e cada uma dessas entra no topo de novo
            </motion.div>
          </div>

          <div className="flex flex-col gap-2.5 justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5" style={{ background: '#0f1018' }}>
              <div className="text-white/85 text-sm leading-relaxed">
                Quem tem um problema jurídico hoje vai ter outro daqui a três anos. <span className="text-white font-bold">E ela não vai pesquisar no Google de novo — vai chamar você.</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
              className="rounded-2xl p-5" style={{ background: G + '12', border: `1.5px solid ${G}50` }}>
              <div className="text-white font-black text-lg leading-snug">
                O tráfego pago não substitui a indicação. Ele abastece a indicação.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="rounded-2xl p-5" style={{ background: GOLD + '10', border: `1px solid ${GOLD}30` }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>Descubra o seu multiplicador</div>
              <div className="text-white/80 text-[13px] leading-relaxed">
                Pega seus últimos 10 clientes: quantos voltaram? Quantos indicaram alguém?
                <span className="text-white/60"> Quem calcula olhando só o primeiro contrato sempre acha caro — e desiste de uma campanha que estava dando certo.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

function S10({ mode }) {
  const dias = [
    'Escrever a frase: "ajudo [quem] a [quê] em [cidade]"',
    'Abrir o WhatsApp Business',
    'Publicar a página com um botão',
    'Criar a conta no Google Ads',
    'Subir a campanha + as negativas',
    'Montar a planilha',
    'Não mexer em nada',
  ]
  return (
    <Wrap mode={mode} id="s10">
      <div className="h-full flex flex-col px-10 py-7 gap-4" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">A sua primeira semana</h2>
          <p className="text-white/65 text-sm mt-2">Nenhum passo leva mais de uma hora. Isso é o degrau 1.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {dias.map((d, i) => (
            <motion.div key={d} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-center gap-4 rounded-lg px-5 py-2.5"
              style={{ background: i === 6 ? G + '1a' : 'rgba(0,0,0,0.26)', border: i === 6 ? `1px solid ${G}50` : '1px solid rgba(255,255,255,0.06)' }}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
                style={{ background: i === 6 ? G : 'rgba(255,255,255,0.1)', color: i === 6 ? DARK : 'white' }}>{i + 1}</span>
              <span className="text-white font-semibold text-sm">{d}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="rounded-2xl px-7 py-3.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <p className="text-white font-black text-[17px] leading-snug">
            Ninguém aqui vai fechar contrato essa semana. Vocês vão subir um degrau.
          </p>
          <p className="text-white/70 text-sm mt-1">
            E quem sobe um degrau por semana chega antes de quem passou o ano estudando a escada.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="rounded-2xl px-7 py-4 flex items-center gap-6"
          style={{ background: G + '16', border: `1.5px solid ${G}60` }}>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: G }}>
              Leva a planilha, o checklist e a escada
            </div>
            <div className="text-white font-black text-2xl leading-none">@trafegonjuridico</div>
            <div className="text-white/70 text-sm mt-1.5">
              Segue e comenta <span className="font-black text-white">DEGRAU</span> no post de hoje — eu mando o material na sua DM.
            </div>
          </div>
          <div className="text-5xl opacity-90">📲</div>
        </motion.div>
      </div>
    </Wrap>
  )
}

export const PALESTRA_CAF_SLIDES = [
  { id: 'pc01', label: '1.609.507',        C: S01 },
  { id: 'pc02', label: 'A escada',          C: S02 },
  { id: 'pc03', label: 'Os dois inimigos',  C: S03 },
  { id: 'pc04', label: 'Como funciona',     C: S04 },
  { id: 'pc05', label: 'A campanha',        C: S05 },
  { id: 'pc06', label: 'A página',          C: S06 },
  { id: 'pc07', label: 'Agendar e anotar',  C: S07 },
  { id: 'pc7b', label: 'A máquina rodando', C: S7B },
  { id: 'pc08', label: 'O mês não é reto',  C: S08 },
  { id: 'pc09', label: 'A ampulheta',       C: S09 },
  { id: 'pc10', label: 'Primeira semana',   C: S10 },
]

export default PALESTRA_CAF_SLIDES
