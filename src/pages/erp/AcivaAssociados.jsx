import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

/* ── Fonte: relatórios "Cadastro de Empresas Analítico" do sistema da ACIVA, impressos em 06/10/2026
   · associados.pdf  → empresas associadas, situação ATIVA, associação entre 01/01/2026 e 06/10/2026 (79)
   · desativados.pdf → empresas não associadas, desativação entre 01/01/2026 e 06/10/2026 (54)
   O relatório de desativados não traz a data nem o motivo da desativação — só a data de associação. ── */

const ENTRADA = '#2f6fe0'
const SAIDA   = '#e8710a'
const VERDE   = '#16a34a'
const ALERTA  = '#d97706'
const CRITICO = '#dc2626'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set']
const SEDE  = 'Araranguá'

/* [nome, segmento, cidade/UF, data de associação, funcionários, boleto Sicoob] */
const ENTRADAS = [
  ['Pausa 17', 'Pessoa física / MEI', 'Balneário Gaivota/SC', '2026-07-20', 0, false],
  ['Sandra Godinho (iGreen Energy)', 'Engenharia e energia', 'Passo de Torres/SC', '2026-04-16', 0, false],
  ['2º Tabelionato de Notas e Protesto', 'Serviços profissionais', 'Araranguá/SC', '2026-04-24', 0, true],
  ['Mateus Balthazar (eventos)', 'Marketing e eventos', 'Brusque/SC', '2026-06-16', 0, true],
  ['Tiago Fernandes Gonçalves', 'Pessoa física / MEI', 'Araranguá/SC', '2026-08-26', 0, true],
  ['Lédio Gabriel', 'Treinamento e consultoria', 'Araranguá/SC', '2026-03-02', 0, true],
  ['Daiane Dimas (Arte com Dimas)', 'Indústria', 'Araranguá/SC', '2026-09-28', 0, true],
  ['Mala Pronta Viagens', 'Turismo e lazer', 'Araranguá/SC', '2026-03-23', 0, true],
  ['Leandro dos Santos Amaral', 'Pessoa física / MEI', 'Araranguá/SC', '2026-07-31', 0, false],
  ['The Brothers', 'Beleza e bem-estar', 'Araranguá/SC', '2026-09-30', 0, true],
  ['Aline Fernandes', 'Treinamento e consultoria', 'Balneário Arroio do Silva/SC', '2026-06-15', 0, true],
  ['Carolini Labes', 'Beleza e bem-estar', 'Araranguá/SC', '2026-02-19', 0, false],
  ['Rubia Nara Becker (síndica)', 'Serviços profissionais', 'Araranguá/SC', '2026-03-23', 0, true],
  ['Acta Contabilidade', 'Serviços profissionais', 'Araranguá/SC', '2026-03-23', 0, true],
  ['AR Peças e Serviços', 'Automotivo e combustíveis', 'Araranguá/SC', '2026-01-21', 0, true],
  ['Arlete de Fátima Zanban', 'Pessoa física / MEI', 'Araranguá/SC', '2026-06-10', 0, true],
  ['ARU (Arukhan IA)', 'Tecnologia', 'Araranguá/SC', '2026-05-01', 0, true],
  ['Auto Posto Daminelli', 'Automotivo e combustíveis', 'Turvo/SC', '2026-05-06', 0, true],
  ['Beach Design', 'Indústria', 'Araranguá/SC', '2026-09-23', 0, true],
  ['BR Sollar Energias Renováveis', 'Engenharia e energia', 'Araranguá/SC', '2026-03-05', 0, true],
  ['Brasa Brasil', 'Alimentação e bebidas', 'Araranguá/SC', '2026-03-31', 0, true],
  ['Cálita Cardozo', 'Pessoa física / MEI', 'Criciúma/SC', '2026-09-25', 0, true],
  ['Cana Cayana', 'Alimentação e bebidas', 'Araranguá/SC', '2026-02-06', 0, true],
  ['Daniel Supermercado', 'Alimentação e bebidas', 'Timbé do Sul/SC', '2026-09-14', 0, true],
  ['Casagrande Materiais de Construção', 'Construção e imóveis', 'Turvo/SC', '2026-05-05', 0, true],
  ['Cores e Traços Makeup', 'Beleza e bem-estar', 'Araranguá/SC', '2026-08-13', 0, true],
  ['Creata Engenharia e Construtora', 'Engenharia e energia', 'Araranguá/SC', '2026-04-06', 0, true],
  ['Edilane Pacheco Emerim', 'Pessoa física / MEI', 'Araranguá/SC', '2026-06-24', 0, true],
  ['EFC Energia', 'Engenharia e energia', 'Araranguá/SC', '2026-09-23', 0, true],
  ['Emi Tech', 'Tecnologia', 'Araranguá/SC', '2026-08-24', 0, true],
  ['Clínica Veterinária Espaço Animal', 'Saúde', 'Praia Grande/SC', '2026-09-11', 0, true],
  ['Estúdio Personal O2', 'Beleza e bem-estar', 'Araranguá/SC', '2026-05-14', 0, true],
  ['Famed Saúde', 'Saúde', 'Araranguá/SC', '2026-08-21', 0, true],
  ['Fernanda Oliveira de Araujo', 'Pessoa física / MEI', 'Araranguá/SC', '2026-07-10', 0, false],
  ['Anjos Colchões e Sofás', 'Comércio e varejo', 'Araranguá/SC', '2026-03-04', 0, true],
  ['Fibcplastic', 'Indústria', 'Araranguá/SC', '2026-04-16', 0, true],
  ['Promise Gestão de Compras', 'Serviços profissionais', 'Araranguá/SC', '2026-06-16', 0, true],
  ['Grêmio Fronteira', 'Turismo e lazer', 'Araranguá/SC', '2026-01-14', 0, true],
  ['Pit Stop Adega e Conveniência', 'Alimentação e bebidas', 'Araranguá/SC', '2026-09-11', 0, true],
  ['Heloize Lourenço', 'Pessoa física / MEI', 'Meleiro/SC', '2026-09-17', 0, true],
  ['H Treinamentos', 'Treinamento e consultoria', 'Florianópolis/SC', '2026-01-15', 0, true],
  ['Insight View Comunicação Digital', 'Marketing e eventos', 'Araranguá/SC', '2026-02-24', 0, true],
  ['Farmácia Econômica Filial I', 'Saúde', 'Araranguá/SC', '2026-02-18', 0, true],
  ['R P Januário (máquinas agrícolas)', 'Indústria', 'Turvo/SC', '2026-04-06', 0, true],
  ['Julu Brinquedos Educativos', 'Comércio e varejo', 'Araranguá/SC', '2026-02-11', 0, true],
  ['Armilar Imóveis', 'Construção e imóveis', 'Araranguá/SC', '2026-06-10', 0, true],
  ['LRC Strategic Consulting', 'Treinamento e consultoria', 'Florianópolis/SC', '2026-07-03', 0, true],
  ['Luminous Store', 'Comércio e varejo', 'Araranguá/SC', '2026-08-07', 0, false],
  ['M6PS Consultoria (reassociação)', 'Treinamento e consultoria', 'Capão da Canoa/RS', '2026-08-05', 0, false],
  ['Hidrosul Soluções', 'Indústria', 'Canoas/RS', '2026-07-01', 0, true],
  ['Mavi Intermediação', 'Serviços profissionais', 'Araranguá/SC', '2026-05-12', 0, true],
  ['Mayk Silva dos Santos', 'Pessoa física / MEI', 'Araranguá/SC', '2026-07-31', 0, false],
  ['Auto Posto Mercosul', 'Automotivo e combustíveis', 'Sombrio/SC', '2026-05-14', 0, true],
  ['Metra Engenharia', 'Engenharia e energia', 'Araranguá/SC', '2026-09-11', 0, true],
  ['Confecções Priscis', 'Indústria', 'Araranguá/SC', '2026-06-12', 0, true],
  ['Nathali Boeira Dalzochio (psicóloga)', 'Saúde', 'Araranguá/SC', '2026-04-16', 0, true],
  ['Nexa Engenharia e Arquitetura', 'Engenharia e energia', 'Araranguá/SC', '2026-02-06', 0, true],
  ['Novo Continente (atacado alimentos)', 'Alimentação e bebidas', 'Araranguá/SC', '2026-06-10', 0, true],
  ['Pizza Água na Boca', 'Alimentação e bebidas', 'Balneário Arroio do Silva/SC', '2026-09-11', 0, true],
  ['Projesul', 'Comércio e varejo', 'Araranguá/SC', '2026-08-06', 0, true],
  ['Quantum Distribuição e Logística', 'Saúde', 'Araranguá/SC', '2026-08-10', 0, true],
  ['R&B Intermediações', 'Construção e imóveis', 'Criciúma/SC', '2026-07-01', 0, true],
  ['Rodima Equipamentos', 'Automotivo e combustíveis', 'Maracajá/SC', '2026-08-12', 0, true],
  ['Recruta Easy', 'Tecnologia', 'Recife/PE', '2026-01-15', 0, true],
  ['Reinaldo Correa Matos (eventos)', 'Marketing e eventos', 'São Paulo/SP', '2026-03-31', 0, true],
  ['COT Clínica Ortopédica', 'Saúde', 'Araranguá/SC', '2026-06-11', 0, true],
  ['Jucafes', 'Comércio e varejo', 'Balneário Arroio do Silva/SC', '2026-08-19', 0, true],
  ['Titanium Segurança Estratégica', 'Serviços profissionais', 'Bom Jesus/RS', '2026-02-24', 0, true],
  ['Tabacaria Central (S.S.M)', 'Comércio e varejo', 'Araranguá/SC', '2026-09-11', 0, true],
  ['Sabor Favorito Gastronomia', 'Alimentação e bebidas', 'Araranguá/SC', '2026-03-10', 0, true],
  ['Sergio Rizzotto Carvalho', 'Pessoa física / MEI', 'Araranguá/SC', '2026-04-22', 0, true],
  ['Tabacaria Central (Simoni)', 'Comércio e varejo', 'Araranguá/SC', '2026-09-11', 0, true],
  ['Steckert Engenharia', 'Engenharia e energia', 'Turvo/SC', '2026-05-05', 0, true],
  ['Tabacaria e Conveniência Central', 'Comércio e varejo', 'Araranguá/SC', '2026-09-11', 0, true],
  ['Talau Imóveis', 'Construção e imóveis', 'Araranguá/SC', '2026-08-13', 0, true],
  ['Tree House Pub', 'Alimentação e bebidas', 'Araranguá/SC', '2026-09-11', 0, true],
  ['Super Popular Giassi (farmácia)', 'Saúde', 'Araranguá/SC', '2026-09-01', 0, true],
  ['Projeto de Vida Consultoria', 'Treinamento e consultoria', 'Torres/RS', '2026-07-16', 0, false],
  ['Qualific+ (VM Engenharia)', 'Engenharia e energia', 'Araranguá/SC', '2026-01-22', 0, true],
]

