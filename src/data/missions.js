// Missões de função por cargo — chaves devem bater exatamente com collab.role no sistema
export const ROLE_MISSIONS = {

  'Creative Producer': {
    area: 'Produção & Operações',
    areaColor: '#ec4899',
    icon: '🎨',
    missions: [
      { id: 'cp-01', title: 'Responder mensagens nos grupos de clientes',          freq: 'Diário',        ons: 2,  cat: 'Atendimento'  },
      { id: 'cp-02', title: 'Enviar cronograma de prazos e responsabilidades',     freq: 'Semanal',       ons: 5,  cat: 'Gestão'       },
      { id: 'cp-03', title: 'Planejamento mensal TráfegOn geral',                  freq: 'Mensal',        ons: 15, cat: 'Planejamento'  },
      { id: 'cp-04', title: 'Planejamento mensal Quadros + Nueva',                 freq: 'Mensal',        ons: 10, cat: 'Planejamento'  },
      { id: 'cp-05', title: 'Calendário editorial de clientes não jurídicos',      freq: 'Mensal',        ons: 8,  cat: 'Planejamento'  },
      { id: 'cp-06', title: 'Criar grupo e enviar mensagem padrão de novo cliente',freq: 'Por entrada',   ons: 8,  cat: 'Onboarding'    },
      { id: 'cp-07', title: 'Formalizar contrato de novo cliente',                 freq: 'Por entrada',   ons: 8,  cat: 'Onboarding'    },
      { id: 'cp-08', title: 'Briefing criativo de novo cliente',                   freq: 'Por entrada',   ons: 6,  cat: 'Onboarding'    },
      { id: 'cp-09', title: 'Entregar copy de landing page (não jurídico)',        freq: 'Por entrega',   ons: 12, cat: 'Produção'      },
      { id: 'cp-10', title: 'Editar e entregar vídeo de cliente',                  freq: 'Por vídeo',     ons: 10, cat: 'Produção'      },
    ],
    goals: [
      { id: 'cp-g1', icon: '⚡', title: '100% grupos criados em até 24h após assinatura' },
      { id: 'cp-g2', icon: '📅', title: 'Cronograma semanal enviado sem falhar nenhuma semana' },
      { id: 'cp-g3', icon: '🎬', title: 'Mín. 6 vídeos entregues no mês' },
      { id: 'cp-g4', icon: '📝', title: '0 contratos pendentes há mais de 3 dias' },
      { id: 'cp-g5', icon: '🖥️', title: '100% LPs entregues no prazo combinado' },
    ],
  },

  'Marketing Trainee': {
    area: 'Tráfego & Onboarding',
    areaColor: '#60a5fa',
    icon: '📈',
    missions: [
      { id: 'mt-01', title: 'Configurar Google Meu Negócio de cliente novo',       freq: 'Por entrada',   ons: 10, cat: 'Onboarding'    },
      { id: 'mt-02', title: 'Organizar perfil de redes sociais de cliente novo',   freq: 'Por entrada',   ons: 8,  cat: 'Onboarding'    },
      { id: 'mt-03', title: 'Atualizar CRM pós-onboarding',                        freq: 'Por entrada',   ons: 4,  cat: 'Operacional'   },
      { id: 'mt-04', title: 'Estudar e praticar gestão de tráfego pago',           freq: 'Semanal',       ons: 5,  cat: 'Crescimento'   },
      { id: 'mt-05', title: 'Acompanhar campanha com Tochiro / GS',                freq: 'Semanal',       ons: 5,  cat: 'Crescimento'   },
      { id: 'mt-06', title: 'Registrar observação de performance no CRM',          freq: 'Semanal',       ons: 3,  cat: 'Operacional'   },
      { id: 'mt-07', title: 'Suporte na estrutura de relatório de cliente',        freq: 'Quinzenal',     ons: 5,  cat: 'Operacional'   },
    ],
    goals: [
      { id: 'mt-g1', icon: '🚀', title: 'Mín. 2 entradas de clientes concluídas por mês' },
      { id: 'mt-g2', icon: '✅', title: '100% dos GMBs organizados sem pendência' },
      { id: 'mt-g3', icon: '📊', title: 'Mín. 1 observação de campanha registrada por semana' },
      { id: 'mt-g4', icon: '🗂️', title: 'CRM atualizado para todos os clientes sob responsabilidade' },
    ],
  },

  'Media Buyer': {
    area: 'Tráfego Pago',
    areaColor: '#6eda2c',
    icon: '📡',
    missions: [
      { id: 'mb-01', title: 'Revisar e otimizar campanhas dos clientes',           freq: 'Semanal',       ons: 8,  cat: 'Gestão'       },
      { id: 'mb-02', title: 'Enviar relatório de performance para clientes',       freq: 'Quinzenal',     ons: 10, cat: 'Relatório'     },
      { id: 'mb-03', title: 'Conduzir reunião quinzenal com cliente',              freq: 'Quinzenal',     ons: 8,  cat: 'Reuniões'      },
      { id: 'mb-04', title: 'Atualizar análise no CRM',                            freq: 'Semanal',       ons: 5,  cat: 'Análise'       },
      { id: 'mb-05', title: 'Enviar pauta de reunião 24h antes',                  freq: 'Por reunião',   ons: 4,  cat: 'Reuniões'      },
      { id: 'mb-06', title: 'Registrar otimizações realizadas no sistema',        freq: 'Semanal',       ons: 3,  cat: 'Análise'       },
      { id: 'mb-07', title: 'Diagnóstico mensal de contas (estratégia)',           freq: 'Mensal',        ons: 15, cat: 'Estratégia'    },
      { id: 'mb-08', title: 'Enviar pauta de aprovação de criativos para clientes',freq: 'Por ciclo',    ons: 6,  cat: 'Gestão'       },
      { id: 'mb-09', title: 'Registrar alerta de anomalia em campanha',           freq: 'Por ocorrência',ons: 5,  cat: 'Análise'       },
    ],
    goals: [
      { id: 'mb-g1', icon: '📋', title: '100% relatórios enviados no prazo' },
      { id: 'mb-g2', icon: '⚙️', title: 'Mín. 4 otimizações registradas por conta ativa/mês' },
      { id: 'mb-g3', icon: '📅', title: '0 reuniões perdidas ou sem pauta enviada' },
      { id: 'mb-g4', icon: '🎯', title: 'CPL dentro da meta em ≥80% das contas gerenciadas' },
      { id: 'mb-g5', icon: '🗂️', title: 'CRM atualizado toda sexta-feira' },
    ],
  },

  'Content Creator': {
    area: 'Social Media Jurídico',
    areaColor: '#a78bfa',
    icon: '⚖️',
    missions: [
      { id: 'cc-01', title: 'Planejar calendário editorial jurídico',              freq: 'Mensal (dia 25)',ons: 15, cat: 'Planejamento'  },
      { id: 'cc-02', title: 'Executar posts de clientes jurídicos',                freq: 'Semanal',       ons: 6,  cat: 'Produção'      },
      { id: 'cc-03', title: 'Planejamento mensal Polízio + Andressa',              freq: 'Mensal',        ons: 10, cat: 'Planejamento'  },
      { id: 'cc-04', title: 'Configurar GMB de cliente jurídico novo',             freq: 'Por entrada',   ons: 10, cat: 'Onboarding'    },
      { id: 'cc-05', title: 'Organizar perfil de redes de cliente jurídico',       freq: 'Por entrada',   ons: 8,  cat: 'Onboarding'    },
      { id: 'cc-06', title: 'Entregar copy de landing page jurídica',              freq: 'Por entrega',   ons: 12, cat: 'Produção'      },
      { id: 'cc-07', title: 'Relatório mensal de métricas orgânicas por cliente',  freq: 'Mensal',        ons: 10, cat: 'Análise'       },
      { id: 'cc-08', title: 'Revisão de bio, destaques e feed de cliente',         freq: 'Bimestral',     ons: 8,  cat: 'Produção'      },
      { id: 'cc-09', title: 'Captar depoimento ou case de cliente satisfeito',     freq: 'Mensal',        ons: 7,  cat: 'Relacionamento' },
    ],
    goals: [
      { id: 'cc-g1', icon: '📅', title: 'Calendário entregue até dia 25 sem falhar' },
      { id: 'cc-g2', icon: '📱', title: 'Mín. 12 posts/mês por cliente jurídico ativo' },
      { id: 'cc-g3', icon: '⚡', title: '100% das entradas jurídicas concluídas em até 48h' },
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
