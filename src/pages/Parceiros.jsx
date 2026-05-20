import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Star, Phone, MessageSquare, Globe, MapPin, ChevronRight, X, Handshake, Camera, Smartphone, Palette, Video, Share2, Code, Package } from 'lucide-react'

const CATEGORIES = [
  { id: 'todos',       label: 'Todos' },
  { id: 'fotografia',  label: 'Fotografia' },
  { id: 'video',       label: 'Vídeo & Produção' },
  { id: 'social',      label: 'Social Media' },
  { id: 'design',      label: 'Identidade Visual' },
  { id: 'app',         label: 'Criação de Apps' },
  { id: 'software',    label: 'Software & Tech' },
  { id: 'outros',      label: 'Outros' },
]

const CATEGORY_CONFIG = {
  fotografia: { icon: Camera,      color: '#ea8a29', label: 'Fotografia' },
  video:      { icon: Video,        color: '#ef4444', label: 'Vídeo & Produção' },
  social:     { icon: Share2,       color: '#be29ec', label: 'Social Media' },
  design:     { icon: Palette,      color: '#60a5fa', label: 'Identidade Visual' },
  app:        { icon: Smartphone,   color: '#6eda2c', label: 'Criação de Apps' },
  software:   { icon: Code,         color: '#22d3ee', label: 'Software & Tech' },
  outros:     { icon: Package,      color: '#8890b5', label: 'Outros' },
}

const PARTNERS = [
  {
    id: 1, name: 'Studio Lumina', category: 'fotografia',
    description: 'Estúdio especializado em fotografia comercial, produto e fashion. Atende todo o estado de SC.',
    location: 'Blumenau, SC', phone: '+5547991234001', site: 'studioumina.com.br',
    rating: 4.9, reviews: 34, commission: '10%',
    services: ['Foto produto', 'Ensaio fashion', 'Foto corporativa', 'Foto gastronômica'],
    badge: 'Parceiro Premium',
  },
  {
    id: 2, name: 'FrameOn Produções', category: 'video',
    description: 'Produtora de conteúdo em vídeo — Reels, TikTok, YouTube e vídeos institucionais.',
    location: 'Joinville, SC', phone: '+5547991234002', site: 'frameon.com.br',
    rating: 4.8, reviews: 27, commission: '12%',
    services: ['Reels / TikTok', 'Vídeo institucional', 'Motion graphics', 'Edição de conteúdo'],
    badge: 'Parceiro Verificado',
  },
  {
    id: 3, name: 'Social Roots', category: 'social',
    description: 'Gestão de redes sociais para empresas locais com foco em engajamento e crescimento orgânico.',
    location: 'Balneário Camboriú, SC', phone: '+5547991234003', site: 'socialroots.com.br',
    rating: 4.7, reviews: 19, commission: '8%',
    services: ['Gestão Instagram', 'Gestão Facebook', 'Criação de conteúdo', 'Stories diários'],
    badge: null,
  },
  {
    id: 4, name: 'Branding SC', category: 'design',
    description: 'Agência de design especializada em identidade visual, branding e materiais gráficos.',
    location: 'Florianópolis, SC', phone: '+5547991234004', site: 'brandingsc.com.br',
    rating: 5.0, reviews: 42, commission: '10%',
    services: ['Logotipo', 'Manual de marca', 'Papelaria', 'Packaging'],
    badge: 'Parceiro Premium',
  },
  {
    id: 5, name: 'AppForge', category: 'app',
    description: 'Desenvolvimento de aplicativos mobile e sistemas web para pequenas e médias empresas.',
    location: 'Remoto', phone: '+5547991234005', site: 'appforge.com.br',
    rating: 4.6, reviews: 15, commission: '15%',
    services: ['App iOS & Android', 'Sistema web', 'Cardápio digital', 'App de delivery'],
    badge: null,
  },
  {
    id: 6, name: 'TechSC Sistemas', category: 'software',
    description: 'Desenvolvimento de sistemas de gestão, ERP e automações para empresas em crescimento.',
    location: 'Joinville, SC', phone: '+5547991234006', site: 'techsc.com.br',
    rating: 4.8, reviews: 23, commission: '12%',
    services: ['CRM personalizado', 'ERP', 'Automações', 'Integrações API'],
    badge: 'Parceiro Verificado',
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10} className={i <= Math.round(rating) ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-border'} />
      ))}
      <span className="text-[10px] font-bold text-text ml-1">{rating}</span>
    </div>
  )
}

