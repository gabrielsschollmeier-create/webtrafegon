import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AVATAR_BY_ID } from '../data/avatars'

// ── Raridades Copa ─────────────────────────────────────────────────────────────
const RAR = {
  raro: {
    label: 'RARO', stars: 3,
    bg:       'linear-gradient(170deg,#000d1a 0%,#001428 55%,#000d1a 100%)',
    headerBg: 'linear-gradient(135deg,#1a3358 0%,#1e56c4 50%,#1a3358 100%)',
    border:   '1.5px solid #3b82f6',
    glow:     '0 0 22px rgba(59,130,246,0.5)',
    glowHov:  '0 0 45px rgba(59,130,246,0.9), 0 0 90px rgba(59,130,246,0.25)',
    rating:   '#93c5fd', name: '#dbeafe', label: '#60a5fa', bar: '#3b82f6',
    shimmer:  'rgba(147,197,253,0.3)',
  },
  epico: {
    label: 'ÉPICO', stars: 4,
    bg:       'linear-gradient(170deg,#0e0018 0%,#1c0030 55%,#0e0018 100%)',
    headerBg: 'linear-gradient(135deg,#3b0068 0%,#7200d4 50%,#3b0068 100%)',
    border:   '1.5px solid #9333ea',
    glow:     '0 0 30px rgba(147,51,234,0.55)',
    glowHov:  '0 0 55px rgba(147,51,234,0.95), 0 0 110px rgba(147,51,234,0.3)',
    rating:   '#e9d5ff', name: '#f5f0ff', label: '#c084fc', bar: '#9333ea',
    shimmer:  'rgba(233,213,255,0.35)',
  },
  lendario: {
    label: 'LENDÁRIO', stars: 5,
    bg:       'linear-gradient(170deg,#080500 0%,#1a1000 55%,#080500 100%)',
    headerBg: 'linear-gradient(135deg,#5c3a00 0%,#b87800 35%,#e8c040 50%,#b87800 65%,#5c3a00 100%)',
    border:   '1.5px solid #c89a00',
    glow:     '0 0 38px rgba(200,154,0,0.6)',
    glowHov:  '0 0 65px rgba(200,154,0,0.95), 0 0 130px rgba(200,154,0,0.25)',
    rating:   '#fde68a', name: '#fefce8', label: '#fbbf24', bar: '#c89a00',
    shimmer:  'rgba(253,230,138,0.45)',
  },
}

// ── Dados das cartas ──────────────────────────────────────────────────────────
const CARTAS = [
  { id:'gs',       nome:'Gabriel S.',  titulo:'O Estrategista',        pos:'ATQ', rar:'lendario', rating:92, ed:'#001',
    stats:[{k:'TÁT',v:96},{k:'ANA',v:93},{k:'LID',v:90}] },
  { id:'carol',    nome:'Carol',       titulo:'A Arquiteta',           pos:'MEI', rar:'lendario', rating:90, ed:'#002',
    stats:[{k:'VIS',v:94},{k:'ORG',v:92},{k:'COM',v:88}] },
  { id:'geovana',  nome:'Geovana',     titulo:'A Artista',             pos:'MDA', rar:'epico',    rating:88, ed:'#003',
    stats:[{k:'CRI',v:97},{k:'DES',v:91},{k:'VEL',v:82}] },
  { id:'elieser',  nome:'Elieser',     titulo:'O Analista',            pos:'VOL', rar:'epico',    rating:87, ed:'#004',
    stats:[{k:'DAD',v:95},{k:'PRE',v:89},{k:'LÓG',v:93}] },
  { id:'deivisson',nome:'Deivisson',   titulo:'O Arquiteto Web',       pos:'DEF', rar:'epico',    rating:86, ed:'#005',
    stats:[{k:'COD',v:94},{k:'DES',v:88},{k:'TEC',v:91}] },
  { id:'tochiro',  nome:'Tochiro',     titulo:'O Fantasma',            pos:'MEI', rar:'raro',     rating:75, ed:'#006',
    stats:[{k:'GES',v:78},{k:'TRF',v:80},{k:'FOC',v:72}] },
  { id:'ana_sm',   nome:'Ana',         titulo:'Rainha das Redes',      pos:'LDA', rar:'raro',     rating:74, ed:'#007',
    stats:[{k:'SMD',v:82},{k:'CON',v:78},{k:'CRI',v:75}] },
  { id:'beatriz',  nome:'Beatriz',     titulo:'Criadora de Histórias', pos:'LDE', rar:'raro',     rating:72, ed:'#008',
    stats:[{k:'CON',v:80},{k:'CRV',v:76},{k:'CLM',v:74}] },
]

