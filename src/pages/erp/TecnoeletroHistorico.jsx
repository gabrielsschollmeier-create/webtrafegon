/* =========================================================================
   Histórico de Resultados — Tecnoeletro
   Comparativo comercial 2025 × 2026 (jan–set) + projeção out/nov 2026.
   Fonte: Relatório interno de Gestão Comercial (Reunião de Indicadores).
   Mesmo design das demais abas do cliente.
   ========================================================================= */

const fmtMi = v => "R$ " + (v / 1e6).toFixed(2).replace(".", ",") + " mi";
const fmtCompact = v => v >= 1e6
  ? "R$ " + (v / 1e6).toFixed(2).replace(".", ",") + " mi"
  : "R$ " + Math.round(v / 1e3) + " mil";
const fmtFull = v => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Card({ children }) {
  return <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(26,29,46,0.07)" }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <p className="text-sm font-extrabold text-text mb-4">{children}</p>;
}

const GREEN = "#4faa1f", RED = "#ef4444", ORANGE = "#f59e0b";

const MESES = [
  ["Jan", 919940.28, 1144330.92],
  ["Fev", 1298513.14, 352153.54],
  ["Mar", 1087802.11, 564411.91],
  ["Abr", 375519.70, 1490718.38],
  ["Mai", 6523622.35, 1181260.78],
  ["Jun", 831124.43, 532555.75],
  ["Jul", 2132867.95, 2005400.35],
  ["Ago", 2012682.31, 1868586.54],
  ["Set", 342766.75, 849285.43],
];
const MAXMES = 6523622.35;

const POR_CLIENTE = [
  ["BPM", 3926880.00], ["Baly", 1888789.00], ["Vista Alegre", 1100000.00],
  ["Sicoob Turvo", 989000.00], ["Baldissera", 684000.00], ["Copagro", 609950.00],
  ["EZA Construtora", 432472.00], ["Strawplast", 306847.00], ["Engetom", 296974.79],
  ["Loteamento Refúgio das Águas", 203933.00], ["Realengo SAP", 150000.00], ["Olim Eldorado", 131589.00],
];
const PRINCIPAIS = [
  ["BPM", "Instalação do galpão logístico", 3926880.00, "Outubro"],
  ["Baly", "Painel da linha nova", 1243789.00, "Novembro"],
  ["Vista Alegre", "Boiler e automação do beneficiamento", 1100000.00, "Novembro"],
  ["Sicoob Turvo", "Montagem de CPD, rede elétrica/lógica e PPCI", 839000.00, "Outubro"],
];

function KpiComparativo({ label, de, para, varTxt, up, color }) {
  const c = up ? GREEN : RED;
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(26,29,46,0.07)", borderTop: `3px solid ${c}` }}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted leading-tight mb-2">{label}</p>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[12px] text-muted line-through">{de}</span>
        <span className="text-[11px] text-muted">→</span>
        <span className="text-lg font-black text-text">{para}</span>
      </div>
      <span className="inline-block mt-2 text-[11px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: c + "18", color: c }}>
        {up ? "▲" : "▼"} {varTxt}
      </span>
    </div>
  );
}