function PartnerModal({ partner, onClose }) {
  const cat = CATEGORY_CONFIG[partner.category]

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.color + '18' }}>
                  <cat.icon size={20} style={{ color: cat.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-text">{partner.name}</h2>
                    {partner.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: cat.color + '15', color: cat.color }}>
                        {partner.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={partner.rating} />
                    <span className="text-[10px] text-muted">({partner.reviews} avaliações)</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-muted hover:text-text-2 p-1 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-muted">{partner.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-bg rounded-xl p-3">
                <p className="text-muted mb-0.5">Localização</p>
                <p className="font-semibold text-text flex items-center gap-1"><MapPin size={11} /> {partner.location}</p>
              </div>
              <div className="bg-bg rounded-xl p-3">
                <p className="text-muted mb-0.5">Comissão parceiro</p>
                <p className="font-bold text-accent text-base">{partner.commission}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-text-2 mb-2">Serviços oferecidos</p>
              <div className="flex flex-wrap gap-1.5">
                {partner.services.map(s => (
                  <span key={s} className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-border text-muted">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a href={`tel:${partner.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-xl border border-border text-muted hover:text-text-2 hover:bg-bg transition-colors">
                <Phone size={13} /> Ligar
              </a>
              <a href={`https://wa.me/${partner.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-xl bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366]/20 transition-colors">
                <MessageSquare size={13} /> WhatsApp
              </a>
              {partner.site && (
                <a href={`https://${partner.site}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                  <Globe size={13} /> Site
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function PartnerCard({ partner, index }) {
  const [open, setOpen] = useState(false)
  const cat = CATEGORY_CONFIG[partner.category]
  const CatIcon = cat.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        onClick={() => setOpen(true)}
        className="bg-white border border-border rounded-2xl p-4 cursor-pointer"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)' }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: cat.color + '18' }}>
            <CatIcon size={17} style={{ color: cat.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-text">{partner.name}</p>
              {partner.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: cat.color + '15', color: cat.color }}>
                  {partner.badge}
                </span>
              )}
            </div>
            <StarRating rating={partner.rating} />
          </div>
        </div>

        <p className="text-xs text-muted mb-3 line-clamp-2">{partner.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={10} /> {partner.location.split(',')[0]}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-accent">
            Comissão: {partner.commission} <ChevronRight size={11} />
          </div>
        </div>
      </motion.div>

      {open && <PartnerModal partner={partner} onClose={() => setOpen(false)} />}
    </>
  )
}

export default function Parceiros() {
  const [category, setCategory] = useState('todos')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = PARTNERS.filter(p => {
    const matchCat = category === 'todos' || p.category === category
    const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-2">
              <Handshake size={20} className="text-accent" /> Parceiros
            </h1>
            <p className="text-sm text-muted mt-0.5">Prestadores de serviços complementares para oferecer aos clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Plus size={14} /> Indicar parceiro
          </motion.button>
        </div>

        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar parceiros..."
            className="w-full bg-white border border-border rounded-xl pl-8 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                category === cat.id
                  ? 'bg-accent text-[#15172a]'
                  : 'bg-white border border-border text-muted hover:text-text-2'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Parceiros ativos', value: PARTNERS.length, color: '#6eda2c' },
          { label: 'Premium',           value: PARTNERS.filter(p => p.badge === 'Parceiro Premium').length, color: '#ea8a29' },
          { label: 'Categorias',        value: CATEGORIES.length - 1, color: '#60a5fa' },
          { label: 'Avaliação média',   value: (PARTNERS.reduce((s, p) => s + p.rating, 0) / PARTNERS.length).toFixed(1) + '★', color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] text-muted mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => <PartnerCard key={p.id} partner={p} index={i} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted text-sm">
            Nenhum parceiro encontrado.
          </div>
        )}
      </div>

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
                <h2 className="text-sm font-bold text-text">Indicar novo parceiro</h2>
                <button onClick={() => setShowAdd(false)} className="text-muted hover:text-text-2 transition-colors"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Nome da empresa', placeholder: 'Ex: Studio Lumina' },
                  { label: 'Telefone / WhatsApp', placeholder: '+55 47 9 9999-0000' },
                  { label: 'Site', placeholder: 'exemplo.com.br' },
                  { label: 'Descrição dos serviços', placeholder: 'O que essa empresa oferece?' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-text-2 mb-1.5">{f.label}</label>
                    <input placeholder={f.placeholder}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-text-2 mb-1.5">Categoria</label>
                  <select className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50">
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 text-sm text-muted border border-border rounded-xl py-2.5 font-semibold hover:bg-bg transition-colors">
                  Cancelar
                </button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAdd(false)}
                  className="flex-1 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold rounded-xl py-2.5 transition-all">
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
