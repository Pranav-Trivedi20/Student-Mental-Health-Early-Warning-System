
const API_BASE_URL = 'http://localhost:8000/api'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Request failed')
  }

  return data
}

export async function checkBackend() {
  return apiRequest('/health')
}

export async function predictAssessment(type, responses) {
  return apiRequest(`/predict/${type}`, {
    method: 'POST',
    body: JSON.stringify({ responses }),
  })
}

export async function fetchHistory() {
  return apiRequest('/history')
}

export async function saveAssessmentResult(resultData) {
  return apiRequest('/results', {
    method: 'POST',
    body: JSON.stringify(resultData),
  })
}