const SAIDAS = [
  ['Paola Camargo Hermann', 'Pessoa física / MEI', 'Araranguá/SC', '2025-09-09', 0, true],
  ['Nolukai (treinamento em informática)', 'Treinamento e consultoria', 'Balneário Arroio do Silva/SC', '2025-09-12', 0, false],
  ['Henrique de Lima Cardoso (elétrica)', 'Serviços técnicos', 'Araranguá/SC', '2026-02-26', 0, false],
  ['Gabriel Vinicius Machado de Machado', 'Pessoa física / MEI', 'Araranguá/SC', '2026-04-22', 0, false],
  ['Agência Matti', 'Marketing e eventos', 'Balneário Arroio do Silva/SC', '2025-05-21', 0, false],
  ['AFreitas Câmara de Arbitragem', 'Serviços profissionais', 'Araranguá/SC', '2025-12-03', 0, true],
  ['2º Tabelionato (cadastro antigo, CPF)', 'Serviços profissionais', 'Araranguá/SC', '2024-07-25', 0, true],
  ['Cakto Produções e Eventos', 'Marketing e eventos', 'Porto Alegre/RS', '2026-04-22', 0, false],
  ['Souza Polli Advogados', 'Serviços profissionais', 'Araranguá/SC', '2023-08-30', 0, true],
  ['Clínica Neuroaprender', 'Saúde', 'Araranguá/SC', '2026-02-18', 0, false],
  ['Comercial Alexfer', 'Construção e imóveis', 'Maracajá/SC', '2025-08-21', 0, false],
  ['Tio Chico Agro Shop', 'Comércio e varejo', 'Araranguá/SC', '2026-02-18', 0, false],
  ['São João Farmácias', 'Saúde', 'Turvo/SC', '2025-08-28', 0, false],
  ['CIS AMESC', 'Saúde', 'Araranguá/SC', '2018-09-14', 9, true],
  ['Jamily Schiestl Trento (psicologia)', 'Saúde', 'Araranguá/SC', '2024-10-28', 0, true],
  ['Della & Matos (Dermaclinic)', 'Saúde', 'Araranguá/SC', '2025-11-11', 0, false],
  ['Diane Consultoria', 'Treinamento e consultoria', 'Araranguá/SC', '2026-06-05', 0, false],
  ['Ricardo Farma', 'Saúde', 'Forquilhinha/SC', '2024-10-31', 0, false],
  ['Webaze', 'Marketing e eventos', 'Araranguá/SC', '2024-05-06', 0, true],
  ['G6 Soluções em Consórcios', 'Serviços profissionais', 'Araranguá/SC', '2023-07-17', 0, false],
  ['Assunção Videomaker', 'Marketing e eventos', 'Araranguá/SC', '2025-11-13', 0, false],
  ['Gustavo Gomes Correia (M4 Auto Estética)', 'Automotivo e combustíveis', 'Araranguá/SC', '2025-02-26', 0, true],
  ['INA Brands', 'Marketing e eventos', 'Araranguá/SC', '2024-01-25', 0, false],
  ['10 Pastéis', 'Alimentação e bebidas', 'Araranguá/SC', '2018-11-27', 4, true],
  ['Blackwhite', 'Pessoa física / MEI', 'Araranguá/SC', '2026-05-13', 0, false],
  ['Presa Supermercado', 'Alimentação e bebidas', 'Meleiro/SC', '2016-04-29', 15, false],
  ['Grão e Goma', 'Alimentação e bebidas', 'Araranguá/SC', '2020-05-29', 0, false],
  ['Lariessa Porcel Sanches', 'Pessoa física / MEI', 'Araranguá/SC', '2024-09-02', 0, false],
  ['Lilian Nolla Fonoaudiologia', 'Saúde', 'Araranguá/SC', '2025-02-17', 0, false],
  ['Litoral Sul Ind. de Churrasqueiras', 'Indústria', 'Araranguá/SC', '2022-03-18', 0, false],
  ['Mercearia Henrique', 'Alimentação e bebidas', 'Maracajá/SC', '2019-04-08', 3, true],
  ['M6PS Consultoria (cadastro antigo)', 'Treinamento e consultoria', 'Capão da Canoa/RS', '2023-11-07', 0, false],
  ['Chuva Conteúdo', 'Marketing e eventos', 'Araranguá/SC', '2024-12-17', 0, false],
  ['Experimmente Consultoria', 'Treinamento e consultoria', 'Araranguá/SC', '2024-07-25', 0, true],
  ['Michelle Oyarzabal Martins', 'Pessoa física / MEI', 'Araranguá/SC', '2023-08-01', 0, true],
  ['Mobiliup Assessoria', 'Serviços profissionais', 'Sombrio/SC', '2025-10-21', 0, false],
  ['Natalia de Farias (advocacia)', 'Serviços profissionais', 'Araranguá/SC', '2024-11-26', 0, false],
  ['NC Construtora', 'Construção e imóveis', 'Araranguá/SC', '2023-09-26', 0, true],
  ['Imagine Marketing', 'Marketing e eventos', 'Araranguá/SC', '2025-12-04', 0, false],
  ['Polli Lemes', 'Pessoa física / MEI', 'Araranguá/SC', '2025-02-24', 0, false],
  ['Idealle Planejados', 'Indústria', 'Araranguá/SC', '2020-06-23', 2, false],
  ['Mercado Sineval', 'Alimentação e bebidas', 'Araranguá/SC', '2026-04-06', 0, false],
  ['Antares Construções', 'Construção e imóveis', 'Araranguá/SC', '2018-04-26', 10, false],
  ['Sul Fiscal', 'Serviços profissionais', 'Araranguá/SC', '2025-06-02', 0, false],
  ['Mestre da Obra Araranguá', 'Construção e imóveis', 'Araranguá/SC', '2025-09-09', 0, false],
  ['CTED Centro de Treinamento Emocional', 'Treinamento e consultoria', 'Araranguá/SC', '2022-08-05', 0, false],
  ['Tiane de Aguiar Joaquim', 'Pessoa física / MEI', 'Araranguá/SC', '2025-12-01', 0, false],
  ['Tramonta Imobiliária', 'Construção e imóveis', 'Balneário Arroio do Silva/SC', '2025-05-30', 0, false],
  ['Santos Climatização e Coifas', 'Serviços técnicos', 'Araranguá/SC', '2025-10-24', 0, false],
  ['Mercado Maykon', 'Alimentação e bebidas', 'Araranguá/SC', '2007-04-26', 3, false],
  ['Clínica Veterinária São Francisco', 'Saúde', 'Araranguá/SC', '2025-09-09', 0, false],
  ['Vitinho Lanches', 'Alimentação e bebidas', 'Araranguá/SC', '2025-07-14', 0, true],
  ['Viviane Borges Bernardo', 'Pessoa física / MEI', 'Araranguá/SC', '2025-10-13', 0, false],
  ['Panorama Radiologia Odontológica', 'Saúde', 'Sombrio/SC', '2026-06-10', 0, false],
]

