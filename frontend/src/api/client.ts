const BASE = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '/api'

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json() as { data?: T; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Request failed')
  return json.data as T
}
