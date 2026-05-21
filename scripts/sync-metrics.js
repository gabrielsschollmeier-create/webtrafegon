#!/usr/bin/env node
// scripts/sync-metrics.js
// Busca métricas de período via Windsor.ai REST API e atualiza ads-metrics.js

import https    from 'https'
import fs       from 'fs'
import path     from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const KEY = process.env.WINDSOR_API_KEY
if (!KEY) { console.error('❌ WINDSOR_API_KEY não definida'); process.exit(1) }

const CLIENTS = {
  rizzotto:     { google: '9175063247',  meta: '1431059114895815' },
  cooperja:     { google: '9685109260',  meta: '1118578092106698' },
  kamy:         { google: '2746776066',  meta: '1145344263042866' },
  intime:       { google: '5376240782',  meta: '1180486984082816' },
  kinto:        { google: '1894458588',  meta: '425444191608309'  },
  carol_adv:    { google: '5183788348',  meta: null               },
  polizio:      { google: '8731710435',  meta: '899954296415207'  },
  pit_floripa:  { google: '4162632254',  meta: '1274870363635683' },
  cacarola:     { google: '5559435113',  meta: '918978155522878'  },
  gabriel_piva: { google: '1936436305',  meta: null               },
  cdc:          { google: '9034028768',  meta: '825199056757247'  },
  rca_adv:      { google: '8067337903',  meta: null               },
  lenergy:      { google: null,          meta: '160278643493876'  },
}

const PERIODS = [
  { key: '7d',   preset: 'last_7d'  },
  { key: '14d',  preset: 'last_14d' },
  { key: 'prev', preset: 'last_30d' },
]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) }
        catch (e) { reject(new Error(`JSON inválido: ${raw.slice(0, 300)}`)) }
      })
    }).on('error', reject)
  })
}

function sum(rows, field) {
  return rows.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0)
}
function r2(n) { return Math.round(n * 100) / 100 }

async function fetchMeta(accountId, preset) {
  if (!accountId) return null
  try {
    const url = `https://connectors.windsor.ai/facebook?api_key=${KEY}&fields=spend,impressions,clicks,reach&date_preset=${preset}&account_id=${accountId}`
    const res = await get(url)
    const rows = Array.isArray(res) ? res : (res.data ?? [])
    if (!rows.length) return null
    const spend = r2(sum(rows, 'spend'))
    if (!spend) return null
    return {
      spend,
      impressions: Math.round(sum(rows, 'impressions')),
      clicks:      Math.round(sum(rows, 'clicks')),
      reach:       Math.round(sum(rows, 'reach')),
    }
  } catch (e) {
    console.warn(`  ⚠️  Meta ${accountId}/${preset}: ${e.message}`)
    return null
  }
}

async function fetchGoogle(customerId, preset) {
  if (!customerId) return null
  try {
    const url = `https://connectors.windsor.ai/google_ads?api_key=${KEY}&fields=spend,impressions,clicks,conversions&date_preset=${preset}&account_id=${customerId}`
    const res = await get(url)
    const rows = Array.isArray(res) ? res : (res.data ?? [])
    if (!rows.length) return null
    const spend = r2(sum(rows, 'spend'))
    if (!spend) return null
    return {
      spend,
      impressions: Math.round(sum(rows, 'impressions')),
      clicks:      Math.round(sum(rows, 'clicks')),
      conversions: Math.round(sum(rows, 'conversions')),
    }
  } catch (e) {
    console.warn(`  ⚠️  Google ${customerId}/${preset}: ${e.message}`)
    return null
  }
}

async function main() {
  const result = {}

  for (const [clientKey, { google, meta }] of Object.entries(CLIENTS)) {
    console.log(`🔄 ${clientKey}`)
    result[clientKey] = {}

    for (const { key, preset } of PERIODS) {
      const [metaData, googleData] = await Promise.all([
        fetchMeta(meta, preset),
        fetchGoogle(google, preset),
      ])
      result[clientKey][key] = { google: googleData, meta: metaData }
      const g = googleData ? `G:R$${googleData.spend}` : 'G:—'
      const m = metaData  ? `M:R$${metaData.spend}`  : 'M:—'
      console.log(`  ${key}: ${g} | ${m}`)
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const newBlock =
    `// SYNC:START — gerado por scripts/sync-metrics.js em ${today}\n` +
    `const CLIENT_PERIODS = ${JSON.stringify(result, null, 2)}\n` +
    `// SYNC:END`

  const filePath = path.join(__dirname, '../src/data/ads-metrics.js')
  const content  = fs.readFileSync(filePath, 'utf8')
  const updated  = content.replace(
    /\/\/ SYNC:START[\s\S]*?\/\/ SYNC:END/,
    newBlock
  )

  if (updated === content) {
    console.warn('\n⚠️  Marcadores SYNC:START/SYNC:END não encontrados em ads-metrics.js')
    process.exit(1)
  }

  fs.writeFileSync(filePath, updated, 'utf8')
  console.log(`\n✅ ads-metrics.js atualizado (${today})`)
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
