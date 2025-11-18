'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Package, ArrowLeft, Edit2, Trash2 } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  supplier: string
  invoiceNumber: string
  purchaseCost: number
  salesPrice: number
  hsnCode: string
  gstPercentage: number
  quantity: number
  createdAt: string
}

export default function Inventory() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    invoiceNumber: '',
    purchaseCost: '',
    salesPrice: '',
    hsnCode: '',
    gstPercentage: '',
    quantity: ''
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const storedItems = localStorage.getItem('inventory')
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const itemData: InventoryItem = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      supplier: formData.supplier,
      invoiceNumber: formData.invoiceNumber,
      purchaseCost: parseFloat(formData.purchaseCost),
      salesPrice: parseFloat(formData.salesPrice),
      hsnCode: formData.hsnCode,
      gstPercentage: parseFloat(formData.gstPercentage),
      quantity: parseInt(formData.quantity),
      createdAt: editingId ? items.find(i => i.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    }

    let updatedItems
    if (editingId) {
      updatedItems = items.map(item => item.id === editingId ? itemData : item)
    } else {
      updatedItems = [itemData, ...items]
    }

    setItems(updatedItems)
    localStorage.setItem('inventory', JSON.stringify(updatedItems))

    // Reset form
    setFormData({
      name: '',
      supplier: '',
      invoiceNumber: '',
      purchaseCost: '',
      salesPrice: '',
      hsnCode: '',
      gstPercentage: '',
      quantity: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      supplier: item.supplier,
      invoiceNumber: item.invoiceNumber,
      purchaseCost: item.purchaseCost.toString(),
      salesPrice: item.salesPrice.toString(),
      hsnCode: item.hsnCode,
      gstPercentage: item.gstPercentage.toString(),
      quantity: item.quantity.toString()
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id)
      setItems(updatedItems)
      localStorage.setItem('inventory', JSON.stringify(updatedItems))
    }
  }

  const totalValue = items.reduce((sum, item) => sum + (item.purchaseCost * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

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
              <Package size={32} color="#10b981" />
              Inventory Management
            </h1>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({
                name: '',
                supplier: '',
                invoiceNumber: '',
                purchaseCost: '',
                salesPrice: '',
                hsnCode: '',
                gstPercentage: '',
                quantity: ''
              })
              setShowForm(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Items</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{items.length}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Quantity</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{totalItems}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Value</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>₹{totalValue.toLocaleString()}</p>
          </div>
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
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {editingId ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Item Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      placeholder="Enter item name"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Supplier *</label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Invoice Number *</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      placeholder="INV-001"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Purchase Cost (₹) *</label>
                      <input
                        type="number"
                        name="purchaseCost"
                        value={formData.purchaseCost}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        style={inputStyle}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Sales Price (₹) *</label>
                      <input
                        type="number"
                        name="salesPrice"
                        value={formData.salesPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        style={inputStyle}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>HSN Code *</label>
                      <input
                        type="text"
                        name="hsnCode"
                        value={formData.hsnCode}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        placeholder="1234"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>GST % *</label>
                      <input
                        type="number"
                        name="gstPercentage"
                        value={formData.gstPercentage}
                        onChange={handleChange}
                        required
                        min="0"
                        max="100"
                        step="0.01"
                        style={inputStyle}
                        placeholder="18"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="1"
                      style={inputStyle}
                      placeholder="1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    marginTop: '1.5rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Items List */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <Package size={48} style={{ margin: '0 auto 1rem' }} />
              <p>No inventory items yet. Add your first item!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Item Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Supplier</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Invoice #</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Purchase Cost</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Sales Price</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Quantity</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>HSN</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>GST %</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Total Value</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                      <td style={{ padding: '1rem' }}>{item.supplier}</td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>{item.invoiceNumber}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>₹{item.purchaseCost.toFixed(2)}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>₹{item.salesPrice.toFixed(2)}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: item.quantity < 10 ? '#fee2e2' : '#dcfce7',
                          color: item.quantity < 10 ? '#dc2626' : '#16a34a',
                          borderRadius: '1rem',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          {item.quantity}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.hsnCode}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.gstPercentage}%</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                        ₹{(item.purchaseCost * item.quantity).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{
                              padding: '0.5rem',
                              background: '#dbeafe',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit2 size={16} color="#3b82f6" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              padding: '0.5rem',
                              background: '#fee2e2',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={16} color="#dc2626" />
                          </button>
                        </div>
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
