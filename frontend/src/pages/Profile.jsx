import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../services/api'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError('')

        const data = await fetchCurrentUser()
        setProfile(data)
      } catch (err) {
        setError(err.message || 'Could not load your profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const initials = profile?.name
    ? profile.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'S'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Student Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your registered account information.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            {loading ? '...' : initials}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {loading ? 'Loading...' : profile?.name || 'Name unavailable'}
            </h2>
            <p className="mt-1 text-xs font-medium text-blue-600">
              Registered Student
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading account information...
          </p>
        ) : profile ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Full Name
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                {profile.name}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Email
              </p>
              <div className="break-all rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                {profile.email}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Account ID
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                {profile.id}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Type
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                Student
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Account information is unavailable.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Account Information
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Your name and email are retrieved from your registered account.
          Profile editing is not available yet because the backend does not
          currently provide an update-profile endpoint.
        </p>
      </div>
    </div>
  )
}

export default Profile