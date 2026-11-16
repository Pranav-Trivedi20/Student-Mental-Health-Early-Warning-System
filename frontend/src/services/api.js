const API_BASE_URL = 'http://localhost:8000/api'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const responseText = await response.text()
  let data = null

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = responseText
    }
  }

  if (!response.ok) {
    const error = new Error(
      typeof data === 'object' && data?.detail
        ? data.detail
        : 'Request failed'
    )
    error.status = response.status
    throw error
  }

  return data
}

export async function checkBackend() {
  return apiRequest('/health')
}

export async function fetchCurrentUser() {
  return apiRequest('/auth/me')
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