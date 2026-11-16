
import { useLocation, useNavigate } from 'react-router'

function Result() {
  const location = useLocation()
  const navigate = useNavigate()

  const result = location.state

  // Do not display fabricated results if someone opens this page directly.
  if (!result || result.score === undefined || result.score === null) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">
          No assessment result found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please complete the assessment to view your result.
        </p>
        <button
          onClick={() => navigate('/assessment/overall')}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Start Assessment
        </button>
      </div>
    )
  }

  const score = Number(result.score)
  const formattedDate = result.timestamp
    ? new Date(result.timestamp).toLocaleString('en-IN')
    : 'Just now'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        ← Return to Dashboard
      </button>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Assessment Result
        </span>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {result.title || 'Overall Mental Health Assessment'}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Generated using the Overall TabNet regression model.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Model Score
            </span>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-blue-600">
                {Number.isFinite(score) ? score.toFixed(2) : 'N/A'}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 10</span>
            </div>
          </div>

          <div className="space-y-3 sm:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">
              Your assessment has been completed.
            </h2>

            <p className="text-sm leading-relaxed text-slate-600">
              This score is the output of the machine learning model based on
              the responses you provided. It is intended for self-awareness
              and early-warning purposes.
            </p>

            <div className="space-y-1 text-xs text-slate-400">
              <p>Assessment: {result.assessment_type}</p>
              <p>Model version: {result.model_version || 'Not specified'}</p>
              <p>Generated: {formattedDate}</p>
              <p>Result ID: {result.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">
          What does this result mean?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The model produces a numerical score from the assessment inputs.
          This score should not be treated as a clinical diagnosis or as a
          substitute for professional evaluation.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/history')}
          className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View Assessment History
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Important Notice
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-amber-900">
          This system does not provide a medical diagnosis. If you are
          experiencing emotional distress or other mental health concerns,
          consider speaking with a qualified healthcare professional or
          campus counselor.
        </p>
      </div>
    </div>
  )
}

export default Result
