import { NextResponse } from 'next/server'
import { getGoldRates } from '@/lib/goldRates'

export async function GET() {
  const rates = await getGoldRates()
  return NextResponse.json({
    success: true,
    rates,
    lastUpdated: new Date().toISOString(),
    disclaimer: 'Indicative rates. Actual buying price may vary with taxes, making charges and stones.'
  }, {
    status: 200,
    headers: { 'Cache-Control': 'private, max-age=600' },
  })
}
