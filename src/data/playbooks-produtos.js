/* ── Playbooks dos produtos avulsos ──────────────────────────────────────
   Cobre as 4 ofertas do deck comercial que não tinham processo:
   Implementação Comercial · Identidade Visual · Landing Page · Site Institucional

   Landing Page e Site têm duas trilhas de publicação (WordPress e Lovable).
   O hub não tem lógica condicional em playbook: ao vincular a um cliente,
   apague os passos da trilha que não for usada.
   ─────────────────────────────────────────────────────────────────────── */

// ══════════════════════════════════════════════════════════════════════════
//   1. IMPLEMENTAÇÃO COMERCIAL — R$ 2.997 · 5 encontros 1:1 · advocacia
// ══════════════════════════════════════════════════════════════════════════

const IMPLEMENTACAO_COMERCIAL = {
  id: 'pb_implementacao_comercial',
  title: 'Implementação Comercial — Modelo A (Organizar)',
  category: 'CRM',
  description: 'Consultoria 1:1 em 3 encontros (Ver → Organizar → Converter) para escritórios de advocacia que JÁ TÊM um processo comercial, mesmo bagunçado. Audita e reorganiza o que existe. Entrega CRM montado, playbook documentado e quem atende treinado — dentro do Provimento 205/2021 do CFOAB.',
  milestones: [
    { id: 'icA_ms_onboarding', title: 'Onboarding',               icon: '🚀', type: 'kickoff',   order: 1 },
    { id: 'icA_ms_ver',        title: 'E1 — VER · Diagnóstico',   icon: '👁️', type: 'revisao',   order: 2 },
    { id: 'icA_ms_organizar',  title: 'E2 — ORGANIZAR · CRM',     icon: '🗂️', type: 'automacao', order: 3 },
    { id: 'icA_ms_converter',  title: 'E3 — CONVERTER · Roteiro', icon: '💬', type: 'revisao',   order: 4 },
    { id: 'icA_ms_handoff',    title: 'Handoff & Recorrência',    icon: '📈', type: 'renovacao', order: 5 },
  ],
  steps: [
    // ── ONBOARDING ── [Beatriz]
    { id: 'icA01', title: '[Onboarding] Formalizar — contrato assinado e pagamento confirmado', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icA_ms_onboarding', type: 'reuniao', done: false },
    { id: 'icA02', title: '[Onboarding] Incluir o cliente no hub.trafegon.com.br', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icA_ms_onboarding', type: 'setup_conta', done: false, checklist: [
      { id: 'icAh1', title: 'Menu Workspaces → Novo Cliente' },
      { id: 'icAh2', title: 'Preencher nome, nicho e cor' },
      { id: 'icAh3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
      { id: 'icAh4', title: 'Confirmar que o workspace foi criado' },
    ] },
    { id: 'icA03', title: '[Onboarding] Criar o grupo no WhatsApp (cliente + Gabriel + Beatriz)', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icA_ms_onboarding', type: 'reuniao', done: false },
    { id: 'icA04', title: '[Onboarding] Enviar a mensagem padrão de boas-vindas (briefing + datas dos 3 encontros)', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icA_ms_onboarding', type: 'reuniao', done: false, message: 'Bom dia / Boa tarde, [NOME]!\nTudo bem?\n\nSeja bem-vinda, agradecemos a confiança. Vamos com tudo!\n\nVou enviar abaixo as instruções para os próximos passos:\n\nEsse formulário serve para conhecermos cada detalhe do seu contexto atual: https://forms.gle/NDyC8WeccVB8hPB2A — responda com atenção.\n\nSobre os 3 encontros das consultorias, você consegue nas seguintes datas?\nEncontro 1: [DIA] às [HORÁRIO] ou às [HORÁRIO]\nEncontro 2: [DIA] às [HORÁRIO] ou às [HORÁRIO]\nEncontro 3: [DIA] às [HORÁRIO] ou às [HORÁRIO]\n\nAguardamos 🤝' },
    { id: 'icA05', title: '[Onboarding] Combinar o CRM e coletar acessos (CRM + WhatsApp Business)', daysAfter: 1, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icA_ms_onboarding', type: 'setup_conta', done: false },
    { id: 'icA06', title: '[Onboarding] Confirmar o briefing preenchido recebido', daysAfter: 2, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icA_ms_onboarding', type: 'reuniao', done: false },
    { id: 'icA07', title: '[Onboarding] Diagnóstico de maturidade — confirmar que o cliente é Modelo A (já tem processo)', daysAfter: 2, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_onboarding', type: 'auditoria', done: false },

    // ── E1 · VER — Auditar (Gabriel) ──
    { id: 'icA08', title: '[Prep E1] Ler o briefing e levantar o que já existe (scripts, cadência, registros)', daysAfter: 3, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_ver', type: 'auditoria', done: false },
    { id: 'icA09', title: '[ENCONTRO 1 — VER] Auditar o processo atual e desenhar o funil (1h–1h30, gravar)', daysAfter: 5, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_ver', type: 'plan_estrategico', done: false, checklist: [
      { id: 'icA1a', title: 'Auditar o que já fazem em cada etapa do funil' },
      { id: 'icA1b', title: 'Mapear o funil real + conversão + onde vaza' },
      { id: 'icA1c', title: 'Identificar o maior gargalo (contato / conversa / pós-proposta)' },
      { id: 'icA1d', title: 'Redesenhar as etapas do funil corrigindo o que está torto' },
      { id: 'icA1e', title: 'Formalizar os critérios de lead ideal' },
      { id: 'icA1f', title: 'Definir a métrica-chave (lead → próximo passo → cliente)' },
      { id: 'icA1g', title: 'Gravar o encontro e subir no Drive' },
    ] },
    { id: 'icA10', title: '[Lição de casa E1] Acompanhar o cliente reunir os leads/registros atuais', daysAfter: 7, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_ver', type: 'revisao', done: false },
    { id: 'icA11', title: '[Pós E1] Reorganizar o CRM existente com as etapas corrigidas', daysAfter: 9, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_ver', type: 'setup_conta', done: false },

    // ── E2 · ORGANIZAR — Limpar & padronizar (Gabriel) ──
    { id: 'icA12', title: '[Prep E2] Limpar a base atual do CRM (deduplicar, padronizar campos)', daysAfter: 10, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_organizar', type: 'setup_conta', done: false },
    { id: 'icA13', title: '[ENCONTRO 2 — ORGANIZAR] Limpar/padronizar o CRM + cadência (1h–1h30, gravar)', daysAfter: 12, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_organizar', type: 'trein_equipe', done: false, checklist: [
      { id: 'icA2a', title: 'Padronizar cadastro e movimentação (unificar o jeito bagunçado)' },
      { id: 'icA2b', title: 'Cadastrar 3–5 leads reais juntos' },
      { id: 'icA2c', title: 'Definir os gatilhos de lembrete (o sistema avisa; a mensagem é humana, caso a caso)' },
      { id: 'icA2d', title: 'Ajustar a régua de reengajamento leve só no topo (lead pré-caso)' },
      { id: 'icA2e', title: 'Montar a rotina de acompanhamento de 15 min' },
      { id: 'icA2f', title: 'Gravar o encontro e subir no Drive' },
    ] },
    { id: 'icA14', title: '[Lição de casa E2] Acompanhar o cliente migrar os leads da semana pro novo padrão', daysAfter: 15, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_organizar', type: 'revisao', done: false },
    { id: 'icA15', title: '[Pós E2] Revisar a adesão ao novo padrão e ajustar', daysAfter: 17, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_organizar', type: 'revisao', done: false },

    // ── E3 · CONVERTER — Refinar (Gabriel) ──
    { id: 'icA16', title: '[Prep E3] Coletar os scripts que já usam + separar conversas reais (base rica) pra autópsia', daysAfter: 19, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_converter', type: 'criacao_copy', done: false },
    { id: 'icA17', title: '[ENCONTRO 3 — CONVERTER] Autópsia, refino do roteiro e treino (1h–1h30, gravar)', daysAfter: 21, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_converter', type: 'trein_equipe', done: false, checklist: [
      { id: 'icA3a', title: 'Autópsia aprofundada das conversas reais por fase (onde vazou)' },
      { id: 'icA3b', title: 'Refinar o roteiro a partir do que já funciona + corrigir o que vaza' },
      { id: 'icA3c', title: 'Definir o corte gentil (pra quem quer orientação de graça)' },
      { id: 'icA3d', title: 'Passar o filtro OAB em cada script (Provimento 205/2021)' },
      { id: 'icA3e', title: 'Mapear as objeções reais + respostas' },
      { id: 'icA3f', title: 'Treinar quem atende — desaprender vícios + padronizar' },
      { id: 'icA3g', title: 'Definir o handoff (o que o 1º atendimento/IA resolve, quando passa)' },
      { id: 'icA3h', title: 'Definir metas + o número de conversão a acompanhar' },
      { id: 'icA3i', title: 'Gravar o encontro e subir no Drive' },
    ] },
    { id: 'icA18', title: '[Lição de casa E3] Acompanhar o cliente rodar o roteiro refinado por 1 semana', daysAfter: 24, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_converter', type: 'revisao', done: false },

    // ── HANDOFF & RECORRÊNCIA (Gabriel) ──
    { id: 'icA19', title: '[Entrega] Consolidar e formatar o Playbook Comercial final (PDF no Drive)', daysAfter: 26, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_handoff', type: 'plan_estrategico', done: false, checklist: [
      { id: 'icA5a', title: 'Funil + critérios de lead ideal' },
      { id: 'icA5b', title: 'Régua de cadência e lembretes' },
      { id: 'icA5c', title: 'Roteiro + corte gentil + banco de objeções' },
      { id: 'icA5d', title: 'Metas + rotina semanal de 15 min' },
      { id: 'icA5e', title: 'Exportar em PDF e subir no Drive do cliente' },
    ] },
    { id: 'icA20', title: '[Handoff] Encerrar o suporte de 30 dias e fazer o check-in', daysAfter: 56, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_handoff', type: 'reuniao', done: false },
    { id: 'icA21', title: '[Recorrência] Apresentar a proposta de continuidade (acompanhamento mensal ou Assessoria)', daysAfter: 58, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icA_ms_handoff', type: 'reuniao', done: false },
    { id: 'icA22', title: '[Recorrência] Solicitar depoimento e avaliação no Google', daysAfter: 60, assigneeRole: 'colaborador', assigneeId: 'adm_at', milestoneId: 'icA_ms_handoff', type: 'reuniao', done: false },
  ],
  createdAt: '2026-08-05',
  active: true,
}

// ══════════════════════════════════════════════════════════════════════════
//   1b. IMPLEMENTAÇÃO COMERCIAL — MODELO B (Do zero) · advocacia
// ══════════════════════════════════════════════════════════════════════════

const IMPLEMENTACAO_COMERCIAL_B = {
  id: 'pb_implementacao_comercial_b',
  title: 'Implementação Comercial — Modelo B (Do zero)',
  category: 'CRM',
  description: 'Consultoria 1:1 em 3 encontros (Ver → Organizar → Converter) para escritórios que TÊM ferramentas (CRM, tráfego) mas NÃO gerenciam nada. Constrói o processo do zero e cria o hábito. Entrega CRM ativo, playbook documentado e quem atende treinado — dentro do Provimento 205/2021 do CFOAB.',
  milestones: [
    { id: 'icB_ms_onboarding', title: 'Onboarding',                icon: '🚀', type: 'kickoff',   order: 1 },
    { id: 'icB_ms_ver',        title: 'E1 — VER · Desenhar',       icon: '👁️', type: 'revisao',   order: 2 },
    { id: 'icB_ms_organizar',  title: 'E2 — ORGANIZAR · Ativar',   icon: '🗂️', type: 'automacao', order: 3 },
    { id: 'icB_ms_converter',  title: 'E3 — CONVERTER · Construir', icon: '💬', type: 'revisao',   order: 4 },
    { id: 'icB_ms_handoff',    title: 'Handoff & Recorrência',     icon: '📈', type: 'renovacao', order: 5 },
  ],
  steps: [
    // ── ONBOARDING ── [Beatriz]
    { id: 'icB01', title: '[Onboarding] Formalizar — contrato assinado e pagamento confirmado', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icB_ms_onboarding', type: 'reuniao', done: false },
    { id: 'icB02', title: '[Onboarding] Incluir o cliente no hub.trafegon.com.br', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icB_ms_onboarding', type: 'setup_conta', done: false, checklist: [
      { id: 'icBh1', title: 'Menu Workspaces → Novo Cliente' },
      { id: 'icBh2', title: 'Preencher nome, nicho e cor' },
      { id: 'icBh3', title: 'Adicionar e-mail do cliente para acesso ao portal' },
      { id: 'icBh4', title: 'Confirmar que o workspace foi criado' },
    ] },
    { id: 'icB03', title: '[Onboarding] Criar o grupo no WhatsApp (cliente + Gabriel + Beatriz)', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icB_ms_onboarding', type: 'reuniao', done: false },
    { id: 'icB04', title: '[Onboarding] Enviar a mensagem padrão de boas-vindas (briefing + datas dos 3 encontros)', daysAfter: 0, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icB_ms_onboarding', type: 'reuniao', done: false, message: 'Bom dia / Boa tarde, [NOME]!\nTudo bem?\n\nSeja bem-vinda, agradecemos a confiança. Vamos com tudo!\n\nVou enviar abaixo as instruções para os próximos passos:\n\nEsse formulário serve para conhecermos cada detalhe do seu contexto atual: https://forms.gle/NDyC8WeccVB8hPB2A — responda com atenção.\n\nSobre os 3 encontros das consultorias, você consegue nas seguintes datas?\nEncontro 1: [DIA] às [HORÁRIO] ou às [HORÁRIO]\nEncontro 2: [DIA] às [HORÁRIO] ou às [HORÁRIO]\nEncontro 3: [DIA] às [HORÁRIO] ou às [HORÁRIO]\n\nAguardamos 🤝' },
    { id: 'icB05', title: '[Onboarding] Combinar o CRM e coletar acessos (CRM + WhatsApp Business)', daysAfter: 1, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icB_ms_onboarding', type: 'setup_conta', done: false },
    { id: 'icB06', title: '[Onboarding] Confirmar o briefing preenchido recebido', daysAfter: 2, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'icB_ms_onboarding', type: 'reuniao', done: false },
    { id: 'icB07', title: '[Onboarding] Diagnóstico de maturidade — confirmar que o cliente é Modelo B (não gerencia nada)', daysAfter: 2, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_onboarding', type: 'auditoria', done: false },

    // ── E1 · VER — Desenhar do zero (Gabriel) ──
    { id: 'icB08', title: '[Prep E1] Ler o briefing e montar a hipótese de funil do zero', daysAfter: 3, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_ver', type: 'auditoria', done: false },
    { id: 'icB09', title: '[ENCONTRO 1 — VER] Desenhar o funil do zero (1h–1h30, gravar)', daysAfter: 5, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_ver', type: 'plan_estrategico', done: false, checklist: [
      { id: 'icB1a', title: 'Explicar o conceito de funil e desenhar com o cliente' },
      { id: 'icB1b', title: 'Mapear a jornada real do lead hoje (mesmo sem gestão)' },
      { id: 'icB1c', title: 'Identificar o maior gargalo (provável: nada é acompanhado)' },
      { id: 'icB1d', title: 'Definir as etapas do funil ideal (do zero)' },
      { id: 'icB1e', title: 'Definir os critérios de lead ideal (do zero)' },
      { id: 'icB1f', title: 'Definir a métrica-chave (lead → próximo passo → cliente)' },
      { id: 'icB1g', title: 'Gravar o encontro e subir no Drive' },
    ] },
    { id: 'icB10', title: '[Lição de casa E1] Acompanhar o cliente separar 10–15 leads reais recentes', daysAfter: 7, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_ver', type: 'revisao', done: false },
    { id: 'icB11', title: '[Pós E1] Montar/ativar o CRM base do zero (ex: Juscia) com as etapas', daysAfter: 9, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_ver', type: 'setup_conta', done: false },

    // ── E2 · ORGANIZAR — Ativar & criar hábito (Gabriel) ──
    { id: 'icB12', title: '[Prep E2] Deixar o CRM base ativado (pipeline + campos + etiquetas)', daysAfter: 10, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_organizar', type: 'setup_conta', done: false },
    { id: 'icB13', title: '[ENCONTRO 2 — ORGANIZAR] Ativar o CRM e criar o hábito (1h–1h30, gravar)', daysAfter: 12, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_organizar', type: 'trein_equipe', done: false, checklist: [
      { id: 'icB2a', title: 'Cadastrar 3–5 leads reais juntos (pela 1ª vez)' },
      { id: 'icB2b', title: 'Ensinar o fluxo básico de uso (mover, campos, etiquetas) — do zero' },
      { id: 'icB2c', title: 'Definir os gatilhos de lembrete (o sistema avisa; a mensagem é humana, caso a caso)' },
      { id: 'icB2d', title: 'Definir a régua leve de reengajamento no topo (lead pré-caso)' },
      { id: 'icB2e', title: 'Montar a rotina de 15 min + combinar o gatilho de hábito (quando/como)' },
      { id: 'icB2f', title: 'Gravar o encontro e subir no Drive' },
    ] },
    { id: 'icB14', title: '[Lição de casa E2] Acompanhar o cliente registrar TODOS os leads da semana (foco: criar o hábito)', daysAfter: 15, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_organizar', type: 'revisao', done: false },
    { id: 'icB15', title: '[Pós E2] Acompanhar de perto a adesão (o risco é a rotina não pegar)', daysAfter: 17, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_organizar', type: 'revisao', done: false },

    // ── E3 · CONVERTER — Construir do zero (Gabriel) ──
    { id: 'icB16', title: '[Prep E3] Pré-preencher os scripts com o nicho (do zero) + preparar exemplos', daysAfter: 19, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_converter', type: 'criacao_copy', done: false },
    { id: 'icB17', title: '[ENCONTRO 3 — CONVERTER] Construir o roteiro do zero e treinar (1h–1h30, gravar)', daysAfter: 21, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_converter', type: 'trein_equipe', done: false, checklist: [
      { id: 'icB3a', title: 'Autópsia do que existe + exemplos ao vivo/hipotéticos (base magra)' },
      { id: 'icB3b', title: 'Construir o roteiro do zero (acolher → qualificar → gerar valor → encaminhar)' },
      { id: 'icB3c', title: 'Definir o corte gentil (pra quem quer orientação de graça)' },
      { id: 'icB3d', title: 'Passar o filtro OAB em cada script (Provimento 205/2021)' },
      { id: 'icB3e', title: 'Mapear as objeções (construir sem histórico organizado)' },
      { id: 'icB3f', title: 'Treinar quem atende / calibrar a IA — foco em executar pela 1ª vez' },
      { id: 'icB3g', title: 'Definir o handoff (IA ↔ pessoa) — do zero' },
      { id: 'icB3h', title: 'Definir metas + o número de conversão a acompanhar' },
      { id: 'icB3i', title: 'Gravar o encontro e subir no Drive' },
    ] },
    { id: 'icB18', title: '[Lição de casa E3] Acompanhar o cliente rodar o roteiro por 1 semana (foco: hábito)', daysAfter: 24, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_converter', type: 'revisao', done: false },

    // ── HANDOFF & RECORRÊNCIA (Gabriel) ──
    { id: 'icB19', title: '[Entrega] Consolidar e formatar o Playbook Comercial final (PDF no Drive)', daysAfter: 26, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_handoff', type: 'plan_estrategico', done: false, checklist: [
      { id: 'icB5a', title: 'Funil + critérios de lead ideal' },
      { id: 'icB5b', title: 'Régua de cadência e lembretes' },
      { id: 'icB5c', title: 'Roteiro + corte gentil + banco de objeções' },
      { id: 'icB5d', title: 'Metas + rotina semanal de 15 min' },
      { id: 'icB5e', title: 'Exportar em PDF e subir no Drive do cliente' },
    ] },
    { id: 'icB20', title: '[Handoff] Encerrar o suporte de 30 dias e fazer o check-in', daysAfter: 56, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_handoff', type: 'reuniao', done: false },
    { id: 'icB21', title: '[Recorrência] Apresentar a proposta de continuidade (acompanhamento mensal ou Assessoria)', daysAfter: 58, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'icB_ms_handoff', type: 'reuniao', done: false },
    { id: 'icB22', title: '[Recorrência] Solicitar depoimento e avaliação no Google', daysAfter: 60, assigneeRole: 'colaborador', assigneeId: 'adm_at', milestoneId: 'icB_ms_handoff', type: 'reuniao', done: false },
  ],
  createdAt: '2026-08-05',
  active: true,
}

// ══════════════════════════════════════════════════════════════════════════
//   2. IDENTIDADE VISUAL — R$ 797 · pagamento único
//   Também é entrega do Destrava Aceleração (hoje descoberta no playbook)
// ══════════════════════════════════════════════════════════════════════════

const IDENTIDADE_VISUAL = {
  id: 'pb_identidade_visual',
  title: 'Identidade Visual',
  category: 'Conteúdo',
  description: 'Criação de identidade visual: logo em 2 variações, paleta de cores, tipografia, cartão de visita digital e papel timbrado. Vendida avulsa (R$ 797) e inclusa no Destrava Aceleração.',
  steps: [
    { id: 'iv01', title: '[F1] Briefing de marca: negócio, público, valores e concorrentes', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'gs', type: 'reuniao', done: false, checklist: [
      { id: 'ivb1', title: 'O que o negócio faz e para quem, em uma frase' },
      { id: 'ivb2', title: 'Como o cliente quer ser percebido — 3 adjetivos' },
      { id: 'ivb3', title: 'O que a marca NÃO pode parecer' },
      { id: 'ivb4', title: 'Concorrentes diretos e o que ele acha da marca deles' },
      { id: 'ivb5', title: 'Existe algum elemento a preservar? Nome, cor, símbolo herdado' },
      { id: 'ivb6', title: 'Onde a marca vai ser aplicada: fachada, uniforme, redes, veículo' },
      { id: 'ivb7', title: 'Se o cliente tem OAB ou conselho de classe, levantar as restrições' },
    ] },
    { id: 'iv02', title: '[F1] Coletar referências visuais com o cliente', daysAfter: 1, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivr1', title: 'Pedir 3 a 5 marcas que ele admira e por quê' },
      { id: 'ivr2', title: 'Pedir 3 marcas que ele não gosta e por quê' },
      { id: 'ivr3', title: 'Montar painel de referências no Figma ou Pinterest' },
      { id: 'ivr4', title: 'Subir o painel na pasta do Drive do cliente' },
    ] },
    { id: 'iv03', title: '[F1] Pesquisa de concorrência visual do nicho', daysAfter: 2, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'analisar_concorr', done: false },
    { id: 'iv04', title: '[F1] Definir conceito e direção criativa', daysAfter: 3, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false },
    { id: 'iv05', title: '[F1 — ENTREGA] Desenvolver a proposta de logo (2 variações)', daysAfter: 5, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivl1', title: 'Versão principal — assinatura completa' },
      { id: 'ivl2', title: 'Versão secundária — reduzida ou símbolo isolado' },
      { id: 'ivl3', title: 'Testar legibilidade em tamanho pequeno (favicon, perfil)' },
      { id: 'ivl4', title: 'Testar em fundo claro e em fundo escuro' },
      { id: 'ivl5', title: 'Testar a versão monocromática (preto e branco)' },
    ] },
    { id: 'iv06', title: '[F1 — ENTREGA] Definir paleta de cores e tipografia', daysAfter: 6, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivp1', title: 'Cor primária, secundária e cores de apoio com código HEX' },
      { id: 'ivp2', title: 'Conferir contraste de acessibilidade nas combinações principais' },
      { id: 'ivp3', title: 'Fonte de título e fonte de texto, com pesos definidos' },
      { id: 'ivp4', title: 'Confirmar que as fontes têm licença de uso comercial' },
      { id: 'ivp5', title: 'Registrar onde baixar as fontes (link e licença)' },
    ] },
    { id: 'iv07', title: '[F1] Revisão interna antes de enviar ao cliente', daysAfter: 7, assigneeRole: 'gerente', assigneeId: 'gs', type: 'revisao', done: false },
    { id: 'iv08', title: '[F1] Apresentar a proposta ao cliente', daysAfter: 8, assigneeRole: 'gerente', assigneeId: 'gs', type: 'reuniao', done: false, checklist: [
      { id: 'iva1', title: 'Apresentar o conceito antes de mostrar o logo' },
      { id: 'iva2', title: 'Mostrar as aplicações reais, não o logo isolado no branco' },
      { id: 'iva3', title: 'Coletar o feedback por escrito no grupo ou e-mail' },
      { id: 'iva4', title: 'Deixar claro quantas rodadas de ajuste estão inclusas' },
    ] },
    { id: 'iv09', title: '[F1] Aplicar ajustes solicitados', daysAfter: 10, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false },
    { id: 'iv10', title: '[F1] Aprovação final da identidade pelo cliente', daysAfter: 11, assigneeRole: 'gerente', assigneeId: 'gs', type: 'revisao', done: false },
    { id: 'iv11', title: '[F1 — ENTREGA] Criar cartão de visita digital', daysAfter: 12, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivc1', title: 'Conferir os dados de contato com o cliente antes de fechar a arte' },
      { id: 'ivc2', title: 'Incluir link de WhatsApp e redes sociais' },
      { id: 'ivc3', title: 'Exportar em formato de compartilhamento por WhatsApp' },
    ] },
    { id: 'iv12', title: '[F1 — ENTREGA] Criar papel timbrado', daysAfter: 12, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivt1', title: 'Cabeçalho e rodapé com dados de contato' },
      { id: 'ivt2', title: 'Versão editável em .docx e versão em PDF' },
      { id: 'ivt3', title: 'Testar a impressão em A4 — conferir margens' },
    ] },
    { id: 'iv13', title: '[F1 — ENTREGA] Exportar e organizar todos os arquivos finais', daysAfter: 13, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivx1', title: 'Logo em PNG com fundo transparente — todas as variações' },
      { id: 'ivx2', title: 'Logo em SVG (vetor editável)' },
      { id: 'ivx3', title: 'Logo em JPG para onde não aceita transparência' },
      { id: 'ivx4', title: 'Versões em fundo claro, fundo escuro e monocromática' },
      { id: 'ivx5', title: 'Arquivo fonte editável (Figma ou Illustrator)' },
      { id: 'ivx6', title: 'Paleta em arquivo com os códigos HEX' },
      { id: 'ivx7', title: 'Organizar em subpastas nomeadas dentro do Drive do cliente' },
    ] },
    { id: 'iv14', title: '[F1 — ENTREGA] Montar o mini manual de uso da marca', daysAfter: 14, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'criar_artes', done: false, checklist: [
      { id: 'ivm1', title: 'Área de respiro mínima ao redor do logo' },
      { id: 'ivm2', title: 'Tamanho mínimo de aplicação' },
      { id: 'ivm3', title: 'O que não fazer: distorcer, trocar cor, aplicar sombra' },
      { id: 'ivm4', title: 'Exemplos de aplicação correta em post, site e impresso' },
      { id: 'ivm5', title: 'Exportar em PDF' },
    ] },
    { id: 'iv15', title: '[F1] Entregar a pasta ao cliente e explicar a organização dos arquivos', daysAfter: 15, assigneeRole: 'gerente', assigneeId: 'gs', type: 'reuniao', done: false },
    { id: 'iv16', title: '[F1] Aplicar a nova identidade no perfil das redes e no GMB', daysAfter: 16, assigneeRole: 'colaborador', assigneeId: 'beatriz', type: 'org_perfil', done: false },
  ],
  createdAt: '2026-08-05',
  active: true,
}

// ══════════════════════════════════════════════════════════════════════════
//   3. LANDING PAGE — R$ 1.297 · duas trilhas de publicação
// ══════════════════════════════════════════════════════════════════════════

const LANDING_PAGE = {
  id: 'pb_landing_page',
  title: 'Landing Page',
  category: 'Landing Page',
  description: 'Criação de landing page de conversão, do briefing à publicação. Duas trilhas de publicação: WordPress com hospedagem, ou Lovable. Ao vincular a um cliente, apague os passos da trilha que não for usada.',
  milestones: [
    { id: 'lp_ms_briefing',   title: 'Briefing e Copy',   icon: '📝', type: 'kickoff',  order: 1 },
    { id: 'lp_ms_design',     title: 'Design',            icon: '🎨', type: 'criativo', order: 2 },
    { id: 'lp_ms_publicacao', title: 'Publicação',        icon: '🚀', type: 'lp',       order: 3 },
    { id: 'lp_ms_entrega',    title: 'Rastreio e Entrega', icon: '✅', type: 'revisao',  order: 4 },
  ],
  steps: [
    // ── BRIEFING E COPY (D0–D3) ───────────────────────────────────────
    { id: 'lpg01', title: '[F1] Briefing: oferta, público, objetivo e CTA principal', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_briefing', type: 'reuniao', done: false, checklist: [
      { id: 'lpb1', title: 'Qual é a oferta exata que a página vende' },
      { id: 'lpb2', title: 'Para quem — e em que momento essa pessoa chega na página' },
      { id: 'lpb3', title: 'Qual é a ação única que a página precisa gerar' },
      { id: 'lpb4', title: 'Destino da conversão: formulário, WhatsApp ou agendamento' },
      { id: 'lpb5', title: 'Provas disponíveis: depoimentos, números, cases, certificações' },
      { id: 'lpb6', title: 'De qual campanha o tráfego vai vir' },
      { id: 'lpb7', title: 'Restrições do nicho — OAB, conselho de classe, saúde' },
    ] },
    { id: 'lpg02', title: '[F1] DECISÃO: definir a trilha de publicação e quem paga a recorrência', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_briefing', type: 'plan_estrategico', done: false, checklist: [
      { id: 'lpd1', title: 'O cliente já tem site ou hospedagem WordPress rodando?' },
      { id: 'lpd2', title: 'A LP precisa ficar no mesmo domínio do site (ex: /lp)?' },
      { id: 'lpd3', title: 'O cliente precisa de blog ou SEO mais profundo?' },
      { id: 'lpd4', title: 'Se sim para qualquer uma das anteriores, TRILHA A (WordPress)' },
      { id: 'lpd5', title: 'Se não — LP isolada de campanha, prazo curto — TRILHA B (Lovable)' },
      { id: 'lpd6', title: 'Definir a origem do domínio: comprado na plataforma ou no Registro.br' },
      { id: 'lpd7', title: 'Definir quem contrata e quem paga a hospedagem ou o plano Lovable' },
      { id: 'lpd8', title: 'Definir em qual conta a página fica: do cliente ou da TráfegOn' },
      { id: 'lpd9', title: 'Registrar a decisão por escrito no grupo do WhatsApp' },
      { id: 'lpd10', title: 'Apagar deste playbook os passos da trilha não escolhida' },
    ] },
    { id: 'lpg03', title: '[F1] Solicitar ou providenciar o domínio', daysAfter: 1, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_briefing', type: 'setup_conta', done: false, checklist: [
      { id: 'lpn1', title: 'Se o cliente já tem domínio: pedir acesso ao painel de DNS' },
      { id: 'lpn2', title: 'Se não tem: verificar disponibilidade e alinhar o nome' },
      { id: 'lpn3', title: 'Confirmar quem registra e em qual conta fica o domínio' },
      { id: 'lpn4', title: 'Domínio .com.br exige CNPJ ou CPF do titular — confirmar antes' },
      { id: 'lpn5', title: 'Registrar no Drive: onde o domínio está, login e vencimento' },
    ] },
    { id: 'lpg04', title: '[F1] Pesquisa de referências e análise de páginas concorrentes', daysAfter: 1, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_briefing', type: 'analisar_concorr', done: false },
    { id: 'lpg05', title: '[F1 — ENTREGA] Escrever a copy completa da página', daysAfter: 2, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_briefing', type: 'criacao_copy', done: false, checklist: [
      { id: 'lpc1', title: 'Headline — promessa clara em uma linha' },
      { id: 'lpc2', title: 'Subheadline — para quem e como funciona' },
      { id: 'lpc3', title: 'Bloco de dor ou situação atual' },
      { id: 'lpc4', title: 'Benefícios em bloco escaneável' },
      { id: 'lpc5', title: 'Prova social: depoimentos, números ou cases' },
      { id: 'lpc6', title: 'Quebra de objeções' },
      { id: 'lpc7', title: 'CTA repetido ao longo da página — mesma ação, sem concorrência' },
      { id: 'lpc8', title: 'Rodapé com dados da empresa e política de privacidade' },
    ] },
    { id: 'lpg06', title: '[F1] Aprovação da copy pelo cliente', daysAfter: 3, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_briefing', type: 'revisao', done: false },

    // ── DESIGN (D4–D6) ────────────────────────────────────────────────
    { id: 'lpg07', title: '[F1 — ENTREGA] Desenvolvimento do design da Landing Page (Figma)', daysAfter: 4, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'lp_ms_design', type: 'design_lp', done: false, checklist: [
      { id: 'lpf1', title: 'Aplicar a identidade visual do cliente: cores, fontes e logo' },
      { id: 'lpf2', title: 'Desenhar a versão desktop e a versão mobile' },
      { id: 'lpf3', title: 'CTA visível sem rolagem na primeira dobra' },
      { id: 'lpf4', title: 'Conferir contraste e legibilidade dos textos sobre imagem' },
      { id: 'lpf5', title: 'Selecionar imagens com licença de uso comercial' },
      { id: 'lpf6', title: 'Definir o formulário: quanto menos campo, mais conversão' },
    ] },
    { id: 'lpg08', title: '[F1] Revisão interna do design antes de enviar', daysAfter: 5, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_design', type: 'revisao', done: false },
    { id: 'lpg09', title: '[F1] Aprovação da versão Figma pelo cliente', daysAfter: 6, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_design', type: 'revisao', done: false },

    // ── TRILHA A — WORDPRESS + HOSPEDAGEM (D7–D10) ────────────────────
    { id: 'lpg10', title: '[TRILHA A — WORDPRESS] Contratar ou acessar a hospedagem', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'lp_ms_publicacao', type: 'setup_conta', done: false, checklist: [
      { id: 'lpwa1', title: 'Confirmar o plano de hospedagem e quem paga' },
      { id: 'lpwa2', title: 'Acessar o painel (cPanel ou equivalente)' },
      { id: 'lpwa3', title: 'Criar a conta de e-mail do domínio, se fizer parte do escopo' },
      { id: 'lpwa4', title: 'Registrar os acessos na pasta do Drive do cliente' },
    ] },
    { id: 'lpg11', title: '[TRILHA A — WORDPRESS] Apontar o domínio para a hospedagem', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'lp_ms_publicacao', type: 'setup_conta', done: false, checklist: [
      { id: 'lpwb1', title: 'Domínio comprado na própria hospedagem: apontamento já vem pronto' },
      { id: 'lpwb2', title: 'Domínio no Registro.br: entrar em Alterar Servidor DNS' },
      { id: 'lpwb3', title: 'Preencher os nameservers da hospedagem (ns1 e ns2)' },
      { id: 'lpwb4', title: 'Salvar e aguardar a propagação — pode levar até 24h' },
      { id: 'lpwb5', title: 'Conferir a propagação antes de seguir' },
      { id: 'lpwb6', title: 'Anotar a data de vencimento do domínio no Drive' },
    ] },
    { id: 'lpg12', title: '[TRILHA A — WORDPRESS] Instalar o WordPress e configurar a base', daysAfter: 8, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'lp_ms_publicacao', type: 'lp', done: false, checklist: [
      { id: 'lpwc1', title: 'Instalar o WordPress no domínio' },
      { id: 'lpwc2', title: 'Ativar o certificado SSL e forçar HTTPS' },
      { id: 'lpwc3', title: 'Instalar o tema e o construtor de página' },
      { id: 'lpwc4', title: 'Remover plugins e conteúdo de exemplo que vêm na instalação' },
      { id: 'lpwc5', title: 'Configurar os links permanentes' },
      { id: 'lpwc6', title: 'Criar usuário administrador para o cliente' },
      { id: 'lpwc7', title: 'Ativar backup automático' },
    ] },
    { id: 'lpg13', title: '[TRILHA A — WORDPRESS] Montar a página conforme o Figma aprovado', daysAfter: 9, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'lp_ms_publicacao', type: 'lp', done: false, checklist: [
      { id: 'lpwd1', title: 'Montar a estrutura seguindo o design aprovado' },
      { id: 'lpwd2', title: 'Ajustar a versão mobile bloco por bloco' },
      { id: 'lpwd3', title: 'Comprimir as imagens antes de subir' },
      { id: 'lpwd4', title: 'Configurar o formulário e o destino dos leads' },
      { id: 'lpwd5', title: 'Configurar o botão de WhatsApp com a mensagem pré-preenchida' },
      { id: 'lpwd6', title: 'Publicar a página de política de privacidade' },
    ] },

    // ── TRILHA B — LOVABLE (D7–D9) ────────────────────────────────────
    { id: 'lpg14', title: '[TRILHA B — LOVABLE] Construir a página no Lovable', daysAfter: 7, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_publicacao', type: 'lp', done: false, checklist: [
      { id: 'lpla1', title: 'Confirmar em qual conta o projeto vai ficar — do cliente ou da TráfegOn' },
      { id: 'lpla2', title: 'Confirmar que o plano cobre domínio personalizado' },
      { id: 'lpla3', title: 'Construir a página seguindo o Figma aprovado' },
      { id: 'lpla4', title: 'Conferir a responsividade em mobile' },
      { id: 'lpla5', title: 'Configurar o formulário e o destino dos leads' },
      { id: 'lpla6', title: 'Configurar o botão de WhatsApp com a mensagem pré-preenchida' },
      { id: 'lpla7', title: 'Publicar a página de política de privacidade' },
    ] },
    { id: 'lpg15', title: '[TRILHA B — LOVABLE] Publicar e conectar o domínio personalizado', daysAfter: 8, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_publicacao', type: 'setup_conta', done: false, checklist: [
      { id: 'lplb1', title: 'Publicar o projeto pelo Lovable' },
      { id: 'lplb2', title: 'Domínio comprado no Lovable: conexão é automática, só confirmar' },
      { id: 'lplb3', title: 'Domínio no Registro.br: copiar os registros DNS que o Lovable indica' },
      { id: 'lplb4', title: 'No Registro.br, ir em Editar Zona DNS' },
      { id: 'lplb5', title: 'Criar os registros exatamente como o Lovable pede (A e/ou CNAME)' },
      { id: 'lplb6', title: 'Salvar e aguardar a validação do domínio no painel do Lovable' },
      { id: 'lplb7', title: 'Confirmar que o SSL foi emitido e o site abre em HTTPS' },
      { id: 'lplb8', title: 'Registrar no Drive: conta, plano, vencimento e quem paga' },
    ] },

    // ── RASTREIO E ENTREGA (D10–D12) ──────────────────────────────────
    { id: 'lpg16', title: '[F1 — ENTREGA] Instalar e configurar os rastreamentos', daysAfter: 10, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'config_pixel', done: false, checklist: [
      { id: 'lpt1', title: 'Instalar o Pixel da Meta no head da página' },
      { id: 'lpt2', title: 'Instalar o Google Tag Manager' },
      { id: 'lpt3', title: 'Criar a tag do GA4 e a tag de conversão do Google Ads no GTM' },
      { id: 'lpt4', title: 'Criar o evento Lead no Gerenciador de Eventos da Meta' },
      { id: 'lpt5', title: 'Confirmar o Pixel com a extensão Pixel Helper' },
      { id: 'lpt6', title: 'Testar todos os eventos no Preview do GTM antes de publicar' },
      { id: 'lpt7', title: 'Publicar o contêiner do GTM' },
      { id: 'lpt8', title: 'Confirmar os eventos chegando na Meta e no Google Ads' },
      { id: 'lpt9', title: 'Registrar na tarefa quais eventos foram configurados' },
    ] },
    { id: 'lpg17', title: '[F1] Integrar o formulário ao CRM', daysAfter: 10, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'setup_conta', done: false, checklist: [
      { id: 'lpi1', title: 'Conectar o formulário ao CRM do cliente' },
      { id: 'lpi2', title: 'Confirmar em qual estágio do funil o lead entra' },
      { id: 'lpi3', title: 'Configurar a notificação de novo lead para o responsável' },
      { id: 'lpi4', title: 'Enviar um lead de teste e confirmar que chegou no CRM' },
    ] },
    { id: 'lpg18', title: '[F1] Revisão técnica final', daysAfter: 11, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'revisao', done: false, checklist: [
      { id: 'lpv1', title: 'Abrir em Android e iPhone, não só no redimensionador do navegador' },
      { id: 'lpv2', title: 'Testar todos os links e botões' },
      { id: 'lpv3', title: 'Enviar o formulário de verdade e conferir onde o lead cai' },
      { id: 'lpv4', title: 'Testar o botão de WhatsApp em celular' },
      { id: 'lpv5', title: 'Medir a velocidade e comprimir o que estiver pesado' },
      { id: 'lpv6', title: 'Conferir o cadeado de HTTPS' },
      { id: 'lpv7', title: 'Revisar ortografia e dados de contato' },
      { id: 'lpv8', title: 'Conferir o título e a descrição que aparecem ao compartilhar' },
    ] },
    { id: 'lpg19', title: '[F1] Aprovação da versão web pelo cliente', daysAfter: 12, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'revisao', done: false },
    { id: 'lpg20', title: '[F1] Aplicar os ajustes finais', daysAfter: 13, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'lp', done: false },
    { id: 'lpg21', title: '[F1 — ENTREGA] Entregar acessos e documentar o que foi feito', daysAfter: 14, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'reuniao', done: false, checklist: [
      { id: 'lpe1', title: 'Entregar o link final da página' },
      { id: 'lpe2', title: 'Entregar os acessos: painel, domínio e hospedagem ou Lovable' },
      { id: 'lpe3', title: 'Documentar no Drive onde tudo está hospedado' },
      { id: 'lpe4', title: 'Informar as datas de vencimento de domínio e plano' },
      { id: 'lpe5', title: 'Deixar claro por escrito quem paga a recorrência daqui pra frente' },
    ] },
    { id: 'lpg22', title: '[F1] Conectar a LP à campanha e testar o fluxo completo de conversão', daysAfter: 15, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'lp_ms_entrega', type: 'criar_campanha', done: false },
  ],
  createdAt: '2026-08-05',
  active: true,
}

// ══════════════════════════════════════════════════════════════════════════
//   4. SITE INSTITUCIONAL — R$ 2.497 · até 5 páginas · entrega em 15 dias
// ══════════════════════════════════════════════════════════════════════════

const SITE_INSTITUCIONAL = {
  id: 'pb_site_institucional',
  title: 'Site Institucional',
  category: 'Landing Page',
  description: 'Site institucional de até 5 páginas com SEO on-page e Google Analytics. Duas trilhas de publicação: WordPress com hospedagem, ou Lovable. Vendido avulso (R$ 2.497) e incluso no Destrava Aceleração em versão de até 3 páginas.',
  milestones: [
    { id: 'si_ms_planejamento', title: 'Planejamento',  icon: '🗺️', type: 'kickoff',  order: 1 },
    { id: 'si_ms_conteudo',     title: 'Conteúdo',      icon: '📝', type: 'criativo', order: 2 },
    { id: 'si_ms_design',       title: 'Design',        icon: '🎨', type: 'criativo', order: 3 },
    { id: 'si_ms_publicacao',   title: 'Publicação',    icon: '🚀', type: 'lp',       order: 4 },
    { id: 'si_ms_entrega',      title: 'SEO e Entrega', icon: '✅', type: 'revisao',  order: 5 },
  ],
  steps: [
    // ── PLANEJAMENTO (D0–D3) ──────────────────────────────────────────
    { id: 'si01', title: '[F1] Briefing: objetivo do site, público e o que ele precisa provar', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_planejamento', type: 'reuniao', done: false, checklist: [
      { id: 'sib1', title: 'O site é para vender, para dar credibilidade ou para captar?' },
      { id: 'sib2', title: 'Quem visita e o que precisa encontrar em 10 segundos' },
      { id: 'sib3', title: 'Serviços ou produtos que precisam de página própria' },
      { id: 'sib4', title: 'O cliente já tem site? Se sim, o que migra e o que morre' },
      { id: 'sib5', title: 'Restrições do nicho — OAB, conselho de classe, saúde' },
      { id: 'sib6', title: 'Precisa de blog? Isso costuma decidir a trilha' },
    ] },
    { id: 'si02', title: '[F1] DECISÃO: definir a trilha de publicação e quem paga a recorrência', daysAfter: 0, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_planejamento', type: 'plan_estrategico', done: false, checklist: [
      { id: 'sid1', title: 'Precisa de blog, SEO profundo ou o cliente vai editar sozinho?' },
      { id: 'sid2', title: 'Se sim, TRILHA A (WordPress)' },
      { id: 'sid3', title: 'Se não — site de apresentação, prazo curto — TRILHA B (Lovable)' },
      { id: 'sid4', title: 'Definir a origem do domínio: plataforma ou Registro.br' },
      { id: 'sid5', title: 'Definir quem contrata e paga a hospedagem ou o plano Lovable' },
      { id: 'sid6', title: 'Definir em qual conta o site fica: do cliente ou da TráfegOn' },
      { id: 'sid7', title: 'Registrar a decisão por escrito no grupo do WhatsApp' },
      { id: 'sid8', title: 'Apagar deste playbook os passos da trilha não escolhida' },
    ] },
    { id: 'si03', title: '[F1] Definir a arquitetura: quais páginas e o que vai em cada uma', daysAfter: 1, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_planejamento', type: 'plan_estrategico', done: false, checklist: [
      { id: 'sia1', title: 'Listar as páginas dentro do limite contratado' },
      { id: 'sia2', title: 'Definir o objetivo e o CTA de cada página' },
      { id: 'sia3', title: 'Desenhar o menu de navegação' },
      { id: 'sia4', title: 'Confirmar por escrito o limite de páginas com o cliente' },
    ] },
    { id: 'si04', title: '[F1] Solicitar ou providenciar o domínio', daysAfter: 1, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_planejamento', type: 'setup_conta', done: false, checklist: [
      { id: 'sin1', title: 'Se o cliente já tem domínio: pedir acesso ao painel de DNS' },
      { id: 'sin2', title: 'Se o site atual está no ar, planejar a virada para evitar queda' },
      { id: 'sin3', title: 'Domínio .com.br exige CNPJ ou CPF do titular' },
      { id: 'sin4', title: 'Registrar no Drive: onde está, login e vencimento' },
    ] },
    { id: 'si05', title: '[F1] Coletar o material do cliente: textos, fotos, logo e dados', daysAfter: 2, assigneeRole: 'colaborador', assigneeId: 'adm_at', milestoneId: 'si_ms_planejamento', type: 'pesquisa_merc', done: false, checklist: [
      { id: 'sic1', title: 'Logo e identidade visual em arquivo editável' },
      { id: 'sic2', title: 'Fotos da equipe, do espaço e dos produtos' },
      { id: 'sic3', title: 'Dados de contato, endereço e horário de atendimento' },
      { id: 'sic4', title: 'CNPJ e razão social para o rodapé' },
      { id: 'sic5', title: 'Depoimentos, cases e certificações' },
      { id: 'sic6', title: 'Se não houver fotos, alinhar banco de imagens ou ensaio' },
    ] },

    // ── CONTEÚDO (D3–D6) ──────────────────────────────────────────────
    { id: 'si06', title: '[F1] Levantar as palavras-chave do nicho e da região', daysAfter: 3, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_conteudo', type: 'pesquisa_merc', done: false },
    { id: 'si07', title: '[F1 — ENTREGA] Escrever os textos de todas as páginas', daysAfter: 4, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_conteudo', type: 'criacao_copy', done: false, checklist: [
      { id: 'sit1', title: 'Home: proposta de valor clara na primeira dobra' },
      { id: 'sit2', title: 'Sobre: história e credibilidade, com prova' },
      { id: 'sit3', title: 'Serviços: uma seção por serviço, com resultado esperado' },
      { id: 'sit4', title: 'Contato: formulário, WhatsApp, endereço e mapa' },
      { id: 'sit5', title: 'Distribuir as palavras-chave sem forçar' },
      { id: 'sit6', title: 'CTA em todas as páginas' },
    ] },
    { id: 'si08', title: '[F1] Aprovação dos textos pelo cliente', daysAfter: 6, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_conteudo', type: 'revisao', done: false },

    // ── DESIGN (D6–D9) ────────────────────────────────────────────────
    { id: 'si09', title: '[F1 — ENTREGA] Desenvolvimento do design do site (Figma)', daysAfter: 6, assigneeRole: 'colaborador', assigneeId: 'beatriz', milestoneId: 'si_ms_design', type: 'design_lp', done: false, checklist: [
      { id: 'sif1', title: 'Aplicar a identidade visual do cliente' },
      { id: 'sif2', title: 'Desenhar todas as páginas em desktop e mobile' },
      { id: 'sif3', title: 'Padronizar cabeçalho, rodapé e botões entre as páginas' },
      { id: 'sif4', title: 'Selecionar imagens com licença de uso comercial' },
      { id: 'sif5', title: 'Deixar o contato acessível de qualquer página' },
    ] },
    { id: 'si10', title: '[F1] Revisão interna do design', daysAfter: 8, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_design', type: 'revisao', done: false },
    { id: 'si11', title: '[F1] Aprovação da versão Figma pelo cliente', daysAfter: 9, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_design', type: 'revisao', done: false },

    // ── TRILHA A — WORDPRESS (D10–D13) ────────────────────────────────
    { id: 'si12', title: '[TRILHA A — WORDPRESS] Contratar hospedagem e apontar o domínio', daysAfter: 10, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'si_ms_publicacao', type: 'setup_conta', done: false, checklist: [
      { id: 'siwa1', title: 'Confirmar o plano de hospedagem e quem paga' },
      { id: 'siwa2', title: 'Domínio no Registro.br: preencher os nameservers da hospedagem' },
      { id: 'siwa3', title: 'Aguardar a propagação e conferir antes de seguir' },
      { id: 'siwa4', title: 'Criar as contas de e-mail do domínio, se estiver no escopo' },
      { id: 'siwa5', title: 'Registrar os acessos no Drive do cliente' },
    ] },
    { id: 'si13', title: '[TRILHA A — WORDPRESS] Instalar o WordPress e configurar a base', daysAfter: 11, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'si_ms_publicacao', type: 'lp', done: false, checklist: [
      { id: 'siwb1', title: 'Instalar o WordPress e ativar o SSL com HTTPS forçado' },
      { id: 'siwb2', title: 'Instalar o tema e o construtor de página' },
      { id: 'siwb3', title: 'Remover plugins e conteúdo de exemplo' },
      { id: 'siwb4', title: 'Instalar o plugin de SEO' },
      { id: 'siwb5', title: 'Configurar os links permanentes' },
      { id: 'siwb6', title: 'Criar usuário administrador para o cliente' },
      { id: 'siwb7', title: 'Ativar backup automático' },
    ] },
    { id: 'si14', title: '[TRILHA A — WORDPRESS] Montar todas as páginas conforme o Figma', daysAfter: 12, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'si_ms_publicacao', type: 'lp', done: false, checklist: [
      { id: 'siwc1', title: 'Montar cada página seguindo o design aprovado' },
      { id: 'siwc2', title: 'Ajustar a versão mobile de cada página' },
      { id: 'siwc3', title: 'Comprimir as imagens antes de subir' },
      { id: 'siwc4', title: 'Configurar o formulário de contato e o destino dos leads' },
      { id: 'siwc5', title: 'Configurar o botão flutuante de WhatsApp' },
      { id: 'siwc6', title: 'Publicar a política de privacidade e o aviso de cookies' },
    ] },

    // ── TRILHA B — LOVABLE (D10–D12) ──────────────────────────────────
    { id: 'si15', title: '[TRILHA B — LOVABLE] Construir o site no Lovable', daysAfter: 10, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_publicacao', type: 'lp', done: false, checklist: [
      { id: 'sila1', title: 'Confirmar em qual conta o projeto vai ficar' },
      { id: 'sila2', title: 'Confirmar que o plano cobre domínio personalizado' },
      { id: 'sila3', title: 'Construir todas as páginas seguindo o Figma aprovado' },
      { id: 'sila4', title: 'Configurar a navegação entre as páginas' },
      { id: 'sila5', title: 'Conferir a responsividade em mobile' },
      { id: 'sila6', title: 'Configurar o formulário de contato e o destino dos leads' },
      { id: 'sila7', title: 'Publicar a política de privacidade' },
    ] },
    { id: 'si16', title: '[TRILHA B — LOVABLE] Publicar e conectar o domínio personalizado', daysAfter: 11, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_publicacao', type: 'setup_conta', done: false, checklist: [
      { id: 'silb1', title: 'Publicar o projeto pelo Lovable' },
      { id: 'silb2', title: 'Domínio comprado no Lovable: conexão automática, só confirmar' },
      { id: 'silb3', title: 'Domínio no Registro.br: copiar os registros DNS que o Lovable indica' },
      { id: 'silb4', title: 'No Registro.br, ir em Editar Zona DNS e criar os registros' },
      { id: 'silb5', title: 'Aguardar a validação do domínio no painel do Lovable' },
      { id: 'silb6', title: 'Confirmar que o SSL foi emitido e o site abre em HTTPS' },
      { id: 'silb7', title: 'Registrar no Drive: conta, plano, vencimento e quem paga' },
    ] },

    // ── SEO E ENTREGA (D13–D15) ───────────────────────────────────────
    { id: 'si17', title: '[F1 — ENTREGA] Configurar o SEO on-page de todas as páginas', daysAfter: 13, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_entrega', type: 'lp', done: false, checklist: [
      { id: 'sis1', title: 'Título e meta descrição únicos por página' },
      { id: 'sis2', title: 'Um H1 por página, com hierarquia correta de títulos' },
      { id: 'sis3', title: 'Texto alternativo em todas as imagens' },
      { id: 'sis4', title: 'URLs limpas e descritivas' },
      { id: 'sis5', title: 'Título e imagem de compartilhamento em redes sociais' },
      { id: 'sis6', title: 'Gerar o sitemap e conferir o robots.txt' },
      { id: 'sis7', title: 'Se houver site antigo, redirecionar as URLs que mudaram' },
    ] },
    { id: 'si18', title: '[F1 — ENTREGA] Instalar Analytics e rastreamentos', daysAfter: 13, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_entrega', type: 'config_pixel', done: false, checklist: [
      { id: 'sig1', title: 'Instalar o Google Tag Manager' },
      { id: 'sig2', title: 'Criar e conectar a propriedade do GA4' },
      { id: 'sig3', title: 'Instalar o Pixel da Meta' },
      { id: 'sig4', title: 'Configurar os eventos de conversão: formulário e WhatsApp' },
      { id: 'sig5', title: 'Cadastrar o site no Google Search Console' },
      { id: 'sig6', title: 'Enviar o sitemap pelo Search Console' },
      { id: 'sig7', title: 'Testar os eventos no Preview do GTM e publicar' },
    ] },
    { id: 'si19', title: '[F1] Vincular o site ao Google Meu Negócio', daysAfter: 14, assigneeRole: 'colaborador', assigneeId: 'gs', milestoneId: 'si_ms_entrega', type: 'atualizar_gmn', done: false },
    { id: 'si20', title: '[F1] Revisão técnica final', daysAfter: 14, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_entrega', type: 'revisao', done: false, checklist: [
      { id: 'siv1', title: 'Abrir todas as páginas em Android e iPhone' },
      { id: 'siv2', title: 'Testar todos os links do menu e do rodapé' },
      { id: 'siv3', title: 'Enviar o formulário de verdade e conferir onde o lead cai' },
      { id: 'siv4', title: 'Testar o botão de WhatsApp em celular' },
      { id: 'siv5', title: 'Medir a velocidade e comprimir o que estiver pesado' },
      { id: 'siv6', title: 'Conferir o cadeado de HTTPS em todas as páginas' },
      { id: 'siv7', title: 'Revisar ortografia, dados de contato e razão social' },
      { id: 'siv8', title: 'Conferir se não sobrou nenhum texto de exemplo' },
    ] },
    { id: 'si21', title: '[F1] Aprovação da versão web pelo cliente', daysAfter: 15, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_entrega', type: 'revisao', done: false },
    { id: 'si22', title: '[F1] Aplicar os ajustes finais', daysAfter: 16, assigneeRole: 'colaborador', assigneeId: 'deivisson', milestoneId: 'si_ms_entrega', type: 'lp', done: false },
    { id: 'si23', title: '[F1 — ENTREGA] Entregar acessos, documentar e treinar o cliente', daysAfter: 17, assigneeRole: 'gerente', assigneeId: 'gs', milestoneId: 'si_ms_entrega', type: 'reuniao', done: false, checklist: [
      { id: 'sie1', title: 'Entregar o link final e todos os acessos' },
      { id: 'sie2', title: 'Documentar no Drive onde tudo está hospedado' },
      { id: 'sie3', title: 'Informar as datas de vencimento de domínio e plano' },
      { id: 'sie4', title: 'Deixar claro por escrito quem paga a recorrência' },
      { id: 'sie5', title: 'Gravar um vídeo curto mostrando como editar o conteúdo' },
      { id: 'sie6', title: 'Explicar quais alterações estão inclusas e quais são cobradas' },
    ] },
  ],
  createdAt: '2026-08-05',
  active: true,
}

export const PRODUTO_PLAYBOOKS = [
  IMPLEMENTACAO_COMERCIAL,
  IMPLEMENTACAO_COMERCIAL_B,
  IDENTIDADE_VISUAL,
  LANDING_PAGE,
  SITE_INSTITUCIONAL,
]