export default function TecnoeletroHistorico({ color = "#06b6d4" }) {
  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* HERO */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a1d2e 60%, #0d1225 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 90% 0%, ${color}26 0%, transparent 55%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: color + "cc" }}>Gestão comercial</p>
          <h1 className="text-xl font-black text-white mb-1">📊 Histórico de Resultados</h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Comparativo comercial 2025 × 2026 (jan–set) e projeção de fechamento para out/nov de 2026.</p>
        </div>
      </div>

      {/* KPIs comparativos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiComparativo label="Valor orçado (jan–set)" de="R$ 60,64 mi" para="R$ 81,49 mi" varTxt="+34,4%" up color={color} />
        <KpiComparativo label="Valor fechado (jan–set)" de="R$ 15,52 mi" para="R$ 9,99 mi" varTxt="−35,7%" up={false} color={color} />
        <KpiComparativo label="Ticket médio do orçamento" de="R$ 127,9 mil" para="R$ 200,7 mil" varTxt="+56,9%" up color={color} />
      </div>

      {/* Leitura rápida */}
      <div className="rounded-2xl p-4" style={{ background: color + "0d", border: `1px solid ${color}2b` }}>
        <p className="text-[12px] text-text leading-snug">
          <b>Leitura:</b> a Tecnoeletro passou a orçar <b>mais valor com menos propostas</b> — o ticket médio subiu +56,9% (foco em projetos maiores).
          Em contrapartida, o <b>valor fechado caiu 35,7%</b>. O desafio de 2026 não é orçar, é <b>converter e fechar</b> as oportunidades de maior porte.
        </p>
      </div>

      {/* Orçamentos */}
      <Card>
        <SectionTitle>🧾 Orçamentos elaborados — jan a set</SectionTitle>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #eef0f6" }}>
          <div className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr] text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: color }}>
            <div className="px-3 py-2">Indicador</div><div className="px-3 py-2">2025</div><div className="px-3 py-2">2026</div><div className="px-3 py-2">Variação</div>
          </div>
          {[
            ["Qtd. de orçamentos", "474", "406", "−14,4%", false],
            ["Valor total orçado", "R$ 60,64 mi", "R$ 81,49 mi", "+34,4%", true],
            ["Ticket médio", "R$ 127.927", "R$ 200.716", "+56,9%", true],
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr] text-[11.5px]" style={{ background: i % 2 ? "#fafbfe" : "#fff" }}>
              <div className="px-3 py-2 font-semibold text-text">{r[0]}</div>
              <div className="px-3 py-2 text-muted">{r[1]}</div>
              <div className="px-3 py-2 font-bold text-text">{r[2]}</div>
              <div className="px-3 py-2 font-extrabold" style={{ color: r[4] ? GREEN : RED }}>{r[3]}</div>
            </div>
          ))}
        </div>
        <p className="text-[10.5px] text-muted leading-snug mt-3">Menos propostas (−68), porém R$ 20,85 mi a mais em valor orçado — concentração em oportunidades maiores.</p>
      </Card>

      {/* Fechamentos consolidado */}
      <Card>
        <SectionTitle>✅ Fechamentos — jan a set</SectionTitle>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #eef0f6" }}>
          <div className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr] text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: "#1a1d2e" }}>
            <div className="px-3 py-2">Indicador</div><div className="px-3 py-2">2025</div><div className="px-3 py-2">2026</div><div className="px-3 py-2">Variação</div>
          </div>
          {[
            ["Qtd. de fechamentos", "189", "139", "−26,5%"],
            ["Valor total fechado", "R$ 15,52 mi", "R$ 9,99 mi", "−35,7%"],
            ["Ticket médio", "R$ 82.142", "R$ 71.861", "−12,5%"],
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr] text-[11.5px]" style={{ background: i % 2 ? "#fafbfe" : "#fff" }}>
              <div className="px-3 py-2 font-semibold text-text">{r[0]}</div>
              <div className="px-3 py-2 text-muted">{r[1]}</div>
              <div className="px-3 py-2 font-bold text-text">{r[2]}</div>
              <div className="px-3 py-2 font-extrabold" style={{ color: RED }}>{r[3]}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Comparativo mensal */}
      <Card>
        <SectionTitle>📆 Fechamentos mês a mês (valor)</SectionTitle>
        <div className="flex items-center gap-4 mb-3 text-[10px] font-bold">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm" style={{ background: "#9aa3c4" }} />2025</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm" style={{ background: color }} />2026</span>
        </div>
        <div className="space-y-2.5">
          {MESES.map(([m, v25, v26], i) => (
            <div key={i} className="grid grid-cols-[34px_1fr] gap-2 items-center">
              <span className="text-[11px] font-extrabold text-text">{m}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 rounded-sm" style={{ width: `${Math.max(2, v25 / MAXMES * 100)}%`, background: "#9aa3c4" }} />
                  <span className="text-[9.5px] text-muted whitespace-nowrap">{fmtCompact(v25)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 rounded-sm" style={{ width: `${Math.max(2, v26 / MAXMES * 100)}%`, background: color }} />
                  <span className="text-[9.5px] font-semibold whitespace-nowrap" style={{ color: color }}>{fmtCompact(v26)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10.5px] text-muted leading-snug mt-3">Maio/2025 teve um pico (R$ 6,52 mi) que puxa o acumulado do ano anterior. Em 2026 os meses ficaram mais equilibrados, porém num patamar menor.</p>
      </Card>

      {/* Projeção Q4 */}
      <Card>
        <SectionTitle>🎯 Projeção de fechamento — out/nov 2026</SectionTitle>
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            ["Outubro", "R$ 5,25 mi", "6 oport."],
            ["Novembro", "R$ 5,47 mi", "10 oport."],
            ["Pipeline total", "R$ 10,72 mi", "16 oport."],
          ].map(([t, v, s], i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: i === 2 ? color + "12" : "#f8f9fc", border: `1px solid ${i === 2 ? color + "33" : "#eef0f6"}` }}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{t}</p>
              <p className="text-base font-black text-text mt-0.5" style={i === 2 ? { color } : {}}>{v}</p>
              <p className="text-[9.5px] text-muted">{s}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-extrabold text-text mb-2">⭐ Principais oportunidades (70% do pipeline)</p>
        <div className="space-y-2 mb-4">
          {PRINCIPAIS.map(([cli, op, val, prev], i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "#f8f9fc", border: "1px solid #eef0f6" }}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[12px] font-extrabold text-text">{cli}</span>
                <span className="text-[12px] font-black" style={{ color }}>{fmtMi(val)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5">
                <span className="text-[10.5px] text-muted">{op}</span>
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: ORANGE + "18", color: ORANGE }}>{prev}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-extrabold text-text mb-2">Todas as oportunidades por cliente</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #eef0f6" }}>
          {POR_CLIENTE.map(([cli, val], i) => (
            <div key={i} className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ background: i % 2 ? "#fafbfe" : "#fff" }}>
              <span className="text-text">{cli}</span>
              <span className="font-semibold text-text tabular-nums">{fmtFull(val)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2 text-[11.5px] font-black text-white" style={{ background: "#1a1d2e" }}>
            <span>TOTAL</span><span className="tabular-nums">R$ 10.720.434,79</span>
          </div>
        </div>
      </Card>

      {/* Propostas perdidas (preliminar) */}
      <Card>
        <SectionTitle>📉 Propostas perdidas (base preliminar)</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl p-3" style={{ background: "#f8f9fc", border: "1px solid #eef0f6" }}>
            <p className="text-[10px] font-bold uppercase text-muted">2025</p>
            <p className="text-base font-black text-text mt-0.5">R$ 16,20 mi</p>
            <p className="text-[9.5px] text-muted">87 registros · 60 com valor</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#f8f9fc", border: "1px solid #eef0f6" }}>
            <p className="text-[10px] font-bold uppercase text-muted">2026</p>
            <p className="text-base font-black text-text mt-0.5">R$ 25,31 mi</p>
            <p className="text-[9.5px] text-muted">23 registros avaliados</p>
          </div>
        </div>
        <p className="text-[10px] text-muted leading-snug mt-3">⚠️ Valores preliminares — a base de 2025 contém registros sem valor e casos que podem ser propostas pendentes (não perdas efetivas). Devem ser validados antes de tratar como definitivos.</p>
      </Card>

      <p className="text-[10px] text-center text-muted">Fonte: Relatório interno de Gestão Comercial — Reunião de Indicadores · período jan–set.</p>

    </div>
  );
}
