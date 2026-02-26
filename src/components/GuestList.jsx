import { useState, useEffect } from 'react'
import { useGuests } from '../context/GuestContext'
import GuestCard from './GuestCard'

export default function GuestList() {
  const { guests, lastAction, undoCheckIn, clearLastAction } = useGuests()
  const [statusFilter, setStatusFilter] = useState('all')
  const [ticketFilter, setTicketFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = guests.filter(g => {
    if (statusFilter === 'checked-in' && !g.checkedIn) return false
    if (statusFilter === 'not-checked-in' && g.checkedIn) return false
    if (ticketFilter !== 'all' && g.ticket !== ticketFilter) return false
    if (search.trim().length >= 2) {
      const q = search.toLowerCase()
      return g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)
    }
    return true
  })

  const checkedInCount = guests.filter(g => g.checkedIn).length
  const total = guests.length
  const progress = total > 0 ? (checkedInCount / total) * 100 : 0

  const lastCheckedInGuest = lastAction?.type === 'CHECK_IN'
    ? guests.find(g => g.id === lastAction.id)
    : null

  useEffect(() => {
    if (!lastCheckedInGuest) return
    const timer = setTimeout(clearLastAction, 5000)
    return () => clearTimeout(timer)
  }, [lastCheckedInGuest, clearLastAction])

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">{checkedInCount} / {total} checked in</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search guests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">All statuses</option>
          <option value="checked-in">Checked in</option>
          <option value="not-checked-in">Not checked in</option>
        </select>
        <select
          value={ticketFilter}
          onChange={e => setTicketFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">All tickets</option>
          <option value="general">General</option>
          <option value="vip">VIP</option>
          <option value="speaker">Speaker</option>
        </select>
      </div>

      {/* Guest list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No guests match your filters.</p>
        ) : (
          filtered.map(guest => (
            <GuestCard key={guest.id} guest={guest} showUndo={true} />
          ))
        )}
      </div>

      {/* Undo toast */}
      {lastCheckedInGuest && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-4 z-50">
          <span className="text-sm">{lastCheckedInGuest.name} checked in</span>
          <button
            onClick={undoCheckIn}
            className="text-sm font-semibold text-indigo-300 hover:text-indigo-200"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  )
}
