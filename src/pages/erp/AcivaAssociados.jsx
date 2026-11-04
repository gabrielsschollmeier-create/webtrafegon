import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

/* ── Fontes
   · associados.pdf / desativados.pdf: "Cadastro de Empresas Analítico" do sistema da ACIVA, impressos em 06/10/2026
     (79 associações ativas e 54 desativações entre 01/01 e 06/10/2026)
   · Mesmos relatórios anotados à mão pela ACIVA: motivo da saída, meses pagos e serviço de entrada
   · Informado pela ACIVA: base de 421 associados em 06/10/2026; outubro fechou com 10 novos e 7 saídas;
     ticket médio R$60; comissão atual = 2 mensalidades; meta de 15 novos por pessoa do comercial ── */

const ENTRADA = '#2f6fe0'
const SAIDA   = '#e8710a'
const VERDE   = '#16a34a'
const ALERTA  = '#d97706'
const CRITICO = '#dc2626'

const BASE_06_OUT  = 421
const OUTUBRO      = { entradas: 10, saidas: 7 }
const TICKET       = 60
const META_PESSOA  = 15
const MESES_PERIODO = 10
const DATA_RELATORIO = '2026-10-06'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
const SEDE  = 'Araranguá'

const MOTIVOS = {
  desfiliacao:   'Pediu desfiliação',
  inadimplencia: 'Inadimplência',
  sem_dados:     'Sem informação',
  util:          'Útil sem adesão dos clientes',
  fechou:        'Fechou ou mudou de cidade',
  titular:       'Troca de titular (não é perda)',
  voltou:        'Já voltou (não é perda)',
}

/* [nome, segmento, cidade/UF, data de associação, funcionários, boleto Sicoob, porta de entrada] */
const ENTRADAS = [
  ['Pausa 17', 'Pessoa física / MEI', 'Balneário Gaivota/SC', '2026-07-20', 0, false, 'Bem Visto'],
  ['Sandra Godinho (iGreen Energy)', 'Engenharia e energia', 'Passo de Torres/SC', '2026-04-16', 0, false, 'Eventos e networking'],
  ['2º Tabelionato de Notas e Protesto', 'Serviços profissionais', 'Araranguá/SC', '2026-04-24', 0, true, 'Ilegível'],
  ['Mateus Balthazar (eventos)', 'Marketing e eventos', 'Brusque/SC', '2026-06-16', 0, true, 'Coworking'],
  ['Tiago Fernandes Gonçalves', 'Pessoa física / MEI', 'Araranguá/SC', '2026-08-26', 0, true, null],
  ['Lédio Gabriel', 'Treinamento e consultoria', 'Araranguá/SC', '2026-03-02', 0, true, null],
  ['Daiane Dimas (Arte com Dimas)', 'Indústria', 'Araranguá/SC', '2026-09-28', 0, true, 'Ilegível'],
  ['Mala Pronta Viagens', 'Turismo e lazer', 'Araranguá/SC', '2026-03-23', 0, true, null],
  ['Leandro dos Santos Amaral', 'Pessoa física / MEI', 'Araranguá/SC', '2026-07-31', 0, false, 'Ilegível'],
  ['The Brothers', 'Beleza e bem-estar', 'Araranguá/SC', '2026-09-30', 0, true, 'Consultorias e mentorias'],
  ['Aline Fernandes', 'Treinamento e consultoria', 'Balneário Arroio do Silva/SC', '2026-06-15', 0, true, 'Núcleo NMH'],
  ['Carolini Labes', 'Beleza e bem-estar', 'Araranguá/SC', '2026-02-19', 0, false, null],
  ['Rubia Nara Becker (síndica)', 'Serviços profissionais', 'Araranguá/SC', '2026-03-23', 0, true, 'Núcleo NME'],
  ['Acta Contabilidade', 'Serviços profissionais', 'Araranguá/SC', '2026-03-23', 0, true, 'Núcleo NME'],
  ['AR Peças e Serviços', 'Automotivo e combustíveis', 'Araranguá/SC', '2026-01-21', 0, true, null],
  ['Arlete de Fátima Zanban', 'Pessoa física / MEI', 'Araranguá/SC', '2026-06-10', 0, true, 'Curso'],
  ['ARU (Arukhan IA)', 'Tecnologia', 'Araranguá/SC', '2026-05-01', 0, true, null],
  ['Auto Posto Daminelli', 'Automotivo e combustíveis', 'Turvo/SC', '2026-05-06', 0, true, 'Útil'],
  ['Beach Design', 'Indústria', 'Araranguá/SC', '2026-09-23', 0, true, 'Consultorias e mentorias'],
  ['BR Sollar Energias Renováveis', 'Engenharia e energia', 'Araranguá/SC', '2026-03-05', 0, true, null],
  ['Brasa Brasil', 'Alimentação e bebidas', 'Araranguá/SC', '2026-03-31', 0, true, 'Núcleo NME'],
  ['Cálita Cardozo', 'Pessoa física / MEI', 'Criciúma/SC', '2026-09-25', 0, true, 'Núcleo NMH'],
  ['Cana Cayana', 'Alimentação e bebidas', 'Araranguá/SC', '2026-02-06', 0, true, null],
  ['Daniel Supermercado', 'Alimentação e bebidas', 'Timbé do Sul/SC', '2026-09-14', 0, true, 'Útil'],
  ['Casagrande Materiais de Construção', 'Construção e imóveis', 'Turvo/SC', '2026-05-05', 0, true, null],
  ['Cores e Traços Makeup', 'Beleza e bem-estar', 'Araranguá/SC', '2026-08-13', 0, true, null],
  ['Creata Engenharia e Construtora', 'Engenharia e energia', 'Araranguá/SC', '2026-04-06', 0, true, 'Núcleo NJE'],
  ['Edilane Pacheco Emerim', 'Pessoa física / MEI', 'Araranguá/SC', '2026-06-24', 0, true, null],
  ['EFC Energia', 'Engenharia e energia', 'Araranguá/SC', '2026-09-23', 0, true, 'Consultorias e mentorias'],
  ['Emi Tech', 'Tecnologia', 'Araranguá/SC', '2026-08-24', 0, true, null],
  ['Clínica Veterinária Espaço Animal', 'Saúde', 'Praia Grande/SC', '2026-09-11', 0, true, 'Núcleo (não especificado)'],
  ['Estúdio Personal O2', 'Beleza e bem-estar', 'Araranguá/SC', '2026-05-14', 0, true, 'Núcleo (não especificado)'],
  ['Famed Saúde', 'Saúde', 'Araranguá/SC', '2026-08-21', 0, true, 'Bem Visto'],
  ['Fernanda Oliveira de Araujo', 'Pessoa física / MEI', 'Araranguá/SC', '2026-07-10', 0, false, 'Curso'],
  ['Anjos Colchões e Sofás', 'Comércio e varejo', 'Araranguá/SC', '2026-03-04', 0, true, 'Núcleo NME'],
  ['Fibcplastic', 'Indústria', 'Araranguá/SC', '2026-04-16', 0, true, 'Curso'],
  ['Promise Gestão de Compras', 'Serviços profissionais', 'Araranguá/SC', '2026-06-16', 0, true, null],
  ['Grêmio Fronteira', 'Turismo e lazer', 'Araranguá/SC', '2026-01-14', 0, true, null],
  ['Pit Stop Adega e Conveniência', 'Alimentação e bebidas', 'Araranguá/SC', '2026-09-11', 0, true, 'Útil'],
  ['Heloize Lourenço', 'Pessoa física / MEI', 'Meleiro/SC', '2026-09-17', 0, true, 'Núcleo NMH'],
  ['H Treinamentos', 'Treinamento e consultoria', 'Florianópolis/SC', '2026-01-15', 0, true, 'Curso'],
  ['Insight View Comunicação Digital', 'Marketing e eventos', 'Araranguá/SC', '2026-02-24', 0, true, null],
  ['Farmácia Econômica Filial I', 'Saúde', 'Araranguá/SC', '2026-02-18', 0, true, 'Útil'],
  ['R P Januário (máquinas agrícolas)', 'Indústria', 'Turvo/SC', '2026-04-06', 0, true, null],
  ['Julu Brinquedos Educativos', 'Comércio e varejo', 'Araranguá/SC', '2026-02-11', 0, true, null],
  ['Armilar Imóveis', 'Construção e imóveis', 'Araranguá/SC', '2026-06-10', 0, true, 'Núcleo NSE'],
  ['LRC Strategic Consulting', 'Treinamento e consultoria', 'Florianópolis/SC', '2026-07-03', 0, true, 'Núcleo NMH'],
  ['Luminous Store', 'Comércio e varejo', 'Araranguá/SC', '2026-08-07', 0, false, 'Locação'],
  ['M6PS Consultoria (reassociação)', 'Treinamento e consultoria', 'Capão da Canoa/RS', '2026-08-05', 0, false, 'Núcleo NME'],
  ['Hidrosul Soluções', 'Indústria', 'Canoas/RS', '2026-07-01', 0, true, 'Bem Visto'],
  ['Mavi Intermediação', 'Serviços profissionais', 'Araranguá/SC', '2026-05-12', 0, true, null],
  ['Mayk Silva dos Santos', 'Pessoa física / MEI', 'Araranguá/SC', '2026-07-31', 0, false, 'Curso'],
  ['Auto Posto Mercosul', 'Automotivo e combustíveis', 'Sombrio/SC', '2026-05-14', 0, true, 'Útil'],
  ['Metra Engenharia', 'Engenharia e energia', 'Araranguá/SC', '2026-09-11', 0, true, 'Bem Visto'],
  ['Confecções Priscis', 'Indústria', 'Araranguá/SC', '2026-06-12', 0, true, 'Consultorias e mentorias'],
  ['Nathali Boeira Dalzochio (psicóloga)', 'Saúde', 'Araranguá/SC', '2026-04-16', 0, true, 'Curso'],
  ['Nexa Engenharia e Arquitetura', 'Engenharia e energia', 'Araranguá/SC', '2026-02-06', 0, true, null],
  ['Novo Continente (atacado alimentos)', 'Alimentação e bebidas', 'Araranguá/SC', '2026-06-10', 0, true, 'Útil'],
  ['Pizza Água na Boca', 'Alimentação e bebidas', 'Balneário Arroio do Silva/SC', '2026-09-11', 0, true, 'Útil'],
  ['Projesul', 'Comércio e varejo', 'Araranguá/SC', '2026-08-06', 0, true, 'Útil'],
  ['Quantum Distribuição e Logística', 'Saúde', 'Araranguá/SC', '2026-08-10', 0, true, 'Bem Visto'],
  ['R&B Intermediações', 'Construção e imóveis', 'Criciúma/SC', '2026-07-01', 0, true, 'Curso'],
  ['Rodima Equipamentos', 'Automotivo e combustíveis', 'Maracajá/SC', '2026-08-12', 0, true, null],
  ['Recruta Easy', 'Tecnologia', 'Recife/PE', '2026-01-15', 0, true, 'Coworking'],
  ['Reinaldo Correa Matos (eventos)', 'Marketing e eventos', 'São Paulo/SP', '2026-03-31', 0, true, null],
  ['COT Clínica Ortopédica', 'Saúde', 'Araranguá/SC', '2026-06-11', 0, true, 'Curso'],
  ['Jucafes', 'Comércio e varejo', 'Balneário Arroio do Silva/SC', '2026-08-19', 0, true, 'Eventos e networking'],
  ['Titanium Segurança Estratégica', 'Serviços profissionais', 'Bom Jesus/RS', '2026-02-24', 0, true, null],
  ['Tabacaria Central (S.S.M)', 'Comércio e varejo', 'Araranguá/SC', '2026-09-11', 0, true, 'Útil'],
  ['Sabor Favorito Gastronomia', 'Alimentação e bebidas', 'Araranguá/SC', '2026-03-10', 0, true, 'Ilegível'],
  ['Sergio Rizzotto Carvalho', 'Pessoa física / MEI', 'Araranguá/SC', '2026-04-22', 0, true, 'Núcleo NJE'],
  ['Tabacaria Central (Simoni)', 'Comércio e varejo', 'Araranguá/SC', '2026-09-11', 0, true, 'Útil'],
  ['Steckert Engenharia', 'Engenharia e energia', 'Turvo/SC', '2026-05-05', 0, true, null],
  ['Tabacaria e Conveniência Central', 'Comércio e varejo', 'Araranguá/SC', '2026-09-11', 0, true, 'Útil'],
  ['Talau Imóveis', 'Construção e imóveis', 'Araranguá/SC', '2026-08-13', 0, true, 'Eventos e networking'],
  ['Tree House Pub', 'Alimentação e bebidas', 'Araranguá/SC', '2026-09-11', 0, true, 'Útil'],
  ['Super Popular Giassi (farmácia)', 'Saúde', 'Araranguá/SC', '2026-09-01', 0, true, 'Útil'],
  ['Projeto de Vida Consultoria', 'Treinamento e consultoria', 'Torres/RS', '2026-07-16', 0, false, 'Núcleo NMH'],
  ['Qualific+ (VM Engenharia)', 'Engenharia e energia', 'Araranguá/SC', '2026-01-22', 0, true, 'Locação'],
]

