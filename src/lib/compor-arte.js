// Escreve o texto do anúncio por cima da imagem gerada pela IA.
// O texto vem do que a pessoa digitou — a IA nunca escreve preço nem CTA.

export const FORMATOS_ARTE = {
  post:  { largura: 1080, altura: 1350, rotulo: 'Post 4:5' },
  story: { largura: 1080, altura: 1920, rotulo: 'Story 9:16' },
}

const FONTE = 'Inter, "Segoe UI", Arial, sans-serif'

function carregarImagem(src) {
  return new Promise((ok, falha) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => ok(img)
    img.onerror = () => falha(new Error('não foi possível carregar a imagem gerada'))
    img.src = src
  })
}

function quebrarLinhas(ctx, texto, larguraMax, maxLinhas) {
  const palavras = String(texto).split(/\s+/).filter(Boolean)
  const linhas = []
  let atual = ''
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p
    if (ctx.measureText(teste).width <= larguraMax || !atual) atual = teste
    else { linhas.push(atual); atual = p }
  }
  if (atual) linhas.push(atual)
  if (linhas.length > maxLinhas) {
    const cortadas = linhas.slice(0, maxLinhas)
    cortadas[maxLinhas - 1] = cortadas[maxLinhas - 1].replace(/\s*\S*$/, '') + '…'
    return cortadas
  }
  return linhas
}

function pilula(ctx, x, y, texto, { fonte, fundo, cor, padX, altura }) {
  ctx.font = fonte
  const w = ctx.measureText(texto).width + padX * 2
  ctx.fillStyle = fundo
  ctx.beginPath()
  ctx.roundRect(x, y, w, altura, altura / 2)
  ctx.fill()
  ctx.fillStyle = cor
  ctx.textBaseline = 'middle'
  ctx.fillText(texto, x + padX, y + altura / 2 + 1)
  return w
}

// Ajusta a fonte do título até caber em no máximo 3 linhas.
function tituloQueCabe(ctx, texto, larguraMax, tamanhoInicial) {
  for (let t = tamanhoInicial; t >= 40; t -= 4) {
    ctx.font = `800 ${t}px ${FONTE}`
    const linhas = quebrarLinhas(ctx, texto, larguraMax, 99)
    if (linhas.length <= 3) return { tamanho: t, linhas }
  }
  ctx.font = `800 40px ${FONTE}`
  return { tamanho: 40, linhas: quebrarLinhas(ctx, texto, larguraMax, 3) }
}

export async function comporArte(imagemSrc, formato, campos, corDestaque = '#6eda2c') {
  const { largura: W, altura: H } = FORMATOS_ARTE[formato]
  if (document.fonts?.ready) { try { await document.fonts.ready } catch { /* segue com fonte do sistema */ } }
  const img = await carregarImagem(imagemSrc)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Imagem cobrindo o quadro inteiro (corta as sobras, sem distorcer).
  const escala = Math.max(W / img.width, H / img.height)
  const iw = img.width * escala, ih = img.height * escala
  ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih)

  // Escurece a base para o texto ser legível sobre qualquer imagem.
  const inicioDegrade = H * (formato === 'story' ? 0.45 : 0.38)
  const deg = ctx.createLinearGradient(0, inicioDegrade, 0, H)
  deg.addColorStop(0, 'rgba(0,0,0,0)')
  deg.addColorStop(0.45, 'rgba(0,0,0,0.62)')
  deg.addColorStop(1, 'rgba(0,0,0,0.88)')
  ctx.fillStyle = deg
  ctx.fillRect(0, inicioDegrade, W, H - inicioDegrade)

  const M = 72
  const larguraTexto = W - M * 2
  const seguroBase = formato === 'story' ? 210 : 80  // story: área livre da interface do Instagram

  // Selo no topo.
  if (campos.selo?.trim()) {
    pilula(ctx, M, formato === 'story' ? 220 : 64, campos.selo.trim().toUpperCase(), {
      fonte: `800 30px ${FONTE}`, fundo: corDestaque, cor: '#0d0f1a', padX: 26, altura: 64,
    })
  }

  // Monta o bloco de baixo para cima, para o CTA ficar sempre no mesmo lugar.
  let y = H - seguroBase

  if (campos.cta?.trim()) {
    const altura = 92
    y -= altura
    ctx.font = `800 36px ${FONTE}`
    const texto = campos.cta.trim()
    const w = Math.min(larguraTexto, ctx.measureText(texto).width + 96)
    ctx.fillStyle = corDestaque
    ctx.beginPath()
    ctx.roundRect(M, y, w, altura, altura / 2)
    ctx.fill()
    ctx.fillStyle = '#0d0f1a'
    ctx.textBaseline = 'middle'
    ctx.fillText(texto, M + 48, y + altura / 2 + 1)
    y -= 40
  }

  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'

  if (campos.condicao?.trim()) {
    ctx.font = `500 30px ${FONTE}`
    ctx.fillStyle = 'rgba(255,255,255,0.82)'
    ctx.fillText(campos.condicao.trim(), M, y)
    y -= 46
  }

  if (campos.preco?.trim()) {
    ctx.font = `900 84px ${FONTE}`
    ctx.fillStyle = corDestaque
    ctx.fillText(campos.preco.trim(), M, y)
    y -= 104
  }

  if (campos.subheadline?.trim()) {
    ctx.font = `500 36px ${FONTE}`
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    const linhas = quebrarLinhas(ctx, campos.subheadline.trim(), larguraTexto, 2)
    for (let i = linhas.length - 1; i >= 0; i--) { ctx.fillText(linhas[i], M, y); y -= 48 }
    y -= 12
  }

  if (campos.headline?.trim()) {
    const { tamanho, linhas } = tituloQueCabe(ctx, campos.headline.trim(), larguraTexto, formato === 'story' ? 84 : 76)
    ctx.font = `800 ${tamanho}px ${FONTE}`
    ctx.fillStyle = '#ffffff'
    for (let i = linhas.length - 1; i >= 0; i--) { ctx.fillText(linhas[i], M, y); y -= tamanho * 1.08 }
  }

  return new Promise(ok => canvas.toBlob(blob => ok(blob), 'image/png'))
}
