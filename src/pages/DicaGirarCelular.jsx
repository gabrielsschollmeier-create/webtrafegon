import { useEffect, useState } from 'react'

// Aviso discreto para quem abre uma apresentação 16:9 no celular em pé.
// Some sozinho ao girar o aparelho e pode ser fechado no toque.
export default function DicaGirarCelular({ cor = '#6eda2c' }) {
  const [mostrar, setMostrar] = useState(false)
  const [fechado, setFechado] = useState(false)

  useEffect(() => {
    const avaliar = () => {
      const estreito = window.innerWidth < 900
      const emPe = window.innerHeight > window.innerWidth
      setMostrar(estreito && emPe)
    }
    avaliar()
    window.addEventListener('resize', avaliar)
    window.addEventListener('orientationchange', avaliar)
    return () => {
      window.removeEventListener('resize', avaliar)
      window.removeEventListener('orientationchange', avaliar)
    }
  }, [])

  if (!mostrar || fechado) return null

  return (
    <button onClick={() => setFechado(true)}
      className="fixed left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2.5 px-4 py-2.5 rounded-full"
      style={{
        bottom: 18,
        background: 'rgba(10,12,20,0.92)',
        border: `1px solid ${cor}55`,
        backdropFilter: 'blur(6px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
      <span className="text-lg leading-none">📱</span>
      <span className="text-white text-[13px] font-bold leading-none">
        Gire o celular para ver melhor
      </span>
      <span className="text-white/40 text-[13px] font-bold leading-none">✕</span>
    </button>
  )
}
