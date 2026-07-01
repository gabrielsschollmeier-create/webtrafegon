// Missões de função por cargo — chaves devem bater exatamente com collab.role no sistema
export const ROLE_MISSIONS = {

  'Creative Producer': {
    area: 'Produção & Operações',
    areaColor: '#ec4899',
    icon: '🎨',
    missions: [
      { id: 'cp-01', title: 'Responder mensagens nos grupos de clientes',              freq: 'Diário',      ons: 1, cat: 'Atendimento' },
      { id: 'cp-02', title: 'Enviar cronograma de prazos e responsabilidades',         freq: 'Semanal',     ons: 3, cat: 'Gestão'      },
      { id: 'cp-03', title: 'Planejamento mensal TráfegOn geral',                      freq: 'Mensal',      ons: 8, cat: 'Planejamento' },
      { id: 'cp-04', title: 'Calendário e planejamento mensal Quadros e Nueva',        freq: 'Mensal',      ons: 6, cat: 'Planejamento' },
      { id: 'cp-06', title: 'Criar grupo e enviar mensagem padrão de novo cliente',    freq: 'Por entrada', ons: 4, cat: 'Onboarding'   },
      { id: 'cp-08', title: 'Briefing criativo de novo cliente',                       freq: 'Por entrada', ons: 3, cat: 'Onboarding'   },
      { id: 'cp-09', title: 'Entregar copy de landing page Quadros e Nueva',           freq: 'Por entrega', ons: 6, cat: 'Produção'     },
      { id: 'cp-10', title: 'Editar e entregar vídeo de cliente',                      freq: 'Por vídeo',   ons: 5, cat: 'Produção'     },
    ],
    goals: [
      { id: 'cp-g1', icon: '⚡', title: '100% grupos criados em até 24h após assinatura' },
      { id: 'cp-g2', icon: '📅', title: 'Cronograma semanal enviado sem falhar nenhuma semana' },
      { id: 'cp-g3', icon: '🎬', title: 'Mín. 6 vídeos entregues no mês' },
      { id: 'cp-g5', icon: '🖥️', title: '100% LPs entregues no prazo combinado' },
    ],
  },

  'Marketing Trainee': {
    area: 'Tráfego & Onboarding',
    areaColor: '#60a5fa',
    icon: '📈',
    missions: [
      { id: 'mt-01', title: 'Configurar GMB e organizar redes de cliente novo',        freq: 'Por entrada', ons: 6, cat: 'Onboarding'  },
      { id: 'mt-03', title: 'Atualizar Hub pós-onboarding',                            freq: 'Por entrada', ons: 2, cat: 'Operacional'  },
      { id: 'mt-04', title: 'Estudar tráfego e acompanhar campanha com Juliano / GS', freq: 'Semanal',     ons: 4, cat: 'Crescimento'  },
      { id: 'mt-06', title: 'Registrar observação de performance no Hub',              freq: 'Semanal',     ons: 2, cat: 'Operacional'  },
      { id: 'mt-07', title: 'Suporte na estrutura de relatório de cliente',            freq: 'Quinzenal',   ons: 3, cat: 'Operacional'  },
    ],
    goals: [
      { id: 'mt-g1', icon: '🚀', title: 'Mín. 2 entradas de clientes concluídas por mês' },
      { id: 'mt-g2', icon: '✅', title: '100% dos GMBs organizados sem pendência' },
      { id: 'mt-g3', icon: '📊', title: 'Mín. 1 observação de campanha registrada por semana' },
      { id: 'mt-g4', icon: '🗂️', title: 'Hub atualizado para todos os clientes sob responsabilidade' },
    ],
  },

  'Media Buyer': {
    area: 'Tráfego Pago',
    areaColor: '#6eda2c',
    icon: '📡',
    missions: [
      { id: 'mb-01', title: 'Revisar e otimizar campanhas dos clientes',               freq: 'Semanal',       ons: 4, cat: 'Gestão'     },
      { id: 'mb-04', title: 'Registrar análises e otimizações no Hub',                 freq: 'Semanal',       ons: 4, cat: 'Análise'    },
      { id: 'mb-02', title: 'Ciclo quinzenal com clientes (pauta + relatório + reunião)', freq: 'Quinzenal', ons: 8, cat: 'Reuniões'   },
      { id: 'mb-07', title: 'Diagnóstico mensal de contas (estratégia)',               freq: 'Mensal',        ons: 8, cat: 'Estratégia' },
      { id: 'mb-08', title: 'Enviar pauta de aprovação de criativos para clientes',    freq: 'Por ciclo',     ons: 3, cat: 'Gestão'     },
      { id: 'mb-09', title: 'Registrar alerta de anomalia em campanha',                freq: 'Por ocorrência',ons: 3, cat: 'Análise'    },
    ],
    goals: [
      { id: 'mb-g1', icon: '📋', title: '100% relatórios enviados no prazo' },
      { id: 'mb-g2', icon: '⚙️', title: 'Mín. 4 otimizações registradas por conta ativa/mês' },
      { id: 'mb-g3', icon: '📅', title: '0 reuniões perdidas ou sem pauta enviada' },
      { id: 'mb-g4', icon: '🎯', title: 'CPL dentro da meta em ≥80% das contas gerenciadas' },
      { id: 'mb-g5', icon: '🗂️', title: 'Hub atualizado toda sexta-feira' },
    ],
  },

  'Marketing Assistant': {
    area: 'Marketing & Atendimento',
    areaColor: '#f59e0b',
    icon: '📣',
    missions: [
      { id: 'ma-01', title: 'Responder mensagens nos grupos de clientes',            freq: 'Diário',        ons: 1, cat: 'Atendimento'   },
      { id: 'ma-02', title: 'Registrar atualizações e feedbacks de clientes no Hub', freq: 'Semanal',       ons: 2, cat: 'Operacional'   },
      { id: 'ma-03', title: 'Criar e entregar copy para aprovação',                  freq: 'Por demanda',   ons: 3, cat: 'Produção'      },
      { id: 'ma-04', title: 'Organizar pauta de conteúdo do mês',                   freq: 'Mensal',        ons: 6, cat: 'Planejamento'  },
      { id: 'ma-05', title: 'Acompanhar onboarding de novo cliente',                 freq: 'Por entrada',   ons: 4, cat: 'Onboarding'    },
      { id: 'ma-06', title: 'Suporte na criação de artes e criativos',               freq: 'Por demanda',   ons: 3, cat: 'Produção'      },
      { id: 'ma-07', title: 'Enviar pauta de aprovação de criativos ao cliente',     freq: 'Quinzenal',     ons: 3, cat: 'Gestão'        },
      { id: 'ma-08', title: 'Captar depoimento ou case de cliente satisfeito',       freq: 'Mensal',        ons: 4, cat: 'Relacionamento' },
    ],
    goals: [
      { id: 'ma-g1', icon: '💬', title: 'Zero mensagens sem resposta por mais de 4h' },
      { id: 'ma-g2', icon: '📝', title: 'Mín. 4 copies criadas e aprovadas por semana' },
      { id: 'ma-g3', icon: '✅', title: '100% dos feedbacks de clientes registrados no Hub' },
      { id: 'ma-g4', icon: '🎯', title: 'Pauta mensal aprovada até dia 20' },
    ],
  },

  'Content Creator': {
    area: 'Social Media Jurídico',
    areaColor: '#a78bfa',
    icon: '⚖️',
    missions: [
      { id: 'cc-01', title: 'Planejamento + calendário editorial Polízio e Andressa',  freq: 'Mensal (dia 25)', ons: 10, cat: 'Planejamento'  },
      { id: 'cc-02', title: 'Executar posts Polízio e Andressa',                       freq: 'Semanal',         ons: 3,  cat: 'Produção'      },
      { id: 'cc-04', title: 'Configurar GMB e organizar redes de cliente jurídico novo', freq: 'Por entrada',   ons: 6,  cat: 'Onboarding'    },
      { id: 'cc-06', title: 'Entregar copy de landing page Polízio e Andressa',        freq: 'Por entrega',     ons: 6,  cat: 'Produção'      },
      { id: 'cc-07', title: 'Relatório mensal de métricas orgânicas Polízio e Andressa', freq: 'Mensal',        ons: 5,  cat: 'Análise'       },
      { id: 'cc-08', title: 'Revisão de bio, destaques e feed de cliente',             freq: 'Bimestral',       ons: 4,  cat: 'Produção'      },
      { id: 'cc-09', title: 'Captar depoimento ou case de cliente satisfeito',         freq: 'Mensal',          ons: 4,  cat: 'Relacionamento' },
    ],
    goals: [
      { id: 'cc-g1', icon: '📅', title: 'Calendário entregue até dia 25 sem falhar' },
      { id: 'cc-g2', icon: '📱', title: 'Mín. 12 posts/mês por cliente ativo' },
      { id: 'cc-g3', icon: '⚡', title: '100% das entradas concluídas em até 48h' },
      { id: 'cc-g4', icon: '📊', title: 'Mín. 1 relatório de métricas orgânicas por cliente/mês' },
    ],
  },
}

export const CAT_COLORS = {
  Atendimento:    '#f59e0b',
  Gestão:         '#6eda2c',
  Planejamento:   '#60a5fa',
  Onboarding:     '#a78bfa',
  Produção:       '#ec4899',
  Operacional:    '#94a3b8',
  Crescimento:    '#34d399',
  Relatório:      '#60a5fa',
  Reuniões:       '#fb923c',
  Análise:        '#22d3ee',
  Estratégia:     '#f43f5e',
  Relacionamento: '#e879f9',
}
