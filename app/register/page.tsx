'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Organization Details
    firmName: '',
    firmType: 'proprietorship',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone: '',

    // Taxation Details
    panNumber: '',
    gstNumber: '',
    tanNumber: '',

    // Banking Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'current',

    // Security
    pin: '',
    confirmPin: '',
    question1: '',
    answer1: '',
    question2: '',
    answer2: '',
    question3: '',
    answer3: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save to localStorage (in production, send to backend)
      localStorage.setItem('firmData', JSON.stringify(formData))
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/dashboard')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.95rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#374151',
    fontWeight: '500'
  }

  const sectionStyle = {
    marginBottom: '1.5rem'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
          Register Your Firm
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Step {step} of 4</p>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '2rem' }}>
          <div style={{ width: `${(step / 4) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '3px', transition: 'width 0.3s' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>Organization Details</h2>

              <div style={sectionStyle}>
                <label style={labelStyle}>Firm Name *</label>
                <input
                  type="text"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter firm name"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Firm Type *</label>
                <select
                  name="firmType"
                  value={formData.firmType}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="proprietorship">Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llp">LLP</option>
                  <option value="private_ltd">Private Limited</option>
                  <option value="public_ltd">Public Limited</option>
                </select>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, minHeight: '80px' }}
                  placeholder="Enter complete address"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="State"
                  />
                </div>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  style={inputStyle}
                  placeholder="6-digit pincode"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="email@example.com"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  style={inputStyle}
                  placeholder="10-digit phone number"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>Taxation Details</h2>

              <div style={sectionStyle}>
                <label style={labelStyle}>PAN Number *</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  required
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  style={inputStyle}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>GST Number *</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                  style={inputStyle}
                  placeholder="22ABCDE1234F1Z5"
                  maxLength={15}
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>TAN Number (Optional)</label>
                <input
                  type="text"
                  name="tanNumber"
                  value={formData.tanNumber}
                  onChange={handleChange}
                  pattern="[A-Z]{4}[0-9]{5}[A-Z]{1}"
                  style={inputStyle}
                  placeholder="ABCD12345E"
                  maxLength={10}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>Banking Details</h2>

              <div style={sectionStyle}>
                <label style={labelStyle}>Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter bank name"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter account number"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  required
                  pattern="[A-Z]{4}0[A-Z0-9]{6}"
                  style={inputStyle}
                  placeholder="ABCD0123456"
                  maxLength={11}
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Account Type *</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="current">Current Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>Security Setup</h2>

              <div style={sectionStyle}>
                <label style={labelStyle}>4-Digit PIN *</label>
                <input
                  type="password"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{4}"
                  maxLength={4}
                  style={inputStyle}
                  placeholder="Enter 4-digit PIN"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Confirm PIN *</label>
                <input
                  type="password"
                  name="confirmPin"
                  value={formData.confirmPin}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{4}"
                  maxLength={4}
                  style={inputStyle}
                  placeholder="Re-enter PIN"
                />
              </div>

              <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', color: '#1f2937' }}>Security Questions</h3>

              <div style={sectionStyle}>
                <label style={labelStyle}>Question 1 *</label>
                <select
                  name="question1"
                  value={formData.question1}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select a question</option>
                  <option value="birth_city">What is your birth city?</option>
                  <option value="first_school">What was your first school name?</option>
                  <option value="pet_name">What is your pet's name?</option>
                  <option value="mothers_maiden">What is your mother's maiden name?</option>
                </select>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Answer 1 *</label>
                <input
                  type="text"
                  name="answer1"
                  value={formData.answer1}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter answer"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Question 2 *</label>
                <select
                  name="question2"
                  value={formData.question2}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select a question</option>
                  <option value="favorite_book">What is your favorite book?</option>
                  <option value="first_job">What was your first job?</option>
                  <option value="childhood_friend">Who was your childhood best friend?</option>
                  <option value="favorite_teacher">Who was your favorite teacher?</option>
                </select>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Answer 2 *</label>
                <input
                  type="text"
                  name="answer2"
                  value={formData.answer2}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter answer"
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Question 3 *</label>
                <select
                  name="question3"
                  value={formData.question3}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select a question</option>
                  <option value="dream_destination">What is your dream travel destination?</option>
                  <option value="first_car">What was your first car?</option>
                  <option value="favorite_food">What is your favorite food?</option>
                  <option value="birth_hospital">In which hospital were you born?</option>
                </select>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Answer 3 *</label>
                <input
                  type="text"
                  name="answer3"
                  value={formData.answer3}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter answer"
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Previous
              </button>
            )}
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {step === 4 ? 'Complete Registration' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
