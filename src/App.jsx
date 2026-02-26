import { useState } from 'react'
import { GuestProvider, useGuests } from './context/GuestContext'
import QRScanner from './components/QRScanner'
import GuestSearch from './components/GuestSearch'
import GuestList from './components/GuestList'
import WalkInForm from './components/WalkInForm'

const TABS = [
  { id: 'scan', label: 'Scan QR' },
  { id: 'search', label: 'Search' },
  { id: 'list', label: 'Guest List' },
  { id: 'walkin', label: 'Walk-in' },
]

function AppShell() {
  const [activeTab, setActiveTab] = useState('list')
  const { guests } = useGuests()

  const checkedInCount = guests.filter(g => g.checkedIn).length
  const total = guests.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-bold text-indigo-600">EventCheck</h1>
            <span className="text-sm text-gray-500 font-medium">
              {checkedInCount} / {total} checked in
            </span>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 -mb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'scan' && <QRScanner />}
        {activeTab === 'search' && <GuestSearch />}
        {activeTab === 'list' && <GuestList />}
        {activeTab === 'walkin' && <WalkInForm />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <GuestProvider>
      <AppShell />
    </GuestProvider>
  )
}
