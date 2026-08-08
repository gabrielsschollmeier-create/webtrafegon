import { useState, useEffect } from 'react'
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
const CYAN   = '#22d3ee'

// ── PRINTS REAIS ───────────────────────────────────────────────────────────────
// Coloque os arquivos em /public/palestra-caf/ e preencha o caminho aqui.
// Enquanto for null, o slide mostra a versão ilustrativa E NÃO afirma que é da Carol.
const PRINTS = {
  crmCurva:  null,  // ex: '/palestra-caf/curva-fechamentos-carol.png'
  crmFunil:  null,  // ex: '/palestra-caf/funil-carol.png'
  landing:   null,  // ex: '/palestra-caf/lp-carol.png'
  termos:    null,  // ex: '/palestra-caf/termos-pesquisa.png'
}

// ── O AVATAR DA JORNADA ────────────────────────────────────────────────────────
// Rostinho que percorre as 4 etapas no slide "Jornada do cliente".
// Salve um recorte só da cabeça (quadrado, fundo transparente de preferência)
// em /public/palestra-caf/ e aponte aqui. Vazio = emoji genérico.
const AVATAR = {
  src:   null,          // ex: '/palestra-caf/rostinho.png'
  label: 'Maria',
}

// ── QUEM ESTÁ FALANDO ──────────────────────────────────────────────────────────
// Salve a foto (retrato, quadrada de preferência) em /public/palestra-caf/
// e aponte em `foto`. Vazio = o slide mostra as iniciais no lugar.
const PERFIL = {
  foto:  '/palestra-caf/gabriel.jpg',
  casal: '/palestra-caf/gabriel-carol.jpg',
  nome:  'Gabriel Schollmeier',
  cargo: 'Fundador da TráfegOn',
  linhas: [
    { icone: '💍', texto: 'Casado com a Carol — advogada, dona do escritório e minha sócia' },
    { icone: '👶', texto: 'E a partir do final deste mês, pai da Maria Júlia' },
  ],
  remate:    'Tudo o que eu vou mostrar hoje roda no escritório da Carol.',
  remateSub: 'Vocês vão ver cada tela. Não é case de cliente — é a nossa própria casa.',
}

// ── CONTATO ────────────────────────────────────────────────────────────────────
const WHATS = {
  numero:   '5548996834253',
  mensagem: 'Oii, sou advogada e vim do material da Camila Masera',
}
const WHATS_URL = `https://wa.me/${WHATS.numero}?text=${encodeURIComponent(WHATS.mensagem)}`

// ── A AGÊNCIA ──────────────────────────────────────────────────────────────────
const AGENCIA = {
  foto:   '/palestra-caf/trafegon-equipe.jpg',
  nome:   'TráfegOn',
  o_que:  'Assessoria de marketing e vendas',
  frase:  'Não fazemos apenas tráfego pago. Implementamos processos de vendas específicos para a advocacia usando a internet.',
  perfis: [
    { arroba: '@trafegon_',         desc: 'a agência' },
    { arroba: '@trafegonjuridico',  desc: 'o braço jurídico' },
  ],
}

// ── O LABORATÓRIO ──────────────────────────────────────────────────────────────
// Números reais do escritório da Carol. Enquanto for null, o slide mostra o que
// falta preencher em vez de inventar dado.
const LAB = {
  periodo:     null,  // ex: 'jan a jul de 2026'
  investido:   null,  // ex: 'R$ 12.400'
  conversas:   null,  // ex: 487
  consultas:   null,  // ex: 96
  contratos:   null,  // ex: 34
  faturamento: null,  // ex: 'R$ 148.000'
}

// ── AS TELAS DO LABORATÓRIO ────────────────────────────────────────────────────
// Deixe estas abas abertas, nesta ordem, antes de começar.
const TELAS = [
  { n: 1, min: 12, aba: 'Google — busca da área da Carol',      mostrar: 'O anúncio dela aparecendo entre os patrocinados' },
  { n: 2, min: 19, aba: 'Google Ads — a campanha da Carol',      mostrar: 'As palavras e a lista de bloqueadas' },
  { n: 3, min: 23, aba: 'Landing page da Carol',                 mostrar: 'A página inteira, do topo ao FAQ · e no celular' },
  { n: 4, min: 27, aba: 'WhatsApp do escritório',                mostrar: 'Uma conversa real, do "oi" até o agendamento' },
  { n: 5, min: 29, aba: 'O CRM',                      mostrar: 'As linhas e a conta investimento ÷ contratos' },
  { n: 6, min: 38, aba: 'O CRM — aba de resultado',         mostrar: 'Conversas, contratos e faturamento do período' },
]

// ══════════════════════════════════════════════════════════════════════════════
//   ROTEIRO DO PALESTRANTE
// ══════════════════════════════════════════════════════════════════════════════

