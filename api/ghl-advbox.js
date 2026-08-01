// Webhook receiver: GHL → AdvBox
// GHL chama esta rota quando lead é movido para "Lead Qualificado".
// Cria o contato no AdvBox com nome e telefone do lead.
// Variáveis de ambiente necessárias na Vercel: ADVBOX_TOKEN

const ADVBOX_BASE = 'https://app.advbox.com.br/api/v1'
const ADVBOX_USERS_ID = 267687        // Andressa Frozza
const ADVBOX_ORIGIN_ID = 611865       // ANÚNCIO

function extractName(body) {
  return (
    body?.contact?.name ||
    body?.contact?.fullName ||
    body?.contact?.firstName && `${body.contact.firstName} ${body.contact.lastName || ''}`.trim() ||
    body?.full_name ||
    body?.name ||
    body?.opportunity?.contact?.name ||
    'Lead GHL'
  )
}

function extractEmail(body) {
  const c = body?.contact || {}
  return c.email || body?.email || body?.opportunity?.contact?.email || ''
}

function extractPhone(body) {
  const c = body?.contact || {}
  const raw =
    c.phone ||
    c.phoneRaw ||
    c.mobilePhone ||
    c.homePhone ||
    c.workPhone ||
    c.phone1 ||
    c.fullPhoneNumber ||
    body?.phone ||
    body?.opportunity?.contact?.phone ||
    ''
  // GHL envia em E.164 (+556181353650) — AdvBox rejeita o +55, aceita sem prefixo
  return String(raw).replace(/^\+55/, '')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.ADVBOX_TOKEN
  if (!token) return res.status(500).json({ error: 'ADVBOX_TOKEN não configurado' })

  const body = req.body || {}
  console.log('GHL payload:', JSON.stringify(body))
  const name = extractName(body)
  const phone = extractPhone(body)
  const email = extractEmail(body)

  const payload = {
    name,
    users_id: ADVBOX_USERS_ID,
    customers_origins_id: ADVBOX_ORIGIN_ID,
  }
  if (phone) payload.cellphone = phone
  if (email) payload.email = email

  try {
    const r = await fetch(`${ADVBOX_BASE}/customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    })

    const data = await r.json().catch(() => ({}))

    if (!r.ok) {
      return res.status(502).json({ error: `AdvBox ${r.status}`, detail: data, sent: payload })
    }

    return res.status(200).json({ success: true, customers_id: data.customers_id, name, phone, email })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
