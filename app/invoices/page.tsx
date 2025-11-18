'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, FileText, ArrowLeft, Download, Eye } from 'lucide-react'

interface InvoiceItem {
  name: string
  quantity: number
  rate: number
  gst: number
  amount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  customerName: string
  customerAddress: string
  customerGST: string
  items: InvoiceItem[]
  subtotal: number
  totalGST: number
  total: number
  createdAt: string
}

export default function Invoices() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [firmData, setFirmData] = useState<any>(null)
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerGST: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: '', quantity: 1, rate: 0, gst: 18, amount: 0 }
  ])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const storedFirm = localStorage.getItem('firmData')
    if (storedFirm) {
      setFirmData(JSON.parse(storedFirm))
    }

    const storedInvoices = localStorage.getItem('invoices')
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices))
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }

    // Calculate amount
    const item = updated[index]
    const baseAmount = item.quantity * item.rate
    const gstAmount = (baseAmount * item.gst) / 100
    updated[index].amount = baseAmount + gstAmount

    setItems(updated)
  }

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, rate: 0, gst: 18, amount: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
    const totalGST = items.reduce((sum, item) => sum + ((item.quantity * item.rate * item.gst) / 100), 0)
    const total = subtotal + totalGST

    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: formData.date,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerGST: formData.customerGST,
      items: items,
      subtotal,
      totalGST,
      total,
      createdAt: new Date().toISOString()
    }

    const updatedInvoices = [invoice, ...invoices]
    setInvoices(updatedInvoices)
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices))

    // Reset
    setFormData({
      customerName: '',
      customerAddress: '',
      customerGST: '',
      date: new Date().toISOString().split('T')[0]
    })
    setItems([{ name: '', quantity: 1, rate: 0, gst: 18, amount: 0 }])
    setShowForm(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#374151',
    fontWeight: '500'
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
              <FileText size={32} color="#f59e0b" />
              Invoices
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
            Create Invoice
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
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Create New Invoice</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Customer Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Customer Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={labelStyle}>Customer Address *</label>
                    <textarea
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleChange}
                      required
                      style={{ ...inputStyle, minHeight: '60px' }}
                      placeholder="Enter customer address"
                    />
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={labelStyle}>Customer GST Number (Optional)</label>
                    <input
                      type="text"
                      name="customerGST"
                      value={formData.customerGST}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="22ABCDE1234F1Z5"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937' }}>Items</h3>
                    <button
                      type="button"
                      onClick={addItem}
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
                      + Add Item
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Item</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Qty</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Rate</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>GST%</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Amount</th>
                          <th style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                                placeholder="Item name"
                              />
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                required
                                min="1"
                                style={{ width: '80px', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                                required
                                min="0"
                                step="0.01"
                                style={{ width: '100px', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', textAlign: 'right' }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <input
                                type="number"
                                value={item.gst}
                                onChange={(e) => updateItem(index, 'gst', parseFloat(e.target.value))}
                                required
                                min="0"
                                max="100"
                                style={{ width: '80px', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', textAlign: 'center' }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                              ₹{item.amount.toFixed(2)}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  style={{ padding: '0.25rem', background: '#fee2e2', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                                >
                                  <X size={16} color="#dc2626" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>Subtotal:</span>
                    <span style={{ fontWeight: '500' }}>₹{items.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>Total GST:</span>
                    <span style={{ fontWeight: '500' }}>₹{items.reduce((sum, item) => sum + ((item.quantity * item.rate * item.gst) / 100), 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid #e5e7eb' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      ₹{items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Create Invoice
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {viewInvoice && firmData && (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Invoice Preview</h2>
                <button onClick={() => setViewInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div id="invoice-content" style={{ border: '2px solid #e5e7eb', padding: '2rem', borderRadius: '0.5rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #3b82f6', paddingBottom: '1rem' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                    {firmData.firmName}
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{firmData.address}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>GST: {firmData.gstNumber}</p>
                </div>

                {/* Invoice Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Bill To:</h3>
                    <p style={{ fontWeight: '500' }}>{viewInvoice.customerName}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{viewInvoice.customerAddress}</p>
                    {viewInvoice.customerGST && (
                      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>GST: {viewInvoice.customerGST}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Invoice # {viewInvoice.invoiceNumber}
                    </p>
                    <p style={{ color: '#6b7280' }}>Date: {new Date(viewInvoice.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Item</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Rate</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center' }}>GST%</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{item.name}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{item.rate.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.gst}%</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ marginLeft: 'auto', width: '300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>Subtotal:</span>
                    <span>₹{viewInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>Total GST:</span>
                    <span>₹{viewInvoice.totalGST.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid #e5e7eb' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>₹{viewInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Download size={20} />
                Print / Download
              </button>
            </div>
          </div>
        )}

        {/* Invoices List */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {invoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <FileText size={48} style={{ margin: '0 auto 1rem' }} />
              <p>No invoices yet. Create your first invoice!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Invoice #</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{invoice.invoiceNumber}</td>
                      <td style={{ padding: '1rem' }}>{new Date(invoice.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{invoice.customerName}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#3b82f6' }}>
                        ₹{invoice.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => setViewInvoice(invoice)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#dbeafe',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#3b82f6',
                            fontWeight: '500'
                          }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