const toObj = ([nome, segmento, cidade, data, func, boleto]) => ({ nome, segmento, cidade, data, func, boleto, ano: Number(data.slice(0, 4)) })
const E = ENTRADAS.map(toObj)
const S = SAIDAS.map(toObj)

const pct = (a, b) => b ? Math.round((a / b) * 100) : 0
const fmtData = d => d.split('-').reverse().join('/')
const countBy = (arr, fn) => arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; return m }, {})
const cidadeNome = c => c.split('/')[0]

/* ── Indicadores derivados (calculados dos registros, não digitados) ── */
const SALDO             = E.length - S.length
const SAIDAS_COORTE26   = S.filter(x => x.ano === 2026).length
const ENTRARAM_2026     = E.length + SAIDAS_COORTE26
const SAIDAS_RECENTES   = S.filter(x => x.ano >= 2025).length
const E_FORA_SEDE       = E.filter(x => cidadeNome(x.cidade) !== SEDE).length
const S_FORA_SEDE       = S.filter(x => cidadeNome(x.cidade) !== SEDE).length
const E_BOLETO          = E.filter(x => x.boleto).length
const S_BOLETO          = S.filter(x => x.boleto).length
const POR_MES           = MESES.map((_, i) => E.filter(x => Number(x.data.slice(5, 7)) === i + 1).length)
const DIA_PICO          = Object.entries(countBy(E, x => x.data)).sort((a, b) => b[1] - a[1])[0]

