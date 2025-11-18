'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ArrowLeft, Download } from 'lucide-react'

export default function Reports() {
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState<string>('trial-balance')
  const [journalEntries, setJournalEntries] = useState<any[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const entries = localStorage.getItem('journalEntries')
    if (entries) {
      setJournalEntries(JSON.parse(entries))
    }
  }, [router])

  // Calculate ledger balances
  const calculateLedger = () => {
    const ledger: { [key: string]: { debit: number; credit: number } } = {}

    journalEntries.forEach(entry => {
      entry.entries.forEach((acc: any) => {
        if (!ledger[acc.account]) {
          ledger[acc.account] = { debit: 0, credit: 0 }
        }
        ledger[acc.account].debit += Number(acc.debit) || 0
        ledger[acc.account].credit += Number(acc.credit) || 0
      })
    })

    return ledger
  }

  const ledger = calculateLedger()

  // Calculate Trial Balance
  const trialBalance = Object.entries(ledger).map(([account, values]) => ({
    account,
    debit: values.debit,
    credit: values.credit,
    balance: values.debit - values.credit
  }))

  const totalDebit = trialBalance.reduce((sum, acc) => sum + acc.debit, 0)
  const totalCredit = trialBalance.reduce((sum, acc) => sum + acc.credit, 0)

  // Profit & Loss
  const revenueAccounts = trialBalance.filter(acc =>
    acc.account.toLowerCase().includes('sales') ||
    acc.account.toLowerCase().includes('revenue') ||
    acc.account.toLowerCase().includes('income')
  )
  const expenseAccounts = trialBalance.filter(acc =>
    acc.account.toLowerCase().includes('purchase') ||
    acc.account.toLowerCase().includes('expense') ||
    acc.account.toLowerCase().includes('salary') ||
    acc.account.toLowerCase().includes('rent')
  )

  const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + acc.credit, 0)
  const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + acc.debit, 0)
  const netProfit = totalRevenue - totalExpenses

  // Balance Sheet
  const assetAccounts = trialBalance.filter(acc =>
    acc.account.toLowerCase().includes('cash') ||
    acc.account.toLowerCase().includes('bank') ||
    acc.account.toLowerCase().includes('debtor') ||
    acc.account.toLowerCase().includes('inventory') ||
    acc.account.toLowerCase().includes('asset')
  )
  const liabilityAccounts = trialBalance.filter(acc =>
    acc.account.toLowerCase().includes('creditor') ||
    acc.account.toLowerCase().includes('loan') ||
    acc.account.toLowerCase().includes('payable') ||
    acc.account.toLowerCase().includes('liability')
  )

  const totalAssets = assetAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
  const totalLiabilities = liabilityAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
  const capital = totalAssets - totalLiabilities

  const reports = [
    { id: 'trial-balance', name: 'Trial Balance', icon: '⚖️' },
    { id: 'profit-loss', name: 'Profit & Loss Statement', icon: '📊' },
    { id: 'balance-sheet', name: 'Balance Sheet', icon: '📈' },
    { id: 'ledger', name: 'General Ledger', icon: '📖' },
    { id: 'cash-book', name: 'Cash Book', icon: '💰' },
    { id: 'journal-book', name: 'Journal Book', icon: '📓' }
  ]

  const renderReport = () => {
    switch (selectedReport) {
      case 'trial-balance':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>
              Trial Balance
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Account Name</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Debit (₹)</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {trialBalance.map((acc, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>{acc.account}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>{acc.debit.toFixed(2)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>{acc.credit.toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f9fafb', fontWeight: 'bold', borderTop: '2px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>Total</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#3b82f6' }}>{totalDebit.toFixed(2)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#3b82f6' }}>{totalCredit.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      case 'profit-loss':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>
              Profit & Loss Statement
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#dc2626' }}>Expenses (Dr.)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {expenseAccounts.map((acc, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{acc.account}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{acc.debit.toFixed(2)}</td>
                      </tr>
                    ))}
                    {netProfit > 0 && (
                      <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 'bold', background: '#dcfce7' }}>
                        <td style={{ padding: '0.75rem' }}>Net Profit</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#16a34a' }}>₹{netProfit.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr style={{ background: '#f9fafb', fontWeight: 'bold' }}>
                      <td style={{ padding: '0.75rem' }}>Total</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{totalRevenue.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#16a34a' }}>Revenue (Cr.)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {revenueAccounts.map((acc, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{acc.account}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{acc.credit.toFixed(2)}</td>
                      </tr>
                    ))}
                    {netProfit < 0 && (
                      <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 'bold', background: '#fee2e2' }}>
                        <td style={{ padding: '0.75rem' }}>Net Loss</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#dc2626' }}>₹{Math.abs(netProfit).toFixed(2)}</td>
                      </tr>
                    )}
                    <tr style={{ background: '#f9fafb', fontWeight: 'bold' }}>
                      <td style={{ padding: '0.75rem' }}>Total</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{totalRevenue.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'balance-sheet':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>
              Balance Sheet
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3b82f6' }}>Assets</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {assetAccounts.map((acc, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{acc.account}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{Math.abs(acc.balance).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f9fafb', fontWeight: 'bold', borderTop: '2px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>Total Assets</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#3b82f6' }}>₹{totalAssets.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f59e0b' }}>Liabilities & Capital</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>Capital</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{capital.toFixed(2)}</td>
                    </tr>
                    {liabilityAccounts.map((acc, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{acc.account}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{Math.abs(acc.balance).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f9fafb', fontWeight: 'bold', borderTop: '2px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>Total</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b' }}>₹{totalAssets.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'ledger':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>
              General Ledger
            </h2>
            {Object.entries(ledger).map(([account, values]) => (
              <div key={account} style={{ marginBottom: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{account}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Particulars</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Debit (₹)</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.75rem' }}>Total Transactions</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{values.debit.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{values.credit.toFixed(2)}</td>
                    </tr>
                    <tr style={{ background: '#f9fafb', fontWeight: 'bold' }}>
                      <td style={{ padding: '0.75rem' }}>Balance</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }} colSpan={2}>
                        {values.debit > values.credit ? `₹${(values.debit - values.credit).toFixed(2)} Dr` : `₹${(values.credit - values.debit).toFixed(2)} Cr`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )

      case 'cash-book':
        const cashTransactions = journalEntries.filter(entry =>
          entry.entries.some((acc: any) =>
            acc.account.toLowerCase().includes('cash') ||
            acc.account.toLowerCase().includes('bank')
          )
        )
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>
              Cash Book
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Particulars</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Receipt (₹)</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Payment (₹)</th>
                </tr>
              </thead>
              <tbody>
                {cashTransactions.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>{new Date(entry.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{entry.narration}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#16a34a' }}>
                      {entry.entries.find((acc: any) =>
                        (acc.account.toLowerCase().includes('cash') || acc.account.toLowerCase().includes('bank')) && acc.debit > 0
                      )?.debit.toFixed(2) || '-'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#dc2626' }}>
                      {entry.entries.find((acc: any) =>
                        (acc.account.toLowerCase().includes('cash') || acc.account.toLowerCase().includes('bank')) && acc.credit > 0
                      )?.credit.toFixed(2) || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'journal-book':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center' }}>
              Journal Book
            </h2>
            {journalEntries.map((entry) => (
              <div key={entry.id} style={{ marginBottom: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Entry #{entry.id.slice(-6)}</span>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '1rem', fontStyle: 'italic' }}>{entry.narration}</p>
                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Account</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>Debit (₹)</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.entries.map((acc: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.5rem' }}>{acc.account}</td>
                        <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                          {acc.debit ? acc.debit.toFixed(2) : '-'}
                        </td>
                        <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                          {acc.credit ? acc.credit.toFixed(2) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
              <FileText size={32} color="#8b5cf6" />
              Reports
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Download size={20} />
            Download
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Report Types</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  style={{
                    padding: '0.75rem',
                    background: selectedReport === report.id ? '#eff6ff' : 'transparent',
                    border: selectedReport === report.id ? '1px solid #3b82f6' : '1px solid transparent',
                    borderRadius: '0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: selectedReport === report.id ? '#3b82f6' : '#374151',
                    fontWeight: selectedReport === report.id ? '600' : '400',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }}>{report.icon}</span>
                  {report.name}
                </button>
              ))}
            </div>
          </div>

          {/* Report Content */}
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {journalEntries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <FileText size={48} style={{ margin: '0 auto 1rem' }} />
                <p>No data available yet. Create journal entries to generate reports.</p>
              </div>
            ) : (
              renderReport()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
