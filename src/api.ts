const API_URL = 'https://b7ywm2txkojn4qe4wtb6ivlo3e0wejwr.lambda-url.eu-west-1.on.aws'
const SEARCH_RESULTS_COUNT = 10

export const fetchRandomMeme = async (n: number = 1): Promise<string> => {
  const response = await fetch(`${API_URL}/random?n=${n}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch random meme')
  }
  
  const data = await response.json()
  return data.url
}

export const searchByText = async (q: string): Promise<string[]> => {
  const encodedQuery = encodeURIComponent(q)
  const response = await fetch(`${API_URL}/search?q=${encodedQuery}&n=${SEARCH_RESULTS_COUNT}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to search by text')
  }
  
  const data = await response.json()
  return Array.isArray(data) ? data.map((item: any) => item.url || item) : [data.url || data]
}

export const searchByImageText = async (q: string, image: File): Promise<string[]> => {
  const formData = new FormData()
  formData.append('q', q)
  formData.append('n', SEARCH_RESULTS_COUNT.toString())
  formData.append('image', image)
  
  const response = await fetch(`${API_URL}/search`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    },
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to search by image and text')
  }
  
  const data = await response.json()
  return Array.isArray(data) ? data.map((item: any) => item.url || item) : [data.url || data]
}