const FAIXAS_CASA = [
  { label: 'Entrou em 2026', teste: a => a === 2026 },
  { label: 'Entrou em 2025', teste: a => a === 2025 },
  { label: 'Entrou em 2024', teste: a => a === 2024 },
  { label: 'Entrou em 2023', teste: a => a === 2023 },
  { label: '2022 ou antes',  teste: a => a <= 2022 },
].map(f => ({ ...f, valor: S.filter(x => f.teste(x.ano)).length }))

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

const PERDAS_PESO = [...S]
  .filter(x => x.func > 0 || x.ano <= 2018)
  .sort((a, b) => a.ano - b.ano)

/* ── Componentes base (mesma linguagem dos painéis do hub) ── */
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

function Legenda() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-muted">
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: ENTRADA }} /> Entradas</span>
      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: SAIDA }} /> Saídas</span>
    </div>
  )
}

function BarraH({ valor, max, color, titulo, delay = 0 }) {
  const w = max ? Math.max(valor ? 2 : 0, (valor / max) * 100) : 0
  return (
    <div className="flex items-center gap-2" title={titulo}>
      <div className="flex-1 h-3 rounded-r" style={{ background: '#f4f5f9' }}>
        <motion.div className="h-full rounded-r" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${w}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <span className="text-[11px] font-bold text-text w-6 text-right tabular-nums">{valor}</span>
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
            01/01 a 06/10/2026 · relatórios do sistema ACIVA
          </span>
        </div>
        <div className="mt-5 flex items-end gap-6 flex-wrap">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>Saldo líquido no ano</p>
            <p className="text-6xl font-black leading-none mt-1 text-white">+{SALDO}</p>
          </div>
          <div className="flex gap-6 pb-1">
            <div>
              <p className="text-2xl font-black text-white">{E.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>novos ativos</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{S.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>desativados</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{(E.length / S.length).toFixed(2).replace('.', ',')}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>entradas por saída</p>
            </div>
          </div>
        </div>
        <p className="text-xs mt-5 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          A base cresce, mas o vazamento está no começo da relação: <b className="text-white">{pct(SAIDAS_RECENTES, S.length)}% de quem saiu</b> tinha
          se associado em 2025 ou 2026. A captação acelerou no 2º semestre, com setembro sendo o melhor mês do ano.
        </p>
      </div>
    </motion.div>
  )
}

function Kpis() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Kpi icon="⏳" color={CRITICO} label="Saídas com < 2 anos de casa"
        value={`${pct(SAIDAS_RECENTES, S.length)}%`} sub={`${SAIDAS_RECENTES} de ${S.length} entraram em 2025/2026`} />
      <Kpi icon="🧲" color={VERDE} label="Retenção da turma 2026"
        value={`${pct(E.length, ENTRARAM_2026)}%`} sub={`${SAIDAS_COORTE26} de ${ENTRARAM_2026} que entraram já saíram`} />
      <Kpi icon="🗺️" color={ENTRADA} label="Novos fora de Araranguá"
        value={`${pct(E_FORA_SEDE, E.length)}%`} sub={`${E_FORA_SEDE} de ${E.length} · Turvo lidera com 4`} />
      <Kpi icon="🧾" color={ALERTA} label="Boleto Sicoob: novos × saídas"
        value={`${pct(E_BOLETO, E.length)}% × ${pct(S_BOLETO, S.length)}%`} sub="hipótese a validar com a inadimplência" />
    </div>
  )
}

