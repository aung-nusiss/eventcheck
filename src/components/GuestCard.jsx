import { useGuests } from '../context/GuestContext'

const TICKET_STYLES = {
  general: 'bg-slate-100 text-slate-700',
  vip: 'bg-purple-100 text-purple-700',
  speaker: 'bg-blue-100 text-blue-700',
}

export default function GuestCard({ guest, showUndo = false }) {
  const { checkIn, undoCheckIn, lastAction } = useGuests()

  const canUndo = showUndo && lastAction?.type === 'CHECK_IN' && lastAction?.id === guest.id

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 truncate">{guest.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TICKET_STYLES[guest.ticket] || TICKET_STYLES.general}`}>
            {guest.ticket}
          </span>
          {guest.isWalkIn && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
              Walk-in
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{guest.email}</p>
        {guest.company && (
          <p className="text-sm text-gray-400 truncate">{guest.company}</p>
        )}
      </div>

      <div className="flex items-center gap-3 ml-4 shrink-0">
        {guest.checkedIn ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              Checked In
            </span>
            {canUndo && (
              <button
                onClick={undoCheckIn}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Undo
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => checkIn(guest.id)}
            className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Check In
          </button>
        )}
      </div>
    </div>
  )
}
