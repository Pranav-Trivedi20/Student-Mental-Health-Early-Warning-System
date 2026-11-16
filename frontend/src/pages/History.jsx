import { useEffect, useState } from 'react'
import { fetchHistory } from '../services/api'

const assessmentNames = {
  overall: 'Overall Mental Health',
  depression: 'Depression Assessment',
  anxiety: 'Anxiety Assessment',
  stress: 'Stress Assessment',
}

function formatDate(timestamp) {
  if (!timestamp) return 'Date unavailable'

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function History() {
  const [historyList, setHistoryList] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        setError('')

        const data = await fetchHistory()
        setHistoryList(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Could not load assessment history.')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const getTitle = (item) =>
    assessmentNames[item.assessment_type] ||
    item.assessment_type ||
    'Assessment'

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Assessment History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your previously completed assessments and their results.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Assessments
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? '...' : historyList.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Latest Assessment
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {loading
              ? 'Loading...'
              : historyList.length > 0
                ? getTitle(historyList[0])
                : 'No assessments yet'}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Saved Assessment Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Records retrieved from your account.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {historyList.length} Records
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading your assessment history...
          </div>
        ) : historyList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl">📋</div>
            <h3 className="mt-4 font-bold text-slate-900">
              No assessments completed yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your completed assessments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Assessment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Model Version</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {historyList.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {getTitle(item)}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(item.timestamp)}
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.score !== null && item.score !== undefined
                        ? `${Number(item.score).toFixed(2)} / 10`
                        : 'Unavailable'}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.model_version || 'Not available'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedResult(item)}
                        className="rounded-lg bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Assessment Record
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {getTitle(selectedResult)}
                </h3>
              </div>

              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Prediction Score
              </p>
              <p className="mt-2 text-4xl font-bold text-blue-600">
                {selectedResult.score !== null &&
                selectedResult.score !== undefined
                  ? `${Number(selectedResult.score).toFixed(2)} / 10`
                  : 'Unavailable'}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Date
                </p>
                <p className="mt-1 font-medium text-slate-800">
                  {formatDate(selectedResult.timestamp)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Model Version
                </p>
                <p className="mt-1 font-medium text-slate-800">
                  {selectedResult.model_version || 'Not available'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Risk Level
                </p>
                <p className="mt-1 font-medium text-slate-800">
                  {selectedResult.risk_level || 'Not assigned by this model'}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-slate-500">
                This record displays the information saved by the assessment
                system. No additional contributing factors or recommendations
                are inferred.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History