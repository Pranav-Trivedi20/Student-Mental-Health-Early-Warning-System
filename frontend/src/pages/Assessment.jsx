
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { predictAssessment } from '../services/api'

const fields = [
  {
    key: 'age',
    title: 'What is your age?',
    type: 'number',
    min: 15,
    max: 100,
  },
  {
    key: 'year',
    title: 'Which year of your degree are you currently studying in?',
    type: 'select',
    options: [
      { label: '1st Year', value: 1 },
      { label: '2nd Year', value: 2 },
      { label: '3rd Year', value: 3 },
      { label: '4th Year', value: 4 },
      { label: '5th Year', value: 5 },
      { label: '6th Year', value: 6 },
    ],
  },
  {
    key: 'sleep',
    title: 'How many hours do you usually sleep each day?',
    options: ['<4 hrs', '4–5 hrs', '5–6 hrs', '6–7 hrs', '7–8 hrs'],
  },
  {
    key: 'screen',
    title: 'How many hours do you usually spend on screens each day?',
    options: ['2–4 hrs', '4–6 hrs', '6–8 hrs', '8+ hrs'],
  },
  {
    key: 'nervous',
    title: 'How often have you felt nervous or anxious?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    key: 'relax',
    title: 'How often have you had difficulty relaxing?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    key: 'interest',
    title: 'How often have you had little interest or pleasure in doing things?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    key: 'down',
    title: 'How often have you felt down or hopeless?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    key: 'concentration',
    title: 'How often have you had difficulty concentrating?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    key: 'control',
    title: 'How often have you felt able to control important things in your life?',
    options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
  },
  {
    key: 'confidence',
    title: 'How often have you felt confident about handling personal problems?',
    options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
  },
  {
    key: 'attendance',
    title: 'What is your approximate class attendance?',
    options: ['90%+', '75–90%', '60–75%', '<60%'],
  },
]

function Assessment() {
  const { type } = useParams()
  const navigate = useNavigate()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const field = fields[currentQuestion]
  const currentAnswer = answers[field.key] ?? ''

  const selectAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [field.key]: value,
    }))
    setError('')
  }

  const handleNext = async () => {
    if (currentAnswer === '') return

    if (currentQuestion < fields.length - 1) {
      setCurrentQuestion((previous) => previous + 1)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const responses = {
        ...answers,
        age: Number(answers.age),
        year: Number(answers.year),
      }

      const result = await predictAssessment('overall', responses)

      navigate('/result', {
        state: result,
      })
    } catch (err) {
      setError(err.message || 'Could not generate your result. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = Math.round(((currentQuestion + 1) / fields.length) * 100)

  if (type && type !== 'overall') {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">
          Assessment not available yet
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Currently, only the Overall Mental Health model is integrated.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        ← Back to dashboard
      </button>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Overall Mental Health
            </span>

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Overall Mental Health Assessment
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Answer these questions to complete your assessment.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-center">
            <span className="block text-xs text-slate-400">Question</span>
            <span className="text-lg font-bold text-slate-900">
              {currentQuestion + 1} / {fields.length}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Question {currentQuestion + 1}
        </span>

        <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
          {field.title}
        </h2>

        <div className="mt-6 space-y-3">
          {field.type === 'number' ? (
            <input
              type="number"
              min={field.min}
              max={field.max}
              value={currentAnswer}
              onChange={(event) => selectAnswer(event.target.value)}
              placeholder="Enter your age"
              className="w-full rounded-2xl border border-slate-200 p-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          ) : field.type === 'select' ? (
            field.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectAnswer(option.value)}
                className={`w-full rounded-2xl border p-4 text-left text-sm transition ${
                  currentAnswer === option.value
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            field.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectAnswer(option)}
                className={`w-full rounded-2xl border p-4 text-left text-sm transition ${
                  currentAnswer === option
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option}
              </button>
            ))
          )}
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => setCurrentQuestion((previous) => Math.max(0, previous - 1))}
            disabled={currentQuestion === 0 || isSubmitting}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={
              currentAnswer === '' ||
              (field.key === 'age' &&
                (Number(currentAnswer) < 15 || Number(currentAnswer) > 100)) ||
              isSubmitting
            }
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? 'Analyzing...'
              : currentQuestion === fields.length - 1
                ? 'Generate Result'
                : 'Next →'}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
        Your responses are used to generate an early-warning score. This system
        does not provide a medical diagnosis.
      </p>
    </div>
  )
}

export default Assessment