/* [nome, segmento, cidade/UF, data de associação, funcionários, boleto Sicoob, motivo, meses pagos, serviço usado] */
const SAIDAS = [
  ['Paola Camargo Hermann', 'Pessoa física / MEI', 'Araranguá/SC', '2025-09-09', 0, true, 'desfiliacao', 4, null],
  ['Nolukai (treinamento em informática)', 'Treinamento e consultoria', 'Balneário Arroio do Silva/SC', '2025-09-12', 0, false, 'desfiliacao', 6, null],
  ['Henrique de Lima Cardoso (elétrica)', 'Serviços técnicos', 'Araranguá/SC', '2026-02-26', 0, false, 'desfiliacao', 4, null],
  ['Gabriel Vinicius Machado de Machado', 'Pessoa física / MEI', 'Araranguá/SC', '2026-04-22', 0, false, 'desfiliacao', 3, 'Coworking'],
  ['Agência Matti', 'Marketing e eventos', 'Balneário Arroio do Silva/SC', '2025-05-21', 0, false, 'desfiliacao', 11, 'Núcleo NJE'],
  ['AFreitas Câmara de Arbitragem', 'Serviços profissionais', 'Araranguá/SC', '2025-12-03', 0, true, 'inadimplencia', 0, null],
  ['2º Tabelionato (cadastro antigo, CPF)', 'Serviços profissionais', 'Araranguá/SC', '2024-07-25', 0, true, 'titular', null, null],
  ['Cakto Produções e Eventos', 'Marketing e eventos', 'Porto Alegre/RS', '2026-04-22', 0, false, 'fechou', null, null],
  ['Souza Polli Advogados', 'Serviços profissionais', 'Araranguá/SC', '2023-08-30', 0, true, 'desfiliacao', null, null],
  ['Clínica Neuroaprender', 'Saúde', 'Araranguá/SC', '2026-02-18', 0, false, 'desfiliacao', 2, null],
  ['Comercial Alexfer', 'Construção e imóveis', 'Maracajá/SC', '2025-08-21', 0, false, 'inadimplencia', null, null],
  ['Tio Chico Agro Shop', 'Comércio e varejo', 'Araranguá/SC', '2026-02-18', 0, false, 'inadimplencia', null, null],
  ['São João Farmácias', 'Saúde', 'Turvo/SC', '2025-08-28', 0, false, 'desfiliacao', null, null],
  ['CIS AMESC', 'Saúde', 'Araranguá/SC', '2018-09-14', 9, true, 'desfiliacao', null, null],
  ['Jamily Schiestl Trento (psicologia)', 'Saúde', 'Araranguá/SC', '2024-10-28', 0, true, 'desfiliacao', null, null],
  ['Della & Matos (Dermaclinic)', 'Saúde', 'Araranguá/SC', '2025-11-11', 0, false, 'desfiliacao', 3, null],
  ['Diane Consultoria', 'Treinamento e consultoria', 'Araranguá/SC', '2026-06-05', 0, false, 'desfiliacao', 4, 'Núcleo NMH'],
  ['Ricardo Farma', 'Saúde', 'Forquilhinha/SC', '2024-10-31', 0, false, 'desfiliacao', null, null],
  ['Webaze', 'Marketing e eventos', 'Araranguá/SC', '2024-05-06', 0, true, 'desfiliacao', null, null],
  ['G6 Soluções em Consórcios', 'Serviços profissionais', 'Araranguá/SC', '2023-07-17', 0, false, 'inadimplencia', null, null],
  ['Assunção Videomaker', 'Marketing e eventos', 'Araranguá/SC', '2025-11-13', 0, false, 'desfiliacao', 4, null],
  ['Gustavo Gomes Correia (M4 Auto Estética)', 'Automotivo e combustíveis', 'Araranguá/SC', '2025-02-26', 0, true, 'inadimplencia', null, null],
  ['INA Brands', 'Marketing e eventos', 'Araranguá/SC', '2024-01-25', 0, false, 'desfiliacao', null, 'Núcleo NJE'],
  ['10 Pastéis', 'Alimentação e bebidas', 'Araranguá/SC', '2018-11-27', 4, true, 'sem_dados', null, null],
  ['Blackwhite', 'Pessoa física / MEI', 'Araranguá/SC', '2026-05-13', 0, false, 'desfiliacao', 3, 'Núcleo NJE'],
  ['Presa Supermercado', 'Alimentação e bebidas', 'Meleiro/SC', '2016-04-29', 15, false, 'inadimplencia', null, null],
  ['Grão e Goma', 'Alimentação e bebidas', 'Araranguá/SC', '2020-05-29', 0, false, 'sem_dados', null, null],
  ['Lariessa Porcel Sanches', 'Pessoa física / MEI', 'Araranguá/SC', '2024-09-02', 0, false, 'sem_dados', null, null],
  ['Lilian Nolla Fonoaudiologia', 'Saúde', 'Araranguá/SC', '2025-02-17', 0, false, 'desfiliacao', null, null],
  ['Litoral Sul Ind. de Churrasqueiras', 'Indústria', 'Araranguá/SC', '2022-03-18', 0, false, 'sem_dados', null, null],
  ['Mercearia Henrique', 'Alimentação e bebidas', 'Maracajá/SC', '2019-04-08', 3, true, 'sem_dados', null, null],
  ['M6PS Consultoria (cadastro antigo)', 'Treinamento e consultoria', 'Capão da Canoa/RS', '2023-11-07', 0, false, 'voltou', null, null],
  ['Chuva Conteúdo', 'Marketing e eventos', 'Araranguá/SC', '2024-12-17', 0, false, 'inadimplencia', null, null],
  ['Experimmente Consultoria', 'Treinamento e consultoria', 'Araranguá/SC', '2024-07-25', 0, true, 'sem_dados', null, null],
  ['Michelle Oyarzabal Martins', 'Pessoa física / MEI', 'Araranguá/SC', '2023-08-01', 0, true, 'sem_dados', null, null],
  ['Mobiliup Assessoria', 'Serviços profissionais', 'Sombrio/SC', '2025-10-21', 0, false, 'inadimplencia', null, 'FAN (mês grátis)'],
  ['Natalia de Farias (advocacia)', 'Serviços profissionais', 'Araranguá/SC', '2024-11-26', 0, false, 'desfiliacao', null, 'Núcleo NJE'],
  ['NC Construtora', 'Construção e imóveis', 'Araranguá/SC', '2023-09-26', 0, true, 'sem_dados', null, null],
  ['Imagine Marketing', 'Marketing e eventos', 'Araranguá/SC', '2025-12-04', 0, false, 'inadimplencia', 0, null],
  ['Polli Lemes', 'Pessoa física / MEI', 'Araranguá/SC', '2025-02-24', 0, false, 'desfiliacao', null, 'Núcleo NJE'],
  ['Idealle Planejados', 'Indústria', 'Araranguá/SC', '2020-06-23', 2, false, 'inadimplencia', null, 'Núcleo NME'],
  ['Mercado Sineval', 'Alimentação e bebidas', 'Araranguá/SC', '2026-04-06', 0, false, 'util', null, 'Útil'],
  ['Antares Construções', 'Construção e imóveis', 'Araranguá/SC', '2018-04-26', 10, false, 'desfiliacao', null, null],
  ['Sul Fiscal', 'Serviços profissionais', 'Araranguá/SC', '2025-06-02', 0, false, 'desfiliacao', null, null],
  ['Mestre da Obra Araranguá', 'Construção e imóveis', 'Araranguá/SC', '2025-09-09', 0, false, 'desfiliacao', null, null],
  ['CTED Centro de Treinamento Emocional', 'Treinamento e consultoria', 'Araranguá/SC', '2022-08-05', 0, false, 'inadimplencia', null, null],
  ['Tiane de Aguiar Joaquim', 'Pessoa física / MEI', 'Araranguá/SC', '2025-12-01', 0, false, 'desfiliacao', null, null],
  ['Tramonta Imobiliária', 'Construção e imóveis', 'Balneário Arroio do Silva/SC', '2025-05-30', 0, false, 'desfiliacao', null, null],
  ['Santos Climatização e Coifas', 'Serviços técnicos', 'Araranguá/SC', '2025-10-24', 0, false, 'inadimplencia', null, null],
  ['Mercado Maykon', 'Alimentação e bebidas', 'Araranguá/SC', '2007-04-26', 3, false, 'fechou', null, 'Útil'],
  ['Clínica Veterinária São Francisco', 'Saúde', 'Araranguá/SC', '2025-09-09', 0, false, 'desfiliacao', null, null],
  ['Vitinho Lanches', 'Alimentação e bebidas', 'Araranguá/SC', '2025-07-14', 0, true, 'util', null, 'Útil'],
  ['Viviane Borges Bernardo', 'Pessoa física / MEI', 'Araranguá/SC', '2025-10-13', 0, false, 'desfiliacao', null, null],
  ['Panorama Radiologia Odontológica', 'Saúde', 'Sombrio/SC', '2026-06-10', 0, false, 'desfiliacao', 2, null],
]

