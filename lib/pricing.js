// Pricing utilities for gold and stones

/**
 * Calculate per-gram price for a given karat based on 24K rate.
 * Gold per gram (K) = perGram24K * (K / 24)
 * @param {number} perGram24K - 24K gold price per gram
 * @param {number} karat - Purity in karats (e.g., 24, 22, 18)
 * @returns {number}
 */
export function goldPerGramFrom24K(perGram24K, karat) {
  const base = Number(perGram24K)
  const k = Number(karat)
  if (!base || !k) return 0
  return base * (k / 24)
}

/**
 * Calculate total gold price using 24K per gram rate.
 * Gold Price = (24K per gram) × (K / 24) × Weight (grams)
 * @param {number} perGram24K
 * @param {number} karat
 * @param {number} weightGrams
 * @returns {number}
 */
export function goldPrice(perGram24K, karat, weightGrams) {
  const perGram = goldPerGramFrom24K(perGram24K, karat)
  const w = Number(weightGrams)
  if (!perGram || !w) return 0
  return perGram * w
}

/**
 * Calculate stones total from per-carat rate.
 * Stones Total = pricePerCarat × caratWeight
 * @param {number} pricePerCarat
 * @param {number} caratWeight
 * @returns {number}
 */
export function stonesTotal(pricePerCarat, caratWeight) {
  const p = Number(pricePerCarat)
  const c = Number(caratWeight)
  if (!p || !c) return 0
  return p * c
}

/**
 * Unit price shown on cards and the product page.
 * Uses the stored price when it is set. Otherwise:
 * (goldWeight × karat rate + stone price + making charges) × 1.05 VAT, rounded.
 */
export function jewelleryUnitPrice(product, rates) {
  const stored = Number(product?.price)
  if (stored > 0) return Math.round(stored)

  const karat = Number(product?.attributes?.goldPurityKarat) || 22
  let liveRate = Number(rates?.perGram22K) || 0
  if (karat === 24) liveRate = Number(rates?.perGram24K) || liveRate
  else if (karat === 18) liveRate = Number(rates?.perGram18K) || liveRate

  const rate = Number(product?.goldRate) || liveRate
  const weight = Number(product?.goldWeight) || 0
  if (!(weight > 0) || !(rate > 0)) return 0

  const beforeVat = weight * rate + (Number(product?.stonePrice) || 0) + (Number(product?.makingCharges) || 0)
  return Math.round(beforeVat * 1.05)
}
