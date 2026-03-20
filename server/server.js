import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
const ATTOM_BASE = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0'

async function attomFetch(path, params = {}) {
  const url = new URL(`${ATTOM_BASE}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      apikey: process.env.ATTOM_API_KEY,
      accept: 'application/json',
    },
  })

  const text = await response.text()

  if (!response.ok) {
    throw new Error(`ATTOM error ${response.status}: ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('ATTOM returned non-JSON response')
  }
}

function mapSaleDetailProperty(property) {
  return {
    attomId: property?.identifier?.attomId ?? null,
    apn: property?.identifier?.apn ?? null,
    oneLineAddress: property?.address?.oneLine ?? null,
    address1: property?.address?.line1 ?? null,
    address2: property?.address?.line2 ?? null,
    city: property?.address?.locality ?? null,
    state: property?.address?.countrySubd ?? null,
    zip: property?.address?.postal1 ?? null,
    latitude: property?.location?.latitude ?? null,
    longitude: property?.location?.longitude ?? null,
    propertyType: property?.summary?.propertyType ?? null,
    propClass: property?.summary?.propclass ?? null,
    yearBuilt: property?.summary?.yearbuilt ?? null,
    beds: property?.building?.rooms?.beds ?? null,
    bathsFull: property?.building?.rooms?.bathsfull ?? null,
    bathsPartial: property?.building?.rooms?.bathspartial ?? null,
    bathsTotal: property?.building?.rooms?.bathstotal ?? null,
    roomsTotal: property?.building?.rooms?.roomsTotal ?? null,
    sqftLiving: property?.building?.size?.livingsize ?? null,
    sqftBuilding: property?.building?.size?.bldgsize ?? null,
    lotSizeSqft: property?.lot?.lotsize2 ?? null,
    lastSaleDate: property?.sale?.saleTransDate ?? null,
    lastSaleAmount: property?.sale?.amount?.saleamt ?? null,
    saleDocNumber: property?.sale?.amount?.saledocnum ?? null,
    saleTransactionType: property?.sale?.amount?.saletranstype ?? null,
    pricePerSqftAtSale: property?.sale?.calculation?.pricepersizeunit ?? null,
  }
}

function mapAllEventsProperty(property) {
  return {
    attomId: property?.identifier?.attomId ?? null,
    oneLineAddress: property?.address?.oneLine ?? null,
    avmValue: property?.avm?.amount?.value ?? null,
    avmHigh: property?.avm?.amount?.high ?? null,
    avmLow: property?.avm?.amount?.low ?? null,
    avmConfidenceScore: property?.avm?.amount?.scr ?? null,
    avmDate: property?.avm?.eventDate ?? null,
    taxAmount: property?.assessment?.tax?.taxamt ?? null,
    taxYear: property?.assessment?.tax?.taxyear ?? null,
    marketValue: property?.assessment?.market?.mktttlvalue ?? null,
    saleDate: property?.sale?.saleTransDate ?? null,
    saleAmount: property?.sale?.amount?.saleamt ?? null,
    saleRecordDate: property?.sale?.amount?.salerecdate ?? null,
    saleType: property?.sale?.amount?.saletranstype ?? null,
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/property/search', async (req, res) => {
  try {
    const { address1, address2 } = req.query

    if (!address1 || !address2) {
      return res.status(400).json({
        error: 'address1 and address2 are required',
      })
    }

    const saleDetail = await attomFetch('/sale/detail', { address1, address2 })
    const property = saleDetail?.property?.[0]

    if (!property) {
      return res.status(404).json({
        error: 'No property found for that address',
      })
    }

    const mapped = mapSaleDetailProperty(property)

    let eventsMapped = null
    if (mapped.attomId) {
      try {
        const allEvents = await attomFetch('/allevents/detail', {
          id: mapped.attomId,
        })
        const eventProperty = allEvents?.property?.[0]
        if (eventProperty) {
          eventsMapped = mapAllEventsProperty(eventProperty)
        }
      } catch (eventError) {
        eventsMapped = {
          error: 'Unable to load all events detail',
          detail: eventError.message,
        }
      }
    }

    res.json({
      success: true,
      property: mapped,
      allEvents: eventsMapped,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})