const MS_MES  = 30.4375 * 864e5
const msData  = d => new Date(d + 'T00:00:00').getTime()
const FIM     = msData(DATA_RELATORIO)
const INICIO  = msData('2026-01-01')
const mesesAte = d => (FIM - msData(d)) / MS_MES

const E = ENTRADAS.map(([nome, segmento, cidade, data, func, boleto, servico]) =>
  ({ nome, segmento, cidade, data, func, boleto, servico, ano: Number(data.slice(0, 4)) }))
const S = SAIDAS.map(([nome, segmento, cidade, data, func, boleto, motivo, pagos, servico]) => {
  const a = msData(data)
  const min = Math.max(0, (INICIO - a) / MS_MES)
  const max = (FIM - a) / MS_MES
  return { nome, segmento, cidade, data, func, boleto, motivo, pagos, servico, ano: Number(data.slice(0, 4)), casa: (min + max) / 2 }
})
const REAIS = S.filter(x => x.motivo !== 'voltou' && x.motivo !== 'titular')

const pct  = (a, b) => b ? Math.round((a / b) * 100) : 0
const dec  = (n, d = 1) => n.toFixed(d).replace('.', ',')
const brl  = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const fmtData = d => d.split('-').reverse().join('/')
const countBy = (arr, fn) => arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; return m }, {})
const cidadeNome = c => c.split('/')[0]
const mediana = arr => {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b), n = s.length
  return (s[(n - 1) >> 1] + s[n >> 1]) / 2
}

