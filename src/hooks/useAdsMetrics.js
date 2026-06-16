import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'
import { CLIENT_METRICS } from '../data/ads-metrics'

const WINDSOR_BASE = 'https://connectors.windsor.ai/api/v1/raw'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

async function windsorFetch(apiKey, connector, accountId, dateFrom, dateTo, fields) {
  const params = new URLSearchParams({ api_key: apiKey, connector, account_id: accountId, date_from: dateFrom, date_to: dateTo, fields })
  const res = await fetch(`${WINDSOR_BASE}?${params}`)
  if (!res.ok) throw new Error(`Windsor ${connector}: HTTP ${res.status}`)
  return res.json()
}

function todayStr()      { return new Date().toISOString().split('T')[0] }
function monthStartStr() { return todayStr().slice(0, 7) + '-01' }

function aggregateWindsor(rows) {
  if (!rows?.length) return null
  const totals = rows.reduce((acc, r) => {
    acc.spend       += Number(r.spend       || 0)
    acc.clicks      += Number(r.clicks      || 0)
    acc.impressions += Number(r.impressions || 0)
    acc.conversions += Number(r.conversions || 0)
    acc.reach       += Number(r.reach       || 0)
    return acc
  }, { spend: 0, clicks: 0, impressions: 0, conversions: 0, reach: 0 })

  const bycamp = {}
  rows.forEach(r => {
    const n = r.campaign_name || 'Sem campanha'
    if (!bycamp[n]) bycamp[n] = { name: n, spend: 0, clicks: 0, impressions: 0, conversions: 0 }
    bycamp[n].spend       += Number(r.spend       || 0)
    bycamp[n].clicks      += Number(r.clicks      || 0)
    bycamp[n].impressions += Number(r.impressions || 0)
    bycamp[n].conversions += Number(r.conversions || 0)
  })

  const byDate = {}
  rows.forEach(r => {
    if (!r.date) return
    byDate[r.date] = (byDate[r.date] || 0) + Number(r.spend || 0)
  })

  return {
    ...totals,
    ctr: totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
    cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
    cpl: totals.conversions > 0 ? totals.spend / totals.conversions : 0,
    campaigns: Object.values(bycamp).sort((a, b) => b.spend - a.spend),
    dailySpend: Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, spend]) => ({ date, spend: +Number(spend).toFixed(2) })),
  }
}

export function useAdsMetrics(clientId, client) {
  const [metrics, setMetrics]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState(null)
  const [syncedAt, setSyncedAt] = useState(null)
  const [source,   setSource]   = useState('static')

  const gadsId = client?.gads_customer_id
  const metaId = client?.meta_account_id

  const loadStatic = useCallback(() => {
    const s = CLIENT_METRICS[clientId]
    setMetrics(s || null)
    setSource('static')
  }, [clientId])

  const refresh = useCallback(async (force = false) => {
    if (!supabaseReady || (!gadsId && !metaId)) { loadStatic(); return }

    setLoading(true)
    setError(null)

    try {
      if (!force) {
        const { data: cached } = await supabase
          .from('ad_metrics')
          .select('data, synced_at')
          .eq('client_id', clientId)
          .order('synced_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (cached && new Date(cached.synced_at) > new Date(Date.now() - CACHE_TTL_MS)) {
          setMetrics(cached.data)
          setSyncedAt(new Date(cached.synced_at))
          setSource('cached')
          return
        }
      }

      const { data: setting } = await supabase
        .from('ad_settings')
        .select('value')
        .eq('key', 'windsor_api_key')
        .maybeSingle()

      if (!setting?.value) { loadStatic(); return }

      const apiKey = setting.value
      const from   = monthStartStr()
      const to     = todayStr()

      const [gRes, mRes] = await Promise.allSettled([
        gadsId ? windsorFetch(apiKey, 'google_ads',   gadsId, from, to,
          'date,campaign_name,spend,clicks,impressions,conversions') : Promise.resolve(null),
        metaId ? windsorFetch(apiKey, 'facebook_ads', metaId, from, to,
          'date,campaign_name,spend,clicks,impressions,reach') : Promise.resolve(null),
      ])

      const google = gRes.status === 'fulfilled' ? aggregateWindsor(gRes.value?.data) : null
      const meta   = mRes.status === 'fulfilled' ? aggregateWindsor(mRes.value?.data) : null

      const result = {
        gadsId, metaId,
        updatedAt: to,
        period: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        focus: client?.ads_focus || 'leads',
        channels: { google, meta },
        periods:  { month: { google, meta } },
      }

      await supabase.from('ad_metrics').upsert(
        { client_id: clientId, data: result, synced_at: new Date().toISOString() },
        { onConflict: 'client_id' }
      )

      setMetrics(result)
      setSyncedAt(new Date())
      setSource('live')
    } catch (err) {
      setError(err.message)
      loadStatic()
    } finally {
      setLoading(false)
    }
  }, [clientId, gadsId, metaId, loadStatic, client])

  useEffect(() => { refresh() }, [refresh])

  return { metrics, loading, error, syncedAt, source, refresh: () => refresh(true) }
}
