import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AVATAR_BY_ID } from '../data/avatars'

// ── Raridades Copa ────────────────────────────────────────────────────
const RAR = {
  raro: {
    label: 'RARO', stars: 3,
    bg:       'linear-gradient(170deg,#000d1a 0%,#001833 55%,#000d1a 100%)',
    headerBg: 'linear-gradient(135deg,#1e3a5f 0%,#2563eb 50%,#1e3a5f 100%)',
    border:   '1.5px solid #3b82f6',
    glow:     '0 0 22px rgba(59,130,246,0.45)',
    glowHov:  '0 0 36px rgba(59,130,246,0.75), 0 0 70px rgba(59,130,246,0.18)',
    rating:   '#93c5fd', name: '#dbeafe', label: '#60a5fa', bar: '#3b82f6',
  },
  epico: {
    label: 'ÉPICO', stars: 4,
    bg:       'linear-gradient(170deg,#0d0015 0%,#1e0035 55%,#0d0015 100%)',
    headerBg: 'linear-gradient(135deg,#3b0070 0%,#7c3aed 50%,#3b0070 100%)',
    border:   '1.5px solid #8b5cf6',
    glow:     '0 0 28px rgba(139,92,246,0.5)',
    glowHov:  '0 0 45px rgba(139,92,246,0.8), 0 0 90px rgba(139,92,246,0.2)',
    rating:   '#d8b4fe', name: '#f3e8ff', label: '#c084fc', bar: '#8b5cf6',
  },
  lendario: {
    label: 'LENDÁRIO', stars: 5,
    bg:       'linear-gradient(170deg,#0a0700 0%,#1c1200 55%,#0a0700 100%)',
    headerBg: 'linear-gradient(135deg,#6b4c00 0%,#c89a00 35%,#e8c040 50%,#c89a00 65%,#6b4c00 100%)',
    border:   '1.5px solid #c89a00',
    glow:     '0 0 35px rgba(200,154,0,0.55)',
    glowHov:  '0 0 55px rgba(200,154,0,0.85), 0 0 110px rgba(200,154,0,0.2)',
    rating:   '#fde68a', name: '#fef9c3', label: '#fbbf24', bar: '#c89a00',
  },
}

// ── Cartas da equipe ──────────────────────────────────────────────────
const CARTAS = [
  {
    id: 'gs',      nome: 'Gabriel S.',  titulo: 'O Estrategista',       pos: 'ATQ', rar: 'lendario', rating: 92, ed: '#001',
    stats: [{ k:'TÁT', v:96 }, { k:'ANA', v:93 }, { k:'LID', v:90 }],
  },
  {
    id: 'carol',   nome: 'Carol',       titulo: 'A Arquiteta',          pos: 'MEI', rar: 'lendario', rating: 90, ed: '#002',
    stats: [{ k:'VIS', v:94 }, { k:'ORG', v:92 }, { k:'COM', v:88 }],
  },
  {
    id: 'geovana', nome: 'Geovana',     titulo: 'A Artista',            pos: 'MDA', rar: 'epico',    rating: 88, ed: '#003',
    stats: [{ k:'CRI', v:97 }, { k:'DES', v:91 }, { k:'VEL', v:82 }],
  },
  {
    id: 'elieser', nome: 'Elieser',     titulo: 'O Analista',           pos: 'VOL', rar: 'epico',    rating: 87, ed: '#004',
    stats: [{ k:'DAD', v:95 }, { k:'PRE', v:89 }, { k:'LÓG', v:93 }],
  },
  {
    id: 'deivisson', nome: 'Deivisson', titulo: 'O Arquiteto Web',      pos: 'DEF', rar: 'epico',    rating: 86, ed: '#005',
    stats: [{ k:'COD', v:94 }, { k:'DES', v:88 }, { k:'TEC', v:91 }],
  },
  {
    id: 'tochiro', nome: 'Tochiro',     titulo: 'O Fantasma',           pos: 'MEI', rar: 'raro',     rating: 75, ed: '#006',
    stats: [{ k:'GES', v:78 }, { k:'TRF', v:80 }, { k:'FOC', v:72 }],
  },
  {
    id: 'ana_sm',  nome: 'Ana',         titulo: 'Rainha das Redes',     pos: 'LDA', rar: 'raro',     rating: 74, ed: '#007',
    stats: [{ k:'SMD', v:82 }, { k:'CON', v:78 }, { k:'CRI', v:75 }],
  },
  {
    id: 'beatriz', nome: 'Beatriz',     titulo: 'Criadora de Histórias', pos: 'LDE', rar: 'raro',    rating: 72, ed: '#008',
    stats: [{ k:'CON', v:80 }, { k:'CRV', v:76 }, { k:'CLM', v:74 }],
  },
]

