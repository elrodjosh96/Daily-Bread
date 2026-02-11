import { useEffect, useMemo, useState } from 'react'
import PassageCard from './components/PassageCard'
import { readingPlan } from './data/readingPlan'
import { fetchPassage } from './services/esvApi'

const STORAGE_KEYS = {
  startDate: 'dailyBread.startDate',
  completedDays: 'dailyBread.completedDays',
}

const formatDateInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDateInput = (value) => {
  if (!value) return new Date()
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const getStoredStartDate = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.startDate)
  if (stored) return stored
  return formatDateInput(new Date())
}

const getStoredCompletedDays = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.completedDays)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [startDate, setStartDate] = useState(getStoredStartDate)
  const [completedDays, setCompletedDays] = useState(getStoredCompletedDays)
  const [passages, setPassages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const currentDayIndex = useMemo(() => {
    if (readingPlan.length === 0) return 0
    const today = new Date()
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const start = parseDateInput(startDate)
    const diffMs = todayLocal - start
    const diffDays = Math.max(0, Math.floor(diffMs / 86400000))
    return Math.min(diffDays, readingPlan.length - 1)
  }, [startDate])

  const currentDay = readingPlan[currentDayIndex]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.startDate, startDate)
  }, [startDate])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.completedDays, JSON.stringify(completedDays))
  }, [completedDays])

  useEffect(() => {
    if (!currentDay) return
    let isActive = true

    const loadPassages = async () => {
      setIsLoading(true)
      setError('')

      try {
        const results = await Promise.all(
          currentDay.references.map(async (reference) => ({
            reference,
            text: await fetchPassage(reference),
          })),
        )

        if (isActive) {
          setPassages(results)
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || 'Unable to load passages.')
          setPassages([])
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadPassages()

    return () => {
      isActive = false
    }
  }, [currentDay])

  const isCompleted = currentDay ? completedDays.includes(currentDay.day) : false

  const toggleComplete = () => {
    if (!currentDay) return
    setCompletedDays((prev) => {
      if (prev.includes(currentDay.day)) {
        return prev.filter((day) => day !== currentDay.day)
      }
      return [...prev, currentDay.day]
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Daily Bread</p>
          <h1>ESV Reading Dashboard</h1>
          <p className="muted">
            Your current reading is based on the start date you choose below.
          </p>
        </div>
        <div className="controls">
          <label className="field">
            <span>Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <div className="status">
            <div>
              <span className="muted">Today</span>
              <strong>
                Day {currentDay?.day ?? 0} of {readingPlan.length}
              </strong>
            </div>
            <button type="button" onClick={toggleComplete}>
              {isCompleted ? 'Completed' : 'Mark complete'}
            </button>
          </div>
        </div>
      </header>

      <section className="passages">
        {error && <p className="error">{error}</p>}
        {!error && isLoading && passages.length === 0 && (
          <p className="muted">Loading passage...</p>
        )}
        {!error && currentDay ? (
          passages.map((passage) => (
            <PassageCard
              key={passage.reference}
              reference={passage.reference}
              text={passage.text}
              isLoading={isLoading}
              error={error}
            />
          ))
        ) : (
          !error && <p className="muted">Add readings to start your plan.</p>
        )}
      </section>

      <footer className="attribution">
        <p>
          Scripture quotations are from The ESV® Bible (The Holy Bible, English
          Standard Version®), copyright © 2001 by Crossway, a publishing
          ministry of Good News Publishers. Used by permission. All rights
          reserved.
        </p>
      </footer>
    </div>
  )
}

export default App
