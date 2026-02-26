import { createContext, useContext, useReducer } from 'react'
import { initialGuests } from '../data/guests'

const GuestContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'CHECK_IN': {
      const previousGuest = state.guests.find(g => g.id === action.id)
      return {
        ...state,
        guests: state.guests.map(g =>
          g.id === action.id
            ? { ...g, checkedIn: true, checkedInAt: new Date().toISOString() }
            : g
        ),
        lastAction: { type: 'CHECK_IN', id: action.id, previousState: previousGuest },
      }
    }
    case 'UNDO_CHECK_IN': {
      if (!state.lastAction || state.lastAction.type !== 'CHECK_IN') return state
      const { id, previousState } = state.lastAction
      return {
        ...state,
        guests: state.guests.map(g =>
          g.id === id
            ? { ...g, checkedIn: previousState.checkedIn, checkedInAt: previousState.checkedInAt }
            : g
        ),
        lastAction: null,
      }
    }
    case 'ADD_GUEST':
      return {
        ...state,
        guests: [...state.guests, action.guest],
        lastAction: null,
      }
    case 'CLEAR_LAST_ACTION':
      return { ...state, lastAction: null }
    default:
      return state
  }
}

export function GuestProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    guests: initialGuests,
    lastAction: null,
  })

  const checkIn = (id) => dispatch({ type: 'CHECK_IN', id })
  const undoCheckIn = () => dispatch({ type: 'UNDO_CHECK_IN' })
  const addGuest = (guest) => dispatch({ type: 'ADD_GUEST', guest })
  const clearLastAction = () => dispatch({ type: 'CLEAR_LAST_ACTION' })
  const findByQr = (qrCode) => state.guests.find(g => g.qrCode === qrCode) || null

  return (
    <GuestContext.Provider value={{ guests: state.guests, lastAction: state.lastAction, checkIn, undoCheckIn, addGuest, clearLastAction, findByQr }}>
      {children}
    </GuestContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGuests() {
  const ctx = useContext(GuestContext)
  if (!ctx) throw new Error('useGuests must be used within GuestProvider')
  return ctx
}