// ── Card individual ───────────────────────────────────────────────────
function CartaCopaCard({ carta, index }) {
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef               = useRef(null)
  const r    = RAR[carta.rar]
  const Svg  = AVATAR_BY_ID[carta.id]
  const starsFilled = { raro: 3, epico: 4, lendario: 5 }[carta.rar]

  const particles = useMemo(() =>
    Array.from({ length: carta.rar === 'lendario' ? 9 : carta.rar === 'epico' ? 6 : 0 }).map(() => ({
      w: 2 + Math.random() * 2.5,
      left: 8 + Math.random() * 84,
      dur: 1.1 + Math.random() * 0.9,
      delay: Math.random() * 0.7,
      rise: 70 + Math.random() * 60,
    })),
  [carta.id])

  function onMove(e) {
    const rc = cardRef.current?.getBoundingClientRect()
    if (!rc) return
    setTilt({
      x:  ((e.clientX - rc.left)  / rc.width  - 0.5) * 18,
      y: -((e.clientY - rc.top)   / rc.height - 0.5) * 18,
    })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.28 }}
      onMouseMove={onMove}
      onMouseLeave={() => { setTilt({ x:0, y:0 }); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      style={{ perspective: 900, cursor: 'pointer', flexShrink: 0 }}
    >
      <motion.div
        animate={{ rotateY: tilt.x, rotateX: tilt.y, scale: hovered ? 1.07 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
          width: 180, height: 285,
          borderRadius: 16,
          background: r.bg,
          border: r.border,
          boxShadow: hovered ? r.glowHov : r.glow,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Partículas lendário/épico */}
        {hovered && particles.map((p, i) => (
          <motion.span key={i}
            style={{
              position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
              width: p.w, height: p.w,
              background: r.rating,
              left: `${p.left}%`, bottom: '8%',
              zIndex: 10,
            }}
            animate={{ y: [0, -p.rise], opacity: [0.9, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
          />
        ))}

        {/* Shimmer sweep */}
        {hovered && (
          <motion.div
            style={{
              position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none',
              background: 'linear-gradient(105deg,transparent 28%,rgba(255,255,255,0.22) 50%,transparent 72%)',
            }}
            initial={{ x: '-110%' }} animate={{ x: '210%' }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />
        )}

        {/* Rainbow foil overlay (apenas lendário, hover) */}
        {carta.rar === 'lendario' && hovered && (
          <motion.div
            style={{
              position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none', borderRadius: 16,
              background: 'linear-gradient(120deg,rgba(255,40,40,0.07),rgba(255,180,0,0.1),rgba(0,210,90,0.07),rgba(0,130,255,0.09),rgba(180,0,255,0.07))',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}

        {/* ── HEADER: Arte do personagem ── */}
        <div style={{
          height: 128, position: 'relative', overflow: 'hidden',
          background: r.headerBg,
        }}>
          {/* Textura radial */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(ellipse at 70% 20%,rgba(255,255,255,0.14),transparent 55%), radial-gradient(ellipse at 20% 90%,rgba(0,0,0,0.22),transparent 50%)`,
          }} />

          {/* Rating + posição — canto esquerdo */}
          <div style={{ position: 'absolute', top: 8, left: 10, zIndex: 4 }}>
            <div style={{
              fontSize: 26, fontWeight: 900, lineHeight: 1,
              color: r.rating,
              textShadow: `0 0 12px ${r.rating}80`,
            }}>
              {carta.rating}
            </div>
            <div style={{ fontSize: 8, fontWeight: 800, color: r.rating, letterSpacing: '0.07em', opacity: 0.85 }}>
              {carta.pos}
            </div>
          </div>

          {/* Estrelas — canto direito */}
          <div style={{ position: 'absolute', top: 9, right: 8, display: 'flex', gap: 1, zIndex: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 7, color: r.rating, opacity: i < starsFilled ? 1 : 0.18 }}>★</span>
            ))}
          </div>

          {/* Avatar SVG */}
          {Svg ? (
            <div style={{
              position: 'absolute', bottom: -2, left: '50%',
              transform: 'translateX(-50%)',
              width: 96, height: 116,
              filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 8px ${r.rating}40)`,
              zIndex: 3,
            }}>
              <Svg />
            </div>
          ) : (
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 70, height: 90,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, zIndex: 3,
            }}>?</div>
          )}
        </div>

        {/* Rarity badge — abaixo do header */}
        <div style={{
          position: 'absolute', top: 131, right: 8,
          padding: '1.5px 5px', borderRadius: 4,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 6,
        }}>
          <span style={{ fontSize: 6.5, fontWeight: 900, color: r.rating, letterSpacing: '0.07em' }}>
            {r.label}
          </span>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '8px 11px 4px', position: 'relative', zIndex: 2 }}>

          {/* Nome + título */}
          <div style={{ borderBottom: `1px solid ${r.bar}28`, paddingBottom: 6, marginBottom: 6 }}>
            <p style={{ fontSize: 12, fontWeight: 900, color: r.name, letterSpacing: '0.02em', lineHeight: 1.1 }}>
              {carta.nome}
            </p>
            <p style={{ fontSize: 7.5, fontWeight: 700, color: r.label, letterSpacing: '0.05em', marginTop: 1.5, opacity: 0.85 }}>
              "{carta.titulo}"
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {carta.stats.map(({ k, v }) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: r.label, width: 22, flexShrink: 0, letterSpacing: '0.03em' }}>
                  {k}
                </span>
                <span style={{ fontSize: 8, fontWeight: 900, color: r.rating, width: 18, textAlign: 'right', flexShrink: 0 }}>
                  {v}
                </span>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${r.bar},${r.rating})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    transition={{ duration: 0.9, delay: index * 0.05 + 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER: Copa stamp ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '7px 10px 7px',
          background: 'linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.75) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 3,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11, lineHeight: 1 }}>⚽</span>
            <div>
              <p style={{ fontSize: 6.5, fontWeight: 900, color: r.rating, letterSpacing: '0.07em', lineHeight: 1.15 }}>
                COPA TRÁFEGON
              </p>
              <p style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.05em' }}>
                2026 · EDIÇÃO LIMITADA
              </p>
            </div>
          </div>
          <span style={{ fontSize: 8.5, fontWeight: 900, color: r.rating, opacity: 0.65, letterSpacing: '0.04em' }}>
            {carta.ed}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Seção principal ───────────────────────────────────────────────────
export default function CartasCopaSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      style={{ marginBottom: 32 }}
    >
      {/* Header da seção */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#6b4c00,#c89a00)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, boxShadow: '0 4px 14px rgba(200,154,0,0.4)',
        }}>⚽</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 900, color: '#1a1d2e', lineHeight: 1.1 }}>
            Cartas Colecionáveis
          </p>
          <p style={{ fontSize: 10, color: '#8890b5', marginTop: 1 }}>
            Copa Tráfegon 2026 · Edição Limitada Jun-Jul
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          padding: '4px 12px', borderRadius: 20,
          background: 'linear-gradient(90deg,#6b4c00,#c89a00)',
          fontSize: 8.5, fontWeight: 900, color: '#fff', letterSpacing: '0.08em',
          boxShadow: '0 2px 10px rgba(200,154,0,0.35)',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          ★ EDIÇÃO LIMITADA
        </div>
      </div>

      {/* Scroll horizontal de cartas */}
      <div style={{
        display: 'flex', gap: 14,
        overflowX: 'auto', paddingBottom: 14,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}>
        {CARTAS.map((carta, i) => (
          <CartaCopaCard key={carta.id} carta={carta} index={i} />
        ))}
      </div>

      {/* Hint de colecionável */}
      <p style={{ fontSize: 9, color: '#8890b5', textAlign: 'center', marginTop: 4, letterSpacing: '0.04em' }}>
        Passe o mouse sobre as cartas para ativar o efeito holográfico · 8 cartas disponíveis nesta edição
      </p>
    </motion.div>
  )
}