/* ── Base e churn ── */
const BASE_INICIO    = BASE_06_OUT - E.length + S.length
const BASE_FIM_OUT   = BASE_06_OUT + OUTUBRO.entradas - OUTUBRO.saidas
const ENTRADAS_ANO   = E.length + OUTUBRO.entradas
const SAIDAS_ANO     = S.length + OUTUBRO.saidas
const SALDO_ANO      = ENTRADAS_ANO - SAIDAS_ANO
const CHURN_ACUM     = SAIDAS_ANO / BASE_INICIO
const CHURN_MES      = CHURN_ACUM / MESES_PERIODO
const CHURN_ANO      = 1 - Math.pow(1 - CHURN_MES, 12)
const CHURN_OUT      = OUTUBRO.saidas / BASE_06_OUT
const RECEITA_BASE   = BASE_FIM_OUT * TICKET
const RECEITA_PERDIDA_ANO = SAIDAS_ANO * TICKET * 12

/* ── Turma 2026: quem entrou em 2026 (ativos + já desativados).
   Tempo até a saída = meses pagos anotados; sem anotação, estimativa de 3 meses. ── */
const TURMA = (() => {
  const saidas26 = S.filter(x => x.ano === 2026)
  const pts = [
    ...E.map(e => ({ t: mesesAte(e.data), ev: 0 })),
    ...saidas26.map(s => ({ t: s.pagos ?? Math.min(3, mesesAte(s.data)), ev: 1 })),
  ]
  let surv = 1
  const curva = [{ mes: 0, surv: 100, risco: pts.length }]
  for (let m = 1; m <= 9; m++) {
    const risco = pts.filter(p => p.t > m - 1).length
    const saem  = pts.filter(p => p.ev && p.t > m - 1 && p.t <= m).length
    surv *= risco ? 1 - saem / risco : 1
    curva.push({ mes: m, surv: surv * 100, risco, saem })
  }
  const pessoaMes = pts.reduce((s, p) => s + p.t, 0)
  const hazard = saidas26.length / pessoaMes
  return { total: pts.length, saidas: saidas26.length, curva, hazard, anual: 1 - Math.pow(1 - hazard, 12), vida: 1 / hazard / 12 }
})()

const PAGOS        = REAIS.filter(x => x.pagos > 0).map(x => x.pagos)
const NUNCA_PAGOU  = REAIS.filter(x => x.pagos === 0).length
const POR_MES      = [...MESES.slice(0, 9).map((_, i) => E.filter(x => Number(x.data.slice(5, 7)) === i + 1).length), OUTUBRO.entradas]
const DIA_PICO     = Object.entries(countBy(E, x => x.data)).sort((a, b) => b[1] - a[1])[0]
const UTIL_PICO    = E.filter(x => x.data === DIA_PICO[0] && x.servico === 'Útil').length
const E_FORA_SEDE  = E.filter(x => cidadeNome(x.cidade) !== SEDE).length
const S_FORA_SEDE  = S.filter(x => cidadeNome(x.cidade) !== SEDE).length
const E_BOLETO     = E.filter(x => x.boleto).length
const INAD         = REAIS.filter(x => x.motivo === 'inadimplencia')
const INAD_BOLETO  = INAD.filter(x => x.boleto).length

const MOTIVOS_RESUMO = Object.keys(MOTIVOS).map(k => {
  const g = S.filter(x => x.motivo === k)
  return { k, label: MOTIVOS[k], n: g.length, casa: mediana(g.map(x => x.casa)), real: k !== 'voltou' && k !== 'titular' }
}).filter(m => m.n).sort((a, b) => b.n - a.n)

const FAIXAS_CASA = [
  ['Menos de 1 ano', 0, 12], ['1 a 2 anos', 12, 24], ['2 a 3 anos', 24, 36], ['3 a 5 anos', 36, 60], ['Mais de 5 anos', 60, Infinity],
].map(([label, a, b]) => ({ label, valor: REAIS.filter(x => x.casa >= a && x.casa < b).length }))

const agrupaServico = s => !s ? 'Sem anotação' : s.startsWith('Núcleo') ? 'Núcleos' : s
const PORTAS = Object.entries(countBy(E, x => agrupaServico(x.servico)))
  .map(([k, n]) => ({ k, n })).sort((a, b) => (a.k === 'Sem anotação') - (b.k === 'Sem anotação') || b.n - a.n)
const NUCLEOS = Object.entries(countBy(E.filter(x => x.servico?.startsWith('Núcleo')), x => x.servico.replace('Núcleo ', '')))
  .sort((a, b) => b[1] - a[1])
const SERVICO_SAIDA = (() => {
  const s = countBy(REAIS.filter(x => x.servico), x => x.servico)
  const e = countBy(E.filter(x => x.servico), x => x.servico)
  return Object.entries(s).map(([k, n]) => ({ k, saidas: n, entradas: e[k] || 0 })).sort((a, b) => b.saidas - a.saidas)
})()

const SEGMENTOS = (() => {
  const e = countBy(E, x => x.segmento), s = countBy(S, x => x.segmento)
  return [...new Set([...Object.keys(e), ...Object.keys(s)])]
    .map(seg => ({ seg, e: e[seg] || 0, s: s[seg] || 0 }))
    .sort((a, b) => (b.e + b.s) - (a.e + a.s))
})()

const CIDADES = (() => {
  const e = countBy(E, x => cidadeNome(x.cidade)), s = countBy(S, x => cidadeNome(x.cidade))
  return [...new Set([...Object.keys(e), ...Object.keys(s)])]
    .map(c => ({ c, e: e[c] || 0, s: s[c] || 0 }))
    .sort((a, b) => (b.e + b.s) - (a.e + a.s))
})()

const PERDAS_PESO = [...S].filter(x => x.func > 0 || x.ano <= 2018).sort((a, b) => a.ano - b.ano)

/* ── Componentes base ── */
const sombra = { boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }

