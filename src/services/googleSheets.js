const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1rhHjjxdFF8OOzbXQLdJVUjUm2hlCfL76DQSE5kkZ33w/export?format=csv'

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

// Parse "DD.MM.YY" or "DD.MM.YYYY" → "YYYY-MM-DD"
function parseUzDate(str) {
  if (!str) return null
  const m = str.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/)
  if (!m) return null
  const year = m[3].length === 2 ? `20${m[3]}` : m[3]
  return `${year}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

// Parse column header "Nodir 20.02.24" → { name, date, hasEvent }
// "Xojakbar A 07.08.24" → { name: "Xojakbar A", date: "2024-08-07", hasEvent: true }
// "Shoxjaxon" (no date) → { name: "Shoxjaxon", date: null, hasEvent: false }
function parseHeader(text) {
  const trimmed = text.trim()
  if (!trimmed) return null
  const parts = trimmed.split(/\s+/)
  const lastPart = parts[parts.length - 1]
  const date = parseUzDate(lastPart)
  if (date && parts.length > 1) {
    return { name: parts.slice(0, -1).join(' '), date, hasEvent: true }
  }
  return { name: trimmed, date: null, hasEvent: false }
}

// Parse "$100", "100$", "1,200$", "80" → number
function parseAmount(str) {
  if (!str || !str.trim()) return 0
  const n = parseFloat(str.replace(/[$,\s]/g, ''))
  return isNaN(n) ? 0 : n
}

// Main matrix parser:
// Row 0: [empty, "Nodir 20.02.24", "Xojakbar A 07.08.24", ...]
// Row 1+: ["Muhammad", 100, 100, ...]  (giver → amounts at each toy event)
// Last row: "Jami" totals (skip)
function parseMatrix(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headerFields = parseCSVLine(lines[0])

  // Build event list from columns 1+ (col 0 is the person name column)
  const events = []
  for (let i = 1; i < headerFields.length; i++) {
    const h = parseHeader(headerFields[i])
    if (h && h.name) events.push({ colIndex: i, ...h })
  }

  const debts = []
  let id = 1

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i])
    const giverName = fields[0]?.trim()

    // Skip empty rows and the "Jami" totals row
    if (!giverName || /^jami$/i.test(giverName)) continue

    for (const event of events) {
      // Only record transactions for events that have happened (have a date)
      if (!event.hasEvent || !event.date) continue

      const amount = parseAmount(fields[event.colIndex])
      if (amount <= 0) continue // 0 means didn't give (own toy or absent)

      debts.push({
        id: id++,
        giver_name: giverName,
        receiver_name: event.name,
        amount,
        returned_amount: 0,
        created_at: event.date,
        returned_at: '',
        note: ''
      })
    }
  }

  return debts
}

// Sample data built from the actual sheet structure provided by the user
function getSampleData() {
  const events = [
    { name: 'Nodir',           date: '2024-02-20' },
    { name: 'Xojakbar Athamov',date: '2024-08-07' },
    { name: 'Ibrohim Nigmatov',date: '2025-07-10' },
    { name: 'Ilhom',           date: '2025-09-10' },
  ]

  //           Nodir  XojA   Ibr   Ilhom
  const rows = [
    { name: 'Muhammad',         amounts: [100, 100, 100, 100] },
    { name: 'Husniddin',        amounts: [100, 100, 100, 100] },
    { name: 'Nodir',            amounts: [  0, 100, 100,   0] },
    { name: 'Aziz',             amounts: [100, 100, 100,   0] },
    { name: 'Islom',            amounts: [100, 100, 100,   0] },
    { name: 'Ibrohim Nigmatov', amounts: [100, 100,   0, 100] },
    { name: 'Sarvar',           amounts: [100, 100, 100,   0] },
    { name: 'Samariddin',       amounts: [100, 100, 100,  80] },
    { name: 'Xojakbar Athamov', amounts: [100,   0, 100, 100] },
    { name: 'Xojakbar Toirov',  amounts: [100, 100, 100,   0] },
    { name: 'Ibrohim Olimjonov',amounts: [  0,   0,  50,   0] },
    { name: 'Dilshod',          amounts: [100,   0,   0,   0] },
    { name: 'Shoxjaxon',        amounts: [100, 100, 100, 100] },
    { name: 'Suhrob',           amounts: [100, 100,   0,   0] },
    { name: 'Ilhom',            amounts: [  0, 100, 100,   0] },
  ]

  const debts = []
  let id = 1
  rows.forEach((person) => {
    events.forEach((event, i) => {
      const amount = person.amounts[i]
      if (amount > 0) {
        debts.push({
          id: id++,
          giver_name: person.name,
          receiver_name: event.name,
          amount,
          returned_amount: 0,
          created_at: event.date,
          returned_at: '',
          note: ''
        })
      }
    })
  })
  return debts
}

export async function fetchDebtsFromSheet() {
  try {
    const response = await fetch(SHEET_CSV_URL, {
      signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const text = await response.text()
    const parsed = parseMatrix(text)

    if (parsed.length === 0) {
      console.warn('No data parsed from sheet, using sample data')
      return getSampleData()
    }

    return parsed
  } catch (err) {
    console.warn('Google Sheets fetch failed, using sample data:', err.message)
    return getSampleData()
  }
}
