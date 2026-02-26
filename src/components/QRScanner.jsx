import { useEffect, useRef, useState, useCallback } from 'react'
import { useGuests } from '../context/GuestContext'
import CheckInResult from './CheckInResult'

export default function QRScanner() {
  const { findByQr, checkIn } = useGuests()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const scannerRef = useRef(null)
  const isProcessingRef = useRef(false)

  const handleDismiss = useCallback(() => {
    setResult(null)
    isProcessingRef.current = false
  }, [])

  useEffect(() => {
    let scanner = null
    let stopped = false

    async function start() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (stopped) return

        scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (isProcessingRef.current) return
            isProcessingRef.current = true

            const guest = findByQr(decodedText)
            if (!guest) {
              setResult({ status: 'not_found' })
            } else if (guest.checkedIn) {
              setResult({ status: 'already', guest })
            } else {
              checkIn(guest.id)
              setResult({ status: 'success', guest })
            }
          },
          () => {}
        )
        setReady(true)
      } catch (err) {
        if (!stopped) {
          setError('Camera access denied or unavailable. ' + (err?.message || String(err)))
        }
      }
    }

    start()

    return () => {
      stopped = true
      if (scanner) {
        scanner.stop().then(() => scanner.clear()).catch(() => {})
      }
    }
  }, [findByQr, checkIn])

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        Point the camera at a guest&apos;s QR code
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!error && !ready && (
        <p className="text-center text-gray-400 text-sm py-4">Starting camera...</p>
      )}

      <div className="relative rounded-xl overflow-hidden bg-black">
        <div id="qr-reader" className="w-full" />
        {result && (
          <CheckInResult result={result} onDismiss={handleDismiss} />
        )}
      </div>
    </div>
  )
}
