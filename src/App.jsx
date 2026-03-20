import React, { useMemo, useState } from 'react'

const agent = {
  name: 'Ehsan Ahmadzai',
  license: 'CalDRE# 02010305',
  phone: '(510) 677-9571',
  phoneHref: 'tel:+15106779571',
  email: 'ehsan.ahmadzai@yahoo.com',
  website: 'https://ehsanahmadzai.metrolist.com',
  websiteLabel: 'ehsanahmadzai.metrolist.com',
  company: 'Real Estate EBroker Inc.',
  officeAddress: 'Sacramento, California',
  languages: ['Farsi', 'Pashto'],
}

const featuredHomes = [
  {
    id: 1,
    title: 'Sacramento Buyer Support',
    city: 'Sacramento',
    type: 'Client Service',
    description:
      'Helping buyers search by address, city, ZIP code, and neighborhood while getting direct support from Ehsan.',
  },
  {
    id: 2,
    title: 'Northern California Coverage',
    city: 'Northern California',
    type: 'Service Area',
    description:
      'Serving Sacramento and surrounding Northern California markets with responsive real estate guidance.',
  },
  {
    id: 3,
    title: 'California Property Lookup',
    city: 'California',
    type: 'Property Data',
    description:
      'Search real property records using ATTOM-powered address lookup directly inside the website.',
  },
]

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function FieldRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-200 py-3 sm:grid-cols-[180px_1fr]">
      <div className="font-semibold text-slate-900">{label}</div>
      <div className="text-slate-600">{value ?? 'N/A'}</div>
    </div>
  )
}

function SectionCard({ children, className = '' }) {
  return (
    <div className={`rounded-3xl shadow-lg shadow-slate-200/60 ${className}`}>
      {children}
    </div>
  )
}

function InfoChip({ children }) {
  return (
    <div className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
      {children}
    </div>
  )
}

