import { useEffect, useMemo, useState } from 'react'
import PassageCard from './components/PassageCard'
import { getPlanById, getReadingForDay, readingPlans } from './data/readingPlan'
import { fetchPassage } from './services/esvApi'

const STORAGE_KEYS = {
  startDate: 'dailyBread.startDate',
  completedDays: 'dailyBread.completedDays',
  planId: 'dailyBread.planId',
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

const getStoredPlanId = () =>
  localStorage.getItem(STORAGE_KEYS.planId) || readingPlans[0]?.id || ''

const getStoredCompletedByPlan = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.completedDays)
  if (!stored) return {}
  try {
    const parsed = JSON.parse(stored)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function App() {
  const [startDate, setStartDate] = useState(getStoredStartDate)
  const [planId, setPlanId] = useState(getStoredPlanId)
  const [completedByPlan, setCompletedByPlan] = useState(getStoredCompletedByPlan)
  const [passages, setPassages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const selectedPlan = useMemo(() => getPlanById(planId), [planId])
  const planLength = selectedPlan?.totalDays || selectedPlan?.readings?.length || 0
  const completedDays = completedByPlan[planId] || []

  useEffect(() => {
    if (!readingPlans.some((plan) => plan.id === planId)) {
      setPlanId(readingPlans[0]?.id || '')
    }
  }, [planId])

  const currentDayIndex = useMemo(() => {
    if (planLength === 0) return 0
    const today = new Date()
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const start = parseDateInput(startDate)
    const diffMs = todayLocal - start
    const diffDays = Math.max(0, Math.floor(diffMs / 86400000))
    return Math.min(diffDays, planLength - 1)
  }, [planLength, startDate])

  const currentDayNumber = planLength ? currentDayIndex + 1 : 0
  const currentReading = getReadingForDay(selectedPlan, currentDayNumber)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.startDate, startDate)
  }, [startDate])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.completedDays, JSON.stringify(completedByPlan))
  }, [completedByPlan])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.planId, planId)
  }, [planId])

  useEffect(() => {
    if (!selectedPlan || planLength === 0) return
    if (!currentReading) {
      setPassages([])
      setIsLoading(false)
      setError('')
      setNotice(
        `No reading is defined for day ${currentDayNumber} in this plan yet. Update src/data/readingPlan.js to add it.`,
      )
      return
    }

    let isActive = true
    setNotice('')

    const loadPassages = async () => {
      setIsLoading(true)
      setError('')

      try {
        const results = await Promise.all(
          currentReading.references.map(async (reference) => ({
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
  }, [currentDayNumber, currentReading, planLength, selectedPlan])

  const isCompleted = currentDayNumber ? completedDays.includes(currentDayNumber) : false

  const toggleComplete = () => {
    if (!currentDayNumber) return
    setCompletedByPlan((prev) => {
      const currentCompleted = prev[planId] || []
      const updated = currentCompleted.includes(currentDayNumber)
        ? currentCompleted.filter((day) => day !== currentDayNumber)
        : [...currentCompleted, currentDayNumber]

      return {
        ...prev,
        [planId]: updated,
      }
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Daily Bread</p>
          <h1>ESV Reading Dashboard</h1>
          <p className="muted">
            Choose a plan and start date to generate today&apos;s reading.
          </p>
        </div>
        <div className="controls">
          <label className="field">
            <span>Reading plan</span>
            <select
              value={planId}
              onChange={(event) => setPlanId(event.target.value)}
            >
              {readingPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.label}
                </option>
              ))}
            </select>
          </label>
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
                Day {currentDayNumber} of {planLength}
              </strong>
              <span className="muted">{selectedPlan?.description}</span>
            </div>
            <button type="button" onClick={toggleComplete}>
              {isCompleted ? 'Completed' : 'Mark complete'}
            </button>
          </div>
        </div>
      </header>

      <section className="passages">
        {error && <p className="error">{error}</p>}
        {notice && !error && <p className="muted">{notice}</p>}
        {!error && isLoading && passages.length === 0 && (
          <p className="muted">Loading passage...</p>
        )}
        {!error && currentReading ? (
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