const UNLOCK_KEY = (userId) => `copa_2026_unlocked_${userId || 'anon'}`
const THRESHOLD  = 100000

// ── CSS keyframes (injetados uma vez) ─────────────────────────────────────────
const KEYFRAMES = `
  @keyframes rainbow-border {
    0%   { border-color: #ff4444; box-shadow: 0 0 28px rgba(255,68,68,0.7),  0 0 60px rgba(255,68,68,0.2);  }
    16%  { border-color: #ffaa00; box-shadow: 0 0 28px rgba(255,170,0,0.7),  0 0 60px rgba(255,170,0,0.2);  }
    33%  { border-color: #44ff44; box-shadow: 0 0 28px rgba(68,255,68,0.7),  0 0 60px rgba(68,255,68,0.2);  }
    50%  { border-color: #00aaff; box-shadow: 0 0 28px rgba(0,170,255,0.7),  0 0 60px rgba(0,170,255,0.2);  }
    66%  { border-color: #cc44ff; box-shadow: 0 0 28px rgba(204,68,255,0.7), 0 0 60px rgba(204,68,255,0.2); }
    83%  { border-color: #ff44aa; box-shadow: 0 0 28px rgba(255,68,170,0.7), 0 0 60px rgba(255,68,170,0.2); }
    100% { border-color: #ff4444; box-shadow: 0 0 28px rgba(255,68,68,0.7),  0 0 60px rgba(255,68,68,0.2);  }
  }
  @keyframes foil-sweep {
    0%   { transform: translateX(-110%) skewX(-20deg); }
    100% { transform: translateX(220%)  skewX(-20deg); }
  }
  @keyframes pulse-glow {
    0%,100% { opacity:0.6 } 50% { opacity:1 }
  }
`

