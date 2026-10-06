import { useState } from 'react'

/* =========================================================================
   Inteligência Comercial — Tecnoeletro
   Base construída com a consultoria Dealwise.
   Página enxuta: painéis recolhíveis (clicar para ampliar). Nenhum dado é
   removido — tudo fica a um clique de distância.
   ========================================================================= */

/* ---------- blocos reutilizáveis ---------- */

function Collapse({ title, sub, color, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #eaecf4' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-3.5 text-left transition-colors"
        style={{ background: open ? color + '0d' : '#f8f9fc' }}>
        <span className="text-[11px] font-black flex-shrink-0 w-4 text-center" style={{ color }}>{open ? '–' : '+'}</span>
        <span className="flex-1">
          <span className="block text-[12px] font-extrabold text-text leading-tight">{title}</span>
          {sub && <span className="block text-[10px] text-muted mt-0.5 leading-snug">{sub}</span>}
        </span>
      </button>
      {open && <div className="p-4 space-y-3" style={{ background: '#fff' }}>{children}</div>}
    </div>
  )
}

/* painel de seção (nível 1) — recolhido por padrão, mostra só o cabeçalho */
function Panel({ icon, tag, title, sub, color, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-4 text-left transition-colors"
        style={{ background: open ? color + '08' : '#fff' }}>
        <span className="text-xl flex-shrink-0">{icon}</span>
        <span className="flex-1 min-w-0">
          {tag && <span className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{tag}</span>}
          <span className="block text-[14px] font-black text-text leading-tight">{title}</span>
          {sub && <span className="block text-[10.5px] text-muted mt-0.5 leading-snug">{sub}</span>}
        </span>
        <span className="text-sm font-black flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: color + '16', color }}>{open ? '–' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4 pt-3 space-y-4 border-t" style={{ borderColor: '#eef0f6' }}>{children}</div>}
    </div>
  )
}

/* sub-bloco dentro de um painel (sem sombra, pra não empilhar cartões brancos) */
function Sub({ title, children }) {
  return (
    <div>
      {title && <p className="text-[12px] font-extrabold text-text mb-2.5">{title}</p>}
      {children}
    </div>
  )
}

function SeqTable({ rows, color }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #eef0f6' }}>
      <div className="grid grid-cols-[88px_1fr_2fr] text-[9px] font-bold uppercase tracking-wide text-white"
        style={{ background: color }}>
        <div className="px-2.5 py-1.5">Momento</div>
        <div className="px-2.5 py-1.5">Canal</div>
        <div className="px-2.5 py-1.5">Objetivo</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[88px_1fr_2fr] text-[10px]" style={{ background: i % 2 ? '#fafbfe' : '#fff' }}>
          <div className="px-2.5 py-1.5 font-extrabold text-text">{r[0]}</div>
          <div className="px-2.5 py-1.5 text-text">{r[1]}</div>
          <div className="px-2.5 py-1.5 text-muted">{r[2]}</div>
        </div>
      ))}
    </div>
  )
}

function Script({ label, children, color }) {
  return (
    <div className="rounded-lg p-3" style={{ background: '#f8f9fc', border: '1px solid #eef0f6' }}>
      <p className="text-[9px] font-black uppercase tracking-wide mb-1.5" style={{ color }}>{label}</p>
      <div className="text-[11px] text-text leading-relaxed whitespace-pre-line">{children}</div>
    </div>
  )
}

