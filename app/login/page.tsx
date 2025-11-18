'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In production, validate against backend
    const storedData = localStorage.getItem('firmData')
    if (!storedData) {
      setError('No account found. Please register first.')
      return
    }

    const firmData = JSON.parse(storedData)
    if (firmData.pin === pin) {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/dashboard')
    } else {
      setError('Invalid PIN. Please try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
              Enter 4-Digit PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value)
                setError('')
              }}
              maxLength={4}
              pattern="[0-9]{4}"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.5rem'
              }}
              placeholder="••••"
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            Login
          </button>

          <div style={{ textAlign: 'center' }}>
            <a
              href="/forgot-pin"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Forgot PIN?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