export default function App() {
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const [homePrice, setHomePrice] = useState(750000)
  const [downPayment, setDownPayment] = useState(150000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    need: '',
    message: '',
  })

  const monthlyPayment = useMemo(() => {
    const principal = Math.max(homePrice - downPayment, 0)
    const monthlyRate = interestRate / 100 / 12
    const totalPayments = loanTerm * 12

    if (principal <= 0) return 0
    if (monthlyRate === 0) return principal / totalPayments

    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    )
  }, [homePrice, downPayment, interestRate, loanTerm])

  const inquiryHref = useMemo(() => {
    const subject = encodeURIComponent(`Website Inquiry for ${agent.name}`)
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\nPhone: ${contactForm.phone}\nLooking for: ${contactForm.need}\n\nMessage:\n${contactForm.message}`
    )
    return `mailto:${agent.email}?subject=${subject}&body=${body}`
  }, [contactForm])

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const url = new URL('/api/property/search', window.location.origin)
      url.searchParams.set('address1', address1)
      url.searchParams.set('address2', address2)

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search property')
      }

      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const property = result?.property
  const allEvents = result?.allEvents

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-xl font-bold tracking-tight">{agent.name}</div>
            <div className="text-sm text-slate-500">
              {agent.company} • {agent.license}
            </div>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-slate-700">
            <a href="#home" className="hover:text-slate-950">Home</a>
            <a href="#search" className="hover:text-slate-950">Property Search</a>
            <a href="#about" className="hover:text-slate-950">About</a>
            <a href="#calculator" className="hover:text-slate-950">Calculator</a>
            <a href="#contact" className="hover:text-slate-950">Contact</a>
          </nav>
        </div>
      </header>

      <section
        id="home"
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.72), rgba(15,23,42,0.72)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur">
              Sacramento • Northern California • California Clients
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Real estate support with live property lookup built into the website.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Search real property data by address, review sale history and valuation data,
              estimate payments, and connect directly with {agent.name}.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <InfoChip>{agent.license}</InfoChip>
              <InfoChip>Based in Sacramento</InfoChip>
              <InfoChip>Serving Northern California</InfoChip>
              <InfoChip>Languages: {agent.languages.join(', ')}</InfoChip>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#search"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Search Property
              </a>
              <a
                href={agent.website}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                Visit MetroList
              </a>
            </div>
          </div>

          <SectionCard className="overflow-hidden bg-white/95 backdrop-blur">
            <div className="h-full p-6 sm:p-8">
              <div className="rounded-[2rem] bg-slate-900 p-6 text-white">
                <div className="text-sm uppercase tracking-[0.2em] text-slate-300">
                  Contact Ehsan Ahmadzai
                </div>
                <div className="mt-4 space-y-4">
                  <a href={agent.phoneHref} className="block rounded-2xl bg-white/10 p-4 hover:bg-white/15">
                    {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="block rounded-2xl bg-white/10 p-4 hover:bg-white/15">
                    {agent.email}
                  </a>
                  <a href={agent.website} className="block rounded-2xl bg-white/10 p-4 hover:bg-white/15">
                    {agent.websiteLabel}
                  </a>
                </div>
                <div className="mt-6 text-sm text-slate-300">
                  {agent.company} • {agent.officeAddress}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredHomes.map((item) => (
            <SectionCard key={item.id} className="bg-white">
              <div className="p-6">
                <div className="mb-3 inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                  {item.type}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <div className="mt-1 text-sm text-slate-500">{item.city}</div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            </SectionCard>
          ))}
        </div>
      </section>

      <section id="search" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-slate-300 px-4 py-1 text-sm text-slate-700">
            ATTOM Property Search
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Search real property data by address
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Enter a street address and city/state to pull real property detail, sale data,
            valuation information, and tax-related data.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard className="bg-white">
            <div className="p-8">
              <div className="text-xl font-semibold">Property Lookup</div>

              <form onSubmit={handleSearch} className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Street Address
                  </label>
                  <input
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="468 SEQUOIA DR"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    City, State
                  </label>
                  <input
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="SMYRNA, DE"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading ? 'Searching...' : 'Search Property'}
                </button>
              </form>

              <div className="mt-4 text-sm text-slate-500">
                Example: enter the street in the first field and city/state in the second.
              </div>

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {result?.success && !error && (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Property data loaded successfully.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard className="bg-white">
            <div className="p-8">
              <div className="text-xl font-semibold">Quick Summary</div>

              {!property && (
                <p className="mt-4 text-slate-500">
                  Search an address to load real ATTOM property data here.
                </p>
              )}

              {property && (
                <div className="mt-4">
                  <FieldRow label="Address" value={property.oneLineAddress} />
                  <FieldRow label="Property Type" value={property.propertyType} />
                  <FieldRow label="Year Built" value={property.yearBuilt} />
                  <FieldRow label="Beds" value={property.beds} />
                  <FieldRow label="Baths Total" value={property.bathsTotal} />
                  <FieldRow label="Living Sq Ft" value={property.sqftLiving} />
                  <FieldRow label="Lot Size Sq Ft" value={property.lotSizeSqft} />
                  <FieldRow label="Last Sale Date" value={property.lastSaleDate} />
                  <FieldRow
                    label="Last Sale Amount"
                    value={formatCurrency(property.lastSaleAmount)}
                  />
                  <FieldRow label="ATTOM ID" value={property.attomId} />
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {property && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <SectionCard className="bg-white">
              <div className="p-8">
                <div className="text-xl font-semibold">Sale Detail</div>
                <div className="mt-4">
                  <FieldRow label="Address" value={property.oneLineAddress} />
                  <FieldRow label="APN" value={property.apn} />
                  <FieldRow label="City" value={property.city} />
                  <FieldRow label="State" value={property.state} />
                  <FieldRow label="ZIP" value={property.zip} />
                  <FieldRow label="Property Type" value={property.propertyType} />
                  <FieldRow label="Property Class" value={property.propClass} />
                  <FieldRow label="Beds" value={property.beds} />
                  <FieldRow label="Full Baths" value={property.bathsFull} />
                  <FieldRow label="Partial Baths" value={property.bathsPartial} />
                  <FieldRow label="Total Baths" value={property.bathsTotal} />
                  <FieldRow label="Rooms Total" value={property.roomsTotal} />
                  <FieldRow label="Living Sq Ft" value={property.sqftLiving} />
                  <FieldRow label="Building Sq Ft" value={property.sqftBuilding} />
                  <FieldRow label="Lot Size Sq Ft" value={property.lotSizeSqft} />
                  <FieldRow label="Last Sale Date" value={property.lastSaleDate} />
                  <FieldRow
                    label="Sale Amount"
                    value={formatCurrency(property.lastSaleAmount)}
                  />
                  <FieldRow label="Sale Type" value={property.saleTransactionType} />
                  <FieldRow label="Price Per Sq Ft At Sale" value={property.pricePerSqftAtSale} />
                  <FieldRow label="Latitude" value={property.latitude} />
                  <FieldRow label="Longitude" value={property.longitude} />
                </div>
              </div>
            </SectionCard>

            <SectionCard className="bg-white">
              <div className="p-8">
                <div className="text-xl font-semibold">All Events / AVM / Tax</div>

                {!allEvents && (
                  <p className="mt-4 text-slate-500">No all-events data available.</p>
                )}

                {allEvents?.error && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                    {allEvents.error}: {allEvents.detail}
                  </div>
                )}

                {allEvents && !allEvents.error && (
                  <div className="mt-4">
                    <FieldRow label="ATTOM ID" value={allEvents.attomId} />
                    <FieldRow label="AVM Date" value={allEvents.avmDate} />
                    <FieldRow label="AVM Value" value={formatCurrency(allEvents.avmValue)} />
                    <FieldRow label="AVM High" value={formatCurrency(allEvents.avmHigh)} />
                    <FieldRow label="AVM Low" value={formatCurrency(allEvents.avmLow)} />
                    <FieldRow label="AVM Confidence" value={allEvents.avmConfidenceScore} />
                    <FieldRow label="Tax Amount" value={formatCurrency(allEvents.taxAmount)} />
                    <FieldRow label="Tax Year" value={allEvents.taxYear} />
                    <FieldRow label="Market Value" value={formatCurrency(allEvents.marketValue)} />
                    <FieldRow label="Sale Date" value={allEvents.saleDate} />
                    <FieldRow label="Sale Amount" value={formatCurrency(allEvents.saleAmount)} />
                    <FieldRow label="Sale Record Date" value={allEvents.saleRecordDate} />
                    <FieldRow label="Sale Type" value={allEvents.saleType} />
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        )}
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard className="bg-white">
            <div className="p-8">
              <div className="inline-flex rounded-full border border-slate-300 px-4 py-1 text-sm text-slate-700">
                About Ehsan Ahmadzai
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">{agent.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{agent.license}</p>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {agent.name} is a licensed real estate agent based in Sacramento and serving
                Northern California clients. This website includes live ATTOM-powered
                property lookup so visitors can search real property data directly inside the site.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">Buyer Support</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Property guidance, address lookup, market support, and direct communication.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">Seller Support</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Practical support for pricing, market awareness, and next-step planning.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="bg-white">
            <div className="p-8">
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-lg font-semibold">Quick Contact</div>
                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <a href={agent.phoneHref} className="block rounded-2xl bg-white p-4 shadow-sm">
                    {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="block rounded-2xl bg-white p-4 shadow-sm">
                    {agent.email}
                  </a>
                  <a href={agent.website} className="block rounded-2xl bg-white p-4 shadow-sm">
                    {agent.websiteLabel}
                  </a>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">{agent.company}</div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">{agent.officeAddress}</div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    Languages: {agent.languages.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard className="bg-white">
            <div className="p-8">
              <div className="text-2xl font-bold tracking-tight">Mortgage Calculator</div>
              <p className="mt-2 text-sm text-slate-500">
                Estimate a monthly principal and interest payment.
              </p>

              <div className="mt-8 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Home Price</label>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Down Payment</label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Loan Term (Years)</label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="bg-slate-950">
            <div className="p-8">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Estimated Monthly Payment
              </div>
              <div className="mt-4 text-5xl font-bold tracking-tight text-white">
                {formatCurrency(monthlyPayment)}
              </div>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                This estimate includes principal and interest only. Taxes, insurance, HOA fees,
                and lender-specific costs may change the final payment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5">
                  <div className="text-sm text-slate-300">Loan Amount</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {formatCurrency(Math.max(homePrice - downPayment, 0))}
                  </div>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <div className="text-sm text-slate-300">Down Payment</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {formatCurrency(downPayment)}
                  </div>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <div className="text-sm text-slate-300">Interest Rate</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {interestRate}%
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard className="bg-white">
            <div className="p-8">
              <div className="inline-flex rounded-full border border-slate-300 px-4 py-1 text-sm text-slate-700">
                Get In Touch
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Let’s talk about your next move
              </h2>
              <p className="mt-4 max-w-xl text-slate-600">
                Buyers, sellers, and property search visitors can use this form to contact Ehsan.
              </p>

              <div className="mt-8 grid gap-4">
                <input
                  placeholder="Your full name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />
                <input
                  placeholder="Your email address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />
                <input
                  placeholder="Your phone number"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />
                <input
                  placeholder="What are you looking for?"
                  value={contactForm.need}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, need: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />
                <textarea
                  placeholder="Tell me about your timeline, budget, or questions"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="min-h-[130px] w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />
                <a
                  href={inquiryHref}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Send Inquiry
                </a>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Work with {agent.name}</h3>
                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-200">
                  This website gives clients a strong starting point with property lookup,
                  affordability estimates, and direct contact in one place.
                </p>
              </div>

              <div className="mt-8 space-y-4 text-sm text-slate-100">
                <a href={agent.phoneHref} className="block">{agent.phone}</a>
                <a href={`mailto:${agent.email}`} className="block">{agent.email}</a>
                <a href={agent.website} className="block">{agent.websiteLabel}</a>
                <div>{agent.license}</div>
                <div>{agent.company}</div>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            © 2026 {agent.name} Real Estate. Serving Sacramento, Northern California, and California clients.
          </div>
          <div>
            {agent.company} • {agent.license}
          </div>
        </div>
      </footer>
    </div>
  )
}