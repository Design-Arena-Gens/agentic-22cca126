'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          AI Accounting
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: isLogin ? '#3b82f6' : '#e5e7eb',
              color: isLogin ? 'white' : '#6b7280',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: !isLogin ? '#3b82f6' : '#e5e7eb',
              color: !isLogin ? 'white' : '#6b7280',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Go to Login
          </button>
        ) : (
          <button
            onClick={() => router.push('/register')}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Go to Registration
          </button>
        )}
      </div>
    </div>
  )
}
