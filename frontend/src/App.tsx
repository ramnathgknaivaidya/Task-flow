import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { TaskBoard } from './pages/tasks/TaskBoard'
import { ProjectsPage } from './pages/projects/ProjectsPage'
import { TeamPage } from './pages/team/TeamPage'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { MeetingsPage } from './pages/meetings/MeetingsPage'
import { TimeTrackingPage } from './pages/timetracking/TimeTrackingPage'
import { FilesPage } from './pages/files/FilesPage'
import { ReportsPage } from './pages/reports/ReportsPage'
import { ApprovalsPage } from './pages/approvals/ApprovalsPage'
import { DirectoryPage } from './pages/directory/DirectoryPage'
import { DepartmentsPage } from './pages/departments/DepartmentsPage'
import { GoalsPage } from './pages/goals/GoalsPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { AdminPage } from './pages/admin/AdminPage'
import { useAuthStore } from './store/authStore'
import { useUIStore } from './store/uiStore'
import { useEffect } from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { isAuthenticated } = useAuthStore()
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<TaskBoard />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="timetracking" element={<TimeTrackingPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="directory" element={<DirectoryPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
