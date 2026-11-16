import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { fetchCurrentUser, fetchHistory } from '../services/api'

const assessments = [
  {
    type: 'overall',
    title: 'Overall Mental Health',
    subtitle: 'Comprehensive Wellbeing Assessment',
    description:
      'Get an overall early-warning assessment of your general mental wellbeing and daily functioning.',
    icon: '📊',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    type: 'depression',
    title: 'Depression Assessment',
    subtitle: 'PHQ-9 Derived Early Warning',
    description:
      'Assess indicators associated with depressive symptoms, mood regulation, and daily energy levels.',
    icon: '💙',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    type: 'anxiety',
    title: 'Anxiety Assessment',
    subtitle: 'GAD-7 Derived Early Warning',
    description:
      'Understand your current level of anxiety-related symptoms, worrying, and stress responsiveness.',
    icon: '🌊',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    type: 'stress',
    title: 'Stress Assessment',
    subtitle: 'PSS-10 Derived Early Warning',
    description:
      'Evaluate your current perceived academic stress, coping mechanisms, and workload pressures.',
    icon: '⚡',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
]

const assessmentNames = {
  overall: 'Overall Mental Health',
  depression: 'Depression',
  anxiety: 'Anxiety',
  stress: 'Stress',
}

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const [userData, historyData] = await Promise.all([
          fetchCurrentUser(),
          fetchHistory(),
        ])

        setUser(userData)
        setHistory(Array.isArray(historyData) ? historyData : [])
      } catch (err) {
        setError(err.message || 'Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const latestAssessment = history[0]

  const latestAssessmentName = latestAssessment
    ? assessmentNames[latestAssessment.assessment_type] ||
      latestAssessment.assessment_type
    : 'No assessments yet'

  const latestScore =
    latestAssessment?.score !== null &&
    latestAssessment?.score !== undefined
      ? `${Number(latestAssessment.score).toFixed(1)}/10`
      : 'Not available'

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-lg sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300">
            JUET Early Warning Portal
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome, {user?.name || 'Student'}.
          </h1>

          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Take a moment to check in with your mental wellbeing. Choose an
            assessment below to get started.
          </p>
        </div>

        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Assessments Completed
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? '...' : history.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Latest Assessment
          </p>
          <p className="mt-2 truncate text-xl font-bold text-slate-900">
            {loading ? 'Loading...' : latestAssessmentName}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Latest Prediction Score
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {loading ? '...' : latestScore}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Assessment Systems
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select an assessment to check your mental wellbeing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {assessments.map((item) => (
            <div
              key={item.type}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl ${item.color}`}
                  >
                    {item.icon}
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    Assessment
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-xs font-medium text-blue-600">
                  {item.subtitle}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-4">
                <button
                  onClick={() => navigate(`/assessment/${item.type}`)}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  <span>Start Assessment</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
            🛡️
          </div>

          <div>
            <h3 className="text-sm font-bold text-blue-900">
              Student Privacy Protection
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-blue-800">
              Your assessment history is associated with your account.
              This system provides early-warning information and does not
              provide a medical diagnosis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard