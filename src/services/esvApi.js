const ESV_API_URL = 'https://api.esv.org/v3/passage/text/'

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

export async function fetchPassage(reference) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Missing VITE_ESV_API_KEY in .env')
  }

  const params = new URLSearchParams({
    q: reference,
    ...DEFAULT_PARAMS,
  })

  const response = await fetch(`${ESV_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Failed to fetch passage')
  }

  const data = await response.json()
  const passages = Array.isArray(data.passages) ? data.passages : []

  return passages.join('\n').trim()
}
