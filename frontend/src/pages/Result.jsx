
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

  // Read the category and interpretation returned by the backend.
  const riskLevel = result.risk_level
  const interpretation = result.interpretation

  const categoryStyles = {
    Good: 'border-green-200 bg-green-50 text-green-800',
    Fair: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    'Moderate concern': 'border-orange-200 bg-orange-50 text-orange-800',
    'High concern': 'border-red-200 bg-red-50 text-red-800'
  }

  const categoryStyle =
    categoryStyles[riskLevel] ||
    'border-slate-200 bg-slate-50 text-slate-700'

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        ← Return to Dashboard
      </button>

      {/* PAGE HEADING */}
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

      {/* MAIN RESULT CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">

        <div className="grid gap-6 sm:grid-cols-3 sm:items-center">

          {/* SCORE */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Model Score
            </span>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-blue-600">
                {Number.isFinite(score) ? score.toFixed(2) : 'N/A'}
              </span>

              <span className="text-lg font-bold text-slate-400">
                / 10
              </span>
            </div>
          </div>

          {/* RESULT INFORMATION */}
          <div className="space-y-3 sm:col-span-2">

            <h2 className="text-xl font-bold text-slate-900">
              Your assessment has been completed.
            </h2>

            {riskLevel && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assessment Category
                </span>

                <div className={`mt-2 inline-flex rounded-xl border px-4 py-2 text-sm font-bold ${categoryStyle}`}>
                  {riskLevel}
                </div>
              </div>
            )}

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

      {/* TABLE 3.4 INTERPRETATION */}
      {interpretation && (
        <div className={`rounded-2xl border p-6 ${categoryStyle}`}>
          <h2 className="font-bold">
            What does your category mean?
          </h2>

          <p className="mt-2 text-sm leading-relaxed">
            {interpretation}
          </p>
        </div>
      )}

      {/* GENERAL EXPLANATION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">
          Understanding your result
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The model produces a numerical score from the assessment inputs.
          The category and interpretation are based on the result bands
          specified in Table 3.4 of the project report.
          This score should not be treated as a clinical diagnosis or
          substitute for professional evaluation.
        </p>
      </div>

      {/* ACTION BUTTONS */}
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

      {/* IMPORTANT NOTICE */}
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
