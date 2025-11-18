'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, FileText, Plus, Menu } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [firmData, setFirmData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const storedData = localStorage.getItem('firmData')
    if (storedData) {
      setFirmData(JSON.parse(storedData))
    }

    // Initialize sample data if not exists
    if (!localStorage.getItem('transactions')) {
      localStorage.setItem('transactions', JSON.stringify([]))
    }
    if (!localStorage.getItem('inventory')) {
      localStorage.setItem('inventory', JSON.stringify([]))
    }
    if (!localStorage.getItem('invoices')) {
      localStorage.setItem('invoices', JSON.stringify([]))
    }
  }, [router])

  const salesData = [
    { month: 'Jan', sales: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', sales: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', sales: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', sales: 61000, expenses: 38000, profit: 23000 },
    { month: 'May', sales: 55000, expenses: 36000, profit: 19000 },
    { month: 'Jun', sales: 67000, expenses: 40000, profit: 27000 }
  ]

  const expenseData = [
    { name: 'Purchases', value: 45 },
    { name: 'Salaries', value: 30 },
    { name: 'Rent', value: 15 },
    { name: 'Utilities', value: 10 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  const stats = [
    { label: 'Total Sales', value: '₹3,28,000', icon: DollarSign, change: '+12.5%', positive: true },
    { label: 'Revenue', value: '₹1,14,000', icon: TrendingUp, change: '+8.2%', positive: true },
    { label: 'Tax Due', value: '₹18,450', icon: FileText, change: '+5.3%', positive: false },
    { label: 'Expenses', value: '₹2,14,000', icon: TrendingDown, change: '-3.1%', positive: true },
    { label: 'Purchases', value: '₹1,85,000', icon: ShoppingCart, change: '+6.7%', positive: false },
    { label: 'Inventory Value', value: '₹67,500', icon: Package, change: '+2.4%', positive: true }
  ]

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  if (!firmData) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: showMenu ? '250px' : '0',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        transition: 'width 0.3s',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>AI Accounting</h2>
          <nav>
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Journal', path: '/journal' },
              { name: 'Inventory', path: '/inventory' },
              { name: 'Invoices', path: '/invoices' },
              { name: 'Reports', path: '/reports' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '0.5rem',
                  background: item.path === '/dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginTop: '2rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: showMenu ? '250px' : '0', transition: 'margin-left 0.3s' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Dashboard</h1>
          </div>
          <div style={{ color: '#6b7280' }}>
            <p style={{ fontWeight: '500' }}>{firmData.firmName}</p>
            <p style={{ fontSize: '0.9rem' }}>{firmData.email}</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '2rem' }}>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>{stat.value}</p>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    background: '#eff6ff',
                    borderRadius: '0.5rem'
                  }}>
                    <stat.icon size={24} color="#3b82f6" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {stat.positive ? (
                    <TrendingUp size={16} color="#10b981" />
                  ) : (
                    <TrendingDown size={16} color="#ef4444" />
                  )}
                  <span style={{
                    color: stat.positive ? '#10b981' : '#ef4444',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    {stat.change}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Sales & Profit Chart */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                Sales & Profit Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                Expense Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Performance */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              Monthly Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {[
              { label: 'New Journal Entry', path: '/journal', color: '#3b82f6' },
              { label: 'Add Inventory', path: '/inventory', color: '#10b981' },
              { label: 'Create Invoice', path: '/invoices', color: '#f59e0b' },
              { label: 'View Reports', path: '/reports', color: '#8b5cf6' }
            ].map((action, index) => (
              <a
                key={index}
                href={action.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  background: action.color,
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'transform 0.2s'
                }}
              >
                <Plus size={20} />
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
