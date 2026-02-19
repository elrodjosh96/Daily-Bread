const ESV_API_URL = 'https://api.esv.org/v3/passage/html/'

const DEFAULT_PARAMS = {
  'include-passage-references': false,
  'include-verse-numbers': true,
  'include-first-verse-numbers': true,
  'include-footnotes': false,
  'include-headings': false,
  'include-short-copyright': false,
  'indent-poetry': true,
  'line-length': 0,
}

const getApiKey = () => import.meta.env.VITE_ESV_API_KEY

const buildParams = (query) =>
  new URLSearchParams({
    q: query,
    ...DEFAULT_PARAMS,
  })

const requestPassages = async (query) => {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Missing VITE_ESV_API_KEY in .env')
  }

  const response = await fetch(`${ESV_API_URL}?${buildParams(query).toString()}`, {
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Failed to fetch passage')
  }

  const data = await response.json()
  return Array.isArray(data.passages) ? data.passages : []
}

export async function fetchPassage(reference) {
  const passages = await requestPassages(reference)
  return passages.join('\n').trim()
}

export async function fetchPassages(references) {
  if (!references || references.length === 0) return []

  const query = references.join('; ')
  const passages = await requestPassages(query)

  return references.map((reference, index) => ({
    reference,
    html: (passages[index] || '').trim(),
  }))
}