function EntradasPorMes() {
  const max = Math.max(...POR_MES)
  const [hover, setHover] = useState(null)
  return (
    <Card titulo="Novos associados por mês" sub="Associação entre jan e set/2026 (out até dia 6 sem registros)">
      <div className="p-5">
        <div className="flex items-end gap-2 h-44" role="img" aria-label={MESES.map((m, i) => `${m}: ${POR_MES[i]}`).join(', ')}>
          {POR_MES.map((v, i) => (
            <div key={MESES[i]} className="flex-1 flex flex-col items-center justify-end h-full relative"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {hover === i && (
                <div className="absolute -top-1 -translate-y-full bg-[#1a1d2e] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-10">
                  {MESES[i]}/26 · {v} {v === 1 ? 'associado' : 'associados'}
                </div>
              )}
              <span className="text-[11px] font-bold text-text mb-1 tabular-nums">{v}</span>
              <motion.div className="w-full max-w-[38px] rounded-t" style={{ background: ENTRADA, opacity: hover === null || hover === i ? 1 : 0.55 }}
                initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }} />
              <span className="text-[10px] text-muted mt-1.5">{MESES[i]}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ background: ENTRADA + '10', color: '#1a1d2e' }}>
          📌 <b>{fmtData(DIA_PICO[0])}: {DIA_PICO[1]} adesões num único dia</b>. Quatro delas são do mesmo grupo (Simoni dos Santos:
          Pit Stop Adega e três CNPJs da Tabacaria Central). Vale descobrir o que gerou esse dia (evento, ação comercial, indicação) e repetir.
        </div>
      </div>
    </Card>
  )
}

