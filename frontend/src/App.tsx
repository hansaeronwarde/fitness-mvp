import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import MemberDetailPage from './pages/MemberDetailPage'
import MembersPage from './pages/MembersPage'
import NewMemberPage from './pages/NewMemberPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/members" replace />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/new" element={<NewMemberPage />} />
          <Route path="/members/:id" element={<MemberDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
