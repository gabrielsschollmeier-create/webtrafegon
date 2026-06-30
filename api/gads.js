const ADS_API_VERSION = 'v21'

// Extrai o erro específico do Google Ads (campo + código + mensagem), que vem
// aninhado em error.details[].errors[] — não na mensagem genérica do topo.
function formatGadsError(data, fallback) {
  const err = data?.error
  if (!err) return fallback
  const details = Array.isArray(err.details) ? err.details : []
  const msgs = []
  for (const d of details) {
    for (const e of (Array.isArray(d.errors) ? d.errors : [])) {
      const campo = Array.isArray(e.location?.fieldPathElements)
        ? e.location.fieldPathElements.map(f => f.fieldName).filter(Boolean).join('.')
        : ''
      const code = e.errorCode ? Object.values(e.errorCode)[0] : ''
      msgs.push([campo && `campo "${campo}"`, code, e.message].filter(Boolean).join(' — '))
    }
  }
  return msgs.length ? msgs.join(' | ') : (err.message || fallback)
}

async function getAccessToken(clientId, clientSecret, refreshToken) {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(`OAuth2: ${data.error_description || data.error}`)
  return data.access_token
}

async function gadsQuery(accessToken, developerToken, mccId, customerId, query) {
  const cid = String(customerId).replace(/-/g, '')
  const url = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${cid}/googleAds:search`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': String(mccId).replace(/-/g, ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(formatGadsError(data, `Google Ads API ${resp.status}`))
  return data.results || []
}

async function gadsMutate(accessToken, developerToken, mccId, customerId, resource, operations) {
  const cid = String(customerId).replace(/-/g, '')
  const url = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${cid}/${resource}:mutate`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': String(mccId).replace(/-/g, ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operations }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(formatGadsError(data, `Google Ads mutate ${resp.status}`))
  return data
}

