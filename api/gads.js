import { GoogleAdsApi } from 'google-ads-api'

function calcDates(dias) {
  const hoje = new Date()
  const dataFim    = hoje.toISOString().split('T')[0]
  const dataInicio = new Date(hoje.getTime() - Number(dias) * 86400000).toISOString().split('T')[0]
  return { dataInicio, dataFim }
}

function makeGads() {
  return new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  })
}

function getCustomer(gads, customerId) {
  return gads.Customer({
    customer_id:       String(customerId).replace(/-/g, ''),
    login_customer_id: String(process.env.GOOGLE_ADS_MCC_ID).replace(/-/g, ''),
    refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })

  const { GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_DEVELOPER_TOKEN } = process.env
  if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_DEVELOPER_TOKEN) {
    return res.status(500).json({ erro: 'Credenciais Google Ads não configuradas no servidor Vercel' })
  }

  const { action, customerId, customerIds, dias = 30 } = req.body || {}

  try {
    const gads = makeGads()
    const cid  = customerId ? String(customerId).replace(/-/g, '') : null
    const c    = cid ? getCustomer(gads, cid) : null

    // ── Lista campanhas ──────────────────────────────────────────────────────
    if (action === 'campanhas') {
      const rows = await c.query(`
        SELECT campaign.id, campaign.name, campaign.status,
               campaign_budget.amount_micros, campaign.advertising_channel_type
        FROM campaign WHERE campaign.status != 'REMOVED' ORDER BY campaign.name
      `)
      return res.status(200).json(rows.map(r => ({
        id:               r.campaign?.id,
        nome:             r.campaign?.name,
        status:           r.campaign?.status,
        orcamento_diario: r.campaign_budget?.amount_micros
          ? (Number(r.campaign_budget.amount_micros) / 1_000_000).toFixed(2) : null,
        tipo:             r.campaign?.advertising_channel_type,
      })))
    }

    // ── Performance de um cliente ────────────────────────────────────────────
    if (action === 'performance') {
      const { dataInicio: di, dataFim: df } = req.body
      const { dataInicio: diCalc, dataFim: dfCalc } = calcDates(dias)
      const dataInicio = di || diCalc
      const dataFim    = df || dfCalc
      const rows = await c.query(`
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
        impressoes:  Number(r.metrics?.impressions  || 0),
        cliques:     Number(r.metrics?.clicks        || 0),
        ctr:         parseFloat(((r.metrics?.ctr || 0) * 100).toFixed(2)),
        cpc_medio:   parseFloat((Number(r.metrics?.average_cpc  || 0) / 1_000_000).toFixed(2)),
        custo_total: parseFloat((Number(r.metrics?.cost_micros  || 0) / 1_000_000).toFixed(2)),
        conversoes:  Number(r.metrics?.conversions   || 0),
        cpa:         Number(r.metrics?.conversions || 0) > 0
          ? parseFloat((Number(r.metrics?.cost_per_conversion || 0) / 1_000_000).toFixed(2))
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
      await Promise.all(ids.map(async (id) => {
        try {
          const rows = await getCustomer(gads, id).query(query)
          const total = { gasto: 0, cliques: 0, impressoes: 0, conversoes: 0 }
          for (const r of rows) {
            total.gasto      += Number(r.metrics?.cost_micros  || 0) / 1_000_000
            total.cliques    += Number(r.metrics?.clicks        || 0)
            total.impressoes += Number(r.metrics?.impressions   || 0)
            total.conversoes += Number(r.metrics?.conversions   || 0)
          }
          total.gasto = +total.gasto.toFixed(2)
          total.cpl   = total.conversoes > 0 ? +(total.gasto / total.conversoes).toFixed(2) : null
          resultados[id] = total
        } catch (e) {
          resultados[id] = { erro: e.message }
        }
      }))
      return res.status(200).json(resultados)
    }

    // ── Termos de pesquisa (Search Terms Report) ─────────────────────────────
    if (action === 'termos_pesquisa') {
      const { campaignId, di: diRaw, df: dfRaw } = req.body
      const { dataInicio: diCalc, dataFim: dfCalc } = calcDates(dias)
      const dataInicio = diRaw || diCalc
      const dataFim    = dfRaw || dfCalc
      const filtro = campaignId ? `AND campaign.id = ${campaignId}` : ''
      const rows = await c.query(`
        SELECT search_term_view.search_term, search_term_view.status,
               campaign.id, campaign.name, ad_group.id, ad_group.name,
               metrics.impressions, metrics.clicks, metrics.cost_micros,
               metrics.conversions, metrics.ctr
        FROM search_term_view
        WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
          AND metrics.impressions > 0 ${filtro}
        ORDER BY metrics.cost_micros DESC LIMIT 200
      `)
      return res.status(200).json(rows.map(r => ({
        termo:       r.search_term_view?.search_term,
        status:      r.search_term_view?.status,
        campanha_id: r.campaign?.id,
        campanha:    r.campaign?.name,
        grupo_id:    r.ad_group?.id,
        grupo:       r.ad_group?.name,
        impressoes:  Number(r.metrics?.impressions || 0),
        cliques:     Number(r.metrics?.clicks      || 0),
        custo:       parseFloat((Number(r.metrics?.cost_micros || 0) / 1_000_000).toFixed(2)),
        conversoes:  parseFloat(Number(r.metrics?.conversions || 0).toFixed(1)),
        ctr:         parseFloat(((r.metrics?.ctr || 0) * 100).toFixed(2)),
        cpl:         Number(r.metrics?.conversions || 0) > 0
          ? parseFloat((Number(r.metrics?.cost_micros || 0) / 1_000_000 / Number(r.metrics.conversions)).toFixed(2))
          : null,
      })))
    }

    // ── Pausar campanha ───────────────────────────────────────────────────────
    if (action === 'pausar_campanha') {
      const { campaignId } = req.body
      await c.campaigns.update([{
        resource_name: `customers/${cid}/campaigns/${campaignId}`,
        status: 'PAUSED',
      }])
      return res.status(200).json({ sucesso: true, acao: 'pausar_campanha', campaignId })
    }

    // ── Ativar campanha ───────────────────────────────────────────────────────
    if (action === 'ativar_campanha') {
      const { campaignId } = req.body
      await c.campaigns.update([{
        resource_name: `customers/${cid}/campaigns/${campaignId}`,
        status: 'ENABLED',
      }])
      return res.status(200).json({ sucesso: true, acao: 'ativar_campanha', campaignId })
    }

    // ── Ajustar orçamento ─────────────────────────────────────────────────────
    if (action === 'ajustar_orcamento') {
      const { campaignId, orcamento_diario } = req.body
      const rows = await c.query(`
        SELECT campaign.id, campaign.campaign_budget, campaign_budget.id
        FROM campaign WHERE campaign.id = ${campaignId} LIMIT 1
      `)
      if (!rows.length) throw new Error(`Campanha ${campaignId} não encontrada`)
      const budgetRN = rows[0].campaign?.campaign_budget
      if (!budgetRN) throw new Error('Budget resource name não encontrado')
      await c.campaignBudgets.update([{
        resource_name: budgetRN,
        amount_micros: Math.round(Number(orcamento_diario) * 1_000_000),
      }])
      return res.status(200).json({ sucesso: true, acao: 'ajustar_orcamento', campaignId, orcamento_diario })
    }

    // ── Negativar termos (nível campanha) ─────────────────────────────────────
    if (action === 'negativar_termos') {
      const { campaignId, termos, tipo = 'BROAD' } = req.body
      const lista = Array.isArray(termos) ? termos : [termos]
      const adicionados = []
      const ignorados   = []
      const erros       = []
      for (const termo of lista) {
        try {
          await c.campaignCriteria.create([{
            campaign: `customers/${cid}/campaigns/${campaignId}`,
            keyword:  { text: termo, match_type: tipo },
            negative: true,
          }])
          adicionados.push(termo)
        } catch (e) {
          const msg = e.message || ''
          if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already exists')) {
            ignorados.push(termo)
          } else {
            erros.push({ termo, erro: msg })
          }
        }
      }
      if (adicionados.length === 0 && erros.length > 0) {
        return res.status(502).json({ erro: `Falha ao negativar: ${erros[0].erro}`, erros })
      }
      return res.status(200).json({
        sucesso: true, acao: 'negativar_termos',
        termos_adicionados: adicionados.length,
        termos_ignorados:   ignorados.length,
        termos_erro:        erros.length,
        adicionados,
        ignorados,
        erros,
      })
    }

    // ── Adicionar keywords (nível grupo) ─────────────────────────────────────
    if (action === 'adicionar_keywords') {
      const { adGroupId, keywords, tipo = 'PHRASE' } = req.body
      const lista = Array.isArray(keywords) ? keywords : [keywords]
      await c.adGroupCriteria.create(lista.map(kw => ({
        ad_group: `customers/${cid}/adGroups/${adGroupId}`,
        keyword:  { text: kw, match_type: tipo },
        status:   'ENABLED',
      })))
      return res.status(200).json({ sucesso: true, acao: 'adicionar_keywords', keywords_adicionadas: lista.length })
    }

    // ── Criar anúncio RSA ─────────────────────────────────────────────────────
    if (action === 'criar_anuncio_rsa') {
      const { adGroupId, headlines, descriptions, finalUrl, path1, path2, status = 'PAUSED' } = req.body
      const hs = (Array.isArray(headlines)    ? headlines    : []).filter(Boolean).map(t => String(t).slice(0, 30))
      const ds = (Array.isArray(descriptions) ? descriptions : []).filter(Boolean).map(t => String(t).slice(0, 90))
      if (!adGroupId)    throw new Error('adGroupId é obrigatório')
      if (hs.length < 3) throw new Error('RSA exige no mínimo 3 títulos (headlines)')
      if (ds.length < 2) throw new Error('RSA exige no mínimo 2 descrições')
      if (!finalUrl)     throw new Error('finalUrl (URL de destino) é obrigatória')
      const rsa = {
        headlines:    hs.slice(0, 15).map(text => ({ text })),
        descriptions: ds.slice(0, 4).map(text => ({ text })),
      }
      if (path1) rsa.path1 = String(path1).slice(0, 15)
      if (path2) rsa.path2 = String(path2).slice(0, 15)
      const result = await c.adGroupAds.create([{
        ad_group: `customers/${cid}/adGroups/${adGroupId}`,
        status,
        ad: { responsive_search_ad: rsa, final_urls: [finalUrl] },
      }])
      return res.status(200).json({
        sucesso: true, acao: 'criar_anuncio_rsa',
        anuncio:   result[0]?.resource_name,
        titulos:   hs.length,
        descricoes: ds.length,
        status,
      })
    }

    // ── Listar grupos de anúncios ─────────────────────────────────────────────
    if (action === 'listar_grupos') {
      const { campaignId } = req.body
      const rows = await c.query(`
        SELECT ad_group.id, ad_group.name, ad_group.status
        FROM ad_group
        WHERE ad_group.campaign = 'customers/${cid}/campaigns/${campaignId}'
          AND ad_group.status != 'REMOVED'
        ORDER BY ad_group.name
      `)
      return res.status(200).json(rows.map(r => ({
        id:     r.ad_group?.id,
        nome:   r.ad_group?.name,
        status: r.ad_group?.status,
      })))
    }

    // ── Criar campanha ────────────────────────────────────────────────────────
    if (action === 'criar_campanha') {
      const {
        nome, orcamento_diario,
        tipo             = 'SEARCH',
        estrategia_lance = 'MAXIMIZE_CONVERSIONS',
        cpa_alvo,
        rede_busca       = true,
        rede_display     = false,
        criar_grupo      = false,
        grupo_nome,
        grupo_cpc_padrao = 1,
      } = req.body

      const [budgetRes] = await c.campaignBudgets.create([{
        name:              `Budget | ${nome} | ${Date.now()}`,
        amount_micros:     Math.round(Number(orcamento_diario) * 1_000_000),
        delivery_method:   'STANDARD',
        explicitly_shared: false,
      }])
      const budgetRN = budgetRes?.resource_name
      if (!budgetRN) throw new Error('Falha ao criar orçamento — verifique permissões da conta')

      const biddingStrategy = (estrategia_lance === 'TARGET_CPA' && cpa_alvo)
        ? { target_cpa: { target_cpa_micros: Math.round(Number(cpa_alvo) * 1_000_000) } }
        : { maximize_conversions: {} }

      const [campRes] = await c.campaigns.create([{
        name:                      nome,
        status:                    'PAUSED',
        advertising_channel_type:  tipo,
        campaign_budget:           budgetRN,
        network_settings: {
          target_google_search:        rede_busca !== false,
          target_search_network:       rede_busca !== false,
          target_content_network:      rede_display === true,
          target_partner_search_network: false,
        },
        ...biddingStrategy,
      }])
      const campRN = campRes?.resource_name
      if (!campRN) throw new Error('Falha ao criar campanha')
      const campId = campRN.split('/').pop()

      let grupoId = null
      if (criar_grupo && grupo_nome) {
        try {
          const [groupRes] = await c.adGroups.create([{
            name:            grupo_nome,
            campaign:        campRN,
            status:          'ENABLED',
            type:            'SEARCH_STANDARD',
            cpc_bid_micros:  Math.round(Number(grupo_cpc_padrao || 1) * 1_000_000),
          }])
          if (groupRes?.resource_name) grupoId = groupRes.resource_name.split('/').pop()
        } catch (e) {
          console.error('[criar_campanha] adGroup error:', e.message)
        }
      }

      return res.status(200).json({
        sucesso: true, acao: 'criar_campanha',
        campanha_id:   campId,
        campanha_nome: nome,
        budget_id:     budgetRN.split('/').pop(),
        grupo_id:      grupoId,
        status:        'PAUSED',
        proximo_passo: grupoId
          ? `Grupo "${grupo_nome}" criado (ID: ${grupoId}). Adicione keywords com adicionar_keywords e crie o anúncio com criar_anuncio_rsa.`
          : 'Campanha criada PAUSADA. Crie grupos de anúncios, keywords e o anúncio RSA antes de ativar.',
      })
    }

    return res.status(400).json({ erro: `action inválida: "${action}"` })
  } catch (e) {
    console.error('[api/gads]', e.message)
    return res.status(502).json({ erro: e.message })
  }
}
