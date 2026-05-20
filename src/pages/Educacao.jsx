import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, Plus, Search, Lock, CheckCircle2, Clock, ChevronRight, X, Star, Users } from 'lucide-react'

const CATEGORIES = ['Todos', 'Tráfego Pago', 'Copy & Conteúdo', 'Negócios', 'Ferramentas', 'Vendas']

const COURSES = [
  {
    id: 1, title: 'Google Ads do Zero ao Avançado', category: 'Tráfego Pago',
    instructor: 'Gabriel S.', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    audience: 'equipe', duration: '4h 20min', lessons: 12, level: 'Iniciante',
    description: 'Aprenda a criar, otimizar e escalar campanhas no Google Ads com foco em resultados reais.',
    color: '#ea8a29',
    videos: [
      { id: 1, title: 'Introdução ao Google Ads', duration: '12:30', youtubeId: 'dQw4w9WgXcQ', done: true },
      { id: 2, title: 'Estrutura de Campanhas',   duration: '18:45', youtubeId: 'dQw4w9WgXcQ', done: true },
      { id: 3, title: 'Palavras-chave e Match Types', duration: '22:10', youtubeId: 'dQw4w9WgXcQ', done: false },
      { id: 4, title: 'Anúncios RSA de Alta Performance', duration: '15:20', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 2, title: 'Meta Ads: Estratégia e Escala', category: 'Tráfego Pago',
    instructor: 'Gabriel S.', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    audience: 'equipe', duration: '3h 10min', lessons: 9, level: 'Intermediário',
    description: 'Domine o ecossistema Meta Ads — Facebook e Instagram — e aprenda a escalar resultados.',
    color: '#4f6ef7',
    videos: [
      { id: 1, title: 'Pixel e Eventos de Conversão', duration: '20:00', youtubeId: 'dQw4w9WgXcQ', done: false },
      { id: 2, title: 'Públicos: Custom, Lookalike e Interesses', duration: '25:15', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 3, title: 'Copywriting que Converte', category: 'Copy & Conteúdo',
    instructor: 'Ana M.', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    audience: 'ambos', duration: '2h 45min', lessons: 8, level: 'Iniciante',
    description: 'Aprenda os fundamentos do copy persuasivo aplicado a anúncios, landing pages e WhatsApp.',
    color: '#6eda2c',
    videos: [
      { id: 1, title: 'Os 5 Elementos do Copy Matador', duration: '18:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 4, title: 'Resultados para o Cliente: Como Apresentar', category: 'Negócios',
    instructor: 'Gabriel S.', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    audience: 'cliente', duration: '1h 30min', lessons: 5, level: 'Iniciante',
    description: 'Entenda como ler relatórios, interpretar métricas e tirar o máximo da sua parceria com a agência.',
    color: '#be29ec',
    videos: [
      { id: 1, title: 'Entendendo CPL, ROAS e ROI', duration: '15:00', youtubeId: 'dQw4w9WgXcQ', done: false },
      { id: 2, title: 'Como Acompanhar Suas Campanhas', duration: '12:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 5, title: 'Canva para Marketing Digital', category: 'Ferramentas',
    instructor: 'João C.', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    audience: 'equipe', duration: '2h 00min', lessons: 7, level: 'Iniciante',
    description: 'Crie artes profissionais para redes sociais, anúncios e apresentações usando Canva.',
    color: '#22d3ee',
    videos: [
      { id: 1, title: 'Template de Stories que Converte', duration: '10:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
  {
    id: 6, title: 'Técnicas de Fechamento no WhatsApp', category: 'Vendas',
    instructor: 'Gabriel S.', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    audience: 'equipe', duration: '1h 50min', lessons: 6, level: 'Intermediário',
    description: 'Scripts, gatilhos mentais e técnicas para fechar mais vendas diretamente pelo WhatsApp.',
    color: '#25d366',
    videos: [
      { id: 1, title: 'O Script de Abertura Perfeito', duration: '14:00', youtubeId: 'dQw4w9WgXcQ', done: false },
    ],
  },
]

const audienceConfig = {
  equipe:  { label: 'Equipe',       color: '#6eda2c', icon: '👥' },
  cliente: { label: 'Para Clientes', color: '#60a5fa', icon: '🏢' },
  ambos:   { label: 'Todos',        color: '#be29ec', icon: '✨' },
}

const levelConfig = {
  Iniciante:    '#6eda2c',
  Intermediário: '#ea8a29',
  Avançado:     '#ef4444',
}

function CourseModal({ course, onClose }) {
  const done = course.videos.filter(v => v.done).length
  const pct = Math.round((done / course.videos.length) * 100)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          <div className="p-5 border-b border-border flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: course.color + '20' }}>
                <BookOpen size={18} style={{ color: course.color }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text">{course.title}</h2>
                <p className="text-xs text-muted">{course.instructor} · {course.lessons} aulas · {course.duration}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted hover:text-text-2 p-1 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="p-5">
            <p className="text-sm text-muted mb-4">{course.description}</p>

            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-text-2">{done}/{course.videos.length} aulas concluídas</span>
                <span className="font-bold" style={{ color: course.color }}>{pct}%</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}80)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Video list */}
            <div className="space-y-2">
              {course.videos.map((video, i) => (
                <motion.a
                  key={video.id}
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition-colors group"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    video.done ? 'bg-accent/15' : 'bg-border'
                  }`}>
                    {video.done
                      ? <CheckCircle2 size={14} className="text-accent" />
                      : <Play size={12} className="text-muted group-hover:text-text-2" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${video.done ? 'text-muted line-through' : 'text-text'}`}>
                      {i + 1}. {video.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted flex items-center gap-1 flex-shrink-0">
                    <Clock size={10} /> {video.duration}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function CourseCard({ course, index }) {
  const [open, setOpen] = useState(false)
  const aud = audienceConfig[course.audience]
  const done = course.videos.filter(v => v.done).length
  const pct = Math.round((done / course.videos.length) * 100)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        onClick={() => setOpen(true)}
        className="bg-white border border-border rounded-2xl overflow-hidden cursor-pointer"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)' }}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}60)` }} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: aud.color + '15', color: aud.color }}>
                {aud.icon} {aud.label}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: levelConfig[course.level] + '15', color: levelConfig[course.level] }}>
                {course.level}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-text mb-1 leading-snug">{course.title}</h3>
          <p className="text-xs text-muted mb-3 line-clamp-2">{course.description}</p>

          <div className="flex items-center gap-3 text-xs text-muted mb-3">
            <span className="flex items-center gap-1"><Play size={10} /> {course.lessons} aulas</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
            <span className="flex items-center gap-1"><Users size={10} /> {course.instructor}</span>
          </div>

          {pct > 0 && (
            <div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color }} />
              </div>
              <p className="text-[10px] text-muted mt-1">{pct}% concluído</p>
            </div>
          )}
        </div>
      </motion.div>

      {open && <CourseModal course={course} onClose={() => setOpen(false)} />}
    </>
  )
}

export default function Educacao() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [audience, setAudience] = useState('todos')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = COURSES.filter(c => {
    const matchCat = category === 'Todos' || c.category === category
    const matchSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase())
    const matchAud = audience === 'todos' || c.audience === audience || c.audience === 'ambos'
    return matchCat && matchSearch && matchAud
  })

  return (
    <div className="p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-text">Educação</h1>
            <p className="text-sm text-muted mt-0.5">Conteúdos de treinamento para equipe e clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Plus size={14} /> Adicionar aula
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar cursos..."
              className="w-full bg-white border border-border rounded-xl pl-8 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <select
            value={audience} onChange={e => setAudience(e.target.value)}
            className="bg-white border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
          >
            <option value="todos">Para todos</option>
            <option value="equipe">Equipe interna</option>
            <option value="cliente">Para clientes</option>
          </select>
        </div>
      </motion.div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
              category === cat
                ? 'bg-accent text-[#15172a]'
                : 'bg-white border border-border text-muted hover:text-text-2'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Cursos disponíveis', value: COURSES.length, color: '#6eda2c' },
          { label: 'Para equipe',        value: COURSES.filter(c => c.audience !== 'cliente').length, color: '#60a5fa' },
          { label: 'Para clientes',      value: COURSES.filter(c => c.audience !== 'equipe').length, color: '#be29ec' },
          { label: 'Total de aulas',     value: COURSES.reduce((s, c) => s + c.lessons, 0), color: '#ea8a29' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white border border-border rounded-xl p-3 text-center"
          >
            <p className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[11px] text-muted mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">
          Nenhum curso encontrado para os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}

      {/* Add course modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-text">Adicionar nova aula</h2>
                <button onClick={() => setShowAdd(false)} className="text-muted hover:text-text-2 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Título do curso', placeholder: 'Ex: Google Ads Avançado' },
                  { label: 'Link do YouTube', placeholder: 'https://youtube.com/watch?v=...' },
                  { label: 'Instrutor', placeholder: 'Ex: Gabriel S.' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-text-2 mb-1.5">{f.label}</label>
                    <input
                      placeholder={f.placeholder}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Categoria', options: ['Tráfego Pago', 'Copy & Conteúdo', 'Negócios', 'Ferramentas', 'Vendas'] },
                    { label: 'Para quem', options: ['Equipe', 'Clientes', 'Ambos'] },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-bold text-text-2 mb-1.5">{f.label}</label>
                      <select className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50">
                        {f.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 text-sm text-muted border border-border rounded-xl py-2.5 font-semibold hover:bg-bg transition-colors">
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAdd(false)}
                  className="flex-1 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold rounded-xl py-2.5 transition-all"
                >
                  Adicionar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
