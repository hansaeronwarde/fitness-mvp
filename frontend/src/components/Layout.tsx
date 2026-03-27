import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="flex items-center gap-6 px-8 h-14 border-b border-gray-200 shrink-0">
        <Link to="/members" className="font-semibold text-sm no-underline">
          Fitness Member Management App
        </Link>
        <nav className="flex gap-1">

        </nav>
      </header>
      <main className="flex-1 p-8 max-w-3xl w-full box-border">
        <Outlet />
      </main>
    </div>
  )
}