const ROTEIRO = {
  // ── BLOCO 1 · QUEM FALA E POR QUE OUVIR ─────────────────────────────────────
  s1b: {
    min: 'CORTE 1 · ~40s', tag: 'Prioridade: criar vínculo em 40 segundos',
    falas: [
      '"Eu sou o Gabriel, fundador da TráfegOn."',
      '"Sou casado com a Carol, que é advogada e tem escritório próprio. E no fim deste mês a gente vira pai da Maria Júlia."',
      '"A TráfegOn não faz só tráfego pago. A gente implementa processo de vendas para advocacia."',
    ],
    exec: [
      'Sem currículo, sem números de mercado. Aqui é só pertencimento.',
      'CORTE seco no fim da terceira frase.',
    ],
  },
  s1c: {
    min: 'CORTE 2 · ~15s', tag: 'Prioridade: a promessa que segura até o fim',
    falas: [
      '"Tudo o que eu vou mostrar hoje roda no escritório da Carol."',
      '"Não é case de cliente. É a nossa própria casa."',
    ],
    exec: [
      'Duas frases e para. Não explique.',
      'Segure 2 segundos olhando pra câmera antes do corte.',
    ],
  },
  s1: {
    min: 'CORTE 3 · ~30s', tag: 'Prioridade: abrir o vazio de mercado',
    falas: [
      '"No Brasil são um milhão e seiscentos mil advogados."',
      '"Quantos você conhece que anunciam?" — pausa — "e quantos você conhece que anunciam e têm resultado?"',
    ],
    exec: [
      'A pausa entre as duas perguntas é o corte. Não emende.',
    ],
  },

  // ── BLOCO 2 · POR QUE VOCÊ AINDA NÃO ESTÁ LÁ ────────────────────────────────
  s2: {
    min: 'CORTE 4 · ~60s', tag: 'Prioridade: nomear a dor sem entregar a solução',
    falas: [
      '"Duas coisas travam a advogada. A primeira: depender de indicação. Ela é ótima, mas decide sozinha quando vem."',
      '"A segunda: o esforço de produzir conteúdo. Gravar, editar, postar, toda semana. Custa tempo, custa dinheiro — e ainda exige você na frente da câmera."',
      '"Nos dois casos, você está esperando."',
    ],
    exec: [
      '⚠️ NÃO fale de Google aqui. Só a dor.',
      'Não deprecie quem produz conteúdo — o ponto é o esforço, não o valor.',
    ],
  },
  s2b: {
    min: 'CORTE 5 · ~35s', tag: 'Prioridade: provar escala com dois números, não quatro',
    falas: [
      '"Cento e quarenta e sete milhões de brasileiros no WhatsApp — e os mesmos cento e quarenta e sete no Instagram. É a mesma pessoa, em dois lugares."',
      '"O Google faz cinco trilhões de buscas por ano. Setenta e seis por cento das pessoas pesquisam antes de decidir — e isso inclui decidir com qual advogada falar."',
    ],
    exec: [
      'Diga só dois números. Os outros a tela mostra.',
      'Fale "5 trilhões por ano" — é o número que o próprio Google publicou (mar/2025). Os 13,7 bi/dia da tela são essa conta dividida por 365.',
      'Redes sociais: DataReportal / Digital 2026 (out-2025).',
      '⚠️ Os 76% não têm fonte primária. Se alguém perguntar, não defenda — diga "é a ordem de grandeza".',
    ],
  },
  s3c: {
    min: 'CORTE 6 · ~50s', tag: 'Prioridade: justificar a escolha do Google',
    falas: [
      '"O digital não é uma coisa só. São vários caminhos, e todos levam à mesma pessoa."',
      'Passe rápido: "rede social alcança quem ainda não procura. Blog é de graça, mas leva meses. YouTube constrói autoridade, mas exige produção. Indicação é a melhor cliente, mas você não controla o volume."',
      '"O Google aparece hoje, para quem já está procurando. É por ele que a gente começa."',
    ],
    exec: [
      'Este é o corte que justifica os próximos 15 minutos.',
      '⚠️ Todos funcionam. O que muda é tempo, custo e esforço.',
    ],
  },
  s2c: {
    min: 'CORTE 7 · ~45s', tag: 'Prioridade: a diferença entre procurar e ser interrompida',
    falas: [
      '"No Google é intenção. Ela para o que está fazendo e digita — já sabe o que quer."',
      '"No Instagram é atenção. Ela está deitada vendo os stories da Virginia, sem pensar em advogada. Aí aparece o seu anúncio no meio."',
      '"As duas funcionam. Mas são jornadas diferentes."',
    ],
    exec: [
      'Aponte as duas cenas na tela enquanto fala.',
      'O nome da influenciadora fica só na fala — no slide está "@influencer".',
    ],
  },
  s3b: {
    min: 'CORTE 8 · ~45s', tag: 'Prioridade: calibrar a expectativa antes de ensinar',
    falas: [
      '"Cada etapa filtra. De cem que veem o anúncio, quarenta e cinco olham, doze clicam, quatro entram em contato."',
      '"As três primeiras o anúncio faz. As três últimas são você."',
      '"E é por isso que melhorar uma dessas etapas multiplica tudo o que vem depois."',
    ],
    exec: [
      'Desça com o dedo na tela enquanto diz os números.',
      '⚠️ Diga que é ordem de grandeza, não promessa.',
    ],
  },

  // ── BLOCO 3 · COMO FUNCIONA, PEÇA A PEÇA ────────────────────────────────────
  s8: {
    min: 'CORTE 9 · ~50s', tag: 'Prioridade: dar o mapa antes das peças',
    falas: [
      '"Antes de explicar cada pedaço, olha o caminho inteiro. São seis etapas."',
      '"Ela pesquisa, cai na landing page, te chama no WhatsApp, vem pra consulta, recebe a proposta, assina."',
      '"Repara: o anúncio cuida das duas primeiras. As quatro últimas são você."',
      '"E o CRM não é etapa — ele fica embaixo de todas, registrando."',
    ],
    exec: [
      'Passagem rápida. A explicação vem nos próximos cortes.',
    ],
  },
  s4: {
    min: 'CORTE 10 · ~60s', tag: 'Prioridade: a frase que mais destrava',
    falas: [
      '🔴 "No Google, o anúncio é só texto. Um título, duas linhas e o link. Sem arte, sem gravação, sem edição."',
      '"E não precisa de site. Uma landing page basta."',
      '"Criar a conta é de graça, leva dez minutos, você só paga quando alguém clica e pausa quando quiser."',
    ],
    exec: [
      'A primeira frase é a mais importante da palestra inteira para quem tem medo de aparecer.',
      'Aponte o anúncio de exemplo na tela.',
    ],
  },
  s5: {
    min: 'CORTE 11 · ~70s', tag: 'Prioridade: mostrar que cabe numa tarde',
    falas: [
      '"São seis decisões. Nenhuma é técnica — são escolhas de negócio."',
      'Leia as seis apontando: tipo, onde, palavras, o que bloquear, o texto, quanto por dia.',
      '"O que trava não é o Google. É achar que precisa entender o Google antes de começar."',
    ],
    exec: [
      'Pare no passo 3 e leia o exemplo riscado: "ninguém digita ação revisional de alimentos retroativa".',
      'Se quiser aprofundar: até 20% do que a cliente paga, e recuse as recomendações do Google nos primeiros 30 dias.',
    ],
  },
  s6: {
    min: 'CORTE 12 · ~60s', tag: 'Prioridade: uma página com um objetivo só',
    falas: [
      '"Quem, onde e como. É só isso que a landing page precisa responder, em cinco segundos."',
      '"Um botão só. Menu pode, se rolar a própria página — o que não pode é link que leve pra fora."',
      '"E cuidado com a OAB: informe o direito, não prometa resultado."',
    ],
    exec: [
      '⚠️ Diga com que ferramenta se faz a página. É onde a leiga trava.',
      'Se abrir a página da Carol ao vivo, role do topo ao FAQ e mostre no celular.',
    ],
  },
  s7: {
    min: 'CORTE 13 · ~60s', tag: 'Prioridade: o vazamento que ninguém vê',
    falas: [
      '"Não existe campanha que salve atendimento ruim."',
      'Leia as três colunas rápido: o que funciona, o que faz perder cliente, o que não pode faltar.',
      '"O objetivo não é fechar contrato no WhatsApp. É levar para uma consulta."',
    ],
    exec: [
      'Se a sala pedir, os cinco modelos de mensagem estão logo abaixo.',
      '① "Oi, [nome]! Aqui é a [advogada]. Vi que você me chamou sobre [assunto]. Posso te fazer três perguntas rápidas?"',
      '② "O que aconteceu? Desde quando está assim? Você já conversou com algum advogado antes?"',
      '③ "Entendi. Preciso ver seus documentos com calma. Consigo quinta às 14h ou sexta às 10h. Qual fica melhor?"',
      '④ "Passando pra confirmar a consulta amanhã às 14h. Pode trazer o que tiver, mesmo incompleto."',
      '⑤ "Tudo bem? Fiquei à disposição pra falar do seu caso quando você puder."',
    ],
  },
  s7b: {
    min: 'CORTE 14 · ~50s', tag: 'Prioridade: explicar o que é um CRM, sem jargão',
    falas: [
      '"Cada conversa é um cartão. E ele anda da esquerda para a direita."',
      '"Isso tem nome: CRM. Não é sistema caro nem coisa de escritório grande. É um quadro que responde três perguntas: quem me chamou, o que eu já fiz e o que falta fazer."',
      '"Sem ele, a conversa some no meio. E no fim do mês ninguém sabe se o dinheiro do anúncio virou cliente."',
      '"A conta é uma só: investimento dividido por contratos."',
    ],
    exec: [
      'Aponte o cartão da indicação — ela veio de quem entrou por anúncio.',
      'Se abrir o CRM real, faça a divisão na calculadora, ao vivo.',
    ],
  },

  // ── BLOCO 4 · POR QUE A MAIORIA DESISTE ─────────────────────────────────────
  s9: {
    min: 'CORTE 15 · ~70s', tag: 'Prioridade: prever o comportamento dela — pico de autoridade',
    falas: [
      '🔴 "Vou dizer o que vai acontecer nos seus primeiros 30 dias. Lá pelo dia 12 você vai abrir a conta e achar caro. Lá pelo dia 15 você vai responder mais devagar. E o mês vai fechar ruim — não porque a campanha caiu, mas porque você desanimou antes dela."',
      '"Repara nos vinte primeiros dias." — pausa — "quem desligou no dia 15 nunca viu essa parte."',
      '"Consistência no que é controlável. Resultado é efeito colateral."',
      '"Um mês é montanha-russa. Três meses sobrepostos viram uma linha."',
    ],
    exec: [
      'Fale a previsão ANTES de mostrar o gráfico. É a ordem que gera autoridade.',
      '🔴 O gráfico é ilustrativo enquanto PRINTS.crmCurva estiver vazio. Não diga que é da Carol até trocar.',
      'Rotina diária, 15 min: responder as novas, confirmar as de amanhã, voltar a chamar quem sumiu, anotar.',
    ],
  },
  s10: {
    min: 'CORTE 16 · ~60s', tag: 'Prioridade: reconciliar a indicação — momento da foto',
    falas: [
      '"Vocês acabaram de calcular quanto custa uma cliente. Esse número está errado, e pra pior. Porque você não compra uma causa. Compra uma cliente."',
      '"Em família, a mesma cliente volta três, quatro vezes ao longo da vida. Divórcio hoje, alimentos depois, guarda, o inventário do pai dela anos à frente."',
      '"Eu comecei falando mal da indicação. Não era bem isso — o problema é depender dela sem controlar a entrada."',
      '🔴 "O tráfego pago não substitui a indicação. Ele abastece a indicação." → PAUSA DE 5 SEGUNDOS',
    ],
    exec: [
      'A pausa depois da última frase é obrigatória. É o slide da foto.',
    ],
  },
  s10b0: {
    min: 'CORTE 17 · ~45s', tag: 'Prioridade: prova real — a cliente que voltou',
    falas: [
      '"Ana. Chegou em fevereiro por uma consulta de consumidor, cento e cinquenta reais."',
      '"Fechou a ação por oitocentos mais trinta por cento. Em julho voltou, agora por divórcio. Hoje a gente negocia um contrato de cinco mil e quinhentos."',
      '"Valor da cliente no tempo: seis mil, quatrocentos e cinquenta."',
    ],
    exec: [
      'Aponte o print da direita: é ela pedindo indicação de advogado de divórcio — para a própria advogada.',
    ],
  },
  s10b1: {
    min: 'CORTE 18 · ~35s', tag: 'Prioridade: a que "não deu certo" e voltou',
    falas: [
      '"Katina. Consulta em março, duzentos reais. Não havia o que fazer, não virou contrato."',
      '"Em julho ela voltou sozinha — o advogado dela tinha abandonado o caso."',
      '"Ela não virou contrato em março. Virou em julho, porque a gente continuou existindo pra ela."',
    ],
    exec: [
      'Este é o corte que responde a objeção "mas nem todo lead fecha".',
    ],
  },
  s10b2: {
    min: 'CORTE 19 · ~40s', tag: 'Prioridade: a que disse não ter dinheiro',
    falas: [
      '"Dayane. Primeiro contato em abril, disse que não tinha como pagar."',
      '"Em maio voltou, pagou trezentos de consulta e fechou o serviço em dez vezes de duzentos e cinquenta."',
      '"Quem olha só o primeiro contrato acha caro. Quem olha a cliente inteira, não."',
    ],
    exec: [
      'Fecha o bloco das provas. Depois disso, só recap e chamada.',
    ],
  },

  // ── BLOCO 5 · FECHAMENTO ────────────────────────────────────────────────────
  s3: {
    min: 'CORTE 20 · ~60s', tag: 'Prioridade: dar o próximo passo, não o plano inteiro',
    falas: [
      '"Tráfego pago não é deu certo ou não deu. São oito degraus, na ordem."',
      '"O que conta como vitória muda a cada degrau. Quem só comemora contrato desiste antes de chegar no contrato."',
      '"Sobe um por vez. Só trabalhe no degrau seguinte ao seu, e mexa em uma coisa de cada vez."',
      '"Qual degrau você vai subir na segunda-feira?"',
    ],
    exec: [
      'Aponte três degraus só: o 1, o 4 e o 7. O resto a tela mostra.',
      'A exceção, se sobrar tempo: "alguém vai fechar na primeira semana. É sorte, e sorte não te diz o que repetir."',
      'O botão do WhatsApp está no canto — mencione que está no material.',
    ],
  },
  sfim: {
    min: 'CORTE 21 · ~30s', tag: 'Prioridade: uma ação, sem rodeio',
    falas: [
      '"Obrigado por ficarem até aqui."',
      '"Eu acabei de publicar um post no @trafegonjuridico. Comenta DEGRAU nele e eu te mando todo o material desta aula, mais um bônus aprofundando Google Ads."',
      '"Faz agora. Eu espero."',
    ],
    exec: [
      '⚠️ O post precisa estar publicado ANTES. Se não existir, a chamada morre.',
      'Se for ao vivo: espere dez segundos em silêncio e deixe esta tela no ar durante as perguntas.',
      'Decida antes se a DM vai ser automática ou manual.',
    ],
  },
}

