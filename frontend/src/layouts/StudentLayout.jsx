import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { fetchCurrentUser } from '../services/api'

function StudentLayout() {
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser()
        setUser(data)
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('access_token')
          navigate('/login', { replace: true })
        }
      }
    }

    loadUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'S'

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/history', label: 'History' },
    { to: '/profile', label: 'Profile' },
  ]

  const assessmentItems = [
    { to: '/assessment/overall', label: 'Overall Mental Health' },
    { to: '/assessment/depression', label: 'Depression' },
    { to: '/assessment/anxiety', label: 'Anxiety' },
    { to: '/assessment/stress', label: 'Stress' },
  ]

  const navLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-blue-50 font-semibold text-blue-600'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                  ♥
                </div>

                <div>
                  <h1 className="text-lg font-bold leading-tight text-blue-600">
                    MindCare
                  </h1>
                  <p className="text-[11px] font-medium text-slate-400">
                    JUET Mental Health System
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-6 p-4">
              <div>
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Main Navigation
                </p>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={navLinkClass}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Assessments
                </p>

                <div className="space-y-1">
                  {assessmentItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={navLinkClass}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          <div className="border-t border-slate-100 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <span>↪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-bold text-blue-600">
                MindCare JUET
              </span>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <nav className="mt-6 space-y-6">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Menu
                </p>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={navLinkClass}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assessments
                </p>

                <div className="space-y-1">
                  {assessmentItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={navLinkClass}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:h-20 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <p className="hidden text-xs font-medium text-slate-400 sm:block">
                JUET Student Mental Health System
              </p>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Student Portal
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50 p-1.5 pr-4 transition hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-xs font-bold leading-tight text-slate-900">
                {user?.name || 'Loading...'}
              </p>
              <p className="max-w-40 truncate text-[11px] leading-tight text-slate-500">
                {user?.email || 'Student Account'}
              </p>
            </div>
          </button>
        </header>

        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StudentLayout