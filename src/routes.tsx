import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { AdminShell } from './components/layout/AdminShell';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { BlockedPage } from './pages/BlockedPage';
import { TodayPage } from './pages/TodayPage';
import { WeekPage } from './pages/WeekPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { StudentsPage } from './pages/admin/StudentsPage';
import { StudentDetailPage } from './pages/admin/StudentDetailPage';
import { ExercisesPage } from './pages/admin/ExercisesPage';
import { TemplatesPage } from './pages/admin/TemplatesPage';
import { ProgramEditorPage } from './pages/admin/ProgramEditorPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute requireOnboarding={false}>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bloqueado',
    element: (
      <ProtectedRoute requireSubscription={false}>
        <BlockedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell>
          <TodayPage />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/semana',
    element: (
      <ProtectedRoute>
        <AppShell>
          <WeekPage />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/entrenar/:programDayId',
    element: (
      <ProtectedRoute>
        <WorkoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/progreso',
    element: (
      <ProtectedRoute>
        <AppShell>
          <ProgressPage />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/perfil',
    element: (
      <ProtectedRoute>
        <AppShell>
          <ProfilePage />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireRole="admin">
        <AdminShell>
          <DashboardPage />
        </AdminShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/alumnos',
    element: (
      <ProtectedRoute requireRole="admin">
        <AdminShell>
          <StudentsPage />
        </AdminShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/alumnos/:id',
    element: (
      <ProtectedRoute requireRole="admin">
        <AdminShell>
          <StudentDetailPage />
        </AdminShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/ejercicios',
    element: (
      <ProtectedRoute requireRole="admin">
        <AdminShell>
          <ExercisesPage />
        </AdminShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/plantillas',
    element: (
      <ProtectedRoute requireRole="admin">
        <AdminShell>
          <TemplatesPage />
        </AdminShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/plantillas/:id',
    element: (
      <ProtectedRoute requireRole="admin">
        <AdminShell>
          <ProgramEditorPage />
        </AdminShell>
      </ProtectedRoute>
    ),
  },
]);