// ── Card individual ───────────────────────────────────────────────────────────
function CartaCopaCard({ carta, index, isUnlocked }) {
  const [tilt, setTilt]   = useState({ x:0, y:0 })
  const [hov, setHov]     = useState(false)
  const cardRef           = useRef(null)
  const r                 = RAR[carta.rar]
  const Svg               = AVATAR_BY_ID[carta.id]
  const starsFilled       = { raro:3, epico:4, lendario:5 }[carta.rar]

  const parts = useMemo(() =>
    Array.from({ length: carta.rar==='lendario' ? 12 : carta.rar==='epico' ? 8 : 5 }).map(() => ({
      w: 1.5 + Math.random() * 2.5,
      left: 5 + Math.random() * 90,
      dur:  0.9 + Math.random() * 1.1,
      delay: Math.random() * 1.2,
      rise: 60 + Math.random() * 80,
    })),
  [carta.id])

  function onMove(e) {
    const rc = cardRef.current?.getBoundingClientRect()
    if (!rc) return
    setTilt({ x:((e.clientX-rc.left)/rc.width-0.5)*22, y:-((e.clientY-rc.top)/rc.height-0.5)*22 })
  }

  // cartas lendárias: partículas sutis mesmo sem hover quando desbloqueadas
  const idleParticles = isUnlocked && carta.rar === 'lendario'

  const borderStyle = isUnlocked
    ? { animation: 'rainbow-border 3s linear infinite', border: '2px solid #ff4444' }
    : { border: r.border, boxShadow: r.glow }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index*0.06, duration:0.3 }}
      onMouseMove={isUnlocked ? onMove : undefined}
      onMouseLeave={() => { setTilt({x:0,y:0}); setHov(false) }}
      onMouseEnter={() => setHov(true)}
      style={{ perspective:900, cursor: isUnlocked ? 'pointer' : 'default', flexShrink:0 }}
    >
      <motion.div
        animate={{ rotateY: isUnlocked ? tilt.x : 0, rotateX: isUnlocked ? tilt.y : 0, scale: isUnlocked && hov ? 1.08 : 1 }}
        transition={{ type:'spring', stiffness:260, damping:20 }}
        style={{
          transformStyle:'preserve-3d',
          width:182, height:290,
          borderRadius:16,
          background: r.bg,
          position:'relative', overflow:'hidden',
          ...borderStyle,
        }}
      >
        {/* Partículas idle (lendário desbloqueado) */}
        {idleParticles && parts.map((p,i) => (
          <motion.span key={`idle-${i}`}
            style={{
              position:'absolute', borderRadius:'50%', pointerEvents:'none',
              width:p.w, height:p.w, background:r.rating,
              left:`${p.left}%`, bottom:'5%', zIndex:10, opacity:0.7,
            }}
            animate={{ y:[0,-p.rise], opacity:[0.7,0] }}
            transition={{ duration:p.dur, repeat:Infinity, delay:p.delay, repeatDelay: 0.5 + Math.random() }}
          />
        ))}

        {/* Partículas hover (todos os desbloqueados) */}
        {isUnlocked && hov && parts.map((p,i) => (
          <motion.span key={`hov-${i}`}
            style={{
              position:'absolute', borderRadius:'50%', pointerEvents:'none',
              width:p.w+1, height:p.w+1, background:r.rating,
              left:`${p.left}%`, bottom:'5%', zIndex:10,
            }}
            animate={{ y:[0,-p.rise-20], opacity:[0.9,0] }}
            transition={{ duration:p.dur*0.85, repeat:Infinity, delay:p.delay*0.5 }}
          />
        ))}

        {/* Auto-shimmer (desbloqueado, loop) */}
        {isUnlocked && (
          <motion.div
            key={`shimmer-${carta.id}`}
            style={{
              position:'absolute', inset:0, zIndex:8, pointerEvents:'none',
              background:`linear-gradient(105deg,transparent 25%,${r.shimmer} 50%,transparent 75%)`,
              width:'50%', top:0, bottom:0,
            }}
            animate={{ transform:['translateX(-110%) skewX(-20deg)', 'translateX(320%) skewX(-20deg)'] }}
            transition={{ duration: carta.rar==='lendario' ? 2.5 : 3.5, repeat:Infinity, repeatDelay: carta.rar==='lendario' ? 1 : 2, ease:'easeInOut' }}
          />
        )}

        {/* Rainbow foil overlay (lendário desbloqueado) */}
        {isUnlocked && carta.rar==='lendario' && (
          <motion.div
            style={{
              position:'absolute', inset:0, zIndex:7, pointerEvents:'none', borderRadius:16,
              background:'linear-gradient(125deg,rgba(255,40,40,0.06),rgba(255,180,0,0.09),rgba(0,210,90,0.06),rgba(0,130,255,0.09),rgba(200,0,255,0.06))',
              animation:'pulse-glow 2s ease-in-out infinite',
            }}
          />
        )}

        {/* ── LOCKED STATE ── */}
        {!isUnlocked && (
          <div style={{
            position:'absolute', inset:0, zIndex:20, borderRadius:16,
            background:'linear-gradient(180deg,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.92) 100%)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:10,
          }}>
            {/* Prévia borrada visível por baixo */}
            <motion.div
              style={{ fontSize:36, filter:'drop-shadow(0 0 16px rgba(255,223,0,0.6))' }}
              animate={{ scale:[1,1.08,1], rotate:[-3,3,-3] }}
              transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}>
              ⛓️
            </motion.div>
            <div style={{ textAlign:'center', padding:'0 16px' }}>
              <p style={{ fontSize:11, fontWeight:900, color:r.rating, letterSpacing:'0.05em', lineHeight:1.2 }}>
                CARTA BLOQUEADA
              </p>
              <p style={{ fontSize:8, color:'rgba(255,255,255,0.45)', marginTop:4, letterSpacing:'0.04em' }}>
                Acumule
              </p>
              <p style={{ fontSize:16, fontWeight:900, color:'#FFDF00', textShadow:'0 0 12px rgba(255,223,0,0.6)' }}>
                100.000 ons
              </p>
              <p style={{ fontSize:8, color:'rgba(255,255,255,0.35)', marginTop:2 }}>
                para desbloquear permanentemente
              </p>
            </div>
            <div style={{ padding:'3px 10px', borderRadius:20,
              background:'rgba(255,223,0,0.12)', border:'1px solid rgba(255,223,0,0.25)',
              fontSize:8, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:'0.06em' }}>
              {carta.ed} · EDIÇÃO LIMITADA
            </div>
          </div>
        )}

        {/* ── HEADER ── */}
        <div style={{ height:130, position:'relative', overflow:'hidden', background:r.headerBg }}>
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`radial-gradient(ellipse at 70% 15%,rgba(255,255,255,0.16),transparent 55%), radial-gradient(ellipse at 20% 85%,rgba(0,0,0,0.25),transparent 50%)`,
          }} />

          {/* Rating + posição */}
          <div style={{ position:'absolute', top:8, left:10, zIndex:4 }}>
            <div style={{ fontSize:28, fontWeight:900, lineHeight:1, color: isUnlocked ? r.rating : 'rgba(255,255,255,0.2)',
              textShadow: isUnlocked ? `0 0 14px ${r.rating}80` : 'none' }}>
              {isUnlocked ? carta.rating : '??'}
            </div>
            <div style={{ fontSize:8.5, fontWeight:800, color: isUnlocked ? r.rating : 'rgba(255,255,255,0.2)',
              letterSpacing:'0.07em', opacity:0.9 }}>
              {isUnlocked ? carta.pos : '???'}
            </div>
          </div>

          {/* Estrelas */}
          <div style={{ position:'absolute', top:9, right:8, display:'flex', gap:1, zIndex:4 }}>
            {Array.from({length:5}).map((_,i) => (
              <span key={i} style={{ fontSize:7.5, color: isUnlocked ? r.rating : 'rgba(255,255,255,0.15)',
                opacity: i < starsFilled ? 1 : 0.18 }}>★</span>
            ))}
          </div>

          {/* Avatar */}
          {Svg && (
            <div style={{
              position:'absolute', bottom:-2, left:'50%',
              transform:'translateX(-50%)',
              width:96, height:116,
              filter: isUnlocked
                ? `drop-shadow(0 4px 12px rgba(0,0,0,0.6)) drop-shadow(0 0 10px ${r.rating}50)`
                : 'brightness(0.15) blur(2px)',
              zIndex:3,
            }}>
              <Svg />
            </div>
          )}
        </div>

        {/* Rarity badge */}
        <div style={{
          position:'absolute', top:133, right:8,
          padding:'1.5px 5px', borderRadius:4,
          background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)', zIndex:6,
        }}>
          <span style={{ fontSize:6.5, fontWeight:900, color: isUnlocked ? r.rating : 'rgba(255,255,255,0.3)',
            letterSpacing:'0.07em' }}>
            {r.label}
          </span>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding:'8px 11px 4px', position:'relative', zIndex:2,
          filter: isUnlocked ? 'none' : 'blur(3px) brightness(0.3)' }}>
          <div style={{ borderBottom:`1px solid ${r.bar}28`, paddingBottom:6, marginBottom:6 }}>
            <p style={{ fontSize:12, fontWeight:900, color:r.name, letterSpacing:'0.02em', lineHeight:1.1 }}>
              {carta.nome}
            </p>
            <p style={{ fontSize:7.5, fontWeight:700, color:r.label, letterSpacing:'0.05em', marginTop:1.5, opacity:0.85 }}>
              "{carta.titulo}"
            </p>
          </div>

          {carta.stats.map(({k,v}) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
              <span style={{ fontSize:7, fontWeight:800, color:r.label, width:22, flexShrink:0 }}>{k}</span>
              <span style={{ fontSize:8, fontWeight:900, color:r.rating, width:18, textAlign:'right', flexShrink:0 }}>{v}</span>
              <div style={{ flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <motion.div
                  style={{ height:'100%', borderRadius:2, background:`linear-gradient(90deg,${r.bar},${r.rating})` }}
                  initial={{ width:0 }}
                  animate={{ width: isUnlocked ? `${v}%` : '0%' }}
                  transition={{ duration:0.9, delay:index*0.05+0.35, ease:[0.22,1,0.36,1] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'7px 10px',
          background:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.8) 100%)',
          display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:3,
          filter: isUnlocked ? 'none' : 'blur(2px) brightness(0.3)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ fontSize:11, lineHeight:1 }}>⚽</span>
            <div>
              <p style={{ fontSize:6.5, fontWeight:900, color:r.rating, letterSpacing:'0.07em', lineHeight:1.15 }}>
                COPA TRÁFEGON
              </p>
              <p style={{ fontSize:5.5, color:'rgba(255,255,255,0.38)', letterSpacing:'0.05em' }}>
                2026 · EDIÇÃO LIMITADA
              </p>
            </div>
          </div>
          <span style={{ fontSize:8.5, fontWeight:900, color:r.rating, opacity:0.65, letterSpacing:'0.04em' }}>
            {carta.ed}
          </span>
        </div>

        {/* "DESBLOQUEADA" holographic stamp (só unlocked, lendário) */}
        {isUnlocked && carta.rar === 'lendario' && (
          <div style={{
            position:'absolute', top:14, left:-22, width:100, textAlign:'center',
            background:'linear-gradient(90deg,#ff4444,#ffaa00,#44ff44,#00aaff)',
            backgroundSize:'200%', animation:'rainbow-border 2s linear infinite',
            padding:'2px 0', transform:'rotate(-40deg)', zIndex:9,
            fontSize:6.5, fontWeight:900, color:'#000', letterSpacing:'0.08em',
            boxShadow:'0 2px 8px rgba(0,0,0,0.6)',
          }}>
            DESBLOQUEADA
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Seção principal ───────────────────────────────────────────────────────────
export default function CartasCopaSection({ userOns = 0, userId = null }) {
  // Persiste desbloqueio permanentemente por usuário
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try { return !!localStorage.getItem(UNLOCK_KEY(userId)) } catch { return false }
  })

  useEffect(() => {
    if (!isUnlocked && userOns >= THRESHOLD) {
      try { localStorage.setItem(UNLOCK_KEY(userId), '1') } catch {}
      setIsUnlocked(true)
    }
  }, [userOns, isUnlocked, userId])

  return (
    <>
      <style>{KEYFRAMES}</style>

      <motion.div
        initial={{ opacity:0, y:10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.12 }}
        style={{ marginBottom:32 }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
          <div style={{
            width:34, height:34, borderRadius:10, flexShrink:0,
            background:'linear-gradient(135deg,#5c3a00,#c89a00)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:17, boxShadow:'0 4px 16px rgba(200,154,0,0.5)',
          }}>⚽</div>
          <div>
            <p style={{ fontSize:14, fontWeight:900, color:'#1a1d2e', lineHeight:1.1 }}>
              Cartas Colecionáveis
            </p>
            <p style={{ fontSize:10, color:'#8890b5', marginTop:1 }}>
              Copa Tráfegon 2026 · Edição Limitada Jun-Jul
            </p>
          </div>
          <div style={{
            marginLeft:'auto', padding:'4px 12px', borderRadius:20, flexShrink:0,
            background: isUnlocked
              ? 'linear-gradient(90deg,#ff4444,#ffaa00,#44ff44,#00aaff,#cc44ff)'
              : 'linear-gradient(90deg,#5c3a00,#c89a00)',
            backgroundSize:'200%',
            animation: isUnlocked ? 'rainbow-border 3s linear infinite' : 'none',
            fontSize:8.5, fontWeight:900, color: isUnlocked ? '#000' : '#fff',
            letterSpacing:'0.07em', whiteSpace:'nowrap',
            boxShadow: isUnlocked ? '0 2px 14px rgba(255,170,0,0.5)' : '0 2px 10px rgba(200,154,0,0.35)',
          }}>
            {isUnlocked ? '★ COLEÇÃO DESBLOQUEADA' : `🔒 ${THRESHOLD.toLocaleString('pt-BR')} ons para desbloquear`}
          </div>
        </div>

        {/* Barra de progresso para unlock (se não desbloqueado) */}
        {!isUnlocked && (
          <div style={{ marginBottom:14, padding:'10px 14px', borderRadius:12,
            background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:9, fontWeight:800, color:'#8890b5', letterSpacing:'0.05em' }}>
                PROGRESSO PARA DESBLOQUEAR
              </span>
              <span style={{ fontSize:9, fontWeight:900, color:'#c89a00' }}>
                {userOns.toLocaleString('pt-BR')} / {THRESHOLD.toLocaleString('pt-BR')} ons
              </span>
            </div>
            <div style={{ height:4, borderRadius:2, background:'rgba(0,0,0,0.08)', overflow:'hidden' }}>
              <motion.div
                style={{ height:'100%', borderRadius:2, background:'linear-gradient(90deg,#c89a00,#fde68a)' }}
                animate={{ width:`${Math.min(100, (userOns/THRESHOLD)*100)}%` }}
                transition={{ duration:1, ease:[0.22,1,0.36,1] }}
              />
            </div>
          </div>
        )}

        {/* Cards */}
        <div style={{
          display:'flex', gap:14,
          overflowX:'auto', paddingBottom:14,
          scrollbarWidth:'none', msOverflowStyle:'none',
          WebkitOverflowScrolling:'touch',
        }}>
          {CARTAS.map((carta, i) => (
            <CartaCopaCard key={carta.id} carta={carta} index={i} isUnlocked={isUnlocked} />
          ))}
        </div>

        <p style={{ fontSize:9, color:'#8890b5', textAlign:'center', marginTop:4, letterSpacing:'0.04em' }}>
          {isUnlocked
            ? '✦ Coleção desbloqueada permanentemente · 8 cartas exclusivas Copa Tráfegon 2026'
            : '8 cartas colecionáveis · bloqueadas · acumule 100.000 ons para desbloquear para sempre'}
        </p>
      </motion.div>
    </>
  )
}
