const API_URL = 'https://oanqzrps3ftgcm2mkp43y57sde0vsvjm.lambda-url.eu-west-1.on.aws'
const SEARCH_RESULTS_COUNT = 10

export interface MemeResponse {
  id: number
  modality: string
  score: number
  urls: string[]
}

const prepareToSearch = (description?: string, text?: string, image?: File) => {
  const formData = new FormData()
  
  if (description) {
    formData.append('description', description.trim())
  }
  if (text) {
    formData.append('text', text.trim())
  }
  if (image) {
    formData.append('image', image)
  }
  
  formData.append('n', SEARCH_RESULTS_COUNT.toString())
  
  return formData
}

export const fetchRandomMemes = async (n: number = 1): Promise<MemeResponse[]> => {
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
  return data
}

export const searchMemes = async (description?: string, text?: string, image?: File): Promise<MemeResponse[]> => {
  const hasDescription = description && description.trim().length > 0
  const hasText = text && text.trim().length > 0
  const hasImage = image !== undefined && image !== null
  
  if (!hasDescription && !hasText && !hasImage) {
    throw new Error('At least one search parameter is required')
  }
  
  const formData = prepareToSearch(description, text, image)
  
  const response = await fetch(`${API_URL}/search`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    },
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to search memes')
  }
  
  const data = await response.json()
  return Array.isArray(data) ? data : [data]
}