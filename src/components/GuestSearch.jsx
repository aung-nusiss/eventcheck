import { useMemo, useState } from 'react'
import { useGuests } from '../context/GuestContext'
import GuestCard from './GuestCard'

export default function GuestSearch() {
  const { guests } = useGuests()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    return guests.filter(
      g => g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)
    )
  }, [guests, query])

  return (
    <div className="space-y-4">
      <input
        type="text"
        autoFocus
        placeholder="Search by name or email..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {query.trim().length < 2 ? (
        <p className="text-center text-gray-400 py-8">Type at least 2 characters to search</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No guests found for &quot;{query}&quot;</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          {results.map(guest => (
            <GuestCard key={guest.id} guest={guest} showUndo={false} />
          ))}
        </div>
      )}
    </div>
  )
}
