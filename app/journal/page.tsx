'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Book, ArrowLeft } from 'lucide-react'

interface JournalEntry {
  id: string
  date: string
  narration: string
  entries: {
    account: string
    debit: number
    credit: number
  }[]
  createdAt: string
}

export default function Journal() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    narration: '',
    language: 'english'
  })
  const [accounts, setAccounts] = useState([
    { account: '', debit: 0, credit: 0 }
  ])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const storedEntries = localStorage.getItem('journalEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [router])

  const parseNaturalLanguage = (text: string, lang: string) => {
    // Simple AI-like parsing for common transactions
    const lower = text.toLowerCase()
    const amount = parseFloat(text.match(/\d+/)?.[0] || '0')

    if (lower.includes('sold') || lower.includes('becha') || lower.includes('sale')) {
      return [
        { account: 'Cash/Bank A/c', debit: amount, credit: 0 },
        { account: 'Sales A/c', debit: 0, credit: amount }
      ]
    } else if (lower.includes('purchased') || lower.includes('khareeda') || lower.includes('bought')) {
      return [
        { account: 'Purchases A/c', debit: amount, credit: 0 },
        { account: 'Cash/Bank A/c', debit: 0, credit: amount }
      ]
    } else if (lower.includes('received') || lower.includes('prapt')) {
      return [
        { account: 'Cash/Bank A/c', debit: amount, credit: 0 },
        { account: 'Debtor A/c', debit: 0, credit: amount }
      ]
    } else if (lower.includes('paid') || lower.includes('diya')) {
      return [
        { account: 'Creditor A/c', debit: amount, credit: 0 },
        { account: 'Cash/Bank A/c', debit: 0, credit: amount }
      ]
    }

    return accounts
  }

  const handleNarrationChange = (text: string) => {
    setFormData({ ...formData, narration: text })

    // Auto-generate entries from natural language
    if (text.length > 10) {
      const generatedAccounts = parseNaturalLanguage(text, formData.language)
      setAccounts(generatedAccounts)
    }
  }

  const addAccount = () => {
    setAccounts([...accounts, { account: '', debit: 0, credit: 0 }])
  }

  const removeAccount = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index))
  }

  const updateAccount = (index: number, field: string, value: any) => {
    const updated = [...accounts]
    updated[index] = { ...updated[index], [field]: value }
    setAccounts(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const totalDebit = accounts.reduce((sum, acc) => sum + Number(acc.debit), 0)
    const totalCredit = accounts.reduce((sum, acc) => sum + Number(acc.credit), 0)

    if (totalDebit !== totalCredit) {
      alert('Debit and Credit must be equal!')
      return
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: formData.date,
      narration: formData.narration,
      entries: accounts,
      createdAt: new Date().toISOString()
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries))

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      narration: '',
      language: 'english'
    })
    setAccounts([{ account: '', debit: 0, credit: 0 }])
    setShowForm(false)
  }

  const totalDebit = accounts.reduce((sum, acc) => sum + Number(acc.debit), 0)
  const totalCredit = accounts.reduce((sum, acc) => sum + Number(acc.credit), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '0.5rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Book size={32} color="#3b82f6" />
              Journal Entries
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>New Journal Entry</h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <option value="english">English</option>
                    <option value="hinglish">Hinglish</option>
                    <option value="hindi">Hindi (हिंदी)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                    Narration (Describe the transaction)
                  </label>
                  <textarea
                    value={formData.narration}
                    onChange={(e) => handleNarrationChange(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      resize: 'vertical'
                    }}
                    placeholder="E.g., Goods sold to A for Rs. 5000 / A ko 5000 rupay ka maal becha"
                  />
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    💡 AI will auto-generate journal entries from your description
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ color: '#374151', fontWeight: '500' }}>Account Entries</label>
                    <button
                      type="button"
                      onClick={addAccount}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Row
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Account</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Debit (₹)</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Credit (₹)</th>
                          <th style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((acc, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="text"
                                value={acc.account}
                                onChange={(e) => updateAccount(index, 'account', e.target.value)}
                                required
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '0.375rem'
                                }}
                                placeholder="Account name"
                              />
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="number"
                                value={acc.debit || ''}
                                onChange={(e) => updateAccount(index, 'debit', e.target.value)}
                                min="0"
                                step="0.01"
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '0.375rem',
                                  textAlign: 'right'
                                }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="number"
                                value={acc.credit || ''}
                                onChange={(e) => updateAccount(index, 'credit', e.target.value)}
                                min="0"
                                step="0.01"
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '0.375rem',
                                  textAlign: 'right'
                                }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              {accounts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeAccount(index)}
                                  style={{
                                    padding: '0.25rem',
                                    background: '#fee2e2',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <X size={16} color="#dc2626" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ background: '#f9fafb', fontWeight: 'bold' }}>
                          <td style={{ padding: '0.75rem' }}>Total</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', color: totalDebit === totalCredit ? '#10b981' : '#ef4444' }}>
                            ₹{totalDebit.toFixed(2)}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', color: totalDebit === totalCredit ? '#10b981' : '#ef4444' }}>
                            ₹{totalCredit.toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {totalDebit !== totalCredit && (
                    <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      ⚠️ Debit and Credit must be equal
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={totalDebit !== totalCredit}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: totalDebit === totalCredit ? '#3b82f6' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: totalDebit === totalCredit ? 'pointer' : 'not-allowed'
                  }}
                >
                  Save Entry
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <Book size={48} style={{ margin: '0 auto 1rem' }} />
              <p>No journal entries yet. Create your first entry!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#1f2937' }}>{new Date(entry.date).toLocaleDateString()}</strong>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      Entry #{entry.id.slice(-6)}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem', fontStyle: 'italic' }}>{entry.narration}</p>
                  <table style={{ width: '100%', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }}>Account</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Debit</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.entries.map((acc, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.5rem' }}>{acc.account}</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                            {acc.debit ? `₹${acc.debit.toFixed(2)}` : '-'}
                          </td>
                          <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                            {acc.credit ? `₹${acc.credit.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
