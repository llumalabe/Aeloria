// API helper with error handling
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error);
    // Return empty data instead of throwing
    return null;
  }
}

export { API_URL };