function calcDates(dias) {
  const hoje = new Date()
  const dataFim    = hoje.toISOString().split('T')[0]
  const dataInicio = new Date(hoje.getTime() - Number(dias) * 86400000).toISOString().split('T')[0]
  return { dataInicio, dataFim }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })

  const {
    GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
    GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID,
  } = process.env

  if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_DEVELOPER_TOKEN) {
    return res.status(500).json({ erro: 'Credenciais Google Ads não configuradas no servidor Vercel' })
  }

  const { action, customerId, customerIds, dias = 30 } = req.body || {}

  try {
    const token = await getAccessToken(GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN)
    const cid = customerId ? String(customerId).replace(/-/g, '') : null

    // ── Lista campanhas ──────────────────────────────────────────────────────
    if (action === 'campanhas') {
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT campaign.id, campaign.name, campaign.status,
               campaign_budget.amount_micros, campaign.advertising_channel_type
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `)
      return res.status(200).json(rows.map(r => ({
        id:               r.campaign?.id,
        nome:             r.campaign?.name,
        status:           r.campaign?.status,
        orcamento_diario: r.campaignBudget?.amountMicros
          ? (Number(r.campaignBudget.amountMicros) / 1_000_000).toFixed(2)
          : null,
        tipo:             r.campaign?.advertisingChannelType,
      })))
    }

    // ── Performance de um cliente ────────────────────────────────────────────
    if (action === 'performance') {
      const { dataInicio: di, dataFim: df } = req.body
      const { dataInicio: diCalc, dataFim: dfCalc } = calcDates(dias)
      const dataInicio = di || diCalc
      const dataFim    = df || dfCalc
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT campaign.id, campaign.name, campaign.status,
               metrics.impressions, metrics.clicks, metrics.ctr,
               metrics.average_cpc, metrics.cost_micros,
               metrics.conversions, metrics.cost_per_conversion
        FROM campaign
        WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
          AND campaign.status != 'REMOVED'
      `)
      return res.status(200).json(rows.map(r => ({
        id:          r.campaign?.id,
        nome:        r.campaign?.name,
        status:      r.campaign?.status,
        impressoes:  Number(r.metrics?.impressions || 0),
        cliques:     Number(r.metrics?.clicks || 0),
        ctr:         parseFloat(((r.metrics?.ctr || 0) * 100).toFixed(2)),
        cpc_medio:   parseFloat((Number(r.metrics?.averageCpc || 0) / 1_000_000).toFixed(2)),
        custo_total: parseFloat((Number(r.metrics?.costMicros || 0) / 1_000_000).toFixed(2)),
        conversoes:  Number(r.metrics?.conversions || 0),
        cpa:         Number(r.metrics?.conversions || 0) > 0
          ? parseFloat((Number(r.metrics?.costPerConversion || 0) / 1_000_000).toFixed(2))
          : null,
      })))
    }

    // ── Carteira completa (múltiplos clientes) ───────────────────────────────
    if (action === 'carteira') {
      const ids = Array.isArray(customerIds) ? customerIds : []
      const { dataInicio: di2, dataFim: df2 } = req.body
      const { dataInicio: diCalc2, dataFim: dfCalc2 } = calcDates(dias)
      const dataInicio = di2 || diCalc2
      const dataFim    = df2 || dfCalc2
      const query = `
        SELECT campaign.id, campaign.name, campaign.status,
               metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM campaign
        WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
          AND campaign.status != 'REMOVED'
      `
      const resultados = {}
      for (const id of ids) {
        try {
          const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, id, query)
          const total = { gasto: 0, cliques: 0, impressoes: 0, conversoes: 0 }
          for (const r of rows) {
            total.gasto      += Number(r.metrics?.costMicros || 0) / 1_000_000
            total.cliques    += Number(r.metrics?.clicks || 0)
            total.impressoes += Number(r.metrics?.impressions || 0)
            total.conversoes += Number(r.metrics?.conversions || 0)
          }
          total.gasto = +total.gasto.toFixed(2)
          total.cpl   = total.conversoes > 0 ? +(total.gasto / total.conversoes).toFixed(2) : null
          resultados[id] = total
        } catch (e) {
          resultados[id] = { erro: e.message }
        }
      }
      return res.status(200).json(resultados)
    }

    // ── TERMOS DE PESQUISA (Search Terms Report) ────────────────────────────
    if (action === 'termos_pesquisa') {
      const { campaignId, di: diRaw, df: dfRaw } = req.body
      const { dataInicio: diCalc, dataFim: dfCalc } = calcDates(dias)
      const dataInicio = diRaw || diCalc
      const dataFim    = dfRaw || dfCalc
      const filtro = campaignId
        ? `AND campaign.id = ${campaignId}`
        : ''
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT search_term_view.search_term,
               search_term_view.status,
               campaign.id, campaign.name,
               ad_group.id, ad_group.name,
               metrics.impressions, metrics.clicks, metrics.cost_micros,
               metrics.conversions, metrics.ctr
        FROM search_term_view
        WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
          AND metrics.impressions > 0
          ${filtro}
        ORDER BY metrics.cost_micros DESC
        LIMIT 200
      `)
      return res.status(200).json(rows.map(r => ({
        termo:       r.searchTermView?.searchTerm,
        status:      r.searchTermView?.status,
        campanha_id: r.campaign?.id,
        campanha:    r.campaign?.name,
        grupo_id:    r.adGroup?.id,
        grupo:       r.adGroup?.name,
        impressoes:  Number(r.metrics?.impressions || 0),
        cliques:     Number(r.metrics?.clicks || 0),
        custo:       parseFloat((Number(r.metrics?.costMicros || 0) / 1_000_000).toFixed(2)),
        conversoes:  parseFloat((Number(r.metrics?.conversions || 0)).toFixed(1)),
        ctr:         parseFloat(((r.metrics?.ctr || 0) * 100).toFixed(2)),
        cpl:         Number(r.metrics?.conversions || 0) > 0
          ? parseFloat((Number(r.metrics?.costMicros || 0) / 1_000_000 / Number(r.metrics.conversions)).toFixed(2))
          : null,
      })))
    }

    // ── PAUSAR campanha ──────────────────────────────────────────────────────
    if (action === 'pausar_campanha') {
      const { campaignId } = req.body
      await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'campaigns', [{
        update: { resourceName: `customers/${cid}/campaigns/${campaignId}`, status: 'PAUSED' },
        updateMask: 'status',
      }])
      return res.status(200).json({ sucesso: true, acao: 'pausar_campanha', campaignId })
    }

    // ── ATIVAR campanha ──────────────────────────────────────────────────────
    if (action === 'ativar_campanha') {
      const { campaignId } = req.body
      await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'campaigns', [{
        update: { resourceName: `customers/${cid}/campaigns/${campaignId}`, status: 'ENABLED' },
        updateMask: 'status',
      }])
      return res.status(200).json({ sucesso: true, acao: 'ativar_campanha', campaignId })
    }

    // ── AJUSTAR ORÇAMENTO ────────────────────────────────────────────────────
    if (action === 'ajustar_orcamento') {
      const { campaignId, orcamento_diario } = req.body
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT campaign.id, campaign.campaign_budget, campaign_budget.id, campaign_budget.amount_micros
        FROM campaign
        WHERE campaign.id = ${campaignId}
        LIMIT 1
      `)
      if (!rows.length) throw new Error(`Campanha ${campaignId} não encontrada`)
      const budgetResourceName = rows[0].campaign?.campaignBudget
      if (!budgetResourceName) throw new Error('Budget resource name não encontrado para esta campanha')
      const amountMicros = String(Math.round(Number(orcamento_diario) * 1_000_000))
      await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'campaignBudgets', [{
        update: { resourceName: budgetResourceName, amountMicros },
        updateMask: 'amountMicros',
      }])
      return res.status(200).json({ sucesso: true, acao: 'ajustar_orcamento', campaignId, orcamento_diario })
    }

    // ── NEGATIVAR TERMOS (nível de campanha) ─────────────────────────────────
    if (action === 'negativar_termos') {
      const { campaignId, termos, tipo = 'BROAD' } = req.body
      const lista = Array.isArray(termos) ? termos : [termos]
      const operations = lista.map(termo => ({
        create: {
          campaign: `customers/${cid}/campaigns/${campaignId}`,
          keyword: { text: termo, matchType: tipo },
          negative: true,
        },
      }))
      const result = await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'campaignCriteria', operations)
      return res.status(200).json({ sucesso: true, acao: 'negativar_termos', termos_adicionados: lista.length, resultado: result.results?.length })
    }

    // ── ADICIONAR KEYWORDS (nível de grupo de anúncios) ──────────────────────
    if (action === 'adicionar_keywords') {
      const { adGroupId, keywords, tipo = 'PHRASE' } = req.body
      const lista = Array.isArray(keywords) ? keywords : [keywords]
      const operations = lista.map(kw => ({
        create: {
          adGroup: `customers/${cid}/adGroups/${adGroupId}`,
          keyword: { text: kw, matchType: tipo },
          status: 'ENABLED',
        },
      }))
      const result = await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'adGroupCriteria', operations)
      return res.status(200).json({ sucesso: true, acao: 'adicionar_keywords', keywords_adicionadas: lista.length, resultado: result.results?.length })
    }

    // ── LISTAR GRUPOS DE ANÚNCIOS ────────────────────────────────────────────
    if (action === 'listar_grupos') {
      const { campaignId } = req.body
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT ad_group.id, ad_group.name, ad_group.status
        FROM ad_group
        WHERE ad_group.campaign = 'customers/${cid}/campaigns/${campaignId}'
          AND ad_group.status != 'REMOVED'
        ORDER BY ad_group.name
      `)
      return res.status(200).json(rows.map(r => ({
        id:     r.adGroup?.id,
        nome:   r.adGroup?.name,
        status: r.adGroup?.status,
      })))
    }

    // ── CRIAR CAMPANHA ────────────────────────────────────────────────────────
    if (action === 'criar_campanha') {
      const {
        nome, orcamento_diario,
        tipo = 'SEARCH',
        estrategia_lance = 'MAXIMIZE_CONVERSIONS',
        cpa_alvo,
        rede_busca = true, rede_display = false,
        criar_grupo = false, grupo_nome, grupo_cpc_padrao = 1,
      } = req.body

      const budgetResult = await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'campaignBudgets', [{
        create: {
          name: `Budget | ${nome}`,
          amountMicros: String(Math.round(Number(orcamento_diario) * 1_000_000)),
          deliveryMethod: 'STANDARD',
        }
      }])
      const budgetRN = budgetResult.results?.[0]?.resourceName
      if (!budgetRN) throw new Error('Falha ao criar orçamento — verifique permissões da conta')

      const biddingFields = {}
      if (estrategia_lance === 'MAXIMIZE_CONVERSIONS') {
        biddingFields.maximizeConversions = {}
      } else if (estrategia_lance === 'TARGET_CPA' && cpa_alvo) {
        biddingFields.targetCpa = { targetCpaMicros: String(Math.round(Number(cpa_alvo) * 1_000_000)) }
      } else {
        biddingFields.manualCpc = {}
      }

      const campResult = await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'campaigns', [{
        create: {
          name: nome,
          status: 'PAUSED',
          advertisingChannelType: tipo,
          campaignBudget: budgetRN,
          networkSettings: {
            targetGoogleSearch: rede_busca !== false,
            targetSearchNetwork: rede_busca !== false,
            targetContentNetwork: rede_display === true,
            targetPartnerSearchNetwork: false,
          },
          ...biddingFields,
        }
      }])
      const campRN = campResult.results?.[0]?.resourceName
      if (!campRN) throw new Error('Falha ao criar campanha')
      const campId = campRN.split('/').pop()

      let grupoId = null
      if (criar_grupo && grupo_nome) {
        try {
          const groupResult = await gadsMutate(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, 'adGroups', [{
            create: {
              name: grupo_nome,
              campaign: campRN,
              status: 'ENABLED',
              type: 'SEARCH_STANDARD',
              cpcBidMicros: String(Math.round(Number(grupo_cpc_padrao || 1) * 1_000_000)),
            }
          }])
          const groupRN = groupResult.results?.[0]?.resourceName
          if (groupRN) grupoId = groupRN.split('/').pop()
        } catch (e) {
          console.error('[criar_campanha] adGroup error:', e.message)
        }
      }

      return res.status(200).json({
        sucesso: true, acao: 'criar_campanha',
        campanha_id: campId, campanha_nome: nome,
        budget_id: budgetRN.split('/').pop(),
        grupo_id: grupoId, status: 'PAUSED',
        proximo_passo: grupoId
          ? `Grupo "${grupo_nome}" criado (ID: ${grupoId}). Adicione keywords com adicionar_keywords e crie anúncios RSA no Google Ads Editor.`
          : 'Campanha criada PAUSADA. Crie grupos de anúncios e keywords antes de ativar.',
      })
    }

    return res.status(400).json({ erro: `action inválida: "${action}"` })
  } catch (e) {
    console.error('[api/gads]', e.message)
    return res.status(502).json({ erro: e.message })
  }
}