function Card({ titulo, sub, extra, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl ${className}`} style={sombra}>
      {titulo && (
        <div className="px-5 py-4 flex items-start justify-between gap-3 flex-wrap" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <div>
            <p className="text-sm font-extrabold text-text">{titulo}</p>
            {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
          </div>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

function Kpi({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col" style={{ ...sombra, border: `1px solid ${color}20` }}>
      <span className="text-xl mb-2">{icon}</span>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted mt-0.5 leading-snug">{sub}</p>}
    </div>
  )
}

function Nota({ cor, children }) {
  return (
    <div className="rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ background: cor + '12', color: '#1a1d2e' }}>
      {children}
    </div>
  )
}

function Legenda() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-muted">
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: ENTRADA }} /> Entradas</span>
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: SAIDA }} /> Saídas</span>
    </div>
  )
}

function BarraH({ valor, max, color, titulo, delay = 0, rotulo }) {
  const w = max ? Math.max(valor ? 2 : 0, (valor / max) * 100) : 0
  return (
    <div className="flex items-center gap-2" title={titulo}>
      <div className="flex-1 h-3 rounded-r" style={{ background: '#f4f5f9' }}>
        <motion.div className="h-full rounded-r" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${w}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <span className="text-[11px] font-bold text-text min-w-[1.5rem] text-right tabular-nums">{rotulo ?? valor}</span>
    </div>
  )
}

function ListaBarras({ itens, color, largura = '9rem' }) {
  const max = Math.max(...itens.map(i => i.valor))
  return (
    <div className="space-y-2.5">
      {itens.map((it, i) => (
        <div key={it.label} className="grid gap-3 items-center" style={{ gridTemplateColumns: `${largura} 1fr` }}>
          <div className="min-w-0">
            <p className="text-xs font-bold text-text truncate" title={it.label}>{it.label}</p>
            {it.sub && <p className="text-[10px] text-muted">{it.sub}</p>}
          </div>
          <BarraH valor={it.valor} max={max} color={it.color || color} delay={i * 0.04} titulo={it.titulo || `${it.label}: ${it.valor}`} rotulo={it.rotulo} />
        </div>
      ))}
    </div>
  )
}

function Comparativo({ linhas, chave }) {
  const max = Math.max(...linhas.map(l => Math.max(l.e, l.s)))
  return (
    <div className="p-5 space-y-3">
      {linhas.map((l, i) => (
        <div key={l[chave]} className="grid grid-cols-[minmax(0,9rem)_1fr] sm:grid-cols-[minmax(0,12rem)_1fr] gap-3 items-center">
          <div className="min-w-0">
            <p className="text-xs font-bold text-text truncate" title={l[chave]}>{l[chave]}</p>
            <p className="text-[10px] font-bold" style={{ color: l.e - l.s > 0 ? VERDE : l.e - l.s < 0 ? CRITICO : '#8a8fa3' }}>
              saldo {l.e - l.s > 0 ? '+' : ''}{l.e - l.s}
            </p>
          </div>
          <div className="space-y-1">
            <BarraH valor={l.e} max={max} color={ENTRADA} delay={i * 0.03} titulo={`${l[chave]} · entradas: ${l.e}`} />
            <BarraH valor={l.s} max={max} color={SAIDA}   delay={i * 0.03} titulo={`${l[chave]} · saídas: ${l.s}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Seções ── */
function Hero({ color }) {
  const branco55 = { color: 'rgba(255,255,255,0.55)' }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 lg:p-7 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1f17 0%, #123524 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.35)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 85% 10%, ${color}33 0%, transparent 55%)` }} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: color + '26', color: '#86efac', border: `1px solid ${color}55` }}>
            🤝 Base de associados
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Jan a out/2026 · sistema ACIVA + anotações da equipe
          </span>
        </div>
        <div className="mt-5 flex items-end gap-6 flex-wrap">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={branco55}>Base no fim de outubro</p>
            <p className="text-6xl font-black leading-none mt-1 text-white">{BASE_FIM_OUT}</p>
          </div>
          <div className="flex gap-6 pb-1 flex-wrap">
            {[
              [`+${SALDO_ANO}`, 'saldo no ano'],
              [ENTRADAS_ANO, 'entradas'],
              [SAIDAS_ANO, 'saídas'],
              [`+${dec((BASE_FIM_OUT / BASE_INICIO - 1) * 100)}%`, `crescimento (base ${BASE_INICIO} em jan)`],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={branco55}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs mt-5 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          A base cresce, mas <b className="text-white">{pct(SAIDAS_ANO, ENTRADAS_ANO)}% das entradas só repõem quem sai</b>. O gargalo é
          a retenção, não a captação: o associado novo sai quase no dobro do ritmo da base, entre o 2º e o 5º mês.
        </p>
      </div>
    </motion.div>
  )
}

function Kpis() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Kpi icon="📉" color={ALERTA} label="Churn mensal da base"
        value={`${dec(CHURN_MES * 100)}%`} sub={`≈ ${dec(CHURN_ANO * 100, 0)}% ao ano · ${SAIDAS_ANO} saídas sobre ${BASE_INICIO}`} />
      <Kpi icon="🐣" color={CRITICO} label="Churn mensal da turma 2026"
        value={`${dec(TURMA.hazard * 100)}%`} sub={`≈ ${dec(TURMA.anual * 100, 0)}% ao ano · vida esperada ${dec(TURMA.vida)} anos`} />
      <Kpi icon="⏳" color={CRITICO} label="Mensalidades pagas antes de sair"
        value={dec(mediana(PAGOS), 0)} sub={`mediana de ${PAGOS.length} casos anotados · ${NUNCA_PAGOU} nunca pagaram`} />
      <Kpi icon="💸" color={SAIDA} label="Receita perdida por ano"
        value={brl(RECEITA_PERDIDA_ANO)} sub={`${SAIDAS_ANO} saídas × ${brl(TICKET)} × 12`} />
    </div>
  )
}

function Outubro() {
  const itens = [
    ['Novos', OUTUBRO.entradas, `média jan–set: ${dec(E.length / 9.1)}`],
    ['Saídas', OUTUBRO.saidas, `média jan–set: ${dec(S.length / 9.1)}`],
    ['Saldo', `+${OUTUBRO.entradas - OUTUBRO.saidas}`, 'média jan–set: +2,7'],
    ['Churn do mês', `${dec(CHURN_OUT * 100, 2)}%`, `média do ano: ${dec(CHURN_MES * 100, 2)}%`],
    ['Receita mensal líquida', `+${brl((OUTUBRO.entradas - OUTUBRO.saidas) * TICKET)}`, `+${brl(OUTUBRO.entradas * TICKET)} / −${brl(OUTUBRO.saidas * TICKET)}`],
    ['Meta do comercial', `${pct(OUTUBRO.entradas, META_PESSOA)}%`, `${OUTUBRO.entradas} de ${META_PESSOA} (1 pessoa)`],
  ]
  return (
    <Card titulo="Outubro/2026" sub="Números consolidados informados pela ACIVA (lista nominal ainda não recebida)">
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {itens.map(([l, v, s]) => (
            <div key={l} className="rounded-xl p-3" style={{ background: '#f7f8fb' }}>
              <p className="text-lg font-black text-text leading-none">{v}</p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-1">{l}</p>
              <p className="text-[10px] text-muted mt-0.5">{s}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Nota cor={ALERTA}>
            ⚠️ Outubro captou acima da média, mas também perdeu acima da média: o saldo ficou nos mesmos ~+3 de sempre.
            {' '}<b>{pct(OUTUBRO.saidas, OUTUBRO.entradas)}% das entradas do mês só repuseram saídas.</b> Captar mais não acelera a base enquanto a saída não cair.
          </Nota>
        </div>
      </div>
    </Card>
  )
}

function EntradasPorMes() {
  const max = Math.max(...POR_MES)
  const [hover, setHover] = useState(null)
  return (
    <Card titulo="Novos associados por mês" sub="Jan–set pelo relatório do sistema; out consolidado pela ACIVA">
      <div className="p-5">
        <div className="flex items-end gap-1.5 h-44" role="img" aria-label={MESES.map((m, i) => `${m}: ${POR_MES[i]}`).join(', ')}>
          {POR_MES.map((v, i) => (
            <div key={MESES[i]} className="flex-1 flex flex-col items-center justify-end h-full relative"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {hover === i && (
                <div className="absolute -top-1 -translate-y-full bg-[#1a1d2e] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-10">
                  {MESES[i]}/26 · {v} novos{i === 9 ? ` · ${OUTUBRO.saidas} saídas` : ''}
                </div>
              )}
              <span className="text-[11px] font-bold text-text mb-1 tabular-nums">{v}</span>
              <motion.div className="w-full max-w-[34px] rounded-t"
                style={{ background: ENTRADA, opacity: hover === null || hover === i ? (i === 9 ? 0.75 : 1) : 0.5 }}
                initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }} />
              <span className="text-[10px] text-muted mt-1.5">{MESES[i]}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Nota cor={ENTRADA}>
            📌 <b>{fmtData(DIA_PICO[0])}: {DIA_PICO[1]} adesões num único dia, {UTIL_PICO} delas pelo Útil</b>
            {' '}(Pit Stop, três CNPJs da Tabacaria Central, Pizza Água na Boca e Tree House). Ações concentradas do Útil geram volume, mas exigem acompanhamento de uso.
          </Nota>
        </div>
      </div>
    </Card>
  )
}

function CurvaTurma() {
  const pontos = TURMA.curva
  const min = 75
  return (
    <Card titulo="Permanência da turma 2026" sub={`${TURMA.total} empresas que entraram em 2026 · ${TURMA.saidas} já saíram`}>
      <div className="p-5">
        <div className="flex items-end gap-1.5 h-40" role="img" aria-label={pontos.map(p => `mês ${p.mes}: ${dec(p.surv)}%`).join(', ')}>
          {pontos.map((p, i) => {
            const h = ((p.surv - min) / (100 - min)) * 100
            return (
              <div key={p.mes} className="flex-1 flex flex-col items-center justify-end h-full"
                title={`${p.mes}º mês · ${dec(p.surv)}% ativos${p.risco !== undefined ? ` · ${p.risco} em observação` : ''}`}>
                <span className="text-[10px] font-bold text-text mb-1 tabular-nums">{dec(p.surv, 0)}%</span>
                <motion.div className="w-full max-w-[30px] rounded-t"
                  style={{ background: p.saem ? SAIDA : VERDE, opacity: p.risco < 30 ? 0.5 : 1 }}
                  initial={{ height: 0 }} animate={{ height: `${Math.max(4, h)}%` }}
                  transition={{ duration: 0.7, delay: i * 0.05 }} />
                <span className="text-[10px] text-muted mt-1.5">{p.mes}º</span>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-muted mt-2">
          Eixo a partir de {min}%. Laranja = mês com saídas. Barras claras = menos de 30 empresas em observação (leitura frágil).
        </p>
        <div className="mt-3">
          <Nota cor={CRITICO}>
            🎯 <b>Todas as saídas da turma nova aconteceram entre o 2º e o 5º mês.</b> Quem passou do 5º mês ainda não saiu.
            Tempo até a saída = meses pagos anotados; sem anotação, estimativa de 3 meses.
          </Nota>
        </div>
      </div>
    </Card>
  )
}

function Motivos() {
  return (
    <Card titulo="Por que saíram" sub={`${S.length} desativações jan–set · tempo de casa estimado (o relatório não traz a data de saída)`}>
      <div className="p-5 space-y-4">
        <ListaBarras largura="11rem" color={SAIDA} itens={MOTIVOS_RESUMO.map(m => ({
          label: m.label,
          sub: m.real ? `casa mediana ≈ ${m.casa >= 24 ? `${dec(m.casa / 12)} anos` : `${dec(m.casa, 0)} meses`}` : 'excluído do churn',
          valor: m.n,
          color: m.real ? SAIDA : '#c4c7d4',
          rotulo: `${m.n} · ${pct(m.n, S.length)}%`,
        }))} />
        <Nota cor={SAIDA}>
          <b>Quem pede para sair, sai cedo</b> (≈ {dec(MOTIVOS_RESUMO.find(m => m.k === 'desfiliacao').casa, 0)} meses de casa). Fechamento de empresa é raro: quase toda saída é decisão do associado.
          Os 8 sem informação são todos associados antigos (2018–2024). Só {INAD_BOLETO} de {INAD.length} inadimplentes tinham Boleto Sicoob.
        </Nota>
      </div>
    </Card>
  )
}

function TempoDeCasa() {
  const pagos = Object.entries(countBy(PAGOS, x => x)).sort((a, b) => a[0] - b[0])
  return (
    <Card titulo="Quanto tempo ficaram" sub={`${REAIS.length} saídas reais (sem M6PS e troca de titular do 2º Tabelionato)`}>
      <div className="p-5 space-y-5">
        <ListaBarras largura="7.5rem" color={SAIDA} itens={FAIXAS_CASA.map(f => ({
          label: f.label, valor: f.valor, rotulo: `${f.valor} · ${pct(f.valor, REAIS.length)}%`,
        }))} />
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Mensalidades pagas antes de sair (anotadas)</p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ background: CRITICO + '15', color: CRITICO }}>
              0 meses: {NUNCA_PAGOU}
            </span>
            {pagos.map(([m, n]) => (
              <span key={m} className="text-[11px] font-bold px-2.5 py-1 rounded-lg text-text" style={{ background: '#f4f5f9' }}>
                {m} {Number(m) === 1 ? 'mês' : 'meses'}: {n}
              </span>
            ))}
          </div>
        </div>
        <Nota cor={CRITICO}>
          ⚠️ <b>{pct(FAIXAS_CASA[0].valor, REAIS.length)}% saem antes de 1 ano</b>, normalmente depois de 2 a 4 mensalidades.
          O onboarding precisa entregar valor antes da 3ª cobrança.
        </Nota>
      </div>
    </Card>
  )
}

function Servicos() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card titulo="Por onde entraram" sub={`${E.length} novos jan–set · porta de entrada anotada pela equipe`}>
        <div className="p-5 space-y-4">
          <ListaBarras largura="10rem" color={ENTRADA} itens={PORTAS.map(p => ({
            label: p.k, valor: p.n, color: p.k === 'Sem anotação' || p.k === 'Ilegível' ? '#c4c7d4' : ENTRADA,
          }))} />
          <div className="flex gap-1.5 flex-wrap">
            {NUCLEOS.map(([k, n]) => (
              <span key={k} className="text-[10px] font-bold px-2 py-0.5 rounded-full text-text" style={{ background: '#f4f5f9' }}>
                Núcleo {k}: {n}
              </span>
            ))}
          </div>
        </div>
      </Card>
      <Card titulo="Serviço que quem saiu usava" sub="Comparado com quantos entraram pelo mesmo serviço" extra={<Legenda />}>
        <div className="p-5 space-y-4">
          {SERVICO_SAIDA.map((s, i) => {
            const max = Math.max(...SERVICO_SAIDA.map(x => Math.max(x.saidas, x.entradas)))
            return (
              <div key={s.k} className="grid grid-cols-[8rem_1fr] gap-3 items-center">
                <p className="text-xs font-bold text-text truncate">{s.k}</p>
                <div className="space-y-1">
                  <BarraH valor={s.entradas} max={max} color={ENTRADA} delay={i * 0.04} titulo={`${s.k} · entradas: ${s.entradas}`} />
                  <BarraH valor={s.saidas}   max={max} color={SAIDA}   delay={i * 0.04} titulo={`${s.k} · saídas: ${s.saidas}`} />
                </div>
              </div>
            )
          })}
          <Nota cor={SAIDA}>
            <b>NJE é o serviço que mais aparece entre quem saiu</b> (5 saídas, 2 entradas). O Útil traz volume, mas 2 saídas foram
            porque os clientes do associado não aderiram. Coworking e mês grátis no FAN atraíram uso pontual.
          </Nota>
        </div>
      </Card>
    </div>
  )
}

/* ── Modelo de comissão: atual × proposto ── */
function calcComissao({ novos, meta, retencao, ticket }) {
  const limiar = Math.ceil(meta * 0.6)
  const teto   = Math.floor(meta * 1.3)
  let aquisicao
  if (novos < limiar) aquisicao = novos * 56
  else {
    const base = Math.min(novos, meta) * 70
    const faixa1 = Math.max(0, Math.min(novos, teto) - meta) * 91
    const faixa2 = Math.max(0, novos - teto) * 105
    aquisicao = base + faixa1 + faixa2
  }
  const mult = retencao >= 90 ? 1.5 : retencao < 80 ? 0.5 : 1
  const retidos = novos * retencao / 100
  const premio = retidos * 50 * mult
  const atual = novos * ticket * 2
  const novo = aquisicao + premio
  return { limiar, teto, aquisicao, premio, mult, retidos, atual, novo, porRetido: retidos ? novo / retidos : 0, atualPorRetido: retidos ? atual / retidos : 0 }
}

function Slider({ label, valor, set, min, max, step = 1, sufixo = '' }) {
  return (
    <label className="block">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="font-bold text-text">{label}</span>
        <span className="font-extrabold text-text tabular-nums">{valor}{sufixo}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={valor} onChange={e => set(Number(e.target.value))}
        className="w-full" style={{ accentColor: VERDE }} />
    </label>
  )
}

function Comissao() {
  const [novos, setNovos] = useState(OUTUBRO.entradas)
  const [meta, setMeta] = useState(META_PESSOA)
  const [retencao, setRetencao] = useState(86)
  const c = calcComissao({ novos, meta, retencao, ticket: TICKET })
  const cenarios = [8, 12, 15, 20].map(n => ({ n, ...calcComissao({ novos: n, meta: META_PESSOA, retencao: 86, ticket: TICKET }) }))
  const receita1Ano = TICKET * 12 * (1 - TURMA.anual / 2)

  const regras = [
    ['Aquisição', `R$70 por associado, pago quando ele quita a 1ª mensalidade. Abaixo de 60% da meta (menos de ${c.limiar}), R$56.`],
    ['Aceleradores', `Do ${meta + 1}º ao ${c.teto}º novo: R$91 cada. Acima de ${c.teto}: R$105 cada (só nos excedentes).`],
    ['Retenção', 'R$50 por associado ativo e em dia no 6º mês: depois da janela em que a turma nova costuma sair.'],
    ['Qualidade (trimestral)', 'Retenção no 6º mês ≥ 90%: prêmio de retenção ×1,5. Abaixo de 80%: ×0,5.'],
    ['Bônus de caixa', 'Plano anual à vista (R$720): R$150 de uma vez. Boleto registrado ou débito automático na adesão: +R$10.'],
  ]

  return (
    <Card titulo="Modelo de comissão: atual × proposto (OTE)"
      sub={`Hoje: 2 mensalidades (${brl(TICKET * 2)}) pagas na entrada. Meta: ${META_PESSOA} novos por pessoa.`}>
      <div className="p-5 grid lg:grid-cols-[1fr_1.1fr] gap-5">
        <div className="space-y-3">
          {regras.map(([t, d]) => (
            <div key={t} className="rounded-xl px-4 py-3" style={{ background: '#f7f8fb' }}>
              <p className="text-xs font-extrabold text-text">{t}</p>
              <p className="text-[11px] text-muted mt-0.5 leading-snug">{d}</p>
            </div>
          ))}
          <Nota cor={ALERTA}>
            ⚖️ Formalizar a parcela do 6º mês e os multiplicadores como <b>prêmio por desempenho</b> (CLT art. 457 §4º), não como
            comissão condicionada (art. 466). Validar com o contador/jurídico e rodar 1 trimestre em paralelo, pagando o maior.
          </Nota>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-4 space-y-3" style={{ border: '1px solid #eef0f5' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Simulador (por pessoa, por mês)</p>
            <Slider label="Novos no mês" valor={novos} set={setNovos} min={0} max={30} />
            <Slider label="Meta" valor={meta} set={setMeta} min={5} max={25} />
            <Slider label="Retenção no 6º mês" valor={retencao} set={setRetencao} min={60} max={100} sufixo="%" />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl p-3" style={{ background: '#f4f5f9' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Modelo atual</p>
                <p className="text-xl font-black text-text">{brl(c.atual)}</p>
                <p className="text-[10px] text-muted">tudo na entrada · {brl(c.atualPorRetido)} por retido</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: VERDE + '12' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Modelo proposto</p>
                <p className="text-xl font-black text-text">{brl(c.novo)}</p>
                <p className="text-[10px] text-muted">{brl(c.aquisicao)} entrada + {brl(c.premio)} no 6º mês · {brl(c.porRetido)} por retido</p>
              </div>
            </div>
            <p className="text-[11px] text-muted">
              Atingimento: <b className="text-text">{pct(novos, meta)}%</b> · retidos no 6º mês: <b className="text-text">{dec(c.retidos)}</b>
              {' '}· multiplicador de qualidade: <b className="text-text">{dec(c.mult)}×</b>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[380px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-muted">
                  <th className="pb-2 font-extrabold">Novos/mês</th>
                  <th className="pb-2 font-extrabold">Atual</th>
                  <th className="pb-2 font-extrabold">Proposto</th>
                  <th className="pb-2 font-extrabold">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {cenarios.map(s => (
                  <tr key={s.n} style={{ borderTop: '1px solid #f1f3f9' }}>
                    <td className="py-2 font-bold text-text">{s.n}{s.n === META_PESSOA ? ' (meta)' : ''}</td>
                    <td className="py-2 text-muted tabular-nums">{brl(s.atual)}</td>
                    <td className="py-2 text-text font-bold tabular-nums">{brl(s.novo)}</td>
                    <td className="py-2 tabular-nums" style={{ color: s.novo < s.atual ? VERDE : ALERTA }}>
                      {s.novo < s.atual ? '−' : '+'}{pct(Math.abs(s.novo - s.atual), s.atual)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-muted mt-2">
              Cenários com 86% de retenção no 6º mês. Receita esperada de um novo no 1º ano ≈ {brl(receita1Ano)};
              {' '}comissão atual = {pct(TICKET * 2, receita1Ano)}% dela.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

function PerdasDePeso() {
  return (
    <Card titulo="Perdas de maior peso" sub="Associados antigos ou com equipe registrada">
      <div className="divide-y divide-[#f1f3f9]">
        {PERDAS_PESO.map(x => (
          <div key={x.nome} className="px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-text truncate">{x.nome}</p>
              <p className="text-[10px] text-muted">{x.segmento} · {MOTIVOS[x.motivo]}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-extrabold text-text">desde {x.ano}</p>
              <p className="text-[10px] text-muted">{2026 - x.ano} anos{x.func ? ` · ${x.func} func.` : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Reassociacoes() {
  const itens = [
    { t: 'M6PS Consultoria', d: 'Desativada (cód. 2091) e reassociada como cód. 2570 em 05/08/2026. Não é perda real.' },
    { t: '2º Tabelionato de Araranguá', d: 'Saiu o cadastro no CPF do antigo titular (cód. 2161) e entrou o do CNPJ (cód. 2518) em 24/04/2026.' },
    { t: 'Grupo Simoni dos Santos', d: '4 CNPJs associados em 11/09/2026 pelo Útil (Pit Stop Adega + 3 unidades da Tabacaria Central).' },
  ]
  return (
    <Card titulo="Reassociações e grupos" sub="Movimentos que distorcem a contagem bruta">
      <div className="p-5 space-y-3">
        {itens.map(i => (
          <div key={i.t} className="rounded-xl px-4 py-3" style={{ background: '#f7f8fb' }}>
            <p className="text-xs font-extrabold text-text">{i.t}</p>
            <p className="text-[11px] text-muted mt-0.5 leading-snug">{i.d}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Acoes() {
  const acoes = [
    { t: 'Onboarding até o 5º mês', d: `Boas-vindas, primeiro evento e contato antes da 3ª mensalidade. Mira na janela em que ${pct(FAIXAS_CASA[0].valor, REAIS.length)}% das saídas acontecem.` },
    { t: 'Comissão que paga permanência', d: 'Dividir as 2 mensalidades: uma no 1º pagamento, outra no 6º mês, com aceleradores acima da meta.' },
    { t: 'Rever o NJE', d: '5 saídas de quem participava do NJE contra 2 entradas. Entrevistar quem saiu.' },
    { t: 'Acompanhar o uso do Útil', d: 'Os 13 que entraram pelo Útil precisam de adesão dos clientes deles, ou saem em ~7 meses.' },
    { t: 'Segundo vínculo para curso e coworking', d: 'Quem entra por um benefício pontual precisa de outro motivo para ficar antes do 4º mês.' },
    { t: 'Registrar motivo e data de saída no sistema', d: 'Hoje o motivo só existe à mão, e os associados antigos ficaram sem registro.' },
  ]
  return (
    <Card titulo="Próximos passos sugeridos">
      <div className="p-5 grid sm:grid-cols-2 gap-3">
        {acoes.map((a, i) => (
          <div key={a.t} className="flex gap-3 rounded-xl p-3.5" style={{ background: '#f7f8fb' }}>
            <span className="w-6 h-6 rounded-full text-[11px] font-black text-white flex items-center justify-center shrink-0" style={{ background: VERDE }}>{i + 1}</span>
            <div>
              <p className="text-xs font-extrabold text-text">{a.t}</p>
              <p className="text-[11px] text-muted mt-0.5 leading-snug">{a.d}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Cadastro() {
  const itens = [
    ['Motivo e data de saída', 'só existem anotados à mão; o sistema não registra quando nem por que a empresa saiu'],
    ['Outubro', 'apenas números consolidados (10 novos, 7 saídas); falta a lista nominal para atualizar a turma 2026'],
    ['Turma 2025', 'sem o relatório de 2025 não dá para medir a retenção de 12 a 18 meses'],
    ['Litoral Sul Ind. de Churrasqueiras', 'responsável "DASDASDASD", CEP 88.888-888 e sem e-mail'],
    ['E-mail ausente ou inválido', 'Polli Lemes (":"), Sul Fiscal, Vitinho Lanches, Leandro Amaral, Armilar, M6PS, Espaço Animal ("gmai.com")'],
    ['Campos zerados', 'funcionários e capital social vêm 0 em quase todos: não dá para medir o porte da base'],
  ]
  return (
    <Card titulo="Lacunas de dados" sub="O que impede indicadores mais precisos">
      <div className="p-5 space-y-2.5">
        {itens.map(([t, d]) => (
          <div key={t} className="flex gap-2.5">
            <span className="text-xs mt-0.5" aria-hidden>🔸</span>
            <p className="text-[11px] leading-snug text-text"><b>{t}:</b> <span className="text-muted">{d}</span></p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Tabela() {
  const [aba, setAba] = useState('entradas')
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const base = aba === 'entradas' ? E : S
  const chaveFiltro = x => aba === 'entradas' ? agrupaServico(x.servico) : MOTIVOS[x.motivo]
  const opcoes = useMemo(() => [...new Set(base.map(chaveFiltro))].sort(), [base, aba])
  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return base
      .filter(x => filtro === 'todos' || chaveFiltro(x) === filtro)
      .filter(x => !q || x.nome.toLowerCase().includes(q) || x.cidade.toLowerCase().includes(q) || x.segmento.toLowerCase().includes(q))
      .sort((a, b) => aba === 'entradas' ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data))
  }, [base, busca, filtro, aba])

  return (
    <Card titulo="Lista completa" sub={`${lista.length} de ${base.length} registros`}
      extra={
        <div className="flex rounded-lg p-0.5" style={{ background: '#f1f3f9' }}>
          {[['entradas', `Novos (${E.length})`], ['saidas', `Desativados (${S.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => { setAba(k); setFiltro('todos') }}
              className="text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors"
              style={aba === k ? { background: '#fff', color: '#1a1d2e', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#8a8fa3' }}>
              {l}
            </button>
          ))}
        </div>
      }>
      <div className="px-5 pt-4 flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-[180px]" style={{ background: '#f7f8fb' }}>
          <Search size={13} className="text-muted" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar empresa, cidade ou segmento"
            className="bg-transparent text-xs outline-none flex-1 text-text" />
        </div>
        <select value={filtro} onChange={e => setFiltro(e.target.value)}
          className="text-xs rounded-lg px-3 py-2 outline-none text-text" style={{ background: '#f7f8fb' }}>
          <option value="todos">{aba === 'entradas' ? 'Todas as portas de entrada' : 'Todos os motivos'}</option>
          {opcoes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="p-5 overflow-x-auto">
        <table className="w-full text-xs min-w-[640px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted">
              <th className="pb-2 font-extrabold">Empresa</th>
              <th className="pb-2 font-extrabold">Segmento</th>
              <th className="pb-2 font-extrabold">Cidade</th>
              <th className="pb-2 font-extrabold">Associação</th>
              {aba === 'entradas'
                ? <th className="pb-2 font-extrabold">Porta de entrada</th>
                : <><th className="pb-2 font-extrabold">Motivo</th><th className="pb-2 font-extrabold text-center">Pagos</th></>}
            </tr>
          </thead>
          <tbody>
            {lista.map(x => (
              <tr key={x.nome + x.data} style={{ borderTop: '1px solid #f1f3f9' }}>
                <td className="py-2 pr-3 font-bold text-text">{x.nome}</td>
                <td className="py-2 pr-3 text-muted">{x.segmento}</td>
                <td className="py-2 pr-3 text-muted whitespace-nowrap">{x.cidade}</td>
                <td className="py-2 pr-3 text-muted tabular-nums">{fmtData(x.data)}</td>
                {aba === 'entradas'
                  ? <td className="py-2 text-muted">{x.servico || '—'}</td>
                  : <>
                      <td className="py-2 pr-3 text-muted">{MOTIVOS[x.motivo]}{x.servico ? ` · ${x.servico}` : ''}</td>
                      <td className="py-2 text-center text-muted tabular-nums">{x.pagos ?? '—'}</td>
                    </>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function AcivaAssociados({ color = '#16a34a' }) {
  return (
    <div className="space-y-5 max-w-6xl">
      <Hero color={color} />
      <Kpis />
      <Outubro />
      <div className="grid lg:grid-cols-2 gap-5">
        <EntradasPorMes />
        <CurvaTurma />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Motivos />
        <TempoDeCasa />
      </div>
      <Servicos />
      <Comissao />
      <Card titulo="Entradas × saídas por segmento" sub="Classificação pela atividade cadastrada (quando 'Geral', pelo nome da empresa)" extra={<Legenda />}>
        <Comparativo linhas={SEGMENTOS} chave="seg" />
      </Card>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card titulo="Entradas × saídas por cidade" sub={`Fora de Araranguá: ${E_FORA_SEDE} entradas e ${S_FORA_SEDE} saídas · ${pct(E_BOLETO, E.length)}% dos novos com Boleto Sicoob`} extra={<Legenda />}>
          <Comparativo linhas={CIDADES} chave="c" />
        </Card>
        <div className="space-y-5">
          <PerdasDePeso />
          <Reassociacoes />
        </div>
      </div>
      <Acoes />
      <Cadastro />
      <Tabela />
    </div>
  )
}