function Bullets({ items, color, mark = '•' }) {
  return (
    <div className="space-y-1.5">
      {items.map((t, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-[11px] font-bold flex-shrink-0" style={{ color }}>{mark}</span>
          <span className="text-[11px] text-text leading-snug">{t}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------- dados: cadências ---------- */

const CADENCIAS = [
  {
    n: 1, onda: 1, cor: '#4faa1f',
    titulo: 'Proposta entregue sem decisão',
    contas: 'SATC Criciúma, GN Imobiliária, Castanhel (APAE), Frigo Engenharia, Liga Química, Química Gávea, Tratowel.',
    resp: 'Jhonatan (com apoio do orçamentista/técnico).',
    objetivo: 'Entender se o projeto segue ativo, identificar o que trava o avanço e chegar a uma definição: retomar, revisar escopo, reagendar, programar retomada ou encerrar.',
    seq: [
      ['Dia 1', 'WhatsApp', 'Atualizar o cenário do projeto'],
      ['Dia 5', 'Ligação', 'Entender barreiras e próximos passos'],
      ['Dia 5', 'E-mail', 'Formalizar a retomada'],
      ['Dia 7', 'WhatsApp', 'Trabalhar a pendência identificada'],
      ['Dia 9', 'WhatsApp', 'Solicitar definição e encerrar a sequência'],
    ],
    scripts: [
      ['WhatsApp · Dia 0', 'Olá, [Nome], tudo bem? Aqui é o Jhonatan, da Tecnoeletro.\nEstou retomando a proposta que elaboramos para [projeto ou escopo]. Como já passou um tempo desde a entrega, antes de simplesmente cobrar um retorno, queria atualizar o cenário com vocês.\nEsse projeto continua no radar? Houve alguma mudança de escopo, prazo ou prioridade desde a nossa última conversa?'],
      ['Ligação · Dia 1', 'Olá, [Nome], aqui é o Jhonatan, da Tecnoeletro. Peguei você em um momento ruim?\nEstou ligando por causa da proposta de [escopo]. Queria entender como esse projeto evoluiu e se o cenário ainda é o mesmo. Hoje esse tema segue no planejamento, foi pausado ou já teve alguma definição?\n→ Se ativo: o que falta para avançarem — validação técnica, orçamento, prazo, aprovação interna ou comparação com outro fornecedor?'],
      ['E-mail · Dia 3', 'Assunto: Atualização do projeto de [escopo]\nComo esse tipo de projeto pode sofrer alterações de prazo, investimento e escopo, gostaríamos de entender se a demanda continua ativa e se a proposta ainda representa o cenário atual. Como esse tema está hoje?'],
      ['WhatsApp · Dia 10 (final)', 'Como não conseguimos definir o próximo passo do projeto de [escopo], vou pausar os contatos por enquanto para não insistir fora do momento. Caso a demanda continue ativa, pode me responder por aqui e retomamos de onde paramos.'],
    ],
  },
  {
    n: 2, onda: 1, cor: '#4faa1f',
    titulo: 'Sem resposta após interesse, proposta ou abertura',
    contas: 'IMAS Araranguá (Jhonatan), Resicolor, TotalPlast e Eskimo (Kevin), Baly, Torrecid e Angelgres.',
    resp: 'Kevin inicia; Jhonatan assume quando houver demanda real, orçamento ou reunião técnica.',
    objetivo: 'Recuperar a conexão sem virar cobrança repetitiva. Obter uma resposta simples sobre o status: ativa, pausada, resolvida, falar com outra pessoa ou retomar depois.',
    seq: [
      ['Dia 1', 'WhatsApp', 'Retomar com contexto específico'],
      ['Dia 5', 'Ligação', 'Confirmar status e responsável'],
      ['Dia 5', 'E-mail / LinkedIn', 'Utilizar outro canal'],
      ['Dia 7', 'WhatsApp', 'Solicitar direcionamento objetivo'],
      ['Dia 9', 'WhatsApp', 'Encerrar a sequência'],
    ],
    scripts: [
      ['WhatsApp · Dia 0 (modelo geral)', 'Olá, [Nome], tudo bem? Aqui é o [Kevin/Jhonatan], da Tecnoeletro.\nEstou retomando nosso contato sobre [projeto]. Na ocasião, ficou pendente [reunião, retorno, avaliação da proposta]. Queria entender se o assunto ainda está em andamento, se foi pausado ou se já definiram outro caminho. Mesmo que não seja o momento, essa atualização já me ajuda a organizar por aqui.'],
      ['Ligação · Dia 2', 'Nós chegamos a conversar sobre [contexto] e depois não avançamos. Estou ligando só para entender o status correto. Esse assunto ainda está de pé, foi pausado ou já definiram outro fornecedor?\n→ Se não for o responsável: você consegue me indicar quem responde hoje por [manutenção, engenharia, obra, automação]?'],
      ['LinkedIn (alternativa Dia 5)', 'Olá, [Nome]. Sou [Kevin/Jhonatan], da Tecnoeletro. Já tivemos contato com a [Empresa] sobre [contexto]. Estou tentando entender se o tema continua ativo e se você é a pessoa mais adequada. Caso não seja, consegue me indicar quem responde por essa frente?'],
    ],
    scriptsConta: [
      ['IMAS Araranguá', 'Olá, Samuel, tudo bem? Aqui é o Jhonatan, da Tecnoeletro. Estou retomando o contato sobre a proposta para a instalação do novo hospital do IMAS. Como não conseguimos mais conversar depois do envio, queria entender se o projeto continua em avaliação, se houve mudança de prazo ou se já foi definido outro caminho.'],
      ['Resicolor', 'Olá, Augusto, tudo bem? Aqui é o Kevin. Quando conversamos, vocês estavam em ampliação e reforma da subestação. A reunião com o gerente acabou não acontecendo e queria entender se esse projeto ainda segue no radar. Se continuar ativo, posso organizar um novo horário.'],
      ['Eskimo', 'Olá, [Nome]. Aqui é o Kevin. Chegamos a combinar uma visita, mas nas tentativas anteriores não consegui falar com o responsável. Ainda faz sentido agendarmos um horário curto para entender demandas de elétrica, manutenção, automação ou infraestrutura da operação?'],
    ],
  },
  {
    n: 3, onda: 1, cor: '#4faa1f',
    titulo: 'Lead visitado com histórico ou próximo passo pendente',
    contas: 'Prumare (indicação de responsável), Manenti (envio de projetos), Thermovac (2ª visita) e demais contas visitadas com potencial.',
    resp: 'Kevin conduz; Jhonatan assume com demanda concreta, orçamento ou reunião técnica.',
    objetivo: 'Retomar a partir da visita já feita e transformar em conversa sobre o momento atual do cliente — identificar dor, mudança, projeto ou risco que justifique próximo passo. Quando o histórico estiver incompleto, não inventar pendências.',
    seq: [
      ['Dia 1', 'WhatsApp', 'Retomar pendência ou reconstruir contexto'],
      ['Dia 5', 'Ligação', 'Investigar dor / projeto atual'],
      ['Dia 5', 'WhatsApp / e-mail', 'Retomada baseada na dor'],
      ['Dia 7', 'Ligação', 'Fechar ciclo e definir próximo passo'],
      ['Dia 12', 'WhatsApp', 'Reciclar ou encerrar'],
    ],
    scripts: [
      ['WhatsApp · Modelo A (pendência conhecida)', 'Olá, [Nome], aqui é o Kevin. Estou retomando nossa conversa da visita porque ficou pendente [contato do responsável, envio de projetos, nova visita]. Queria aproveitar para entender também se houve alguma mudança por aí, principalmente em [elétrica, automação, manutenção, obra]. Conseguimos avançar com [ação específica]?'],
      ['WhatsApp · Modelo B (histórico incompleto)', 'Olá, [Nome], aqui é o Kevin. Já passei pela [Empresa] e estou retomando para entender as prioridades da operação neste momento. Em empresas com rotina parecida, costumam aparecer demandas de manutenção e adequações elétricas, expansão de infraestrutura, automação ou novos projetos. Alguma dessas frentes está mais presente por aí hoje?'],
      ['Ligação · Dia 2 (aprofundar dor)', 'Perguntas: existe equipamento/linha gerando parada ou manutenção recorrente? Alguma expansão ou obra que exija adequar a infraestrutura elétrica? Algum processo ainda muito manual que ganharia com automação? Alguma adequação/norma pendente? Projeto sendo orçado para os próximos meses?'],
    ],
  },
  {
    n: 4, onda: 2, cor: '#f59e0b',
    titulo: 'Projeto previsto para outro período',
    contas: 'Construtora Locks (ano seguinte) e propostas com mês/trimestre/etapa futura indicada.',
    resp: 'Jhonatan.',
    objetivo: 'Confirmar o planejamento futuro e deixar a retomada organizada com base em data ou etapa concreta — sem pressionar por decisão antecipada.',
    seq: [
      ['Inicial', 'WhatsApp', 'Confirmar se o projeto continua previsto'],
      ['+2 dias', 'Ligação', 'Identificar data, fase e condições de retomada'],
      ['Após', 'E-mail', 'Formalizar o combinado'],
      ['−30 dias', 'WhatsApp', 'Atualizar o planejamento'],
      ['Na data', 'Ligação', 'Retomar a oportunidade'],
    ],
    scripts: [
      ['WhatsApp · inicial', 'Olá, [Nome], aqui é o Jhonatan. Estou revisando o planejamento do projeto de [escopo], que havia ficado previsto para [período]. Queria confirmar se ele continua no planejamento e se esse prazo ainda faz sentido. Não é cobrança para avançarmos agora — a ideia é deixar a retomada organizada para o momento correto.'],
      ['Ligação · confirmação', 'Perguntas: o projeto continua previsto? Existe estimativa de mês/trimestre? Qual etapa precisa acontecer antes da contratação? O escopo atual continua válido? Quando vocês começam a revisar fornecedores e propostas? Quem deve participar da retomada?'],
      ['E-mail · formalização', 'Assunto: Planejamento de retomada — [projeto]. Conforme conversamos, o projeto de [escopo] permanece previsto para [período]. Deixaremos a retomada programada para [data], quando revisaremos escopo, condições e próximos passos.'],
    ],
  },
  {
    n: 5, onda: 2, cor: '#f59e0b',
    titulo: 'Dependência de recurso, investidor ou aprovação interna',
    contas: 'SHM Empreendimentos (investidor), Hospital Regional de Araranguá (recurso federal), Realengo (aprovação de investimento).',
    resp: 'Jhonatan.',
    objetivo: 'Acompanhar o fator que bloqueia o avanço, sem repetir a apresentação comercial antes de haver mudança no cenário.',
    seq: [
      ['Inicial', 'WhatsApp', 'Atualizar o status da aprovação'],
      ['+3 dias', 'Ligação', 'Mapear processo, responsáveis e previsão'],
      ['Após', 'E-mail', 'Registrar cenário e combinado'],
      ['30–45 dias', 'WhatsApp', 'Acompanhamento breve do gatilho'],
      ['Na mudança', 'Ligação', 'Retomar tecnicamente a oportunidade'],
    ],
    scripts: [
      ['WhatsApp · inicial', 'Olá, [Nome], aqui é o Jhonatan. Estou atualizando o acompanhamento do projeto de [escopo]. Na última conversa, o avanço dependia de [liberação de recurso, definição do investidor ou aprovação interna]. Esse cenário evoluiu ou continua na mesma etapa? A ideia é acompanhar no ritmo correto, sem pressionar antes de existir definição.'],
      ['Ligação · acompanhamento', 'Perguntas: quem conduz a aprovação internamente? Existe previsão de decisão? A aprovação depende de documentação/informação técnica? A Tecnoeletro pode apoiar com algum material? Outros fornecedores já estão sendo avaliados? Qual o primeiro passo depois da liberação?'],
      ['Apoio da Tecnoeletro', 'Podemos apoiar com [memorial, atualização de proposta, informação técnica, estimativa ou apresentação], caso ajude na aprovação. O que seria mais útil para vocês neste momento?'],
    ],
  },
  {
    n: 6, onda: 2, cor: '#f59e0b',
    titulo: 'Validação técnica ou cenário de mercado',
    contas: 'Juriti (teste do sensor de umidade), Moldurarte (automação, momento conservador), Açosul (argumento técnico a desenvolver).',
    resp: 'Jhonatan (projeto/validação em andamento); Kevin acompanha relacionamento, com apoio técnico.',
    objetivo: 'Manter o relacionamento ligado ao gatilho real (teste, viabilidade, produtividade, mudança operacional), trazendo apoio técnico — sem pressionar por contratação antes da decisão.',
    seq: [
      ['Inicial', 'WhatsApp', 'Atualizar o teste ou cenário'],
      ['+3 dias', 'Ligação', 'Entender resultado, impacto e próximos passos'],
      ['Após', 'E-mail', 'Enviar informação técnica / formalizar'],
      ['15–30 dias', 'WhatsApp', 'Nova atualização'],
      ['No gatilho', 'Reunião', 'Retomar a oportunidade'],
    ],
    scripts: [
      ['WhatsApp · inicial', 'Olá, [Nome], aqui é o [Kevin/Jhonatan]. Estou retomando sobre [teste, automação ou oportunidade]. Na ocasião, o avanço dependia de [resultado técnico ou cenário]. Houve alguma evolução? Dependendo do resultado, podemos ajudar a avaliar os próximos passos ou deixar a retomada organizada.'],
      ['Se o interesse continua mas o investimento travou', 'Em vez de descartar o projeto, podemos avaliar uma primeira etapa mais enxuta ou implantação por fases. Faz sentido analisarmos essa possibilidade?'],
      ['Ligação · validação técnica', 'Perguntas: o teste foi concluído? Qual o resultado? Confirmou a necessidade? Há ajustes? Quem valida internamente? Qual o próximo passo se for aprovado? Existe previsão para decisão?'],
    ],
  },
  {
    n: 7, onda: 3, cor: '#be29ec',
    titulo: 'Cliente antigo sem projeto recente',
    contas: 'Farben e outros clientes antigos com bom histórico e aderência, sem compras recentes.',
    resp: 'Jhonatan (Jadiel participa em relacionamento histórico mais próximo).',
    objetivo: 'Reabrir a relação, atualizar contatos e mapear mudanças na operação — sem iniciar a conversa com uma oferta específica.',
    seq: [
      ['Dia 1', 'WhatsApp', 'Reabrir o relacionamento'],
      ['Dia 5', 'Ligação', 'Atualizar cenário e contatos'],
      ['Dia 5', 'E-mail', 'Apresentar frentes atuais da Tecnoeletro'],
      ['Dia 7', 'WhatsApp', 'Propor conversa ou visita'],
      ['Dia 12', 'WhatsApp', 'Encerrar ou programar retomada'],
    ],
    scripts: [
      ['WhatsApp · Dia 0', 'Olá, [Nome], aqui é o Jhonatan. Nós já trabalhamos juntos em [projeto/período] e estou retomando para atualizar nosso relacionamento com a [Empresa]. Desde aquela época, a Tecnoeletro ampliou algumas frentes, e imagino que a operação de vocês também mudou. Queria entender o cenário atual e quem são hoje os responsáveis por manutenção, engenharia, obras e automação.'],
      ['E-mail · Dia 5 (frentes atuais)', 'Atualmente nossa atuação inclui: engenharia e instalações elétricas; automação industrial; painéis, supervisórios e integração; subestações e infraestrutura de energia; PPCI, SPDA e segurança; eficiência energética e energia renovável; manutenção e suporte técnico; projetos completos de elétrica e automação.'],
      ['Convite para visita', 'Como já conhecemos parte da operação, uma visita de atualização pode ser mais útil do que uma apresentação genérica. Podemos passar aí em [opção 1] ou [opção 2] para conhecer o cenário atual?'],
    ],
  },
  {
    n: 8, onda: 3, cor: '#be29ec',
    titulo: 'Cliente antigo com potencial de novas soluções',
    contas: 'Clientes que contrataram só elétrica (podem demandar automação, PPCI, SPDA, energia, manutenção) e contas que conhecem apenas parte do portfólio.',
    resp: 'Jhonatan, com Jadiel ou time técnico conforme a solução.',
    objetivo: 'Mapear oportunidades complementares a partir do histórico e da realidade atual — sem enviar a lista completa de serviços no primeiro contato.',
    seq: [
      ['Dia 1', 'WhatsApp', 'Introduzir uma oportunidade complementar'],
      ['Dia 5', 'Ligação', 'Explorar a dor e a área responsável'],
      ['Dia 5', 'E-mail', 'Referência técnica / portfólio direcionado'],
      ['Dia 7', 'Ligação', 'Propor diagnóstico ou visita'],
      ['Dia 12', 'WhatsApp', 'Organizar o próximo passo'],
    ],
    scripts: [
      ['WhatsApp · Dia 0', 'Olá, [Nome], aqui é o Jhonatan. Como já temos histórico com a [Empresa], estava revisando as soluções que entregamos e percebi que existem outras frentes que talvez ainda não tenham sido trabalhadas conosco. Hoje vocês têm algum projeto ou necessidade de [solução aderente ao histórico: automação, modernização elétrica, energia, PPCI, SPDA, manutenção ou expansão]?'],
      ['Ligação · Dia 2', 'Perguntas: essa frente é atendida internamente ou por parceiro? Há melhorias previstas? Alguma falha/gargalo recorrente? Alguma adequação planejada? O responsável pela área já conhece a Tecnoeletro? Existe planejamento de investimento?'],
    ],
  },
  {
    n: 9, onda: 3, cor: '#be29ec',
    titulo: 'Conta perdida, mas estratégica para futuras oportunidades',
    contas: 'Camilo e Ghisi, Soli 3, Loteamento Porto Fino (em retomada via Jadiel), La Moda, Criciúma Construções (parcial) e contas perdidas por preço/prazo/concorrente que seguem aderentes.',
    resp: 'Jhonatan (Jadiel em contas estratégicas / relacionamento institucional).',
    objetivo: 'Não recuperar a proposta já contratada por outro — e sim aprender com a perda, preservar o relacionamento e se posicionar melhor para o próximo projeto.',
    seq: [
      ['Inicial', 'Ligação', 'Fechamento consultivo da oportunidade'],
      ['Após', 'E-mail', 'Agradecer e manter canal aberto'],
      ['30 dias', 'WhatsApp', 'Reabrir relacionamento (sem falar da proposta perdida)'],
      ['60–90 dias', 'Ligação', 'Mapear novos projetos'],
      ['No gatilho', 'Personalizado', 'Entrar na nova oportunidade'],
    ],
    scripts: [
      ['Ligação · fechamento consultivo', 'Sei que a decisão sobre [projeto] já foi tomada e não estou ligando para reverter uma contratação concluída. Queria apenas entender melhor a escolha e identificar onde poderíamos ter sido mais aderentes. O que mais pesou: preço, prazo, escopo ou experiência? As propostas eram tecnicamente equivalentes? O que faríamos diferente numa próxima?'],
      ['Se perdeu por preço', 'Você consegue compartilhar se a diferença estava mais próxima de 10%, 20% ou acima disso? Pergunto porque precisamos distinguir diferença comercial de diferença de escopo.'],
      ['Contato por novo gatilho', 'Vi que a [Empresa] está com [nova obra, ampliação, nova unidade]. Como já tivemos experiência comercial anterior, faz sentido conversarmos mais cedo desta vez para entender o escopo e evitar comparações desalinhadas na cotação. Quem está conduzindo essa frente?'],
    ],
  },
]

/* ---------- componente principal ---------- */

export default function TecnoeletroInteligencia({ color = '#06b6d4' }) {
  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* HERO */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 60%, #0d1225 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 90% 0%, ${color}26 0%, transparent 55%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: color + 'cc' }}>Base comercial · Dealwise</p>
          <h1 className="text-xl font-black text-white mb-1">📚 Inteligência Comercial</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Diagnóstico, ICP, framework, cadências e playbook ABS. Toque em cada seção para ampliar — tudo fica a um clique.</p>
        </div>
      </div>

      {/* ===== PAINEL 1 · VISÃO GERAL ===== */}
      <Panel icon="📊" tag="Visão geral" title="Panorama comercial" sub="Documentos, perfil de cliente ideal, estratégias e diferenciais" color={color} defaultOpen>
        <Sub title="📁 Documentos da consultoria">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { ic: '📋', t: 'Conclusão de Discovery', d: 'Diagnóstico comercial completo: metas, gargalos e oportunidades.' },
              { ic: '🔍', t: 'Conclusão de As Is', d: 'Como o processo comercial funciona hoje (funil, follow-up, prospecção).' },
              { ic: '🧠', t: 'Relatório de Inteligência Comercial', d: 'ICP, proposta de valor e análise de concorrentes.' },
              { ic: '🔄', t: 'Cadências de Recuperação', d: 'Scripts prontos para reativar propostas paradas — abaixo.' },
              { ic: '✅', t: 'Framework de Qualificação', d: 'Critérios para qualificar um lead antes de avançar — abaixo.' },
              { ic: '🎯', t: 'Playbook ABS', d: 'Venda baseada em contas estratégicas de maior porte — abaixo.' },
            ].map((doc, i) => (
              <div key={i} className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: '#f8f9fc', border: '1px solid #eaecf4' }}>
                <span className="text-lg flex-shrink-0">{doc.ic}</span>
                <div>
                  <p className="text-[11px] font-extrabold text-text mb-0.5 leading-tight">{doc.t}</p>
                  <p className="text-[10px] text-muted leading-snug">{doc.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Sub>

        <Sub title="🎯 Perfil de Cliente Ideal (ICP)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { t: 'Alimentos, ração e cerealistas', d: 'Agroindústrias com operação intensiva em energia e automação.' },
              { t: 'Químicas, metalmecânicas e cerâmicas', d: 'Indústrias técnicas com máquinas, painéis e continuidade crítica.' },
              { t: 'Obras, ampliação e retrofit', d: 'Empresas construindo, ampliando ou modernizando plantas.' },
              { t: 'Clientes atuais (expansão)', d: 'Novas demandas e unidades dentro de contas já atendidas.' },
            ].map((p, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: color + '0a', border: `1px solid ${color}22` }}>
                <p className="text-[11px] font-extrabold text-text mb-0.5">{p.t}</p>
                <p className="text-[10px] text-muted leading-snug">{p.d}</p>
              </div>
            ))}
          </div>
        </Sub>

        <Sub title="🧭 As 4 estratégias comerciais">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { ic: '↑', t: 'Ativa', d: 'Prospecção nova (outbound) para gerar oportunidades.', cor: '#60a5fa' },
              { ic: '↓', t: 'Receptiva', d: 'Leads que chegam por marketing, indicação e canais digitais.', cor: '#4faa1f' },
              { ic: '↻', t: 'Recuperação', d: 'Reativação de propostas paradas e leads perdidos.', cor: '#f59e0b' },
              { ic: '⤢', t: 'Expansão', d: 'Crescer dentro de clientes atuais (novos serviços e unidades).', cor: '#a78bfa' },
            ].map((e, i) => (
              <div key={i} className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: e.cor + '0d', border: `1px solid ${e.cor}2b` }}>
                <span className="text-base font-black flex-shrink-0" style={{ color: e.cor }}>{e.ic}</span>
                <div>
                  <p className="text-[11px] font-extrabold text-text mb-0.5">{e.t}</p>
                  <p className="text-[10px] text-muted leading-snug">{e.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Sub>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Sub title="💪 Diferenciais">
            <Bullets color={color} mark="✓" items={[
              '21 anos de mercado e reputação regional',
              '~82 colaboradores (~50 técnicos)',
              'Obra elétrica completa (turnkey) e automação',
              'Pós-venda técnico, comercial e de engenharia',
              'Produtos próprios (visão, balança, sensores — parceria WEG)',
            ]} />
          </Sub>
          <Sub title="🚀 Focos do trabalho comercial">
            <Bullets color={color} mark="→" items={[
              'Diversificar além do agro/arroz',
              'CRM e funil no lugar da planilha',
              'Cadência de prospecção e follow-up',
              'Traduzir a força técnica em valor comercial',
              'Recuperar propostas paradas',
            ]} />
          </Sub>
        </div>
      </Panel>

      {/* ===== PAINEL 2 · FRAMEWORK DE QUALIFICAÇÃO ===== */}
      <Panel icon="✅" tag="Framework" title="Framework de Qualificação" sub="Checklist + GPCT/BANT para qualificar o lead antes de avançar" color={color}>
        <p className="text-[11px] text-muted leading-snug">Primeiro contato estruturado para entender a demanda, validar aderência ao ICP e direcionar ao próximo passo. As perguntas são um guia, não um interrogatório.</p>

        <Sub title="Checklist para considerar um lead qualificado">
          <div className="space-y-2">
            {[
              ['Empresa e unidade aderentes ao ICP', 'Priorizar alimentos, ração, cerealistas e agroindústrias; químicas, metalmecânicas, cerâmicas e fabricantes de máquinas; empresas em obra/ampliação/retrofit; e clientes atuais com potencial de expansão. Avaliar complexidade, não só nº de funcionários.'],
              ['Contato técnico ou caminho de acesso', 'Há acesso a engenharia, manutenção, produção, gestor da obra ou outro responsável capaz de validar a solução.'],
              ['Tipo de demanda classificado', 'Automação, engenharia elétrica, obra industrial, energia, PPCI, manutenção ou adequação normativa.'],
              ['Dor e impacto entendidos', 'Problema e seu efeito em produção, custo, segurança, energia, qualidade ou conformidade.'],
              ['Prazo e gatilho identificados', 'Por que a demanda existe agora — marco crítico, obra, fiscalização, parada ou início de operação.'],
              ['Processo de decisão mapeado', 'Validador técnico, aprovador comercial e quem precisa participar da próxima etapa.'],
              ['Viabilidade e prioridade mínimas', 'Capacidade de investimento, orçamento em formação ou prioridade suficiente para aprofundar.'],
              ['Próximo passo aceito', 'Lead concordou em avançar para reunião diagnóstica ou visita técnica, com pauta e participantes.'],
            ].map(([t, d], i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ background: '#f8f9fc', border: '1px solid #eef0f6' }}>
                <span className="text-[11px] font-black flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: color }}>{i + 1}</span>
                <div>
                  <p className="text-[11px] font-extrabold text-text mb-0.5">{t}</p>
                  <p className="text-[10px] text-muted leading-snug">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </Sub>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Sub title="📌 Critério mínimo para avançar">
            <Bullets color={color} items={[
              'Empresa aderente ao ICP ou conta estratégica, com operação física relevante.',
              'Demanda clara ou hipótese consistente de problema com impacto real.',
              'Acesso ao responsável técnico ou caminho viável até ele.',
              'Timing relevante ou gatilho que justifique aprofundar.',
              'Próximo passo aceito, com compromisso e participantes definidos.',
            ]} />
          </Sub>
          <Sub title="🗂️ Classificação no CRM">
            <div className="space-y-2">
              {[
                ['Qualificado', 'Atende aos critérios mínimos e seguirá para diagnóstico ou visita técnica.', '#4faa1f'],
                ['Nutrição / monitoramento', 'Há aderência, mas ainda não há timing. Registrar gatilho de retomada e data de follow-up.', '#f59e0b'],
                ['Desqualificado', 'Fora do escopo, sem operação/demanda compatível ou sem caminho realista de continuidade.', '#ef4444'],
              ].map(([t, d, c], i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: c + '0d', border: `1px solid ${c}2b` }}>
                  <p className="text-[11px] font-extrabold mb-0.5" style={{ color: c }}>{t}</p>
                  <p className="text-[10px] text-muted leading-snug">{d}</p>
                </div>
              ))}
            </div>
          </Sub>
        </div>

        <Sub title="📞 Processo de qualificação por ligação (GPCT + BANT)">
          <div className="space-y-2">
            <Collapse color={color} title="1. Quebra de gelo e contexto" sub="Abrir e enquadrar a demanda">
              <p className="text-[11px] text-text leading-relaxed">Olá, [Nome]. Vi que vocês [sinal/contexto]. Antes de falar de solução, quero entender rapidamente a demanda para direcionar ao especialista certo. Essa necessidade surgiu por obra, ampliação, automação, manutenção, energia ou adequação normativa?</p>
            </Collapse>
            <Collapse color={color} title="2. Goals — Objetivos" sub="O resultado esperado">
              <Bullets color={color} items={['Qual resultado a empresa espera com esse projeto?', 'A prioridade é aumentar produção, reduzir mão de obra/custo, padronizar, economizar energia, elevar segurança ou atender normas?', 'Como vocês saberão que o projeto foi bem-sucedido?']} />
            </Collapse>
            <Collapse color={color} title="3. Plans — Planos e estratégias" sub="Cenário e iniciativa atual">
              <Bullets color={color} items={['Já existe projeto, escopo, levantamento técnico ou memorial?', 'É implantação nova, ampliação, retrofit, adequação ou correção?', 'Outros fornecedores já foram envolvidos? Em que estágio?', 'Como a empresa resolve essa necessidade hoje?']} />
            </Collapse>
            <Collapse color={color} title="4. Challenges — Desafios e dor" sub="Problema e impacto">
              <Bullets color={color} items={['Qual problema motivou a busca?', 'Como impacta produção, custo, segurança, qualidade, energia ou conformidade?', 'O que acontece se mantiver o cenário atual?', 'Já houve parada, retrabalho, multa ou perda de produção?', 'Se automação: quantas pessoas, turnos e etapas manuais hoje?']} />
            </Collapse>
            <Collapse color={color} title="5. Timeline — Prioridade e prazo" sub="Urgência e gatilho">
              <Bullets color={color} items={['Por que a demanda ganhou prioridade agora?', 'Existe data desejada para início e conclusão?', 'Há marco crítico (fiscalização, obra, parada, início de produção)?', 'O projeto já está no orçamento ou ainda em planejamento?']} />
            </Collapse>
            <Collapse color={color} title="6. Authority — Autoridade" sub="Quem decide">
              <Bullets color={color} items={['Quem valida tecnicamente o projeto?', 'Depois da validação técnica, quem aprova a parte comercial e a contratação?', 'Compras entra só na negociação ou também influencia o escopo?', 'Quem precisa estar na próxima conversa para evitar retrabalho?']} />
            </Collapse>
            <Collapse color={color} title="7. Budget — Orçamento" sub="Capacidade de investimento">
              <Bullets color={color} items={['Já existe orçamento aprovado, estimativa interna ou faixa prevista?', 'A empresa já recebeu outras propostas? O que pesa além do preço?', 'Existe condição comercial específica que precisamos conhecer?']} />
            </Collapse>
            <Collapse color={color} title="8. Interesse e próximo passo" sub="Fechar o CTA">
              <p className="text-[11px] text-text leading-relaxed">Pelo cenário, faz sentido avançarmos para uma conversa com nosso especialista. Quem precisa participar dessa etapa para validarmos o projeto? Podemos agendar reunião diagnóstica ou visita técnica em [opção 1] ou [opção 2]?</p>
            </Collapse>
          </div>
          <div className="mt-3 rounded-xl p-3" style={{ background: color + '0a', border: `1px solid ${color}22` }}>
            <p className="text-[10px] font-extrabold text-text mb-1">🤝 Passagem de bastão para o especialista — registrar no CRM:</p>
            <p className="text-[10px] text-muted leading-snug">Origem, empresa, unidade, cidade e segmento · contato (nome, cargo, papel, canal) · tipo de demanda e estágio do projeto · problema, impacto e evidências · prazo e gatilho · validador técnico e aprovador comercial · orçamento e critérios · compromissos e próximo passo agendado.</p>
          </div>
        </Sub>
      </Panel>

      {/* ===== PAINEL 3 · CADÊNCIAS DE RECUPERAÇÃO ===== */}
      <Panel icon="🔄" tag="Cadências" title="Cadências de Recuperação" sub="9 cadências em 3 ondas, com sequências e scripts prontos" color={color}>
        <p className="text-[11px] text-muted leading-snug">Toda abordagem deve mostrar que a Tecnoeletro conhece o histórico do cliente — nada de "viu a proposta?" ou "alguma novidade?". Ao receber resposta, a cadência é interrompida e o próximo passo registrado no CRM.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            ['Onda 1', 'Propostas e contatos recentes', 'Ação direta para reativar', '#4faa1f'],
            ['Onda 2', 'Timing futuro ou dependência externa', 'Acompanhar o gatilho sem pressionar', '#f59e0b'],
            ['Onda 3', 'Clientes antigos e contas perdidas', 'Reabrir relacionamento, não reofertar', '#be29ec'],
          ].map(([t, d, e, c], i) => (
            <div key={i} className="rounded-xl p-3.5" style={{ background: c + '0d', border: `1px solid ${c}33`, borderTop: `3px solid ${c}` }}>
              <p className="text-[11px] font-black mb-0.5" style={{ color: c }}>{t}</p>
              <p className="text-[10.5px] font-bold text-text leading-tight mb-1">{d}</p>
              <p className="text-[10px] text-muted leading-snug">{e}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          {CADENCIAS.map((c) => (
            <Collapse key={c.n} color={c.cor}
              title={`Cadência ${c.n} — ${c.titulo}`}
              sub={`Onda ${c.onda} · ${c.resp}`}>
              <div className="rounded-lg p-3" style={{ background: c.cor + '0a', border: `1px solid ${c.cor}22` }}>
                <p className="text-[10px] font-extrabold text-text mb-0.5">🎯 Objetivo</p>
                <p className="text-[10.5px] text-muted leading-snug">{c.objetivo}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-text mb-1">🏢 Contas que entram</p>
                <p className="text-[10.5px] text-muted leading-snug">{c.contas}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-text mb-1.5">📅 Sequência</p>
                <SeqTable rows={c.seq} color={c.cor} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-text mb-1.5">💬 Scripts prontos</p>
                <div className="space-y-2">
                  {c.scripts.map((s, i) => <Script key={i} color={c.cor} label={s[0]}>{s[1]}</Script>)}
                </div>
              </div>
              {c.scriptsConta && (
                <div>
                  <p className="text-[10px] font-extrabold text-text mb-1.5">🏷️ Scripts por conta</p>
                  <div className="space-y-2">
                    {c.scriptsConta.map((s, i) => <Script key={i} color={c.cor} label={s[0]}>{s[1]}</Script>)}
                  </div>
                </div>
              )}
            </Collapse>
          ))}
        </div>

        <Sub title="📏 Regras de execução">
          <Bullets color={color} items={[
            'A mesma conta não entra em duas cadências ao mesmo tempo.',
            'Todo contato precisa mencionar uma informação específica do histórico.',
            'A cadência é pausada assim que o cliente responde.',
            'Cada ação gera comentário e tarefa no CRM.',
            'Não criar negócio só porque houve tentativa ou visita — só com demanda, contexto e próximo passo real.',
            'Oportunidades futuras ficam com data e gatilho de retomada; perdidas, com motivo registrado.',
            'A Onda 2 tem contatos menos frequentes; a Onda 3 começa pelo relacionamento, não pela oferta.',
            'Revisão da campanha toda semana.',
          ]} />
        </Sub>
      </Panel>

      {/* ===== PAINEL 4 · PLAYBOOK ABS ===== */}
      <Panel icon="🎯" tag="Playbook" title="Playbook ABS" sub="Contas estratégicas: score, dossiê, multithreading, cadência e plays" color={color}>
        <p className="text-[11px] text-muted leading-snug">Account-Based Sales: conquistar contas específicas de médio e grande porte que justificam esforço maior que a prospecção comum. A lógica muda de "quantos leads conseguimos" para "quais empresas realmente queremos conquistar". Regra de ouro: ABS não é prospecção em massa mais bonita — é planejamento de conta, inteligência, relacionamento multithread e execução disciplinada.</p>

        <Sub title="🧭 Onde o ABS entra (e onde não entra)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              ['ABS', 'Empresas novas, muito desejadas e de alto potencial — vale pesquisa, múltiplos contatos, visitas e relacionamento de médio/longo prazo.', color],
              ['Recuperação', 'Quem já foi abordado, visitado ou recebeu proposta e perdeu timing, ficou sem resposta ou foi adiado.', '#f59e0b'],
              ['Expansão', 'Clientes atuais com possibilidade de novos serviços, outra unidade, ampliar escopo ou novo projeto.', '#a78bfa'],
              ['Inbound', 'Demandas que chegam por marketing/indicação — prioridade é velocidade e qualificação, não estudo prévio.', '#4faa1f'],
            ].map(([t, d, c], i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: c + '0d', border: `1px solid ${c}2b` }}>
                <p className="text-[11px] font-extrabold mb-0.5" style={{ color: c }}>{t}</p>
                <p className="text-[10px] text-muted leading-snug">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted leading-snug mt-2.5">PAP / visitas de campo podem executar o ABS, desde que a visita tenha conta, objetivo e hipótese definidos. Porta a porta aleatório não é ABS.</p>
        </Sub>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Sub title="⚙️ Modelo operacional">
            <div className="space-y-2.5">
              <div className="rounded-xl p-3" style={{ background: '#f8f9fc', border: '1px solid #eef0f6' }}>
                <p className="text-[11px] font-extrabold text-text mb-1">Piloto (pré-vendas limitada)</p>
                <Bullets color={color} items={['20 contas ativas no mês', '2 ondas de 10 contas', '3 a 5 stakeholders por conta prioritária', 'Prioridade: maior fit, com sinal de momento e bom acesso']} />
              </div>
              <div className="rounded-xl p-3" style={{ background: color + '0a', border: `1px solid ${color}22` }}>
                <p className="text-[11px] font-extrabold text-text mb-1">Modelo-alvo (com pré-vendas dedicado)</p>
                <Bullets color={color} items={['20 a 40 contas ativas por mês', 'Até 10 novas contas por onda', 'Parte em abordagem ativa, parte em relacionamento', 'Revisão semanal de onde insistir / trocar / aguardar']} />
              </div>
            </div>
          </Sub>
          <Sub title="🏷️ Prioridade × nível do stakeholder">
            <div className="space-y-2">
              {[
                ['P1 — Estratégica', 'Alta aderência, alto potencial e motivo concreto para investir esforço agora.', '#ef4444'],
                ['P2 — Prioritária', 'Forte fit e potencial, mas menos urgência/acesso ou gatilho em formação.', '#f59e0b'],
                ['P3 — Radar', 'Conta interessante, sem motivo suficiente para abordagem densa agora.', '#60a5fa'],
              ].map(([t, d, c], i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: c + '0d', border: `1px solid ${c}2b` }}>
                  <p className="text-[11px] font-extrabold mb-0.5" style={{ color: c }}>{t}</p>
                  <p className="text-[10px] text-muted leading-snug">{d}</p>
                </div>
              ))}
              <p className="text-[10px] text-muted leading-snug pt-1"><b className="text-text">Níveis:</b> Estratégico (sócios, diretoria, CAPEX) · Tático (gerentes/coord. de engenharia, manutenção, produção, utilidades) · Operacional/acesso (engenheiros, analistas, técnicos, compras, gatekeepers).</p>
            </div>
          </Sub>
        </div>

        <Sub title="📊 Score de priorização da conta (0, 1 ou 2 por critério)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Aderência ao ICP',
              'Momento ou gatilho',
              'Potencial econômico e técnico',
              'Acesso e relacionamento',
              'Viabilidade de atuação presencial',
              'Espaço competitivo',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg p-2.5" style={{ background: '#f8f9fc', border: '1px solid #eef0f6' }}>
                <span className="text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: color }}>{i + 1}</span>
                <span className="text-[11px] font-bold text-text">{t}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {[
              ['10–12', 'P1 Estratégica', '#ef4444'],
              ['7–9', 'P2 Prioritária', '#f59e0b'],
              ['4–6', 'P3 Radar', '#60a5fa'],
              ['< 4', 'Não ativar', '#7680a8'],
            ].map(([v, t, c], i) => (
              <div key={i} className="rounded-lg p-2.5 text-center" style={{ background: c + '12' }}>
                <p className="text-sm font-black" style={{ color: c }}>{v}</p>
                <p className="text-[9px] font-bold text-muted">{t}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted leading-snug mt-2.5">Travas: a conta precisa ter aderência real ao ICP, potencial técnico compatível e ao menos uma hipótese de abordagem. Não ativar só porque a empresa é grande ou conhecida.</p>
        </Sub>

        <div className="space-y-2.5">
          <Collapse color={color} title="📡 Radar de sinais e fontes de inteligência" sub="O ABS começa com sinais, não com uma lista estática">
            <p className="text-[10px] font-extrabold text-text mb-1">Sinais prioritários</p>
            <Bullets color={color} items={[
              'Nova fábrica, unidade ou CD · ampliação de capacidade',
              'Retrofit, modernização, mudança de layout · compra de máquinas/linhas',
              'Obras civis/industriais · novas exigências de segurança, norma ou PPCI',
              'Projetos de eficiência energética, automação ou redução de custo',
              'Paradas frequentes, gargalos, necessidade de reduzir mão de obra manual',
              'Mudança de liderança em engenharia/manutenção/operação · vagas abertas',
              'Anúncio de investimento, financiamento, aquisição ou novo contrato',
              'Insatisfação conhecida com fornecedor atual · presença em feira/associação',
            ]} />
            <p className="text-[10px] font-extrabold text-text mb-1 mt-3">Fontes</p>
            <p className="text-[10px] text-muted leading-snug"><b className="text-text">Internas:</b> CRM e histórico de propostas, base de projetos, relacionamentos de Jadiel/Jhonatan, indicações, histórico de visitas, cases. <b className="text-text">Externas:</b> site e notícias da empresa, LinkedIn da empresa e executivos, Mais Obras, Google Alerts (ampliação, nova fábrica, investimento, retrofit, automação), portais de licenciamento, associações, feiras, vagas, fornecedores de máquinas. A pesquisa deve terminar em conclusão acionável.</p>
          </Collapse>

          <Collapse color={color} title="📄 Dossiê de Conta ABS" sub="Uma página por conta P1/P2, antes da primeira abordagem">
            <Bullets color={color} items={[
              'Identificação: empresa, segmento, cidade/planta, prioridade, score, potencial de solução, origem, responsável interno.',
              'Contexto e momento: o que acontece agora, expansão/obra/investimento, janela provável, hipótese de necessidade, evidências e o que ainda é suposição.',
              'Estrutura e operação: tamanho da planta, tipo de processo, linhas automatizadas, outras unidades e possibilidade de replicação.',
              'Concorrência: fornecedor atual, tempo de relação, escopo que atende, ponto forte e vulnerabilidade, estratégia de entrada (substituir/complementar/homologar/projeto).',
              'Mapa de stakeholders: ≥ 3 contatos com cargo, nível, papel na decisão, canal e hipótese de dor.',
              'Gatilho e tese: o que observamos · por que importa · por que a Tecnoeletro tem legitimidade. Se não dá para completar as 3 frases sem generalidade, a conta não está pronta.',
            ]} />
          </Collapse>

          <Collapse color={color} title="🧵 Multithreading — mapeamento de stakeholders" sub="Depender de uma pessoa só é risco">
            <div className="space-y-2">
              {[
                ['Estratégico', 'Sócio, diretor, diretor industrial, gerente geral, responsável por CAPEX.', 'Importa: risco do investimento, continuidade, produtividade, payback, segurança do fornecedor, prazo. Conversar pelo impacto, não pelos componentes técnicos.'],
                ['Tático', 'Gerentes de engenharia, manutenção, produção, projetos, utilidades.', 'Importa: confiabilidade, prazo, compatibilidade, redução de parada, manutenção, suporte, documentação. Mostrar que entende o problema antes da solução.'],
                ['Operacional / acesso', 'Engenheiros, analistas, técnicos, planejamento, compras, gatekeepers.', 'Importa: especificação, processo de compra, homologação, prazo. É a ponte que explica a decisão — não tratar como obstáculo.'],
              ].map(([t, cargos, imp], i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: '#f8f9fc', border: '1px solid #eef0f6' }}>
                  <p className="text-[11px] font-extrabold text-text">{t}</p>
                  <p className="text-[10px] text-muted leading-snug mt-0.5"><b>Cargos:</b> {cargos}</p>
                  <p className="text-[10px] text-muted leading-snug mt-0.5">{imp}</p>
                </div>
              ))}
              <p className="text-[10px] text-muted leading-snug pt-1">Compras não deve ser a única porta: a validação técnica deve ocorrer antes ou em paralelo, senão a Tecnoeletro vira "mais uma cotação".</p>
            </div>
          </Collapse>

          <Collapse color={color} title="✉️ Estrutura da mensagem e ativos de valor" sub="Personalização com método + iscas para abrir portas">
            <p className="text-[10px] font-extrabold text-text mb-1">Toda abordagem tem 4 elementos</p>
            <Bullets color={color} mark="→" items={[
              'Contexto real — observação específica da empresa, projeto, região ou pessoa.',
              'Hipótese de relevância — por que isso gera necessidade de segurança, produtividade, automação ou risco.',
              'Prova de legitimidade — case, cliente semelhante, capacidade técnica, histórico no segmento.',
              'CTA de baixa fricção — uma pergunta simples que abre o diagnóstico.',
            ]} />
            <p className="text-[10px] font-extrabold text-text mb-1 mt-3">Ativos de valor (iscas)</p>
            <p className="text-[10px] text-muted leading-snug">Mini diagnóstico de risco técnico · checklist de preparação para expansão · mapa de riscos de comparar propostas só por preço · case por segmento · nota técnica personalizada · convite para visita técnica · conversa técnica de 30 min sem proposta. <b className="text-text">Regra:</b> o material precisa ser útil mesmo que o lead não compre agora.</p>
          </Collapse>

          <Collapse color={color} title="🚪 Estratégias de acesso além do digital" sub="Força regional e presencial como vantagem">
            <Bullets color={color} items={[
              'Warm path — conexões em comum, clientes, parceiros, associações, ex-colaboradores antes do contato frio.',
              'Roadshow regional — 3+ contas próximas viram uma rota de visitas com motivo real.',
              'Eventos e feiras — definir contas-alvo, pessoas e follow-up em 48h antes de ir.',
              'Mesa técnica / café — 5 a 10 convidados em torno de um tema prático, sem pressão de venda.',
              'Referência prática — case comparável, cliente de referência, visita à sede ou obra.',
            ]} />
          </Collapse>

          <Collapse color={color} title="📅 Cadência ABS — base de 20 a 30 dias" sub="Multicanal, menos agressiva e mais inteligente que outbound de volume">
            <SeqTable color={color} rows={[
              ['Dia 0', 'Preparação', 'Dossiê, validar contatos, definir gatilho e canal'],
              ['Dia 1', 'WhatsApp / e-mail', 'Primeira abordagem ao contato mais promissor'],
              ['Dia 3', 'LinkedIn', 'Conectar e interagir com conteúdo real'],
              ['Dia 5', 'Ligação', 'Validar se é a pessoa certa e o tema no radar'],
              ['Dia 8', 'Valor', 'Insight, case ou checklist diferente do 1º contato'],
              ['Dia 12', '2º stakeholder', 'Ativar outro contato — sem copiar a mensagem'],
              ['Dia 16', 'Ligação / acesso', 'Telefone corporativo, indicação ou recepção'],
              ['Dia 21', 'Follow-up', 'Retomar com nova informação, sem pressionar'],
              ['Dia 30', 'Decisão de conta', 'Continuar, radar, retorno por gatilho ou recuperação'],
            ]} />
            <p className="text-[10px] text-muted leading-snug mt-2"><b className="text-text">Não fazer:</b> 8–10 mensagens iguais no WhatsApp; repetir o mesmo e-mail só mudando o assunto; abordar 5 pessoas no mesmo dia com o mesmo texto; tratar silêncio como falta de fit; encerrar conta estratégica só porque a 1ª cadência acabou. <b className="text-text">Recuperação ABS:</b> reentrar em 60–90 dias mudando ao menos uma variável (stakeholder, canal, hipótese, case ou acesso).</p>
          </Collapse>

          <Collapse color={color} title="☎️ Roteiro de ligação ABS" sub="Curto no primeiro contato">
            <p className="text-[10px] text-muted leading-snug mb-2"><b className="text-text">Estrutura:</b> 1) permissão · 2) contexto real · 3) hipótese · 4) duas ou três perguntas · 5) próximo passo.</p>
            <Script color={color} label="Exemplo">Oi, [Nome], aqui é [Nome] da Tecnoeletro. Peguei você num momento possível para uma pergunta rápida? Vi que a [Empresa] está [gatilho]. A gente atua bastante com elétrica e automação em operações industriais e queria validar uma hipótese antes de mandar qualquer material. Nessa frente, quem normalmente lidera a avaliação técnica aí: engenharia, manutenção ou projetos?</Script>
          </Collapse>

          <Collapse color={color} title="🗓️ Ritual semanal (War Room) e indicadores" sub="30–45 min toda sexta-feira">
            <p className="text-[10px] text-muted leading-snug mb-2"><b className="text-text">Agenda:</b> números da semana (5 min) · contas P1 — o que aprendemos, quem falta acessar, próximo movimento (15 min) · contas travadas — trocar stakeholder/hipótese, usar case, warm path ou mover para recuperação (10 min) · próxima onda (5–10 min). O CRM precisa estar atualizado antes — a reunião não é leitura do CRM.</p>
            <p className="text-[10px] text-muted leading-snug"><b className="text-text">Indicadores:</b> preparação (contas por mês, % com dossiê, stakeholders mapeados, % com gatilho real) · execução (contas abordadas, ligações, conversas significativas, % com próxima atividade) · resultado (reuniões, oportunidades, pipeline, propostas, receita, ticket médio). Atenção especial: % de contas com relacionamento multithread.</p>
          </Collapse>

          <Collapse color={color} title="🚀 Plano de implantação em 90 dias" sub="Piloto → aprofundamento → escala controlada">
            <div className="space-y-2">
              {[
                ['Dias 1–30 · Piloto', '20 contas (2 ondas de 10), classificar P1/P2/P3, mapear ≥3 stakeholders em P1/P2, criar dossiê, 2–3 ativos de valor, rodar cadência multicanal e War Room. Sucesso = operar com disciplina e aprender quais sinais geram resposta.'],
                ['Dias 31–60 · Aprofundamento', 'Manter contas com movimento, pôr sem resposta em radar/recuperação, nova onda, refinar score, 1 case/one-pager por segmento, planejar rota de visitas, aumentar multithreading.'],
                ['Dias 61–90 · Escala controlada', 'Evoluir para 20–40 contas só se a qualidade se manteve, formalizar rotina de pesquisa, radar mensal de sinais, consolidar dashboard, definir metas trimestrais e escolher contas-âncora.'],
              ].map(([t, d], i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: color + '0a', border: `1px solid ${color}22` }}>
                  <p className="text-[11px] font-extrabold text-text mb-0.5">{t}</p>
                  <p className="text-[10px] text-muted leading-snug">{d}</p>
                </div>
              ))}
            </div>
          </Collapse>

          <Collapse color={color} title="📚 Biblioteca de plays" sub="8 jogadas por gatilho">
            <div className="space-y-1.5">
              {[
                ['1 · Expansão anunciada', 'Mapear projeto, engenharia e direção; material de preparação de infraestrutura; entrar antes do escopo final.'],
                ['2 · Fornecedor incumbente forte', 'Sondar satisfação, mapear gaps, buscar homologação ou escopo complementar. Não atacar o fornecedor.'],
                ['3 · Projeto futuro sem orçamento', 'Relacionamento leve, registrar data, compartilhar conteúdo e participar da fase de estudo.'],
                ['4 · Conta regional de alto potencial', 'Combinar pesquisa digital com visita planejada, networking local e cliente de referência.'],
                ['5 · Evento com contas-alvo', 'Mapear participantes antes, agendar conversas, material específico e follow-up em 48h.'],
                ['6 · Dor técnica visível', 'Abordar com hipótese (não diagnóstico fechado), validar com a área técnica e propor conversa curta.'],
                ['7 · Conta sem resposta, alto fit', 'Tirar a pressão, manter no radar, trocar stakeholder e reentrar em 60–90 dias.'],
                ['8 · Cliente de referência como ponte', 'Usar case específico, visita autorizada ou introdução para reduzir risco percebido.'],
              ].map(([t, d], i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: '#f8f9fc', border: '1px solid #eef0f6' }}>
                  <p className="text-[11px] font-extrabold text-text leading-tight">{t}</p>
                  <p className="text-[10px] text-muted leading-snug mt-0.5">{d}</p>
                </div>
              ))}
            </div>
          </Collapse>
        </div>

        <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 70%, #0d1225 100%)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 100% 0%, ${color}22 0%, transparent 55%)` }} />
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: color + 'cc' }}>Princípios finais do ABS</p>
            <div className="space-y-1.5">
              {[
                'Poucas contas, alta qualidade.',
                'Pesquisa só tem valor quando gera hipótese e ação.',
                'Uma conta estratégica precisa de mais de um relacionamento.',
                'Personalização deve ter método para continuar executável.',
                'Conta sem timing não é conta morta: tem próxima data, próximo gatilho e próxima estratégia.',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ color }}>◆</span>
                  <span className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>{t}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] leading-snug mt-3" style={{ color: 'rgba(255,255,255,0.45)' }}>O objetivo: quando uma empresa estratégica entrar em fase de investimento, a Tecnoeletro já deve ser conhecida, confiável e tecnicamente lembrada — antes que o processo vire disputa de preço.</p>
          </div>
        </div>
      </Panel>

    </div>
  )
}
