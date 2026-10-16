const OUNCE_TO_GRAM = 31.1034768
const CACHE_MS = 10 * 60 * 1000

let cachedRates = null
let cachedAt = 0
let pendingRates = null

async function fetchFromMetalPriceAPI() {
  const apiKey = process.env.METAL_PRICE_API_KEY || 'dde28869cb1e777033ac3e9e214353e5'
  try {
    const res = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=AED&currencies=XAU,XAG`,
      { cache: 'no-store', signal: AbortSignal.timeout(4000) }
    )
    if (!res.ok) return null

    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) return null

    const data = await res.json()
    const xauRate = data?.rates?.XAU
    const xagRate = data?.rates?.XAG
    if (!xauRate || Number.isNaN(Number(xauRate))) return null

    const perGram24K = (1 / xauRate) / OUNCE_TO_GRAM
    const perGram22K = perGram24K * (22 / 24)
    const perGram18K = perGram24K * (18 / 24)
    let perGramSilver = null
    if (xagRate && !Number.isNaN(Number(xagRate))) {
      perGramSilver = Math.round((1 / xagRate) / OUNCE_TO_GRAM)
    }

    return {
      perGram24K: Math.round(perGram24K),
      perGram22K: Math.round(perGram22K),
      perGram18K: Math.round(perGram18K),
      perGramSilver,
    }
  } catch {
    return null
  }
}

function fallbackRates() {
  const perGram24K = 275
  return {
    perGram24K,
    perGram22K: Math.round(perGram24K * (22 / 24)),
    perGram18K: Math.round(perGram24K * (18 / 24)),
    perGramSilver: 3,
  }
}

export async function getGoldRates() {
  if (cachedRates && Date.now() - cachedAt < CACHE_MS) return cachedRates
  if (!pendingRates) {
    pendingRates = fetchFromMetalPriceAPI()
      .then((live) => {
        const rates = live || fallbackRates()
        cachedRates = rates
        cachedAt = live ? Date.now() : Date.now() - CACHE_MS + 20000
        return rates
      })
      .finally(() => {
        pendingRates = null
      })
  }
  return pendingRates
}
