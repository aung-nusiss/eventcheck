import { useEffect } from 'react'

const STATUS_CONFIG = {
  success: {
    bg: 'bg-green-500',
    icon: '✓',
    title: 'Checked In!',
  },
  already: {
    bg: 'bg-amber-500',
    icon: '⚠',
    title: 'Already Checked In',
  },
  not_found: {
    bg: 'bg-red-500',
    icon: '✕',
    title: 'Guest Not Found',
  },
}

export default function CheckInResult({ result, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!result) return null

  const config = STATUS_CONFIG[result.status]

  return (
    <div
      className={`absolute inset-0 ${config.bg} flex flex-col items-center justify-center cursor-pointer z-10`}
      onClick={onDismiss}
    >
      <div className="text-white text-center p-8">
        <div className="text-6xl font-bold mb-4">{config.icon}</div>
        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>

        {result.status === 'success' && result.guest && (
          <div className="mt-4 space-y-1">
            <p className="text-xl font-semibold">{result.guest.name}</p>
            <p className="text-lg opacity-90 capitalize">{result.guest.ticket} ticket</p>
            {result.guest.company && (
              <p className="text-base opacity-80">{result.guest.company}</p>
            )}
          </div>
        )}

        {result.status === 'already' && result.guest && (
          <div className="mt-4 space-y-1">
            <p className="text-xl font-semibold">{result.guest.name}</p>
            {result.guest.checkedInAt && (
              <p className="text-base opacity-80">
                Checked in at {new Date(result.guest.checkedInAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        {result.status === 'not_found' && (
          <p className="mt-4 text-base opacity-80">Try name/email search or register as walk-in</p>
        )}

        <p className="mt-6 text-sm opacity-60">Tap to dismiss</p>
      </div>
    </div>
  )
}