function Roteiro({ id }) {
  const r = ROTEIRO[id]
  if (!r) {
    return (
      <div className="h-full flex items-center justify-center text-white/40 text-base" style={{ background: '#0f1018' }}>
        Roteiro ainda não escrito para este slide.
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col p-8 gap-4 overflow-auto" style={{ background: '#0f1018' }}>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="px-3 py-1 rounded-lg text-lg font-black tabular-nums" style={{ background: G, color: DARK }}>{r.min} min</span>
        <span className="text-white/60 text-lg font-semibold">{r.tag}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: G }}>O que falar</div>
        {r.falas.map((f, i) => (
          <div key={i} className="rounded-xl px-5 py-3 text-white/90 text-[19px] leading-relaxed"
            style={{ background: '#1e2035', borderLeft: `3px solid ${G}` }}>{f}</div>
        ))}
      </div>

      {r.exec.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Execução e marcações</div>
          {r.exec.map((e, i) => (
            <div key={i} className="flex gap-3 text-white/75 text-lg leading-relaxed">
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

// A Maria acompanhando a apresentação: aparece flutuando no canto de cada
// slide em que ela está vivendo aquela etapa.
function Maria({ diz, etapa }) {
  return (
    <motion.div className="absolute z-20 flex items-center gap-3"
      style={{ right: 40, top: 14, maxWidth: 400 }}
      initial={{ opacity: 0, x: 22, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.75, type: 'spring', stiffness: 190, damping: 16 }}>
      <motion.div className="rounded-2xl rounded-br-sm px-4 py-2.5"
        style={{ background: G, color: DARK, boxShadow: '0 8px 26px rgba(0,0,0,0.45)' }}
        animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-black uppercase tracking-widest" style={{ opacity: 0.55 }}>Maria</span>
          {etapa && (
            <span className="text-[12px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: DARK, color: G }}>{etapa}</span>
          )}
        </div>
        <div className="text-[17px] font-bold leading-snug">{diz}</div>
      </motion.div>
      <div className="relative flex-shrink-0" style={{ width: 62, height: 62 }}>
        <motion.span className="absolute inset-0 rounded-full" style={{ background: G }}
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />
        <motion.div className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: G, border: `3px solid ${DARK}`, boxShadow: `0 0 0 2px ${G}` }}
          animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
          {AVATAR.src
            ? <img src={AVATAR.src} alt="Maria" className="w-full h-full object-cover" />
            : <span style={{ fontSize: 36, lineHeight: 1 }}>👩</span>}
        </motion.div>
      </div>
    </motion.div>
  )
}

function Handle() {
  return (
    <div className="absolute left-10 right-10 flex items-center gap-2 z-10 pointer-events-none"
      style={{ bottom: 14 }}>
      <span className="text-[17px]">📲</span>
      <span className="text-[16px] font-black tracking-wide" style={{ color: '#ffffff', opacity: 0.8 }}>
        @trafegonjuridico
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//   SLIDES
// ══════════════════════════════════════════════════════════════════════════════

// 1 · A OPORTUNIDADE ───────────────────────────────────────────────────────────
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
          <motion.div className="inline-block px-4 py-1.5 rounded-full text-[15px] font-black tracking-widest mb-6"
            style={{ background: G, color: NAVY }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            DO ZERO AO PRIMEIRO CONTRATO
          </motion.div>
          <motion.div className="font-black text-white leading-none"
            style={{ fontSize: '7rem', letterSpacing: '-5px', textShadow: '0 8px 40px rgba(0,0,0,0.35)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            1.610.616
          </motion.div>
          <motion.div className="text-white/70 text-lg font-semibold mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            advogadas e advogados inscritos na OAB
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}
            className="inline-block px-10 py-4 rounded-full font-black text-white text-2xl shadow-2xl"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)' }}>
            E quantos você conhece que anunciam e têm resultado?
          </motion.div>
        </motion.div>
        <Handle />
      </div>
    </Wrap>
  )
}

// 1B · QUEM ESTÁ FALANDO ───────────────────────────────────────────────────────
function S1B({ mode }) {
  const iniciais = PERFIL.nome.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Wrap mode={mode} id="s1b">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.h2 className="text-3xl font-black text-white leading-none"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          Quem está falando com vocês
        </motion.h2>

        <div className="flex items-center gap-7">
          <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 140, delay: 0.1 }}
            className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ width: 200, height: 252, border: `3px solid ${G}`, boxShadow: `0 10px 34px rgba(0,0,0,0.4)`, background: 'rgba(0,0,0,0.3)' }}>
            {PERFIL.foto
              ? <img src={PERFIL.foto} alt={PERFIL.nome} className="w-full h-full object-cover" style={{ objectPosition: 'center 22%' }} />
              : <span className="font-black text-6xl" style={{ color: G, opacity: 0.5 }}>{iniciais}</span>}
          </motion.div>

          {PERFIL.casal && (
            <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 140, delay: 0.2 }}
              className="flex-shrink-0 rounded-2xl overflow-hidden"
              style={{ width: 200, height: 252, border: "3px solid rgba(255,255,255,0.22)", boxShadow: '0 10px 34px rgba(0,0,0,0.4)' }}>
              <img src={PERFIL.casal} alt="Gabriel e Carol" className="w-full h-full object-cover" style={{ objectPosition: 'center 38%' }} />
            </motion.div>
          )}

          <div className="flex-1 flex flex-col gap-2.5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <div className="font-black text-white" style={{ fontSize: '2.6rem', letterSpacing: '-1.5px', lineHeight: 1 }}>
                {PERFIL.nome}
              </div>
              <div className="font-black text-xl mt-1.5" style={{ color: G }}>{PERFIL.cargo}</div>
            </motion.div>
            {PERFIL.linhas.map((l, i) => (
              <motion.div key={l.texto} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.12 }}
                className="flex items-center gap-3 rounded-xl px-5 py-2"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <span className="text-xl">{l.icone}</span>
                <span className="text-white/90 text-[19px] font-semibold">{l.texto}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="rounded-2xl overflow-hidden flex items-stretch gap-0"
          style={{ background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 168 }}>
            <img src={AGENCIA.foto} alt={AGENCIA.nome} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 px-6 py-3.5">
            <div className="flex items-baseline gap-3">
              <span className="font-black text-white text-2xl leading-none">{AGENCIA.nome}</span>
              <span className="font-black text-lg" style={{ color: G }}>{AGENCIA.o_que}</span>
            </div>
            <p className="text-white/75 text-lg leading-snug mt-1.5">{AGENCIA.frase}</p>
            <div className="flex flex-wrap items-stretch gap-3 mt-3.5">
              {AGENCIA.perfis.map(p => (
                <motion.span key={p.arroba}
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl"
                  style={{ background: G, boxShadow: `0 6px 22px ${G}40` }}>
                  <span className="text-2xl">📲</span>
                  <span className="flex flex-col leading-none">
                    <span className="font-black" style={{ color: DARK, fontSize: '1.55rem', letterSpacing: '-0.5px' }}>
                      {p.arroba}
                    </span>
                    <span className="font-bold mt-1" style={{ color: DARK, opacity: 0.6, fontSize: '0.95rem' }}>
                      {p.desc}
                    </span>
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 1C · O LABORATÓRIO ───────────────────────────────────────────────────────────
function S1C({ mode }) {
  return (
    <Wrap mode={mode} id="s1c">
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-16"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 130 }}
          className="text-7xl mb-7">⚖️</motion.div>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-black text-white text-center leading-tight"
          style={{ fontSize: '3.1rem', letterSpacing: '-1.5px', maxWidth: 1000 }}>
          {PERFIL.remate}
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-white/70 text-center mt-5"
          style={{ fontSize: '1.4rem', maxWidth: 860 }}>
          {PERFIL.remateSub}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-8 rounded-full" style={{ width: 160, height: 4, background: G }} />
      </div>
    </Wrap>
  )
}

// 2 · OS DOIS INIMIGOS ─────────────────────────────────────────────────────────
function S02({ mode }) {
  const inimigos = [
    { icon: '📞', color: RED,    t: 'Depender de indicação',
      d: 'A indicação é ótima. O problema é depender dela — ela decide sozinha quando vem.',
      p: '"Quantos clientes você vai ter em setembro? Ninguém sabe."' },
    { icon: '🎬', color: ORANGE, t: 'O esforço de produzir conteúdo',
      d: 'Pensar o tema, gravar, editar, postar. Toda semana, sem parar. Custa tempo, custa dinheiro — e ainda exige você na frente da câmera.',
      p: '"Nem todo mundo tem esse tempo. E nem todo mundo quer se expor."' },
  ]
  return (
    <Wrap mode={mode} id="s2">
      <div className="h-full flex flex-col px-10 pt-8 pb-12 gap-5 justify-center relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.h2 className="text-4xl font-black text-white text-center"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          Os dois inimigos
        </motion.h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {inimigos.map((x, i) => (
            <motion.div key={x.t}
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.12, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-9 flex flex-col gap-5 justify-center"
              style={{ background: x.color + '0d', border: `1px solid ${x.color}30` }}>
              <div className="text-6xl">{x.icon}</div>
              <div className="font-black leading-tight" style={{ color: x.color, fontSize: '2.1rem', letterSpacing: '-1px' }}>{x.t}</div>
              <div className="text-white/85 text-xl leading-relaxed">{x.d}</div>
              <div className="text-white/55 text-xl italic mt-auto">{x.p}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="rounded-xl px-7 py-5 text-center flex-shrink-0" style={{ background: '#1e2035' }}>
          <p className="text-white/85 text-xl">
            Nos dois casos você está <span className="font-black text-white">esperando</span>: ou a boa vontade de quem indica, ou o algoritmo gostar do seu vídeo.
          </p>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 2B · O MERCADO ───────────────────────────────────────────────────────────────
function S2B({ mode }) {
  const stats = [
    { plat: 'Instagram', valor: '147 mi', label: 'usuários ativos no Brasil',                cor: '#be29ec', icon: '📸' },
    { plat: 'Facebook',  valor: '109 mi', label: 'usuários ativos no Brasil',                cor: '#1877f2', icon: '👥' },
    { plat: 'WhatsApp',  valor: '147 mi', label: 'brasileiros — 2º maior mercado do mundo',  cor: '#25d366', icon: '💬' },
    { plat: 'Google',    valor: '13,7 bi', label: 'buscas realizadas por dia no mundo',      cor: '#4285f4', icon: '🔍' },
  ]
  const insights = [
    '76% dos consumidores pesquisam no Google antes de decidir',
    '185 milhões de brasileiros com acesso à internet',
    'O brasileiro passa 3h32 por dia em redes sociais — o maior tempo do mundo',
    'Quem não aparece na hora certa simplesmente não existe para essa pessoa',
  ]
  return (
    <Wrap mode={mode} id="s2b">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Onde as pessoas já estão</h2>
          <p className="text-white/60 text-lg mt-1.5">
            Não é sobre gostar de internet. É sobre estar onde está a atenção das pessoas
            <span className="ml-1.5 text-lg align-middle">👀</span>
            <span className="ml-1 text-lg align-middle">👂</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-4 gap-4" style={{ flex: '1.25 1 0%', minHeight: 0 }}>
          {stats.map((s, i) => (
            <motion.div key={s.plat}
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-6 flex flex-col justify-center gap-2"
              style={{ background: s.cor + '10', border: `1px solid ${s.cor}38` }}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[17px] font-black tracking-widest uppercase" style={{ color: s.cor }}>{s.plat}</span>
              </div>
              <div className="font-black text-white leading-none" style={{ fontSize: '4.2rem', letterSpacing: '-3px' }}>
                {s.valor}
              </div>
              <div className="text-white/70 text-xl leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3" style={{ flex: '1 1 0%', minHeight: 0 }}>
          {insights.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.09 }}
              className="rounded-xl px-6 flex items-center gap-4" style={{ background: '#0f1018' }}>
              <span className="text-2xl flex-shrink-0" style={{ color: G }}>↗</span>
              <span className="text-white/90 text-2xl leading-snug font-semibold">{t}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </Wrap>
  )
}

// 2C · GOOGLE E META ───────────────────────────────────────────────────────────
function S2C({ mode }) {
  const logicas = [
    { icon: '🔍', t: 'Google = intenção', cor: G,
      d: 'Captura quem já está procurando. Ela digitou "advogada de divórcio" — você aparece no momento exato da decisão.' },
    { icon: '📲', t: 'Meta = atenção', cor: BLUE,
      d: 'Interrompe quem ainda não sabe que quer. Você desperta a necessidade antes de a busca existir.' },
    { icon: '🚀', t: 'Os dois juntos', cor: ORANGE,
      d: 'Captura quem está pronta agora e gera lembrança em quem ainda não está. É o cenário completo.' },
  ]
  return (
    <Wrap mode={mode} id="s2c">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 justify-center relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Lógicas opostas que se completam</h2>
          <p className="text-white/55 text-lg mt-1.5">As duas funcionam. Mas com jornadas diferentes.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          {logicas.slice(0, 2).map((l, i) => (
            <motion.div key={l.t}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.12, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: l.cor + '0d', border: `1px solid ${l.cor}38` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: l.cor + '1a', border: `1px solid ${l.cor}40` }}>{l.icon}</div>
                <div className="font-black text-xl leading-tight" style={{ color: l.cor }}>{l.t}</div>
              </div>

              {/* a cena */}
              <div className="flex-1 min-h-0 flex items-center justify-center">
                {i === 0 && (
                  <div className="w-full flex flex-col gap-3">
                    <div className="rounded-2xl rounded-bl-sm px-4 py-2.5 self-start"
                      style={{ background: 'rgba(255,255,255,0.07)', maxWidth: '92%' }}>
                      <span className="text-white/85 text-[17px]">💭 "Preciso de uma advogada de divórcio…"</span>
                    </div>
                    <div className="rounded-full px-5 py-3 flex items-center gap-3"
                      style={{ background: 'white' }}>
                      <span className="text-lg">🔍</span>
                      <span className="text-[17px] text-gray-800">advogada de divórcio florianópolis</span>
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
                        style={{ width: 2, height: 20, background: '#333' }} />
                    </div>
                    <div className="text-center text-[15px] font-bold" style={{ color: l.cor }}>ela procurou você</div>
                  </div>
                )}
                {i === 1 && (
                  <div className="w-full flex flex-col gap-2">
                    <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <span className="rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#f58529,#dd2a7b)' }} />
                      <div className="min-w-0">
                        <div className="text-white/85 text-[15px] font-semibold">@influencer · 2 min</div>
                        <div className="text-white/40 text-[14px]">rolando o feed, sem pensar em advogada</div>
                      </div>
                    </div>
                    <div className="text-center text-white/30 text-lg leading-none">⌄</div>
                    <motion.div initial={{ scale: 0.94 }} animate={{ scale: [0.97, 1, 0.97] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="rounded-xl px-4 py-3"
                      style={{ background: l.cor + '1e', border: `1.5px solid ${l.cor}70` }}>
                      <div className="text-[13px] font-black tracking-widest" style={{ color: l.cor }}>PATROCINADO</div>
                      <div className="text-white text-[16px] font-bold leading-snug mt-0.5">
                        "Você sabia que pode revisar a pensão?"
                      </div>
                    </motion.div>
                    <div className="text-center text-[15px] font-bold" style={{ color: l.cor }}>você interrompeu ela</div>
                  </div>
                )}
                {i === 2 && (
                  <div className="w-full flex flex-col items-center gap-2.5">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg px-3 py-2 text-[15px] font-bold" style={{ background: G + '1e', color: G }}>🔍 procura</span>
                      <span className="rounded-lg px-3 py-2 text-[15px] font-bold" style={{ background: BLUE + '1e', color: '#93c5fd' }}>📲 descobre</span>
                    </div>
                    <div className="text-white/30 text-lg leading-none">↓</div>
                    <div className="rounded-xl px-5 py-3 text-center w-full"
                      style={{ background: l.cor + '1e', border: `1.5px solid ${l.cor}70` }}>
                      <span className="text-white font-black text-[17px]">a mesma pessoa, em dois momentos</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-white/75 text-[17px] leading-relaxed">{l.d}</div>
            </motion.div>
          ))}
        </div>

        {/* os dois juntos, embaixo */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl px-7 py-4 flex items-center gap-6 flex-shrink-0"
          style={{ background: ORANGE + '12', border: `1px solid ${ORANGE}45` }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: ORANGE + '1a', border: `1px solid ${ORANGE}40` }}>🚀</div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="rounded-lg px-3 py-2 text-[15px] font-bold" style={{ background: G + '1e', color: G }}>🔍 procura</span>
            <span className="text-white/30 text-lg">+</span>
            <span className="rounded-lg px-3 py-2 text-[15px] font-bold" style={{ background: BLUE + '1e', color: '#93c5fd' }}>📲 descobre</span>
          </div>
          <div className="flex-1">
            <div className="font-black text-xl leading-tight" style={{ color: ORANGE }}>
              Os dois juntos — a mesma pessoa, em dois momentos
            </div>
            <div className="text-white/75 text-[17px] leading-snug mt-0.5">
              Captura quem está pronta agora e gera lembrança em quem ainda não está. É o cenário completo.
            </div>
          </div>
        </motion.div>

      </div>
    </Wrap>
  )
}

// 3C · OS CAMINHOS DO DIGITAL ──────────────────────────────────────────────────
function S3C({ mode }) {
  const caminhos = [
    { icon: '📱', n: 'Redes sociais', d: 'Alcança quem ainda não procura. Exige constância.',   c: '#be29ec' },
    { icon: '✍️', n: 'Blog e SEO',    d: 'Aparece na busca sem pagar. Leva meses.',              c: CYAN },
    { icon: '🎥', n: 'YouTube',       d: 'Constrói autoridade. Exige produção.',                 c: RED },
    { icon: '🤝', n: 'Indicação',     d: 'A melhor cliente. Você não controla o volume.',        c: GOLD },
    { icon: '🔍', n: 'Google',        d: 'Aparece hoje, para quem já está procurando.',          c: G, escolhido: true },
  ]
  return (
    <Wrap mode={mode} id="s3c">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">O digital tem vários caminhos</h2>
          <p className="text-white/60 text-xl mt-2">
            Todos levam à mesma pessoa. O que muda é <span className="text-white font-bold">quanto tempo</span>,
            <span className="text-white font-bold"> quanto custa</span> e
            <span className="text-white font-bold"> quanto esforço</span> cada um exige de você.
          </p>
        </motion.div>

        <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
          {caminhos.map((c, i) => (
            <motion.div key={c.n}
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.1, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-5 flex flex-col gap-3 justify-center relative"
              style={{
                background: c.escolhido ? c.c + '1a' : 'rgba(255,255,255,0.03)',
                border: `${c.escolhido ? 2 : 1}px solid ${c.c}${c.escolhido ? '' : '35'}`,
                boxShadow: c.escolhido ? `0 0 30px ${c.c}25` : 'none',
              }}>
              {c.escolhido && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[13px] font-black tracking-widest whitespace-nowrap"
                  style={{ background: c.c, color: DARK }}>O QUE VAMOS FALAR HOJE</div>
              )}
              <div className="text-5xl">{c.icon}</div>
              <div className="font-black text-2xl leading-tight" style={{ color: c.c }}>{c.n}</div>
              <div className="text-white/75 text-lg leading-snug">{c.d}</div>
            </motion.div>
          ))}
        </div>

        {/* convergência */}
        <div className="flex-shrink-0">
          <div className="grid grid-cols-5">
            {caminhos.map(c => (
              <div key={c.n} className="flex justify-center">
                <div style={{ width: 2, height: 18, background: c.c, opacity: c.escolhido ? 1 : 0.35 }} />
              </div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="rounded-2xl px-7 py-4 flex items-center justify-center gap-4"
            style={{ background: G + '14', border: `1.5px solid ${G}55` }}>
            <span className="text-3xl">👩</span>
            <span className="text-white font-black text-2xl">Uma cliente que precisa de você</span>
          </motion.div>
        </div>
      </div>
    </Wrap>
  )
}

// 3 · A ESCADA ─────────────────────────────────────────────────────────────────
const DEGRAUS = [
  { n: 1, fato: 'Campanha no ar',                 ajuste: 'Não mexer por 14 dias' },
  { n: 2, fato: 'Apareceram cliques',             ajuste: 'Ver o que digitaram e bloquear o que não serve' },
  { n: 3, fato: 'Alguém te chamou',               ajuste: 'Repetir na landing page as palavras que trouxeram' },
  { n: 4, fato: 'Chamou alguém da sua área',      ajuste: 'Bloquear o resto, investir no que acertou' },
  { n: 5, fato: 'Marcou consulta',                ajuste: 'Padronizar o roteiro e o tempo de resposta' },
  { n: 6, fato: 'Apareceu na consulta',           ajuste: 'Lembrete na véspera' },
  { n: 7, fato: 'Assinou contrato',               ajuste: 'investimento ÷ contratos' },
  { n: 8, fato: 'Assinou o segundo, o terceiro…'  , ajuste: 'Crescer de propósito' },
]

function S03({ mode }) {
  const cor = n => (n <= 3 ? G : n <= 7 ? GOLD : PUR)
  return (
    <Wrap mode={mode} id="s3">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
          <h2 className="font-black text-white leading-none"
            style={{ fontSize: '3.6rem', letterSpacing: '-2px' }}>
            Qual degrau você vai subir <span style={{ color: G }}>na segunda-feira?</span>
          </h2>
        </motion.div>

        {/* Chamada — usa o vazio que a escada deixa embaixo à direita */}
        <motion.a href={WHATS_URL} target="_blank" rel="noreferrer"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 150 }}
          className="absolute z-20 rounded-xl px-4 py-3 flex flex-col gap-2 no-underline"
          style={{
            right: 32, bottom: 52, width: 252,
            background: 'rgba(0,0,0,0.55)', border: `1px solid ${G}60`,
            backdropFilter: 'blur(6px)', boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
          }}>
          <div className="text-white font-black text-[15px] leading-snug">
            A gente sobe esses degraus com você.
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg py-2"
            style={{ background: '#25D366' }}>
            <span className="text-base">💬</span>
            <span className="font-black text-[14px]" style={{ color: '#0b2d17' }}>Falar no WhatsApp</span>
          </div>
        </motion.a>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="relative w-full" style={{ maxWidth: 940 }}>
            {/* estágios */}
            <div className="absolute left-0 flex flex-col gap-1.5" style={{ top: 0, bottom: 0, width: 116 }}>
              {[
                { l: 'CRESCER', c: PUR,  f: 1 },
                { l: 'MEDIR',   c: GOLD, f: 4 },
                { l: 'EXISTIR', c: G,    f: 3 },
              ].map(z => (
                <div key={z.l} className="rounded-lg flex items-center justify-center"
                  style={{ flex: z.f, background: z.c, opacity: 0.92 }}>
                  <span className="font-black text-[15px] tracking-widest whitespace-nowrap" style={{ color: '#0d0f1a' }}>
                    {z.l}
                  </span>
                </div>
              ))}
            </div>

            {/* a escada */}
            <div className="flex flex-col" style={{ marginLeft: 132 }}>
              {[...DEGRAUS].reverse().map((d, i) => (
                <motion.div key={d.n}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (7 - i) * 0.07, type: 'spring', stiffness: 190 }}
                  className="flex items-center gap-4 px-4"
                  style={{
                    width: '54%',
                    height: 56,
                    marginLeft: `${(d.n - 1) * 5.2}%`,
                    background: '#181c30',
                    borderTop: `3px solid ${cor(d.n)}`,
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                    borderTopRightRadius: 6,
                    boxShadow: '0 -2px 12px rgba(0,0,0,0.4)',
                  }}>
                  <div className="rounded-lg flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={{ width: 36, height: 36, background: cor(d.n), color: '#0d0f1a' }}>{d.n}</div>
                  <div className="text-white font-black text-[22px] leading-tight truncate">{d.fato}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 3B · DA INTERNET AO CONTRATO ─────────────────────────────────────────────────
function S3B({ mode }) {
  const etapas = [
    { t: 'Anúncio',           p: '100%', icon: '📢', cor: '#5b6289' },
    { t: 'Visualização',      p: '45%',  icon: '👁️', cor: BLUE },
    { t: 'Clique',            p: '12%',  icon: '🖱️', cor: CYAN },
    { t: 'Contato',           p: '4%',   icon: '📥', cor: GOLD },
    { t: 'Contato certo',     p: '2%',   icon: '✅', cor: ORANGE },
    { t: 'Cliente',           p: '10%',  icon: '🤝', cor: G },
  ]
  return (
    <Wrap mode={mode} id="s3b">
      <div className="h-full flex flex-col px-10 pt-5 pb-12 gap-2.5 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Da internet ao contrato</h2>
          <p className="text-white/50 text-lg mt-1">Cada etapa filtra — só uma parte chega ao final.</p>
        </motion.div>

        {/* Os dois anúncios */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-xl px-4 py-2.5" style={{ background: '#4285f410', border: '1px solid #4285f435' }}>
            <div className="text-[14px] mb-0.5" style={{ color: '#8ab4f8' }}>🔍 Anúncio · advogadacaroline.com.br</div>
            <div className="text-[18px] font-bold underline" style={{ color: '#8ab4f8' }}>Advogada de Família em Florianópolis</div>
            <div className="text-[14px] text-white/50 mt-0.5">Divórcio, guarda e pensão · OAB/SC 00.000 · Falar agora</div>
            <div className="flex gap-1.5 mt-1.5">
              {['Divórcio', 'Guarda', 'Inventário'].map(s => (
                <span key={s} className="text-[14px] px-1.5 py-0.5 rounded" style={{ background: '#4285f41e', color: '#8ab4f8' }}>{s}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
            className="rounded-xl px-4 py-2.5" style={{ background: '#be29ec10', border: '1px solid #be29ec35' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full block" style={{ width: 18, height: 18, background: 'linear-gradient(135deg,#f58529,#dd2a7b)' }} />
                <span className="text-[16px] text-white/85 font-semibold">@advogadacaroline</span>
              </div>
              <span className="text-[13px]" style={{ color: '#d98fee' }}>Patrocinado</span>
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <span className="rounded flex items-center justify-center text-lg"
                style={{ width: 38, height: 38, background: '#be29ec1e' }}>📸</span>
              <div>
                <div className="text-[16px] text-white/70">Criativo do anúncio</div>
                <div className="text-[16px] font-bold" style={{ color: '#d98fee' }}>Falar agora ›</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
          <span className="text-white/30 text-base">↓</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
        </div>

        {/* As etapas */}
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex flex-col gap-2.5 flex-shrink-0" style={{ width: 54 }}>
            {[
              { l: 'Gerar demanda', c: '#60a5fa' },
              { l: 'Converter',     c: G },
            ].map(z => (
              <div key={z.l} className="rounded-xl flex items-center justify-center flex-1 overflow-hidden"
                style={{ background: z.c + '16', border: `1.5px solid ${z.c}45` }}>
                <span className="font-black text-[22px] tracking-wide whitespace-nowrap"
                  style={{ color: z.c, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{z.l}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col gap-1.5 justify-center">
            {etapas.map((e, i) => (
              <motion.div key={e.t}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.09, type: 'spring', stiffness: 170 }}
                className="rounded-lg px-4 py-2 flex items-center justify-between gap-4"
                style={{
                  marginLeft: i * 26, marginRight: i * 12,
                  background: e.cor + '14', border: `1px solid ${e.cor}40`,
                }}>
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{e.icon}</span>
                  <span className="font-bold text-white text-[19px]">{e.t}</span>
                </span>
                <span className="font-black text-[19px] tabular-nums" style={{ color: e.cor }}>{e.p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// 4 · COMO FUNCIONA ────────────────────────────────────────────────────────────
function S04({ mode }) {
  const caminho = ['ela digita', 'vê seu anúncio', 'clica', 'cai na sua landing page', 'te chama no WhatsApp']
  const regras = [
    { icon: '👆', t: 'Só paga quando clicam' },
    { icon: '🔒', t: 'Você define o investimento diário' },
    { icon: '⚖️', t: 'Página melhor paga menos' },
  ]
  return (
    <Wrap mode={mode} id="s4">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 justify-center relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-3xl font-black text-white leading-none">Como isso funciona, na prática</h2>
        </motion.div>

        {/* O caminho */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-1.5">
          {caminho.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex-1 flex items-center gap-1.5">
              <div className="flex-1 rounded-lg py-2 px-2 text-center text-[17px] font-bold text-white/85"
                style={{ background: i === 4 ? G + '1a' : '#1e2035', border: i === 4 ? `1px solid ${G}55` : 'none' }}>
                {c}
              </div>
              {i < 4 && <span className="text-white/25 text-base">→</span>}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex-1 grid gap-4 min-h-0" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
          {/* O anúncio é texto */}
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-6 flex flex-col justify-center gap-5" style={{ background: G + '10', border: `1.5px solid ${G}45` }}>
            <div className="font-black text-white text-2xl leading-tight">
              No Google, o anúncio é <span style={{ color: G }}>só texto</span>.
            </div>
            <div className="rounded-lg px-5 py-4" style={{ background: 'white' }}>
              <div className="text-[15px] font-bold text-gray-700 mb-1">Patrocinado</div>
              <div className="text-[24px] font-bold leading-snug" style={{ color: '#1a0dab' }}>Advogada de Família em Florianópolis</div>
              <div className="text-[17px] text-gray-600 leading-snug mt-1">
                Divórcio, guarda e pensão. OAB/SC 00.000.<br />Atendimento com hora marcada, presencial ou online.
              </div>
            </div>
            <div className="text-white/80 text-xl leading-relaxed">
              Um título, duas linhas e o link. Você escreve num campo e pronto.
              <span className="text-white font-bold"> Sem arte, sem gravação, sem edição.</span>
            </div>
          </motion.div>

          {/* Regras do dinheiro + a conta */}
          <div className="flex flex-col gap-3">
            {regras.map((r, i) => (
              <motion.div key={r.t} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl px-5 flex-1 flex items-center gap-4" style={{ background: '#0f1018' }}>
                <span className="text-3xl">{r.icon}</span>
                <span className="text-white/90 text-xl font-semibold">{r.t}</span>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}
              className="rounded-xl px-5 py-4 flex-1 flex flex-col justify-center" style={{ background: BLUE + '12', border: `1px solid ${BLUE}35` }}>
              <div className="text-white/90 text-xl leading-relaxed">
                Criar a conta é <span className="text-white font-bold">de graça</span> e leva uns 10 minutos.
                Você <span className="text-white font-bold">não precisa de site</span> — uma landing page basta. E dá pra pausar quando quiser.
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </Wrap>
  )
}

// 5 · A CAMPANHA ───────────────────────────────────────────────────────────────
function S05({ mode }) {
  const passos = [
    { n: '1', t: 'Tipo de campanha',  d: 'Pesquisa', nota: 'o anúncio que aparece quando alguém digita' },
    { n: '2', t: 'Onde aparecer',     d: 'Florianópolis + 20 km', nota: 'ou o Brasil todo, se você atende online' },
    { n: '3', t: 'As palavras',       d: '"advogada de família florianópolis" · "advogada de divórcio florianópolis" · "advogada de inventário florianópolis"', exemplo: true },
    { n: '4', t: 'O que bloquear',    d: 'grátis · defensoria · curso · concurso · modelo de petição · calculadora de pensão' },
    { n: '5', t: 'O texto do anúncio', d: '"Advogada de Família em Florianópolis — OAB/SC 00.000. Divórcio, guarda e pensão."' },
    { n: '6', t: 'Quanto por dia',    d: 'R$ ____ , fixo', nota: 'o mesmo valor todos os dias, por 30 dias' },
  ]
  return (
    <Wrap mode={mode} id="s5">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Maria etapa="etapa 1 · busca" diz="Preciso encontrar uma advogada de divórcio aqui perto." />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 flex items-baseline gap-4" style={{ paddingRight: 400 }}>
          <h2 className="text-4xl font-black text-white leading-none">Campanha de pesquisa no Google</h2>
          <span className="text-white/40 text-lg font-semibold">seis decisões, e só isso</span>
        </motion.div>

        {/* a ficha da campanha, preenchida */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
          style={{ background: '#0f1018', border: `1px solid ${G}30` }}>
          {passos.map((p, i) => (
            <motion.div key={p.n} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex-1 flex items-center gap-5 px-7"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-xl flex-shrink-0"
                style={{ background: G + '1a', border: `1.5px solid ${G}70`, color: G }}>{p.n}</span>
              <span className="text-white/70 text-[19px] font-semibold flex-shrink-0" style={{ width: 210 }}>{p.t}</span>
              <span className="flex-1 min-w-0">
                <span className="font-black text-[22px]" style={{ color: G }}>{p.d}</span>
                {p.nota && <span className="text-white/55 text-[18px]"> — {p.nota}</span>}
                {p.exemplo && (
                  <span className="block text-[17px] mt-0.5">
                    <span style={{ color: RED }}>✕</span>
                    <span className="text-white/45 line-through"> "ação revisional de alimentos retroativa" — ninguém digita isso</span>
                  </span>
                )}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </Wrap>
  )
}

// 6 · A PÁGINA ─────────────────────────────────────────────────────────────────
function S06({ mode }) {
  const caixas = [
    { n: 1, t: 'QUEM · ONDE',   d: 'Advogada de Família em Florianópolis' },
    { n: 2, t: 'QUEM',          d: 'Atendimento por Caroline Pagani — OAB/SC 55.141' },
    { n: 3, t: 'COMO',          d: 'Falar com a advogada agora', destaque: true },
    { n: 4, t: 'É PRA MIM?',    d: 'Pensão alimentícia em atraso: o que a lei prevê e quais são os seus direitos' },
    { n: 5, t: 'COMO',          d: '1 Você entra em contato · 2 Agendamos a consulta · 3 Analisamos os seus documentos' },
    { n: 6, t: 'E SE…',         d: '"Como funciona a consulta?" · "Preciso levar documentos?" · "Atende online?"' },
  ]
  return (
    <Wrap mode={mode} id="s6">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Maria etapa="etapa 2 · landing page" diz="Será que ela cuida do meu caso? Queria falar com alguém agora." />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-2" style={{ paddingRight: 400 }}>
          <div className="inline-block px-5 py-1.5 rounded-full font-black tracking-widest text-lg mb-4"
            style={{ background: G + '1e', color: G, border: `1px solid ${G}55` }}>
            LANDING PAGE
          </div>
          <h2 className="font-black text-white leading-none"
            style={{ fontSize: '4.2rem', letterSpacing: '-2.5px' }}>
            Quem? Onde? Como?
          </h2>
          <p className="text-white/60 text-xl mt-4">
            É só isso que a sua landing page precisa responder — em 5 segundos, antes de ela rolar a tela.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 flex-shrink-0 mt-2">
          {[
            { q: 'QUEM?',  r: 'Advogada de Família', s: 'Caroline Pagani · OAB/SC 55.141', c: BLUE },
            { q: 'ONDE?',  r: 'Em Florianópolis',    s: 'presencial ou online',            c: GOLD },
            { q: 'COMO?',  r: 'Falar agora',         s: 'um botão, direto no WhatsApp',    c: G, destaque: true },
          ].map((x, i) => (
            <motion.div key={x.q} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 160 }}
              className="rounded-2xl px-6 py-5 text-center"
              style={{
                background: x.destaque ? x.c + '1e' : 'rgba(255,255,255,0.035)',
                border: `1.5px solid ${x.c}${x.destaque ? '' : '45'}`,
              }}>
              <div className="font-black tracking-widest text-lg" style={{ color: x.c }}>{x.q}</div>
              <div className="font-black text-white text-2xl leading-tight mt-2">{x.r}</div>
              <div className="text-white/50 text-lg mt-1">{x.s}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="flex-1 grid grid-cols-2 gap-5 min-h-0">
          <div className="rounded-2xl px-7 py-5 flex flex-col justify-center gap-3"
            style={{ background: G + '0d', border: `1px solid ${G}35` }}>
            <div className="text-xl font-black uppercase tracking-widest" style={{ color: G }}>Precisa ter</div>
            {['Um botão só de contato', 'Foto real sua', 'Abre em 3s no celular'].map(x => (
              <div key={x} className="flex items-start gap-3">
                <span className="font-black text-xl flex-shrink-0" style={{ color: G }}>✓</span>
                <span className="text-white/90 text-xl leading-snug">{x}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl px-7 py-5 flex flex-col justify-center gap-3"
            style={{ background: RED + '0d', border: `1px solid ${RED}35` }}>
            <div className="text-xl font-black uppercase tracking-widest" style={{ color: RED }}>Não pode ter</div>
            {['Link que leve pra fora', 'Formulário longo', '"Fundado em 1998" no topo'].map(x => (
              <div key={x} className="flex items-start gap-3">
                <span className="font-black text-xl flex-shrink-0" style={{ color: RED }}>✕</span>
                <span className="text-white/90 text-xl leading-snug">{x}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 7 · ATENDIMENTO NO WHATSAPP ──────────────────────────────────────────────────
const ATENDIMENTO = [
  { t: 'O que funciona', cor: G, icone: '✓', itens: [
    'Responder ainda no mesmo dia',
    'Fazer três perguntas antes de qualquer resposta técnica',
    'Oferecer dois horários prontos',
    'Confirmar na véspera',
    'Voltar a chamar quem não respondeu',
  ] },
  { t: 'O que faz perder cliente', cor: RED, icone: '✕', itens: [
    'Demorar horas para responder',
    'Consultar de graça pela conversa',
    'Dar prazo ou opinião sobre o caso ali',
    'Perguntar "quando você pode?"',
    'Nunca mais chamar quem sumiu',
  ] },
  { t: 'O que não pode faltar', cor: GOLD, icone: '◆', itens: [
    'Um número só do escritório',
    'Alguém responsável por responder',
    'Todo contato anotado',
    'Uma resposta padrão pronta',
    'Horários definidos na agenda',
  ] },
]

function S07({ mode }) {
  return (
    <Wrap mode={mode} id="s7">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 relative overflow-hidden" style={{ background: DARK }}>
        <Maria etapa="etapa 3 · whatsapp" diz="Mandei mensagem faz umas horas. Será que ela viu?" />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Atendimento no WhatsApp</h2>
        </motion.div>

        <div className="flex-1 grid grid-cols-3 gap-5 min-h-0">
          {ATENDIMENTO.map((col, i) => (
            <motion.div key={col.t}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.12, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-6 flex flex-col gap-4 justify-center"
              style={{ background: col.cor + '0d', border: `1px solid ${col.cor}38` }}>
              <div className="font-black text-2xl leading-tight" style={{ color: col.cor }}>{col.t}</div>
              <div className="flex flex-col gap-3">
                {col.itens.map(x => (
                  <div key={x} className="flex items-start gap-3">
                    <span className="font-black text-xl flex-shrink-0 leading-tight" style={{ color: col.cor }}>{col.icone}</span>
                    <span className="text-white/90 text-xl leading-snug">{x}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl px-6 py-4 text-center flex-shrink-0" style={{ background: RED + '10', border: `1px solid ${RED}28` }}>
          <span className="font-black text-xl" style={{ color: RED }}>O objetivo não é fechar contrato no WhatsApp, é levar para uma consulta.</span>
        </div>
      </div>
    </Wrap>
  )
}

// 8B · O CRM ───────────────────────────────────────────────────────────────────
function S07B({ mode }) {
  const colunas = [
    { t: 'Lead',            cor: '#5b6289', cards: [
      { n: 'Juliana R.', d: 'Google · divórcio' },
      { n: 'Fernanda M.', d: 'Google · pensão' },
    ] },
    { t: 'Lead qualificado',cor: BLUE, cards: [
      { n: 'Patrícia L.', d: 'Google · inventário' },
    ] },
    { t: 'Consulta',        cor: CYAN, cards: [
      { n: 'Camila T.', d: 'Indicação da Maria' },
    ] },
    { t: 'Orçamento',       cor: GOLD, cards: [
      { n: 'Renata A.', d: 'Google · guarda' },
    ] },
    { t: 'Contrato',        cor: G, cards: [
      { n: 'Maria S.', d: 'Google · divórcio', v: 'R$ 3.500' },
    ] },
    { t: 'Pagamento',       cor: PUR, cards: [
      { n: 'Ana P.', d: 'Google · pensão', v: 'R$ 2.800' },
    ] },
  ]
  return (
    <Wrap mode={mode} id="s7b">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: DARK }}>
        <Maria etapa="registrada no CRM" diz="Ainda não decidi. Preciso pensar — mas não quero ser esquecida." />
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ paddingRight: 400 }}>
          <h2 className="text-3xl font-black text-white leading-none">Cada conversa é um cartão</h2>
          <p className="text-white/55 text-lg mt-1.5">
            E ele anda da esquerda para a direita. Você bate o olho e sabe onde cada uma parou —
            <span className="text-white/85 font-bold"> e no fim do mês faz a conta: investimento ÷ contratos.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-6 gap-2">
          {colunas.map((c, i) => (
            <motion.div key={c.t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl p-2 flex flex-col gap-2"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', minHeight: 182 }}>
              <div className="flex items-center justify-between px-1">
                <span className="text-[14px] font-black uppercase tracking-widest" style={{ color: c.cor }}>{c.t}</span>
                <span className="text-[14px] font-black tabular-nums px-1.5 rounded"
                  style={{ background: c.cor + '22', color: c.cor }}>{c.cards.length}</span>
              </div>
              {c.cards.map((card, k) => (
                <motion.div key={card.n}
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 + k * 0.06, type: 'spring', stiffness: 220 }}
                  className="rounded-lg px-2.5 py-2"
                  style={{ background: '#0f1018', borderLeft: `3px solid ${c.cor}`, boxShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
                  <div className="text-white font-bold text-[16px] leading-tight">{card.n}</div>
                  <div className="text-white/45 text-[14px] leading-snug mt-0.5">{card.d}</div>
                  {card.v && <div className="font-black text-[16px] mt-1" style={{ color: c.cor }}>{card.v}</div>}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl p-5 flex flex-col justify-center gap-2" style={{ background: '#0f1018' }}>
            <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: G }}>Isso tem nome: CRM</div>
            <div className="text-white/85 text-[17px] leading-snug">
              Não é sistema caro nem coisa de escritório grande. É um quadro que responde três perguntas:
              <span className="text-white font-bold"> quem me chamou, o que eu já fiz e o que falta fazer.</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 flex flex-col justify-center gap-2" style={{ background: GOLD + '12', border: `1px solid ${GOLD}40` }}>
            <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: GOLD }}>O problema que ele resolve</div>
            <div className="text-white/85 text-[17px] leading-snug">
              Sem ele a conversa some no meio — e você só lembra das que fecharam.
              <span className="text-white font-bold"> No fim do mês, ninguém sabe dizer se o dinheiro do anúncio virou cliente.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </Wrap>
  )
}

// 8 · A MÁQUINA RODANDO ────────────────────────────────────────────────────────
function S08({ mode }) {
  const ativos = [
    { n: '01', icon: '🔎', t: 'Pesquisa no Google', cor: BLUE,
      d: 'Ela digita o problema e vê o seu anúncio. Você só paga se ela clicar.' },
    { n: '02', icon: '📄', t: 'Landing page', cor: CYAN,
      d: 'A landing page onde ela cai depois do clique. Tem uma função só: fazer ela te chamar.' },
    { n: '03', icon: '💬', t: 'O WhatsApp',   cor: GOLD,
      d: 'A primeira conversa. Aqui você não resolve o caso — você marca a consulta.' },
    { n: '04', icon: '🗓️', t: 'A consulta',   cor: ORANGE,
      d: 'Ela conta tudo e você mostra o caminho. É aqui que ela decide se confia em você.' },
    { n: '05', icon: '💰', t: 'A proposta',   cor: PUR,
      d: 'Quanto custa e como ela pode pagar. Forma de pagamento derruba mais objeção que desconto.' },
    { n: '06', icon: '✍️', t: 'O contrato',   cor: G,
      d: 'A assinatura. É o único número que paga a sua conta.' },
  ]
  const total = ativos.length
  const [passo, setPasso] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPasso(p => (p + 1) % total), 2200)
    return () => clearInterval(t)
  }, [total])
  const meio = 100 / total / 2
  const pos = i => meio + i * (100 / total)

  return (
    <Wrap mode={mode} id="s8">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white leading-none">Jornada do cliente no Google</h2>
          </div>
          <p className="text-white/65 text-lg mt-2">Uma cliente real, do clique ao contrato — no escritório da minha sócia.</p>
        </motion.div>

        {/* A cliente percorrendo as etapas */}
        <div className="relative flex-shrink-0" style={{ height: 54 }}>
          <div className="absolute h-[2px] rounded-full"
            style={{ top: 42, left: `${meio}%`, right: `${meio}%`, background: 'rgba(255,255,255,0.10)' }} />
          <motion.div className="absolute h-[2px] rounded-full"
            style={{ top: 42, left: `${meio}%`, background: G, boxShadow: `0 0 8px ${G}` }}
            animate={{ width: `${(passo / (total - 1)) * (100 - meio * 2)}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          {ativos.map((a, i) => (
            <motion.div key={`no-${a.n}`} className="absolute rounded-full"
              style={{ top: 42, left: `${pos(i)}%`, translateX: '-50%', translateY: '-50%', width: 11, height: 11 }}
              animate={{ background: i <= passo ? G : '#2b3050', scale: i === passo ? 1.6 : 1 }}
              transition={{ duration: 0.3 }} />
          ))}
          <motion.div className="absolute flex flex-col items-center"
            style={{ top: 0, translateX: '-50%' }}
            animate={{ left: `${pos(passo)}%` }}
            transition={{ type: 'spring', stiffness: 110, damping: 17 }}>
            <motion.div className="flex flex-col items-center"
              animate={{ y: [0, -4, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="flex items-center gap-1.5 rounded-full whitespace-nowrap shadow-lg"
                style={{ background: G, color: DARK, padding: AVATAR.src ? '3px 10px 3px 3px' : '4px 12px' }}>
                {AVATAR.src ? (
                  <img src={AVATAR.src} alt="" className="rounded-full object-cover"
                    style={{ width: 28, height: 28, border: `2px solid ${DARK}` }} />
                ) : (
                  <span className="text-base">👩</span>
                )}
                <span className="text-[15px] font-black tracking-wide">{AVATAR.label}</span>
              </div>
              <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `6px solid ${G}` }} />
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-6 gap-2 flex-1 min-h-0">
          {ativos.map((a, i) => {
            const on = i === passo
            return (
              <motion.div key={a.n}
                initial={{ opacity: 0, y: 22 }}
                animate={{
                  opacity: 1, y: 0, scale: on ? 1.04 : 1,
                  backgroundColor: on ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
                  borderColor: on ? a.cor : a.cor + '40',
                  boxShadow: on ? `0 0 26px ${a.cor}40` : `0 0 0px ${a.cor}00`,
                }}
                transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 150 }}
                className="rounded-2xl px-4 py-5 flex flex-col justify-center gap-2"
                style={{ borderWidth: 1, borderStyle: 'solid' }}>
                <div className="text-[14px] font-black tracking-widest" style={{ color: a.cor }}>{a.n}</div>
                <motion.div className="text-4xl" animate={{ scale: on ? 1.15 : 1 }} transition={{ duration: 0.35 }}>
                  {a.icon}
                </motion.div>
                <div className="font-black text-white text-[21px] leading-tight">{a.t}</div>
                <motion.div className="text-[16px] leading-snug"
                  animate={{ color: on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)' }}>
                  {a.d}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="rounded-xl px-6 py-3 flex items-center gap-4 flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.34)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span className="text-2xl">📊</span>
          <p className="text-white/85 text-base">
            <span className="font-black text-white">O CRM fica embaixo de tudo isso.</span> Ele registra as seis etapas —
            e é o que mostra em qual delas você está perdendo.
          </p>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 9 · O MÊS NÃO É RETO ─────────────────────────────────────────────────────────
function S09({ mode }) {
  const dias = [2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 2, 1, 3, 2, 6, 9, 14, 11, 17, 22, 15, 26, 19, 24]
  const max = Math.max(...dias)
  const temPrint = Boolean(PRINTS.crmCurva)
  return (
    <Wrap mode={mode} id="s9">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: '#0f1018' }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">O mês não é reto</h2>
          <p className="text-white/55 text-lg mt-2">Do dia 1 ao dia 30 nada muda: nem a verba, nem o atendimento.</p>
        </motion.div>

        <div className="rounded-2xl px-6 pt-4 pb-3" style={{ background: '#151725' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">📊</span>
            <span className="text-[15px] font-black tracking-widest" style={{ color: temPrint ? G : '#6b7395' }}>
              {temPrint ? 'CONTRATOS POR DIA · ESCRITÓRIO DA CAROL' : 'CONTRATOS FECHADOS POR DIA DO MÊS'}
            </span>
            {!temPrint && <span className="text-white/25 text-[15px]">· esquema ilustrativo</span>}
          </div>
          {temPrint ? (
            <img src={PRINTS.crmCurva} alt="Contratos fechados por dia do mês"
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
              <div className="flex justify-between text-[15px] text-white/40 font-mono mt-2">
                <span>dia 1</span><span>dia 15</span><span>dia 30</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: RED + '0d', border: `1px solid ${RED}28` }}>
            <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: RED }}>A armadilha do dia 15</div>
            <div className="text-white/80 text-[17px] leading-relaxed">
              Nada fechou → desânimo → a resposta esfria, você para de chamar de volta → o mês fecha ruim → <span className="italic">"viu? não funciona"</span>.
            </div>
            <div className="mt-auto text-white font-bold text-base">
              Consistência no que é controlável. Resultado é efeito colateral.
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: G + '10', border: `1px solid ${G}35` }}>
            <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: G }}>A rotina que não muda</div>
            {['Responder as novas', 'Confirmar as de amanhã', 'Voltar a chamar quem não respondeu', 'Anotar'].map(x => (
              <div key={x} className="text-white/85 text-[17px] flex gap-2"><span style={{ color: G }}>✓</span>{x}</div>
            ))}
            <div className="mt-auto text-white/70 text-base">
              + uma vez por mês, volte em quem sumiu meses atrás. Você já pagou por esse contato.
            </div>
          </motion.div>
        </div>

        <div className="rounded-xl px-6 py-3 text-center flex-shrink-0" style={{ background: '#1e2035' }}>
          <span className="text-white font-black">Um mês é montanha-russa. Três meses sobrepostos viram uma linha.</span>
          <span className="text-white/60 text-base"> A estabilidade não vem do mês — vem da soma dos meses.</span>
        </div>
      </div>
    </Wrap>
  )
}

// 10 · A AMPULHETA ─────────────────────────────────────────────────────────────
function S10({ mode }) {
  const topo = ['viu', 'clicou', 'chamou', 'agendou', 'apareceu']
  const base = [
    { t: 'você conduziu bem o divórcio',   n: 1 },
    { t: 'ela volta pra revisar alimentos', n: 2 },
    { t: 'depois, a guarda',                n: 3 },
    { t: 'anos depois, o inventário',       n: 5 },
    { t: 'e indica a amiga que vai separar', n: 8 },
  ]
  return (
    <Wrap mode={mode} id="s10">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: DARK }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">Você não compra uma causa. Compra uma cliente.</h2>
          <p className="text-white/55 text-lg mt-1.5">O caminho vai apertando até o contrato. E depois do contrato ele <span className="text-white/85 font-bold">abre de novo</span>.</p>
        </motion.div>

        <div className="flex-1 grid gap-5" style={{ gridTemplateColumns: '1.05fr 1fr' }}>
          <div className="flex flex-col items-center justify-center gap-1">
            {topo.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-md py-1.5 text-center text-white/80 text-[17px] font-semibold"
                style={{ width: `${100 - i * 13}%`, background: '#1e2035' }}>{t}</motion.div>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.42 }}
              className="rounded-lg py-2 text-center font-black text-lg my-1"
              style={{ width: '34%', background: G, color: DARK }}>CONTRATO</motion.div>
            {base.map((b, i) => (
              <motion.div key={b.t}
                initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.09, type: 'spring', stiffness: 170 }}
                className="rounded-md py-1.5 px-3 flex items-center justify-between gap-2 text-[17px] font-semibold"
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
              className="mt-1.5 text-[16px] font-black text-center" style={{ color: '#c4b5fd' }}>
              ↺ e cada uma dessas entra lá em cima de novo
            </motion.div>
          </div>

          <div className="flex flex-col gap-2.5 justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5" style={{ background: '#0f1018' }}>
              <div className="text-white/85 text-lg leading-relaxed">
                Em família, a mesma cliente volta três, quatro vezes ao longo da vida.
                <span className="text-white font-bold"> E nas próximas ela não vai pesquisar no Google — vai chamar você.</span>
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
              <div className="text-[15px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>Descubra o seu multiplicador</div>
              <div className="text-white/80 text-[17px] leading-relaxed">
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

// 11 · O RESULTADO EM NÚMEROS ────────────────────────────────────────────────
function S11N({ mode }) {
  const completo = Boolean(LAB.conversas && LAB.contratos && LAB.faturamento)
  const cards = [
    { k: 'conversas',   label: 'Conversas que chegaram', valor: LAB.conversas,   cor: BLUE },
    { k: 'consultas',   label: 'Consultas realizadas',   valor: LAB.consultas,   cor: GOLD },
    { k: 'contratos',   label: 'Contratos assinados',    valor: LAB.contratos,   cor: G },
    { k: 'faturamento', label: 'Faturamento no período', valor: LAB.faturamento, cor: PUR },
  ]
  return (
    <Wrap mode={mode} id="s11n">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">O resultado, em números</h2>
          <p className="text-white/65 text-lg mt-2">
            Mesmo escritório, mesmas telas que vocês acabaram de ver
            {LAB.periodo && <span className="text-white/85 font-bold"> · {LAB.periodo}</span>}
          </p>
        </motion.div>

        <div className="grid grid-cols-4 gap-4 flex-1">
          {cards.map((c, i) => (
            <motion.div key={c.k}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.13, type: 'spring', stiffness: 150 }}
              className="rounded-2xl p-6 flex flex-col justify-center gap-1"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: c.valor ? `1px solid ${c.cor}45` : `1px dashed ${c.cor}35`,
              }}>
              <div className="font-black leading-none"
                style={{
                  fontSize: String(c.valor || '').length > 8 ? '2.1rem' : '3rem',
                  letterSpacing: '-2px',
                  color: c.valor ? '#fff' : 'rgba(255,255,255,0.18)',
                }}>
                {c.valor || '—'}
              </div>
              <div className="text-[17px] font-semibold" style={{ color: c.cor, opacity: c.valor ? 1 : 0.55 }}>
                {c.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="rounded-2xl px-7 py-3.5 flex items-center gap-6"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="flex-shrink-0 pr-6" style={{ borderRight: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="text-white/60 text-[15px] font-black uppercase tracking-widest">Investido</div>
            <div className="font-black text-2xl leading-none mt-1"
              style={{ color: LAB.investido ? '#fff' : 'rgba(255,255,255,0.2)' }}>
              {LAB.investido || '—'}
            </div>
          </div>
          <p className="text-white font-black text-[21px] leading-snug">
            Nenhum desses números veio de sorte. Vieram dos oito degraus, na ordem.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
          className="rounded-2xl px-7 py-4 flex items-center gap-6 flex-shrink-0"
          style={{ background: G, boxShadow: `0 10px 34px ${G}30` }}>
          <div className="text-5xl">📲</div>
          <div className="flex-1">
            <div className="text-[15px] font-black uppercase tracking-widest" style={{ color: DARK, opacity: 0.6 }}>
              Quer os oito degraus em PDF, com a planilha e os modelos de mensagem?
            </div>
            <div className="font-black leading-none mt-1" style={{ color: DARK, fontSize: '2.1rem', letterSpacing: '-1px' }}>
              Segue o @trafegonjuridico
            </div>
          </div>
          <div className="rounded-xl px-5 py-3 text-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.16)' }}>
            <div className="text-[14px] font-black uppercase tracking-widest" style={{ color: DARK, opacity: 0.55 }}>Comenta</div>
            <div className="font-black text-2xl leading-none mt-0.5" style={{ color: DARK }}>DEGRAU</div>
            <div className="text-[14px] font-bold mt-0.5" style={{ color: DARK, opacity: 0.55 }}>no post de hoje</div>
          </div>
        </motion.div>

        {!completo && (
          <div className="absolute top-6 right-10 px-3 py-1.5 rounded-full text-[14px] font-black tracking-widest z-10"
            style={{ background: GOLD + '1e', color: GOLD, border: `1px solid ${GOLD}50` }}>
            AGUARDANDO OS NÚMEROS DA CAROL
          </div>
        )}
      </div>
    </Wrap>
  )
}

// 12 · O QUE LEVAR DAQUI ───────────────────────────────────────────────────────
function S11({ mode }) {
  const insights = [
    { n: 1, t: 'Não é "deu certo ou não deu".',   d: 'São 8 degraus — e onde você parou é o seu problema.' },
    { n: 2, t: 'Segmentada na área. Genérica na palavra.', d: 'O que ninguém digita não tem conserto.' },
    { n: 3, t: 'O anúncio abre a porta.',          d: 'Quem fecha é o seu atendimento.' },
    { n: 4, t: 'Do dia 1 ao dia 30, nada muda.',   d: 'Nem a verba, nem a energia com que você responde.' },
    { n: 5, t: 'Você não compra uma causa.',       d: 'Compra uma cliente — que volta e que indica.' },
    { n: 6, t: 'Você não precisa estar pronta.',   d: 'Precisa começar.' },
  ]
  return (
    <Wrap mode={mode} id="s11">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3.5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #0f1018 0%, ${DARK} 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white leading-none">O que levar daqui</h2>
          <p className="text-white/55 text-lg mt-2">Se você esquecer todo o resto e lembrar só destas seis, já valeu.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {insights.map((x, i) => (
            <motion.div key={x.n}
              initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.11, type: 'spring', stiffness: 160 }}
              className="flex items-center gap-4 rounded-xl px-5 py-2.5"
              style={{ background: '#1e2035', borderLeft: `3px solid ${G}` }}>
              <span className="font-black text-2xl tabular-nums flex-shrink-0" style={{ color: G, opacity: 0.5 }}>
                {x.n}
              </span>
              <div>
                <div className="text-white font-black text-[20px] leading-tight">{x.t}</div>
                <div className="text-white/60 text-[17px] mt-0.5">{x.d}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="rounded-2xl px-7 py-4 flex items-center gap-6 flex-shrink-0"
          style={{ background: G + '16', border: `1.5px solid ${G}60` }}>
          <div className="flex-1">
            <div className="text-[15px] font-black uppercase tracking-widest mb-1" style={{ color: G }}>
              Leva o modelo de CRM, o checklist e a escada
            </div>
            <div className="text-white font-black text-2xl leading-none">@trafegonjuridico</div>
            <div className="text-white/70 text-lg mt-1.5">
              Segue e comenta <span className="font-black text-white">DEGRAU</span> no post de hoje — eu mando o material na sua DM.
            </div>
          </div>
          <div className="text-5xl opacity-90">📲</div>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 12 · A PRIMEIRA SEMANA + CTA ─────────────────────────────────────────────────
function S12({ mode }) {
  const dias = [
    'Escrever a frase: "ajudo [quem] a [quê] em [cidade]"',
    'Abrir o WhatsApp Business',
    'Publicar uma landing page com um botão',
    'Criar a conta no Google Ads',
    'Subir a campanha e as palavras bloqueadas',
    'Montar o CRM',
    'Não mexer em nada',
  ]
  return (
    <Wrap mode={mode} id="s12">
      <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-3 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-black text-white leading-none">A sua primeira semana</h2>
          <p className="text-white/65 text-lg mt-1.5">Nenhum passo leva mais de uma hora. Isso é o degrau 1.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {dias.map((d, i) => (
            <motion.div key={d} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center gap-4 rounded-lg px-5 py-2"
              style={{ background: i === 6 ? G + '1a' : 'rgba(0,0,0,0.26)', border: i === 6 ? `1px solid ${G}50` : '1px solid rgba(255,255,255,0.06)' }}>
              <span className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-base flex-shrink-0"
                style={{ background: i === 6 ? G : 'rgba(255,255,255,0.1)', color: i === 6 ? DARK : 'white' }}>{i + 1}</span>
              <span className="text-white font-semibold text-base">{d}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="rounded-xl px-6 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <p className="text-white font-black text-lg leading-snug">
            Ninguém aqui vai fechar contrato essa semana. Vocês vão subir um degrau.
          </p>
        </motion.div>
      </div>
    </Wrap>
  )
}

// 17B · O VALOR NO TEMPO ───────────────────────────────────────────────────────
// Jornadas reais do escritório da Carol.
const JORNADAS = [
  {
    nome: 'Ana', cor: G,
    etapas: [
      { q: 'Fevereiro',  o: 'Consulta consumerista',            v: 'R$ 150' },
      { q: 'Em seguida', o: 'Fechou a ação',                    v: 'R$ 800 + 30%' },
      { q: 'Julho',      o: 'Voltou: divórcio e alimentos',     v: '—' },
      { q: 'Hoje',       o: 'Negociando novo contrato',         v: 'R$ 5.500' },
    ],
    total: 'R$ 6.450 + 30% da ação',
  },
  {
    nome: 'Katina', cor: GOLD,
    etapas: [
      { q: '04/03',  o: 'Consulta',                                        v: 'R$ 200' },
      { q: 'Na hora', o: 'Não havia o que fazer — não virou contrato',     v: '—' },
      { q: 'Julho',  o: 'Voltou: o advogado anterior abandonou o caso',    v: 'novo contrato' },
    ],
    total: 'R$ 200 + o contrato de julho',
  },
  {
    nome: 'Dayane', cor: CYAN,
    etapas: [
      { q: 'Abril', o: 'Primeiro contato: disse que não tinha como pagar', v: '—' },
      { q: 'Maio',  o: 'Voltou e pagou a consulta',                        v: 'R$ 300' },
      { q: 'Depois', o: 'Fechou e parcelou o serviço',                     v: '10 × R$ 250' },
    ],
    total: 'R$ 2.800',
  },
]

function fazJornada(indice, prints, fecho) {
  return function SlideJornada({ mode }) {
    const j = JORNADAS[indice]
    return (
      <Wrap mode={mode} id={`s10b${indice}`}>
        <div className="h-full flex flex-col px-10 pt-6 pb-12 gap-4 relative overflow-hidden" style={{ background: DARK }}>
          <Handle />
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="flex items-baseline gap-4">
            <h2 className="text-4xl font-black text-white leading-none">O valor da cliente no tempo</h2>
            <span className="font-black text-2xl" style={{ color: j.cor }}>Cliente {j.nome}</span>
          </motion.div>

          {/* linha do tempo, em faixa */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="flex items-stretch gap-2.5 flex-shrink-0">
            {j.etapas.map(e => (
              <div key={e.q} className="flex-1 rounded-xl px-4 py-2.5"
                style={{ background: j.cor + '0d', border: `1px solid ${j.cor}30` }}>
                <div className="text-white/45 text-[14px] font-black uppercase tracking-widest">{e.q}</div>
                <div className="text-white/90 text-[17px] leading-snug">{e.o}</div>
                {e.v !== '—' && <div className="font-black text-[17px]" style={{ color: j.cor }}>{e.v}</div>}
              </div>
            ))}
            <div className="rounded-xl px-5 py-2.5 flex flex-col justify-center" style={{ background: j.cor + '1e', border: `1px solid ${j.cor}55`, maxWidth: 300 }}>
              <span className="text-[13px] font-black uppercase tracking-widest" style={{ color: j.cor }}>
                Valor do cliente no tempo
              </span>
              <span className="font-black text-white text-[20px] leading-snug">{j.total}</span>
            </div>
          </motion.div>

          {/* os prints, inteiros */}
          <div className="flex-1 flex gap-3 min-h-0">
            {prints.map((p, i) => (
              <motion.div key={p.src}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex-1 min-w-0 rounded-xl overflow-hidden flex flex-col"
                style={{ border: `1px solid ${j.cor}35`, background: '#0b0d14' }}>
                <div className="px-3 py-1.5 text-[14px] font-black uppercase tracking-widest flex-shrink-0 text-center"
                  style={{ background: j.cor + '1a', color: j.cor }}>{p.legenda}</div>
                <div className="flex-1 min-h-0 flex items-center justify-center p-1">
                  <img src={p.src} alt={p.legenda}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl px-6 py-3 text-center flex-shrink-0" style={{ background: '#1e2035' }}>
            <span className="text-white font-black text-xl">{fecho}</span>
          </div>
        </div>
      </Wrap>
    )
  }
}

const S10Ba = fazJornada(0, [
  { src: '/palestra-caf/jornada-a-1.jpg', legenda: 'O primeiro pagamento' },
  { src: '/palestra-caf/jornada-a-2.jpg', legenda: 'Negociando o novo contrato' },
  { src: '/palestra-caf/jornada-a-3.jpg', legenda: 'Julho · ela volta, agora por divórcio' },
], 'Cinco meses depois, a mesma cliente. Nada disso apareceu no primeiro contrato.')

const S10Bk = fazJornada(1, [
  { src: '/palestra-caf/jornada-k-1.jpg', legenda: 'Julho · a que "não deu certo" volta sozinha' },
], 'Ela não virou contrato em março. Virou em julho — porque a gente continuou existindo pra ela.')

const S10Bd = fazJornada(2, [
  { src: '/palestra-caf/jornada-d-1.jpg', legenda: 'Abril · o primeiro contato' },
  { src: '/palestra-caf/jornada-d-2.jpg', legenda: 'Maio · agendando a consulta' },
  { src: '/palestra-caf/jornada-d-3.jpg', legenda: 'Fechou e parcelou' },
], 'Quem olha só o primeiro contrato acha caro. Quem olha a cliente inteira, não.')

// 18 · OBRIGADO ────────────────────────────────────────────────────────────────
function SFim({ mode }) {
  return (
    <Wrap mode={mode} id="sfim">
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-16"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #16305e 100%)` }}>
        <Handle />

        <motion.h2 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          className="font-black text-white leading-none"
          style={{ fontSize: '5rem', letterSpacing: '-3px' }}>
          Obrigado.
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl px-12 py-8 mt-10 flex flex-col items-center gap-4"
          style={{ background: G, boxShadow: `0 16px 50px ${G}35` }}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">📲</span>
            <span className="font-black" style={{ color: DARK, fontSize: '2.6rem', letterSpacing: '-1px' }}>
              @trafegonjuridico
            </span>
          </div>
          <div className="font-bold text-center" style={{ color: DARK, fontSize: '1.5rem' }}>
            Comenta <span className="font-black px-3 py-0.5 rounded-lg"
              style={{ background: DARK, color: G }}>DEGRAU</span> no post de hoje
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex items-center gap-10 mt-8">
          {['Todo o material desta aula', 'Um bônus aprofundando Google Ads'].map(x => (
            <span key={x} className="flex items-center gap-3 text-white/85" style={{ fontSize: '1.35rem' }}>
              <span style={{ color: G }}>→</span>{x}
            </span>
          ))}
        </motion.div>
      </div>
    </Wrap>
  )
}

export const PALESTRA_CAF_SLIDES = [
  { id: 'pc1b', label: 'Quem está falando',  C: S1B },
  { id: 'pc1c', label: 'O escritório da Carol', C: S1C },
  { id: 'pc01', label: '1.610.616',          C: S01 },
  { id: 'pc02', label: 'Os dois inimigos',   C: S02 },
  { id: 'pc2b', label: 'Onde as pessoas estão', C: S2B },
  { id: 'pc3c', label: 'Os caminhos do digital', C: S3C },
  { id: 'pc2c', label: 'Google e Meta',      C: S2C },
  { id: 'pc3b', label: 'Da internet ao contrato', C: S3B },
  { id: 'pc04', label: 'Jornada no Google',  C: S08 },
  { id: 'pc05', label: 'Como funciona',      C: S04 },
  { id: 'pc06', label: 'Campanha no Google', C: S05 },
  { id: 'pc07', label: 'A landing page',           C: S06 },
  { id: 'pc08', label: 'Atendimento WhatsApp',     C: S07 },
  { id: 'pc8b', label: 'Uma linha por conversa', C: S07B },
  { id: 'pc09', label: 'O mês não é reto',   C: S09 },
  { id: 'pc10', label: 'A ampulheta',        C: S10 },
  { id: 'pc10a', label: 'Jornada · Ana', C: S10Ba },
  { id: 'pc10k', label: 'Jornada · Katina', C: S10Bk },
  { id: 'pc10d', label: 'Jornada · Dayane', C: S10Bd },
  { id: 'pc03', label: 'A escada',           C: S03 },
  { id: 'pcfim', label: 'Obrigado',          C: SFim },
]

export default PALESTRA_CAF_SLIDES
