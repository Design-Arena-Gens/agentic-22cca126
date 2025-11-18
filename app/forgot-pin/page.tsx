'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPin() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [firmData, setFirmData] = useState<any>(null)
  const [answers, setAnswers] = useState({
    answer1: '',
    answer2: '',
    answer3: ''
  })
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const handleVerifyAnswers = (e: React.FormEvent) => {
    e.preventDefault()

    const storedData = localStorage.getItem('firmData')
    if (!storedData) {
      setError('No account found.')
      return
    }

    const data = JSON.parse(storedData)
    setFirmData(data)

    if (
      answers.answer1.toLowerCase() === data.answer1.toLowerCase() &&
      answers.answer2.toLowerCase() === data.answer2.toLowerCase() &&
      answers.answer3.toLowerCase() === data.answer3.toLowerCase()
    ) {
      setStep(2)
      setError('')
    } else {
      setError('Incorrect answers. Please try again.')
    }
  }

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPin !== confirmPin) {
      setError('PINs do not match.')
      return
    }

    if (newPin.length !== 4) {
      setError('PIN must be 4 digits.')
      return
    }

    const updatedData = { ...firmData, pin: newPin }
    localStorage.setItem('firmData', JSON.stringify(updatedData))

    alert('PIN reset successful! You can now login with your new PIN.')
    router.push('/login')
  }

  const questionMap: { [key: string]: string } = {
    birth_city: 'What is your birth city?',
    first_school: 'What was your first school name?',
    pet_name: 'What is your pet\'s name?',
    mothers_maiden: 'What is your mother\'s maiden name?',
    favorite_book: 'What is your favorite book?',
    first_job: 'What was your first job?',
    childhood_friend: 'Who was your childhood best friend?',
    favorite_teacher: 'Who was your favorite teacher?',
    dream_destination: 'What is your dream travel destination?',
    first_car: 'What was your first car?',
    favorite_food: 'What is your favorite food?',
    birth_hospital: 'In which hospital were you born?'
  }

  useEffect(() => {
    const storedData = localStorage.getItem('firmData')
    if (storedData) {
      setFirmData(JSON.parse(storedData))
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          Reset PIN
        </h1>

        {step === 1 ? (
          <form onSubmit={handleVerifyAnswers}>
            <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
              Answer your security questions to reset your PIN.
            </p>

            {firmData && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                    {questionMap[firmData.question1]}
                  </label>
                  <input
                    type="text"
                    value={answers.answer1}
                    onChange={(e) => {
                      setAnswers({ ...answers, answer1: e.target.value })
                      setError('')
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                    {questionMap[firmData.question2]}
                  </label>
                  <input
                    type="text"
                    value={answers.answer2}
                    onChange={(e) => {
                      setAnswers({ ...answers, answer2: e.target.value })
                      setError('')
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                    {questionMap[firmData.question3]}
                  </label>
                  <input
                    type="text"
                    value={answers.answer3}
                    onChange={(e) => {
                      setAnswers({ ...answers, answer3: e.target.value })
                      setError('')
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>
              </>
            )}

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
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              Verify Answers
            </button>

            <div style={{ textAlign: 'center' }}>
              <a
                href="/login"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                Back to Login
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPin}>
            <p style={{ marginBottom: '1.5rem', color: '#10b981', fontWeight: '500' }}>
              ✓ Security questions verified successfully!
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                New 4-Digit PIN
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => {
                  setNewPin(e.target.value)
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                Confirm New PIN
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => {
                  setConfirmPin(e.target.value)
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
                background: '#10b981',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Reset PIN
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
