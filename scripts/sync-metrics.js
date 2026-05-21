#!/usr/bin/env node
// scripts/sync-metrics.js
// Busca métricas por cliente via Windsor.ai REST API e atualiza ads-metrics.js
// Estratégia: busca account_id como dimensão → uma chamada por plataforma/período → filtra por cliente

import https    from 'https'
import fs       from 'fs'
import path     from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const KEY = process.env.WINDSOR_API_KEY
if (!KEY) { console.error('❌ WINDSOR_API_KEY não definida'); process.exit(1) }

const CLIENTS = {
  rizzotto:       { google: '917-506-3247',  meta: '1431059114895815' },
  cooperja:       { google: '968-510-9260',  meta: '1118578092106698' },
  kamy:           { google: '274-677-6066',  meta: '1145344263042866' },
  intime:         { google: '537-624-0782',  meta: '1180486984082816' },
  kinto:          { google: '189-445-8588',  meta: '425444191608309'  },
  carol_adv:      { google: '518-378-8348',  meta: '800973292506199'  },
  polizio:        { google: '873-171-0435',  meta: '899954296415207'  },
  pit_floripa:    { google: '416-263-2254',  meta: '1274870363635683' },
  cacarola:       { google: '555-943-5113',  meta: '918978155522878'  },
  gabriel_piva:   { google: '193-643-6305',  meta: null               },
  cdc:            { google: '903-402-8768',  meta: '825199056757247'  },
  rca_adv:        { google: '806-733-7903',  meta: null               },
  lenergy:        { google: null,            meta: '160278643493876'  },
  sitio_girabas:  { google: '175-471-0815',  meta: '2758233680900963' },
  quadros:        { google: '359-730-9188',  meta: '1151292763096461' },
  ararastur:      { google: '114-744-5454',  meta: null               },
  cooperja_lojas: { google: null,            meta: '607384011466521'  },
  fonseca_gonc:   { google: null,            meta: '7026642694045622' },
}

const PERIODS = [
  { key: 'today', preset: 'today'       },
  { key: '7d',    preset: 'last_7d'     },
  { key: '14d',   preset: 'last_14d'    },
  { key: 'month', preset: 'this_monthT' },
  { key: 'prev',  preset: 'last_month'  },
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

function r2(n) { return Math.round(n * 100) / 100 }

async function fetchByAccount(connector, metrics, preset) {
  try {
    const fields = ['account_id', ...metrics].join(',')
    const url = `https://connectors.windsor.ai/${connector}?api_key=${KEY}&fields=${fields}&date_preset=${preset}`
    const res = await get(url)
    const rows = Array.isArray(res) ? res : (res.data ?? [])
    if (!rows.length) return {}

    const map = {}
    for (const row of rows) {
      const id = row.account_id
      if (!id) continue
      if (!map[id]) map[id] = Object.fromEntries(metrics.map(m => [m, 0]))
      for (const m of metrics) {
        map[id][m] += parseFloat(row[m]) || 0
      }
    }
    for (const id in map) {
      map[id].spend = r2(map[id].spend)
      for (const m of metrics.filter(x => x !== 'spend')) {
        map[id][m] = Math.round(map[id][m])
      }
    }
    return map
  } catch (e) {
    console.warn(`  ⚠️  ${connector}/${preset}: ${e.message}`)
    return {}
  }
}

async function main() {
  const result = {}
  for (const clientKey of Object.keys(CLIENTS)) result[clientKey] = {}

  for (const { key, preset } of PERIODS) {
    console.log(`\n📅 ${key} (${preset})`)

    const [gMap, mMap] = await Promise.all([
      fetchByAccount('google_ads', ['spend', 'impressions', 'clicks', 'conversions'], preset),
      fetchByAccount('facebook',   ['spend', 'impressions', 'clicks', 'reach'],       preset),
    ])

    for (const [clientKey, { google, meta }] of Object.entries(CLIENTS)) {
      const gRaw = google ? gMap[google] : null
      const mRaw = meta   ? mMap[meta]   : null
      const g = gRaw?.spend > 0 ? gRaw : null
      const m = mRaw?.spend > 0 ? mRaw : null

      result[clientKey][key] = { google: g, meta: m }

      const gs = g ? `G:R$${g.spend}` : 'G:—'
      const ms = m ? `M:R$${m.spend}` : 'M:—'
      if (g || m) console.log(`  ${clientKey}: ${gs} | ${ms}`)
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const newBlock =
    `// SYNC:START — gerado por scripts/sync-metrics.js em ${today}\n` +
    `const CLIENT_PERIODS = ${JSON.stringify(result, null, 2)}\n` +
    `// SYNC:END`

  const filePath = path.join(__dirname, '../src/data/ads-metrics.js')
  const content  = fs.readFileSync(filePath, 'utf8')
  const updated  = content.replace(/\/\/ SYNC:START[\s\S]*?\/\/ SYNC:END/, newBlock)

  if (updated === content) {
    console.log('\nℹ️  Dados inalterados desde a última sincronização — arquivo não reescrito.')
    return
  }

  fs.writeFileSync(filePath, updated, 'utf8')
  console.log(`\n✅ ads-metrics.js atualizado (${today})`)
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
