const API_URL = 'https://b7ywm2txkojn4qe4wtb6ivlo3e0wejwr.lambda-url.eu-west-1.on.aws'

export const fetchRandomMeme = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/random`, {
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

