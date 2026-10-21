// Gera 3 versões de arte com IA a partir de criativos de referência.
//
// A IA cria SÓ a parte visual (cena, produto, composição), sem nenhum texto:
// geradores de imagem erram preço, telefone e acento com frequência, e anúncio
// com preço errado é inaceitável. O texto é escrito por cima no navegador, por
// código, com o que a pessoa digitou — exato.
//
// Custa dinheiro por chamada, então exige sessão válida do hub.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bfyshboqvisnuefeyqdv.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'
const PREFIXO_OK   = `${SUPABASE_URL}/storage/v1/object/public/task-images/`
const MODELO       = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1'
const QUALIDADE    = process.env.OPENAI_IMAGE_QUALITY || 'medium'
const MAX_IMAGENS  = 7

// Cada versão puxa para um lado, para as 3 não saírem quase iguais.
const DIRECOES = [
  'Produto como protagonista absoluto: grande, centralizado, iluminação de estúdio, fundo limpo nas cores das referências.',
  'Produto em contexto de uso real: uma cena ambientada e verossímil que mostre o benefício, com o produto bem visível.',
  'Composição gráfica ousada: formas e cores fortes da paleta das referências, produto menor e bastante espaço livre.',
]

async function usuarioValido(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return false
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  })
  return r.ok
}

async function baixarImagem(url) {
  // Só aceita imagens do próprio bucket do hub: impede o servidor de ser usado
  // para buscar URLs arbitrárias.
  if (!String(url).startsWith(PREFIXO_OK)) throw new Error('referência fora do armazenamento do hub')
  const r = await fetch(url)
  if (!r.ok) throw new Error(`não foi possível ler a referência (${r.status})`)
  const tipo = r.headers.get('content-type') || 'image/png'
  return new Blob([await r.arrayBuffer()], { type: tipo })
}

function montarPrompt({ temFoto, produto, objetivo, obs, direcao }) {
  return [
    'Crie a parte visual de um anúncio vertical para Instagram.',
    temFoto
      ? 'A PRIMEIRA imagem é a foto real do produto: reproduza este produto com fidelidade (forma, cor, rótulo). As demais imagens são criativos de referência que deram resultado.'
      : 'As imagens enviadas são criativos de referência que deram resultado.',
    'Siga o estilo visual das referências: paleta, iluminação, tipo de cena, enquadramento e energia. Não copie nenhuma delas; crie uma composição nova da mesma família.',
    produto ? `Produto: ${produto}.` : '',
    objetivo ? `Objetivo do anúncio: ${objetivo}.` : '',
    `Direção desta versão: ${direcao}`,
    'REGRA ABSOLUTA: a imagem não pode conter NENHUM texto, letra, número, preço, logotipo, marca d\'água ou selo. Se o produto tiver rótulo, mantenha-o, mas não acrescente nenhuma escrita.',
    'Deixe o terço inferior da imagem mais simples e com menos detalhes, porque o texto do anúncio será colocado ali depois.',
    obs ? `Observação de quem pediu: ${obs}` : '',
  ].filter(Boolean).join('\n')
}

async function gerarUma({ imagens, prompt, apiKey }) {
  const form = new FormData()
  form.append('model', MODELO)
  form.append('prompt', prompt)
  form.append('size', '1024x1536')
  form.append('quality', QUALIDADE)
  form.append('n', '1')
  // webp comprimido: 3 PNGs nesse tamanho estourariam o limite de resposta da Vercel.
  form.append('output_format', 'webp')
  form.append('output_compression', '85')
  imagens.forEach((blob, i) => form.append('image[]', blob, `ref-${i}.${(blob.type.split('/')[1] || 'png')}`))

  const r = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data?.error?.message || `OpenAI respondeu ${r.status}`)
  const b64 = data?.data?.[0]?.b64_json
  if (!b64) throw new Error('a OpenAI não devolveu imagem')
  return `data:image/webp;base64,${b64}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Use POST' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(503).json({ erro: 'OPENAI_API_KEY não configurada na Vercel. Peça ao administrador para adicionar a chave.' })

  try {
    if (!(await usuarioValido(req))) return res.status(401).json({ erro: 'Sessão inválida. Saia e entre de novo no hub.' })
  } catch {
    return res.status(401).json({ erro: 'Não foi possível validar a sessão.' })
  }

  const { referencias = [], fotoProduto = null, produto = '', objetivo = '', obs = '' } = req.body || {}
  const urls = [fotoProduto, ...referencias].filter(Boolean)
  if (referencias.length < 3) return res.status(400).json({ erro: 'Envie no mínimo 3 referências.' })
  if (urls.length > MAX_IMAGENS) return res.status(400).json({ erro: `No máximo ${MAX_IMAGENS} imagens por pedido.` })

  let imagens
  try {
    imagens = await Promise.all(urls.map(baixarImagem))
  } catch (e) {
    return res.status(400).json({ erro: e.message })
  }

  const resultados = await Promise.allSettled(DIRECOES.map(direcao =>
    gerarUma({ imagens, apiKey, prompt: montarPrompt({ temFoto: !!fotoProduto, produto, objetivo, obs, direcao }) })
  ))

  const versoes = resultados.map((r, i) => r.status === 'fulfilled'
    ? { ok: true, imagem: r.value, direcao: i }
    : { ok: false, erro: r.reason?.message || 'falhou', direcao: i })

  if (!versoes.some(v => v.ok)) {
    return res.status(502).json({ erro: versoes[0].erro, versoes })
  }
  return res.status(200).json({ versoes })
}
