import { useState } from 'react'
import { useGuests } from '../context/GuestContext'
import { createWalkIn } from '../data/guests'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function WalkInForm() {
  const { addGuest } = useGuests()
  const [form, setForm] = useState({ name: '', email: '', company: '', ticket: 'general' })
  const [errors, setErrors] = useState({})
  const [registered, setRegistered] = useState(null)

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_REGEX.test(form.email)) errs.email = 'Enter a valid email address'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const guest = createWalkIn(form)
    addGuest(guest)
    setRegistered(guest)
  }

  function handleReset() {
    setForm({ name: '', email: '', company: '', ticket: 'general' })
    setErrors({})
    setRegistered(null)
  }

  if (registered) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Walk-in Registered!</h2>
        <p className="text-gray-600 mb-6">{registered.name} has been checked in.</p>
        <button
          onClick={handleReset}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Register Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(ev => ({ ...ev, name: undefined })) }}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Full name"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(ev => ({ ...ev, email: undefined })) }}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="email@example.com"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <input
          type="text"
          value={form.company}
          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
        <select
          value={form.ticket}
          onChange={e => setForm(f => ({ ...f, ticket: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="general">General</option>
          <option value="vip">VIP</option>
          <option value="speaker">Speaker</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Register & Check In
      </button>
    </form>
  )
}