function TempoDeCasa() {
  const max = Math.max(...FAIXAS_CASA.map(f => f.valor))
  return (
    <Card titulo="Desativados por ano de associação" sub="Quanto tempo quem saiu ficou na associação">
      <div className="p-5 space-y-3">
        {FAIXAS_CASA.map((f, i) => (
          <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-3 items-center">
            <span className="text-xs font-bold text-text">{f.label}</span>
            <BarraH valor={f.valor} max={max} color={SAIDA} delay={i * 0.05} titulo={`${f.label}: ${f.valor} desativados (${pct(f.valor, S.length)}%)`} />
          </div>
        ))}
        <div className="pt-2 rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ background: SAIDA + '12', color: '#1a1d2e' }}>
          ⚠️ <b>{SAIDAS_COORTE26} empresas entraram e saíram no próprio ano de 2026.</b> O ponto de maior perda é o primeiro ciclo de cobrança:
          um onboarding de 90 dias rende mais do que a reativação depois.
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
              <p className="text-[10px] text-muted">{x.segmento} · {cidadeNome(x.cidade)}</p>
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
    { t: '2º Tabelionato de Araranguá', d: 'Saiu o cadastro no CPF do antigo titular (cód. 2161) e entrou o do CNPJ (cód. 2518) em 24/04/2026. Provável troca de titular.' },
    { t: 'Grupo Simoni dos Santos', d: '4 CNPJs associados em 11/09/2026 (Pit Stop Adega + 3 unidades da Tabacaria Central). Relacionamento concentrado em uma decisora.' },
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

function Cadastro() {
  const itens = [
    ['Litoral Sul Ind. de Churrasqueiras', 'responsável "DASDASDASD", CEP 88.888-888 e sem e-mail'],
    ['E-mail ausente ou inválido', 'Pâmela Katiusci (":"), Sul Fiscal, Vitinho Lanches, Leandro Amaral, Armilar, M6PS, Espaço Animal ("gmai.com")'],
    ['WhatsApp mal formatado', 'padrão "(4)8xxxx" em AR Peças, Arlete, Nathali, Novo Continente, Rodima, Qualific+ e outros'],
    ['Campos zerados', 'funcionários e capital social vêm 0 em quase todos: hoje não dá para medir o porte da base'],
    ['Sem data/motivo de saída', 'o relatório de desativados não traz quando nem por que a empresa saiu'],
  ]
  return (
    <Card titulo="Qualidade do cadastro" sub="O que impede indicadores mais precisos">
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

function Acoes() {
  const acoes = [
    { n: '1', t: 'Onboarding dos primeiros 90 dias', d: `Boas-vindas, apresentação dos benefícios, primeiro evento e um contato no 2º mês. Mira direta nos ${pct(SAIDAS_RECENTES, S.length)}% que saem cedo.` },
    { n: '2', t: 'Registrar motivo e data de saída', d: 'Sem isso, não há como separar inadimplência, insatisfação e fechamento da empresa.' },
    { n: '3', t: 'Boleto registrado na adesão', d: `${pct(E_BOLETO, E.length)}% dos novos já entram com Boleto Sicoob, contra ${pct(S_BOLETO, S.length)}% de quem saiu. Cruzar com inadimplência para confirmar.` },
    { n: '4', t: 'Repetir o 11/09', d: 'Entender a origem das 8 adesões do dia e transformar em ação recorrente.' },
    { n: '5', t: 'Olhar o setor de marketing', d: '7 empresas de marketing/eventos saíram e só 3 entraram. Investigar se a proposta de valor faz sentido para prestadores de serviço.' },
    { n: '6', t: 'Expansão regional', d: 'Turvo trouxe 4 associados e cidades vizinhas somam um terço das entradas. Há espaço para núcleos regionais.' },
  ]
  return (
    <Card titulo="Próximos passos sugeridos">
      <div className="p-5 grid sm:grid-cols-2 gap-3">
        {acoes.map(a => (
          <div key={a.n} className="flex gap-3 rounded-xl p-3.5" style={{ background: '#f7f8fb' }}>
            <span className="w-6 h-6 rounded-full text-[11px] font-black text-white flex items-center justify-center shrink-0" style={{ background: VERDE }}>{a.n}</span>
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

function Tabela() {
  const [aba, setAba] = useState('entradas')
  const [busca, setBusca] = useState('')
  const [seg, setSeg] = useState('todos')
  const base = aba === 'entradas' ? E : S
  const segs = useMemo(() => [...new Set(base.map(x => x.segmento))].sort(), [base])
  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return base
      .filter(x => seg === 'todos' || x.segmento === seg)
      .filter(x => !q || x.nome.toLowerCase().includes(q) || x.cidade.toLowerCase().includes(q))
      .sort((a, b) => aba === 'entradas' ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data))
  }, [base, busca, seg, aba])

  return (
    <Card titulo="Lista completa" sub={`${lista.length} de ${base.length} registros`}
      extra={
        <div className="flex rounded-lg p-0.5" style={{ background: '#f1f3f9' }}>
          {[['entradas', `Novos (${E.length})`], ['saidas', `Desativados (${S.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => { setAba(k); setSeg('todos') }}
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
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar empresa ou cidade"
            className="bg-transparent text-xs outline-none flex-1 text-text" />
        </div>
        <select value={seg} onChange={e => setSeg(e.target.value)}
          className="text-xs rounded-lg px-3 py-2 outline-none text-text" style={{ background: '#f7f8fb' }}>
          <option value="todos">Todos os segmentos</option>
          {segs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="p-5 overflow-x-auto">
        <table className="w-full text-xs min-w-[560px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted">
              <th className="pb-2 font-extrabold">Empresa</th>
              <th className="pb-2 font-extrabold">Segmento</th>
              <th className="pb-2 font-extrabold">Cidade</th>
              <th className="pb-2 font-extrabold">Associação</th>
              <th className="pb-2 font-extrabold text-center">Boleto</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(x => (
              <tr key={x.nome + x.data} style={{ borderTop: '1px solid #f1f3f9' }}>
                <td className="py-2 pr-3 font-bold text-text">{x.nome}</td>
                <td className="py-2 pr-3 text-muted">{x.segmento}</td>
                <td className="py-2 pr-3 text-muted whitespace-nowrap">{x.cidade}</td>
                <td className="py-2 pr-3 text-muted tabular-nums">{fmtData(x.data)}</td>
                <td className="py-2 text-center">{x.boleto ? '✓' : <span className="text-muted">—</span>}</td>
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
      <div className="grid lg:grid-cols-2 gap-5">
        <EntradasPorMes />
        <TempoDeCasa />
      </div>
      <Card titulo="Entradas × saídas por segmento" sub="Classificação pela atividade cadastrada (quando 'Geral', pelo nome da empresa)" extra={<Legenda />}>
        <Comparativo linhas={SEGMENTOS} chave="seg" />
      </Card>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card titulo="Entradas × saídas por cidade" sub={`Fora de Araranguá: ${E_FORA_SEDE} entradas e ${S_FORA_SEDE} saídas`} extra={<Legenda />}>
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
